export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { SimulationFlagsSchema } from '@/lib/schemas';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const flags = SimulationFlagsSchema.parse(body);

        const oldFlags = db.prepare('SELECT * FROM simulator_flags WHERE id = 1').get() as any;

        db.prepare(`
      UPDATE simulator_flags 
      SET rate_limit = ?, delay = ?, duplicates = ?, outage = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).run(flags.rate_limit ? 1 : 0, flags.delay ? 1 : 0, flags.duplicates ? 1 : 0, flags.outage ? 1 : 0);

        // Operational Empathy: Create incident logs for flag changes
        const addIncident = (msg: string, type: 'warning' | 'error' | 'info') => {
            db.prepare('INSERT INTO incidents (msg, type) VALUES (?, ?)').run(msg, type);
        };

        if (flags.outage && !oldFlags.outage) {
            addIncident('Global Outage Protocol Engaged. All sync streams paused.', 'error');
        } else if (!flags.outage && oldFlags.outage) {
            addIncident('Service connectivity restored. Draining retry queues.', 'info');
        }

        if (flags.rate_limit && !oldFlags.rate_limit) {
            addIncident('Upstream rate-limits detected. Throttling active sessions.', 'warning');
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
}
