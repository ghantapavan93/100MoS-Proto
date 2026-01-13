export type Profile = {
    why_statement: string;
    care_tags: string[];
};

export type Activity = {
    provider: "strava" | "apple" | "garmin" | "manual";
    external_activity_id: string;
    timestamp: string;
    distance_miles: number;
    duration_min: number;
};

export type SimulatorFlags = {
    rate_limit: boolean;
    delay: boolean;
    duplicates: boolean;
    outage: boolean;
};

class DemoStore {
    private profile: Profile = { why_statement: "", care_tags: [] };
    private activities: Activity[] = [];
    private flags: SimulatorFlags = {
        rate_limit: false,
        delay: false,
        duplicates: false,
        outage: false,
    };

    getProfile() { return this.profile; }
    setProfile(p: Profile) { this.profile = p; }

    getFlags() { return this.flags; }
    setFlags(f: Partial<SimulatorFlags>) {
        this.flags = { ...this.flags, ...f };
    }

    getActivities() { return this.activities; }

    addActivities(newActivities: Activity[]) {
        const existingIds = new Set(this.activities.map(a => `${a.provider}-${a.external_activity_id}`));
        let added = 0;
        let dups = 0;

        newActivities.forEach(activity => {
            const id = `${activity.provider}-${activity.external_activity_id}`;
            if (existingIds.has(id)) {
                dups++;
            } else {
                this.activities.push(activity);
                added++;
            }
        });

        return { added, dups };
    }

    seedInitialData() {
        this.activities = [
            {
                provider: "strava",
                external_activity_id: "init_1",
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                distance_miles: 3.2,
                duration_min: 45
            },
            {
                provider: "manual",
                external_activity_id: "init_2",
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                distance_miles: 1.5,
                duration_min: 20
            }
        ];
    }
}

// Global singleton for demo
export const demoStore = new DemoStore();
if (typeof window === "undefined") {
    demoStore.seedInitialData();
}
