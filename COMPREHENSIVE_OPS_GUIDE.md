# Ops Cockpit: The Architectural Blueprint

This document serves as the "Source of Truth" for the 100 Miles of Summer Ops Cockpit. It details the **8 Premium Features** currently simulated on the frontend and provides the **Backend Roadmap** required to bring them to life with real data.

---

## 1. Provider Health Grid (The "Pulse")

### 💡 The Concept
A real-time status monitor for the third-party integrations (Strava, Garmin, Apple Health). Users trust us with their data strings; this grid visually proves that our connections to these providers are healthy and active.

### 🎨 Visual Implementation
- **Status Bars**: Visual "health bars" showing success rates (e.g., 99.2%).
- **Latency Indicators**: Real-time milliseconds (ms) response times.
- **Animations**: "Live Ping" pulsing dots and waving wifi icons when healthy.

### ⚙️ Backend Reality (How to make it Real)
To perform this for real, we need actively probing "heartbeats".
- **Database Schema**:
  ```sql
  CREATE TABLE provider_health_logs (
      id SERIAL PRIMARY KEY,
      provider VARCHAR(50), -- 'strava', 'garmin'
      status VARCHAR(20),   -- 'success', 'error'
      latency_ms INTEGER,
      timestamp TIMESTAMP DEFAULT NOW()
  );
  ```
- **Background Worker**: A cron job running every 60s (or a dedicated probe service) that makes a lightweight API call to each provider:
  1.  Ping `GET https://www.strava.com/api/v3/athlete` (or similar low-cost endpoint).
  2.  Measure time-to-first-byte (TTFB).
  3.  Log result to DB.
- **API Endpoint**: `GET /api/ops/provider-health` would compute averages from the last hour of logs:
  - `Success Rate = (Success Count / Total Count) * 100`

---

## 2. Live Signal Frequency (The "Heartbeat")

### 💡 The Concept
A visual ECG (Electrocardiogram) of the system's ingestion engine. It shows incoming webhook traffic in real-time. Flatline = Death. Spikes = Viral event or DDOS.

### 🎨 Visual Implementation
- **Chart**: An SVG polyline chart updating every 5-30s.
- **Animation**: Smooth interpolation (bezier curves) and gradient fills.

### ⚙️ Backend Reality
This represents **Webhook Throughput**.
- **Infrastructure**: Redis is best here for high-speed counting.
- **Logic**:
  - Every time a webhook hits `/api/webhooks/strava`, increment a Redis counter: `INCR webhooks:2026-01-09:14:05`.
  - The graph simply pulls the counts for the last 60 minutes.
- **Authenticity**: To make it "real-time", use **Server-Sent Events (SSE)** or **WebSockets** that push the current "events per second" count to the frontend every 5 seconds.

---

## 3. The "Spike Lab" (Chaos Engineering)

### 💡 The Concept
A control panel to *simulate* disaster. It allows developers (or ops users) to intentionally inject failure to test system resilience. "What happens if Strava goes down?"

### 🎨 Visual Implementation
- **Toggles**: Outage, Rate Limit, Delay, Duplicates.
- **Effect**: Screen shakes, UI turns red, data streams flatline initially.

### ⚙️ Backend Reality
This requires **Feature Flags** or **Middleware Injection**.
- **Implementation**:
  - Create a global middleware (e.g., in Next.js `middleware.ts`).
  - Checking Redis keys like `config:simulate:outage`.
  - **Logic**:
    ```typescript
    // In middleware
    if (await redis.get('config:simulate:outage')) {
        return new Response('Simulated Outage', { status: 503 });
    }
    if (await redis.get('config:simulate:latency')) {
        await sleep(2000); // Artificial delay
    }
    ```
- **"Restore Calm" Button**: Simply deletes all these Redis keys in one atomic operation.

---

## 4. Activity Heatmap

### 💡 The Concept
A GitHub-style contribution graph, but for global fitness activity. It answers: "When do our users run?" (e.g., 6 PM on Tuesdays is hot).

