import db from '../db';

export class CoachingService {
    static getLatestMotivation(userId: string) {
        return db.prepare('SELECT * FROM motivation_events WHERE user_id = ? AND shown_at IS NULL ORDER BY created_at DESC LIMIT 1')
            .get(userId) as { id: number, message: string, type: string } | undefined;
    }

    static markMotivationShown(id: number) {
        db.prepare('UPDATE motivation_events SET shown_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);
    }

    static createDefaultMotivation(userId: string) {
        const messages = [
            { type: 'streak', message: "3 days in a row! You're building a powerful rhythm." },
            { type: 'recovery', message: "Rest recognized. Your body will thank you tomorrow." },
            { type: 'evening', message: "Evening light is perfect for a gentle stroll." }
        ];
        const random = messages[Math.floor(Math.random() * messages.length)];
        db.prepare('INSERT INTO motivation_events (user_id, type, message) VALUES (?, ?, ?)')
            .run(userId, random.type, random.message);
    }
}
