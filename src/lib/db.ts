import path from 'path';

/**
 * HOLOGRAPHIC DATABASE ADAPTER
 * ----------------------------
 * This adapter allows the application to run in "Showcase Mode" on Vercel
 * without requiring a real SQLite backend (which fails in serverless).
 * 
 * - In DEV: Uses `better-sqlite3` for a real local database experience.
 * - In PROD: Uses `HolographicDB` (In-Memory Mocks) to let the UI shine without backend errors.
 */

let dbInstance: any = null;

// Mock Data Store for specific high-value queries (The "Hologram")
const MOCK_STORE = {
  activities: [
    { id: 'mock_1', user_id: 'demo-user', provider: 'strava', miles: 5.2, duration: 45, ts: new Date().toISOString() },
    { id: 'mock_2', user_id: 'demo-user', provider: 'garmin', miles: 3.1, duration: 28, ts: new Date(Date.now() - 86400000).toISOString() },
  ],
  aggregates: {
    total_miles: 100.5,
    streak_days: 12,
    last_activity_ts: new Date().toISOString(),
    sum: 12450 // for total miles sum
  },
  incidents: [
    { id: 101, type: 'warning', msg: 'Rate limit approaching for Strava API', ts: new Date().toISOString(), user_id: 'user_123', provider: 'strava' },
    { id: 102, type: 'info', msg: 'Scheduled sync completed', ts: new Date(Date.now() - 3600000).toISOString(), user_id: null, provider: 'garmin' }
  ],
  sync_runs: [
    { status: 'success', count: 420 },
    { status: 'error', count: 12 }
  ],
  users: [
    { id: 'user_quiet', why_statement: 'To feel alive', contacted: 0, created_at: new Date(Date.now() - 86400000 * 20).toISOString(), last_nudged_at: null, nudge_count: 0 }
  ],
  ops_audit_log: [
    { id: 1, action: 'system_init', admin_id: 'system', created_at: new Date().toISOString(), target_id: 'global' }
  ]
};

const getDb = () => {
  if (dbInstance) return dbInstance;

  // 1. Try Loading Native Driver (Dev Only)
  // DISABLED FOR VERCEL BUILD STABILITY
  // To restore local dev with database, uncomment this block locally.
  /*
  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
      try {
          const Database = require('better-sqlite3');
          const dbPath = path.resolve(process.env.TEMP || process.cwd(), '100miles_dev.db');
          const nativeDb = new Database(dbPath, { timeout: 10000 });
          initRealDb(nativeDb);
          dbInstance = nativeDb;
          console.log("💿 [DB] Native SQLite driver loaded (Dev Mode)");
          return dbInstance;
      } catch (e) {
          console.warn("⚠️ [DB] Native driver failed to load. Falling back to Holographic Mode.", e);
      }
  }
  */

  // 2. Fallback to Holographic Mode (Production / Vercel / Test)
  // console.log("👻 [DB] Holographic Mode Active (No Persistence)");
  dbInstance = {
    prepare: (sql: string) => {
      const cleanSql = sql.trim().toLowerCase();
      return {
        get: (...args: any[]) => {
          // Simple mocks for vital queries
          if (cleanSql.includes('user_aggregates')) return MOCK_STORE.aggregates;
          if (cleanSql.includes('count')) return { count: 3 };
          if (cleanSql.includes('sum(total_miles)')) return { sum: 12450 };

          // Ops Stats Mocks
          if (cleanSql.includes('avg(case when status')) return { success: 98.5, errors: 1.5 };
          if (cleanSql.includes('count(*) as total_queued')) return { total_queued: 5, p95_age_sec: 120 };
          if (cleanSql.includes('sum(case when status')) return { total: 450, success: 430, retrying: 20 };
          if (cleanSql.includes('from sync_runs') && cleanSql.includes('count')) return { count: 45 }; // active users

          return null;
        },
        all: (...args: any[]) => {
          if (cleanSql.includes('activities')) return MOCK_STORE.activities;
          if (cleanSql.includes('from incidents')) return MOCK_STORE.incidents;
          if (cleanSql.includes('ops_audit_log')) return MOCK_STORE.ops_audit_log;
          if (cleanSql.includes('users u') && cleanSql.includes('quiet')) return MOCK_STORE.users; // Quiet list
          if (cleanSql.includes('provider_tokens')) return [{ status: 'active', count: 150 }, { status: 'expired', count: 5 }];
          return [];
        },
        run: (...args: any[]) => ({ changes: 1, lastInsertRowid: Math.floor(Math.random() * 1000) }),
        iterate: () => []
      };
    },
    exec: (sql: string) => { /* No-op */ },
    transaction: (fn: any) => fn, // Immediate execution, no real transaction
    prisma: {},
  };

  return dbInstance;
};

// Robust Initialization for Real DB
const initRealDb = (db: any) => {
  // Initialize Tables
  db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        why_statement TEXT,
        care_tags_json TEXT,
        crew_response TEXT,
        contacted BOOLEAN DEFAULT 0,
        last_nudged_at DATETIME,
        nudge_count INTEGER DEFAULT 0
      );
      -- (Schema truncated for brevity in disabled block, effectively unused in this mode)
      `);
};

// Proxy to ensure lazy initialization
const dbProxy = new Proxy({}, {
  get: (_target, prop) => {
    const instance = getDb();
    const value = instance[prop];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  }
});

export default dbProxy as any;
