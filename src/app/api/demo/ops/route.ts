export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const activeUsersToday = db.prepare(`
      SELECT COUNT(DISTINCT user_id) as count 
      FROM sync_runs 
      WHERE created_at >= date('now', '-1 day')
    `).get() as { count: number };

    // PERFORMANCE: Aggregate read O(1)
    const totalStats = db.prepare(`
      SELECT 
        SUM(total_miles) as totalMiles
      FROM user_aggregates
    `).get() as { totalMiles: number };

    const activityCount = db.prepare('SELECT COUNT(*) as count FROM activities').get() as { count: number };

    // Real aggregated provider health (mocked for now as we don't store latency finely yet)
    const providerHealth = [
      { provider: 'strava', success: 98, errors: 2, latency: 420 },
      { provider: 'garmin', success: 95, errors: 5, latency: 580 },
      { provider: 'apple_health', success: 99, errors: 1, latency: 120 },
    ];

    // OPS HARDENING: Fetch "Quiet List" using O(1) last_activity_ts
    // Logic: Inactive for >14 days OR never active (NULL)
    const quietListRaw = db.prepare(`
            SELECT u.id, u.why_statement, u.contacted, u.created_at, u.last_nudged_at, u.nudge_count
            FROM users u
            LEFT JOIN user_aggregates ua ON u.id = ua.user_id
            WHERE (ua.last_activity_ts < date('now', '-14 days') OR ua.last_activity_ts IS NULL)
            AND u.contacted = 0
            LIMIT 5
        `).all() as any[];

    const quietList = quietListRaw.map((u, i) => ({
      id: u.id,
      name: `Participant ${u.id.slice(0, 4)}`, // Anonymized
      daysInactive: Math.floor((Date.now() - new Date(u.created_at).getTime()) / (1000 * 60 * 60 * 24)),
      crew: "First-Timers", // Default for demo
      contacted: Boolean(u.contacted),
      nudgeCount: u.nudge_count || 0,
      lastNudge: u.last_nudged_at
    }));

    const recentIncidents = db.prepare(`
      SELECT * FROM incidents ORDER BY ts DESC LIMIT 10
    `).all();

    return NextResponse.json({
      activeUsers: activeUsersToday.count || 0,
      totalMiles: totalStats.totalMiles || 0,
      activityCount: activityCount.count || 0,
      providerHealth,
      quietList,
      recentIncidents
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}
