export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = 'demo-user'; // Hardcoded for demo simplicity
    const range = searchParams.get('range') || '7d';
    const cursor = searchParams.get('cursor'); // timestamp for pagination
    const limit = parseInt(searchParams.get('limit') || '20');

    // Calculate start date based on range
    const days = parseInt(range.replace('d', '')) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString();

    try {
        // Query using the new effective miles view
        let query = `
            SELECT 
                a.*, 
                v.effective_miles, 
                v.total_correction,
                v.corrections_count,
                (SELECT note_text FROM activity_notes WHERE activity_id = a.id ORDER BY created_at DESC LIMIT 1) as latest_note
            FROM activities a
            JOIN activity_effective_miles v ON a.id = v.activity_id
            WHERE a.user_id = ? AND a.ts >= ?
        `;

        const params: any[] = [userId, startDateStr];

        if (cursor) {
            query += ` AND a.ts < ?`;
            params.push(cursor);
        }

        query += ` ORDER BY a.ts DESC LIMIT ?`;
        params.push(limit);

        const items = db.prepare(query).all(...params);
        const nextCursor = items.length === limit ? (items[items.length - 1] as any).ts : null;

        return NextResponse.json({
            items,
            nextCursor,
            meta: {
                range,
                limit,
                total: items.length
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