### 🎨 Visual Implementation
- **Grid**: 7 rows (days) x 24 columns (hours).
- **Interactivity**: Cells scale up on hover.

### ⚙️ Backend Reality
This is an **Aggregation Query**.
- **Database**:
  ```sql
  select
    extract(dow from start_date_local) as day_of_week,
    extract(hour from start_date_local) as hour_of_day,
    count(*) as intensity
  from activities
  where start_date_local > now() - interval '7 days'
  group by 1, 2;
  ```
- **Optimization**: This is expensive to run live. Cache the result in Redis for 1 hour.

---

## 5. The "Quiet List" (CRM for Retention)

### 💡 The Concept
Identifies users who are failing or fading away. "Who hasn't run in 10 days?" It turns ops into proactive customer success.

### 🎨 Visual Implementation
- **Cards**: Showing user name, "Days Inactive", and "Last Crew".
- **Action**: "Send Nudge" button with sparkle animation.

### ⚙️ Backend Reality
- **Query**: "Find users with no activities in `activities` table for > 10 days".
- **The "Nudge"**:
  - This shouldn't just be an animation. It should trigger an **Email** or **Push Notification**.
  - **Endpoint**: `POST /api/ops/nudge`
    - Payload: `{ userId: "123" }`
    - Action: Enqueue a job to SendGrid/Twilio.
    - Update user state: `UPDATE users SET last_nudge_at = NOW()`.

---

## 6. Incident Acknowledge System

### 💡 The Concept
Operational alerts (e.g., "Strava API 429 Too Many Requests") need human attention. This system allows an operator to say "I saw this, I'm handling it."

### 🎨 Visual Implementation
- **Feed**: Typewriter text stream of error logs.
- **Interact**: Click "Checkmark" to cross out/strike-through the incident.

### ⚙️ Backend Reality
- **Database Schema**:
  ```sql
  CREATE TABLE incidents (
      id SERIAL PRIMARY KEY,
      message TEXT,
      level VARCHAR(10), -- 'warn', 'error', 'critical'
      acknowledged_at TIMESTAMP NULL,
      acknowledged_by_user_id UUID NULL
  );
  ```
- **Flow**:
  1. Backend catches an error -> inserts row into `incidents`.
  2. Frontend polls `incidents WHERE acknowledged_at IS NULL`.
  3. User clicks checkmark -> `UPDATE incidents SET acknowledged_at = NOW()`.

---

## 7. Challenge Progress Ring (Collective Goal)

### 💡 The Concept
A "North Star" metric. Instead of individual progress, it shows the **Total Miles** of the entire community vs. the 1 Million Mile goal.

### 🎨 Visual Implementation
- **Radial Chart**: Circular progress bar closing the loop.
- **Animation**: "Flame" icon bounces near the finish line.

### ⚙️ Backend Reality
- **Query**: `SELECT SUM(distance) FROM activities`.
- **Performance**: Similar to the heatmap, do *not* run this sum on every page load.
  - **Increment Strategy**: Every time a new activity is saved, update a `global_stats` table: `UPDATE global_stats SET total_miles = total_miles + new_activity_miles`.
  - The frontend just reads a single integer from `global_stats`.

---

## 8. Animated Stress Mode (System Sentience)

### 💡 The Concept
The UI reacts emotionally to the system state. If things are breaking, the UI should look "stressed" (red, pulsing, shaking) to incite urgency in the operator.

### 🎨 Visual Implementation
- **Trigger**: "Calm Score" < 50%.
- **Effect**: Background turns red gradient, overlay pulses opacity, UI shakes.

### ⚙️ Backend Reality
- **The "Calm Score" Algorithm**:
  - We need a composite score calculation on the backend:
    ```python
    calm_score = 100
    - (active_incident_count * 10)
    - (avg_latency > 500ms ? 20 : 0)
    - (is_provider_down ? 50 : 0)
    ```
- **API**: The `/api/ops/status` endpoint returns this calculated `calmScore`. The frontend simply blindly trusts this number to switch CSS classes.
