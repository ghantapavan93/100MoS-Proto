export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        // Simple aggregate for crew pulse
        const pulse = db.prepare(`
            SELECT 
                cm.crew_id,
                COUNT(cm.user_id) as member_count,
                SUM(aem.effective_miles) as total_miles,
                AVG(aem.effective_miles) as avg_miles
            FROM crew_membership cm
            JOIN activity_effective_miles aem ON cm.user_id = aem.user_id
            GROUP BY cm.crew_id
            ORDER BY total_miles DESC
        `).all();

        return NextResponse.json(pulse);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
