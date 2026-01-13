import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { SyncStreamRequestSchema } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const userId = request.cookies.get('demo_user_id')?.value;
    if (!userId) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') || 'strava';

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const send = (data: any) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            try {
                send({ step: 'init', msg: `Initializing secure connection to ${provider}...` });
                await new Promise(r => setTimeout(r, 800));

                // Get simulator flags
                const flags = db.prepare('SELECT * FROM simulator_flags WHERE id = 1').get() as any;

                if (flags.outage) {
                    send({ step: 'error', msg: `Critical: ${provider} API is currently unresponsive. Outage protocol engaged.`, type: 'error' });
                    db.prepare('INSERT INTO sync_runs (user_id, provider, status) VALUES (?, ?, ?)').run(userId, provider, 'outage');
                    controller.close();
                    return;
                }

                send({ step: 'auth', msg: 'Authenticating with OAuth2.0 scope [activity:read_all]...' });
                await new Promise(r => setTimeout(r, 1000));

                if (flags.rate_limit) {
                    send({ step: 'warning', msg: `${provider} is rate-limiting requests. Sync enqueued for background processing.`, type: 'warning' });
                    db.prepare('INSERT INTO sync_runs (user_id, provider, status, rate_limited) VALUES (?, ?, ?, ?)').run(userId, provider, 'rate-limited', 1);
                    controller.close();
                    return;
                }

                send({ step: 'fetch', msg: 'Fetching activity stream from provider...' });
                await new Promise(r => setTimeout(r, 1200));

                // Simulate fetching 3 activities
                const mockExternal = [
                    { id: '101', miles: 3.2, ts: new Date().toISOString() },
                    { id: '102', miles: 5.5, ts: new Date().toISOString() },
                    { id: '103', miles: 2.1, ts: new Date().toISOString() },
                ];

                let added = 0;
                let dupes = 0;

                let totalNewMiles = 0;

                for (const act of mockExternal) {
                    const key = `${provider}:${act.id}`;
                    try {
                        const exists = db.prepare('SELECT id FROM activities WHERE id = ?').get(key);
                        if (exists) {
                            dupes++;
                            send({ step: 'process', msg: `Duplicate detected: ${key}. Non-destructive skip.` });
                        } else {
                            db.prepare('INSERT INTO activities (id, user_id, provider, external_activity_id, ts, miles) VALUES (?, ?, ?, ?, ?, ?)')
                                .run(key, userId, provider, act.id, act.ts, act.miles);
                            added++;
                            totalNewMiles += act.miles;
                            send({ step: 'process', msg: `Verified & Logged: ${act.miles} miles [${key}]`, miles: act.miles });
                        }
                        await new Promise(r => setTimeout(r, 400));
                    } catch (e) {
                        console.error(e);
                    }
                }

                if (added > 0) {
                    // PERFORMANCE LAYER: Incremental Aggregate Update (O(1))
                    // Instead of calculating SUM(miles) every time, we just add the delta.
                    db.prepare(`
                        INSERT INTO user_aggregates (user_id, total_miles, last_activity_ts, streak_days)
                        VALUES (?, ?, datetime('now'), 1)
                        ON CONFLICT(user_id) DO UPDATE SET
                            total_miles = total_miles + ?,
                            last_activity_ts = datetime('now')
                    `).run(userId, totalNewMiles, totalNewMiles);
                }

                send({
                    step: 'complete',
                    msg: `Sync complete. ${added} new miles added. ${dupes} duplicates resolved.`,
                    added,
                    dupes,
                    type: 'success'
                });

                db.prepare('INSERT INTO sync_runs (user_id, provider, status, added, dupes) VALUES (?, ?, ?, ?, ?)')
                    .run(userId, provider, 'success', added, dupes);

            } catch (err) {
                send({ step: 'error', msg: 'An unexpected internal error occurred during synchronization.', type: 'error' });
            } finally {
                controller.close();
            }
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
