import { ProviderSyncService } from './providerSyncService';

/**
 * Mocks a background job scheduler (e.g. Cron/BullMQ) to prove "Reliable Sync" logic.
 */
export class SyncScheduler {
    private static interval: any = null;
    private static nextRun: number = Date.now() + 1000 * 60 * 60; // 1 hour from now

    static start(userId: string) {
        if (this.interval) return;

        this.interval = setInterval(async () => {
            console.log(`[SyncScheduler] Triggering scheduled sync for ${userId}`);
            try {
                await ProviderSyncService.syncUser(userId, 'strava');
                this.resetTimer();
            } catch (err) {
                console.error(`[SyncScheduler] Scheduled sync failed, will retry on next interval`, err);
            }
        }, 1000 * 60 * 60); // Check every hour
    }

    static getNextRunTime() {
        return this.nextRun;
    }

    private static resetTimer() {
        this.nextRun = Date.now() + 1000 * 60 * 60;
    }
}
