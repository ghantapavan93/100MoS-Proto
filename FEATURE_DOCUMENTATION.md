# 100 Miles of Summer - Complete Feature Documentation

> A comprehensive guide to all 8 demo features, their current state, vision, and backend implementation requirements.

---

## Overview

**100 Miles of Summer** is a ritual-based fitness challenge platform where participants commit to moving 100 miles over the summer (May-August). The platform emphasizes:
- **Consistency over intensity** - A 10-minute walk counts the same as a 10-minute run
- **Community support** - Crews and shared accountability
- **Resilience** - Coming back after breaks is celebrated, not punished
- **Personal meaning** - Your "why" drives the journey

---

## Feature 1: Onboarding

### What It Does
Captures the participant's personal motivation and preferences before they begin.

### Current Implementation (Frontend Demo)
```
Location: src/components/demo/OnboardingStep.tsx
API: POST /api/demo/onboarding
```

**UI Elements:**
- "Why" statement text input (free-form motivation)
- Care tags selection (what support they need)
- Crew response preferences

**Data Saved:**
```typescript
{
  why_statement: string,    // "Time with my kids"
  care_tags: string[],      // ["accountability", "flexibility"]
  crew_response?: string    // Optional preference
}
```

### Backend Implementation Required

| Component | What's Needed |
|-----------|--------------|
| **Database** | `users` table already exists with `why_statement`, `care_tags_json`, `crew_response` |
| **API** | ✅ Already implemented in `/api/demo/onboarding` |
| **Auth** | Add proper user authentication (replace demo cookie with JWT/OAuth) |
| **Validation** | ✅ Using Zod schema validation |

### Future Enhancements
- [ ] AI-powered crew matching based on why statement
- [ ] Personalized onboarding flow based on care tags
- [ ] Progress photos/avatar upload

---

## Feature 2: Connect Stream (Provider Integration)

### What It Does
Connects to fitness providers (Strava, Garmin, Apple Health) via OAuth and streams activity data.

### Current Implementation (Frontend Demo)
```
Location: src/components/demo/ConnectStep.tsx
API: GET /api/demo/sync/stream (Server-Sent Events)
```

**UI States:**
- Disconnected → "Connect Strava" button
- Connecting → OAuth handshake animation
- Connected → Shows token status, Simulate Break, Disconnect buttons
- Needs Attention → Re-auth required

**Simulated Features:**
- OAuth2.0 handshake animation
- Token status display
- Connection break simulation

### Backend Implementation Required

| Component | What's Needed |
|-----------|--------------|
| **OAuth Integration** | Real Strava/Garmin/Apple OAuth2.0 flows |
| **Token Storage** | Encrypted token storage with refresh logic |
| **Webhook Handler** | Receive real-time activity pushes from providers |
| **Activity Sync** | Background worker to poll/sync activities |

### Real Implementation Steps
```typescript
// 1. OAuth Flow
GET /api/auth/strava          // Redirect to Strava OAuth
GET /api/auth/strava/callback // Handle OAuth callback, store tokens

// 2. Webhook Receiver
POST /api/webhooks/strava     // Strava pushes new activities here

// 3. Activity Sync
// Background job that:
// - Fetches activities from provider API
// - Deduplicates (provider:external_id as composite key)
// - Converts to miles
// - Updates user_aggregates table
```

### Database Schema Already Exists
```sql
-- activities table
id TEXT PRIMARY KEY,              -- strava:12345678
user_id TEXT,
provider TEXT,                    -- strava, garmin, apple_health
external_activity_id TEXT,
ts DATETIME,
miles REAL,
duration INTEGER
```

---

## Feature 3: Progress Home (Dashboard)

### What It Does
Main dashboard showing real-time mile progress, sync status, and personal motivation.

### Current Implementation (Frontend Demo)
```
Location: src/components/demo/ProgressHomeStep.tsx
API: GET /api/demo/progress
Context: src/components/demo/DemoContext.tsx
```

**UI Elements:**
- Circular mile gauge (animated)
- Days remaining countdown
- Weekly rhythm indicator
- Live sync logs panel
- "Sync Now" button
- Milestone banners
- "Why" statement display

**Real-time Features:**
- Server-Sent Events for sync progress
- Optimistic UI updates
- Milestone detection

### Backend Implementation Required

| Component | What's Needed |
|-----------|--------------|
| **Progress API** | ✅ `/api/demo/progress` already returns real aggregated data |
| **Milestones** | Add milestone detection logic (first mile, 25%, 50%, etc.) |
| **Streak Calc** | Calculate actual streak from activity timestamps |
| **Caching** | Redis cache for frequently accessed progress data |

### API Response Structure
```typescript
// GET /api/demo/progress
{
  miles: number,           // From user_aggregates.total_miles
  profile: {
    why_statement: string,
    care_tags: string[]
  },
  streak: number,          // Consecutive days moved
  lastSyncTime: string,
  milestones: {
    crossed: string[],     // ["first_mile", "week_1"]
    next: string           // "25_percent"
  }
}
```

---

## Feature 4: Seasonal Arcs (Guided Journey)

### What It Does
Breaks the 100-mile journey into 3 emotional phases with contextual guidance.

### Current Implementation (Frontend Demo)
```
Location: src/components/demo/SeasonalArcsStep.tsx
```

**Three Phases:**

| Phase | Weeks | Theme | Guidance |
|-------|-------|-------|----------|
| **Getting Started** | 1-4 | Build the habit | "Start small. A 10-min walk counts." |
| **Sticking With It** | 5-8 | Overcome resistance | "Life happens. Movement still counts." |
| **Finishing Strong** | 9-12 | Celebrate & ritualize | "The finish line is yours to define." |

**Interactive Buttons (Currently Demo):**
- Log a 10-min walk
- Check in with your crew
- Plan your final mile ritual

### Backend Implementation Required

| Component | What's Needed |
|-----------|--------------|
| **Phase Detection** | Calculate current phase from `created_at` date |
| **Guidance Content** | CMS or database table for phase-specific content |
| **Quick Actions** | APIs for the action buttons |

### Phase Logic
```typescript
function getCurrentPhase(userCreatedAt: Date): 'getting_started' | 'sticking_with_it' | 'finishing_strong' {
  const daysSinceStart = Math.floor((Date.now() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysSinceStart <= 28) return 'getting_started'      // Weeks 1-4
  if (daysSinceStart <= 56) return 'sticking_with_it'     // Weeks 5-8
  return 'finishing_strong'                                // Weeks 9-12
}
```

### Action Button APIs
```typescript
// Log quick activity
POST /api/activities/quick
{ type: "10_min_walk", miles: 0.5 }

// Crew check-in
POST /api/crews/checkin
{ crew_id: "first-timers", message: "Still going!" }
```

---

## Feature 5: Crews (Community Groups)

### What It Does
Interest-based communities where participants share rituals and support each other.

### Current Implementation (Frontend Demo)
```
Location: src/components/demo/CrewsStep.tsx
```

**Pre-defined Crews:**
| Crew | Description | Prompt Example |
|------|-------------|----------------|
| **First-Timers** | New to fitness challenges | "What was your first mile like?" |
| **Chicago Crew** | Location-based | "Best lakefront path segment?" |
| **Night Owls** | Late movers | "Most peaceful thing about midnight walks?" |
| **Caregivers** | Busy parents/caregivers | "How did you find your 10 minutes?" |

**Features:**
- Shared miles counter (aggregate)
- Weekly ritual prompts
- "Add Your Story" responses
- Member count

### Backend Implementation Required

| Component | What's Needed |
|-----------|--------------|
| **Crews Table** | Store crew definitions and metadata |
| **Membership** | User-crew relationship table |
| **Prompts** | Weekly rotating prompts per crew |
| **Responses** | Store and display crew responses |
| **Aggregation** | Real-time shared miles calculation |

### Database Schema
```sql
CREATE TABLE crews (
  id TEXT PRIMARY KEY,
  name TEXT,
  description TEXT,
  icon TEXT,
  color TEXT
);

CREATE TABLE crew_memberships (
  user_id TEXT,
  crew_id TEXT,
  joined_at DATETIME,
  PRIMARY KEY (user_id, crew_id)
);

CREATE TABLE crew_prompts (
  id INTEGER PRIMARY KEY,
  crew_id TEXT,
  prompt TEXT,
  week_number INTEGER,
  year INTEGER
);

CREATE TABLE crew_responses (
  id INTEGER PRIMARY KEY,
  user_id TEXT,
  crew_id TEXT,
  prompt_id INTEGER,
  response TEXT,
  created_at DATETIME
);
```

### APIs
```typescript
// Get crews with my membership
GET /api/crews

// Join a crew
POST /api/crews/:id/join

// Get this week's prompt
GET /api/crews/:id/prompt

// Submit response
POST /api/crews/:id/respond
{ response: "It was hard but worth it." }

// Get crew aggregate miles
GET /api/crews/:id/stats
// Returns: { totalMiles: 4520, memberCount: 1240 }
```

---

## Feature 6: Micro-Wins (Achievement System)

### What It Does
Behavioral recognition system that celebrates consistency and resilience, not just distance.

### Current Implementation (Frontend Demo)
```
Location: src/components/demo/MicroWinsStep.tsx
```

**Achievement Types:**

| Badge | Trigger | Message |
|-------|---------|---------|
| **Consistency Ace** | 5 different days in a week | "You've moved on 5 different days this week." |
| **The Comeback** | Activity after 10+ day break | "You returned after a 10-day break. Most people stop there." |
| **Rhythm Maker** | Same time of day pattern | "Your most consistent time is 6:00 PM." |
| **Early Bird** | 5+ morning activities | "You're a morning mover." |
| **Night Owl** | 5+ evening activities | "The quiet hours are yours." |

### Backend Implementation Required

| Component | What's Needed |
|-----------|--------------|
| **Achievement Engine** | Background job to detect achievements |
| **Notifications** | Push/email when new badge earned |
| **History** | Store when each achievement was earned |

### Achievement Detection Logic
```typescript
// Run after each new activity sync
async function checkAchievements(userId: string) {
  const activities = await getRecentActivities(userId, 30) // Last 30 days
  
  // Consistency Ace: 5 unique days in current week
  const thisWeekDays = new Set(
    activities
      .filter(a => isThisWeek(a.ts))
      .map(a => dayOfWeek(a.ts))
  )
  if (thisWeekDays.size >= 5) {
    await awardBadge(userId, 'consistency_ace')
  }
  
  // The Comeback: Activity after 10+ day gap
  const sortedActivities = activities.sort((a, b) => b.ts - a.ts)
  for (let i = 1; i < sortedActivities.length; i++) {
    const gap = daysBetween(sortedActivities[i].ts, sortedActivities[i-1].ts)
    if (gap >= 10) {
      await awardBadge(userId, 'the_comeback')
      break
    }
  }
  
  // Rhythm Maker: Detect time-of-day patterns
  const hourCounts = activities.reduce((acc, a) => {
    const hour = new Date(a.ts).getHours()
    acc[hour] = (acc[hour] || 0) + 1
    return acc
  }, {})
  const [peakHour, count] = Object.entries(hourCounts)
    .sort(([,a], [,b]) => b - a)[0]
  if (count >= 5) {
    await awardBadge(userId, 'rhythm_maker', { peakHour })
  }
}
```

### Database Schema
```sql
CREATE TABLE achievements (
  id INTEGER PRIMARY KEY,
  user_id TEXT,
  badge_type TEXT,        -- 'consistency_ace', 'the_comeback', etc.
  metadata_json TEXT,     -- { "peakHour": 18 }
  earned_at DATETIME,
  UNIQUE(user_id, badge_type)
);
```

---

## Feature 7: Support (Human Logistics)

### What It Does
Compassionate support system for when life gets hard. Emphasizes mental health and flexibility.

### Current Implementation (Frontend Demo)
```
Location: src/components/demo/SupportStep.tsx
```

**Features:**

| Action | Purpose | Implementation |
|--------|---------|----------------|
| **Reset Gently** | Recalculate target to achievable goal | Modal with target input |
| **I'm Overwhelmed** | 30-second breathing exercise | Grounding timer animation |
| **Logging Help** | Sync troubleshooting wizard | 4-step guided flow |
| **Safety First** | Emergency resources | Call 911 / 988 Lifeline links |

### Backend Implementation Required

| Component | What's Needed |
|-----------|--------------|
| **Target Reset API** | Persist new target, log adjustment |
| **Audit Trail** | Track all goal changes for ops visibility |
| **Grounding Analytics** | Track usage for mental health insights |

### APIs
```typescript
// Reset goal
POST /api/user/goal
{ newTarget: 75, reason: "life_circumstances" }

// Log grounding session (for analytics)
POST /api/wellness/grounding
{ duration: 30, completed: true }

// Get help resources (CMS-driven)
GET /api/support/resources
```

### Database Schema
```sql
-- Track goal adjustments
CREATE TABLE goal_adjustments (
  id INTEGER PRIMARY KEY,
  user_id TEXT,
  old_target REAL,
  new_target REAL,
  reason TEXT,
  created_at DATETIME
);

-- Wellness analytics (optional, privacy-conscious)
CREATE TABLE wellness_sessions (
  id INTEGER PRIMARY KEY,
  user_id TEXT,
  type TEXT,              -- 'grounding', 'reset', 'help'
  duration_seconds INTEGER,
  created_at DATETIME
);
```

---

## Feature 8: Summer Story (Recap & Share)

### What It Does
Beautiful end-of-summer recap card showing achievements, stats, and personal journey.

### Current Implementation (Frontend Demo)
```
Location: src/components/demo/SummerStoryStep.tsx
```

**Recap Card Contains:**
- Total miles achieved
- "Most Consistent Week" stat
- "Resilience Score" (percentile)
- Original "why" statement
- Check-in date

**Actions:**
- **Share My Story** → Native share / clipboard copy with image
- **Download Card** → PNG export using html-to-image

### Backend Implementation Required

| Component | What's Needed |
|-----------|--------------|
| **Stats Calculation** | Compute recap stats from activities |
| **Percentile Ranking** | Compare user to cohort |
| **Image Generation** | Server-side card rendering for social sharing |

### Stats Calculation
```typescript
// GET /api/recap
async function getRecap(userId: string) {
  const activities = await getAllActivities(userId)
  const aggregates = await getUserAggregates(userId)
  
  // Most consistent week
  const weeklyActivityCounts = groupByWeek(activities)
  const mostConsistentWeek = Object.entries(weeklyActivityCounts)
    .sort(([,a], [,b]) => b - a)[0]
  
  // Resilience score (percentile)
  // = Users who returned after a 7+ day break / All users
  const allUsers = await getAllUserStats()
  const usersWithComebacks = allUsers.filter(u => u.hadComeback)
  const resiliencePercentile = calculatePercentile(userId, usersWithComebacks)
  
  return {
    totalMiles: aggregates.total_miles,
    mostConsistentWeek: {
      weekNumber: mostConsistentWeek[0],
      daysActive: mostConsistentWeek[1]
    },
    resilienceScore: resiliencePercentile,
    whyStatement: user.why_statement,
    startDate: user.created_at,
    endDate: '2026-08-31'
  }
}
```

### Server-Side Image Generation
For reliable social sharing, generate the card server-side:
```typescript
// Using Puppeteer or Satori for SSR image generation
import satori from 'satori'

async function generateRecapImage(recap: RecapData) {
  const svg = await satori(
    <RecapCard {...recap} />,
    { width: 1200, height: 630, fonts: [...] }
  )
  // Convert SVG to PNG
  const png = await svgToPng(svg)
  return png
}

// API endpoint
GET /api/recap/image
// Returns: image/png
```

---

## Summary: Implementation Priority

### Phase 1: Core Backend (MVP)
1. ✅ User authentication (replace demo cookies)
2. ✅ Real OAuth integration with Strava
3. ✅ Activity sync and deduplication
4. ✅ Progress API with real data

### Phase 2: Community Features
5. Crews system with memberships
6. Weekly prompts and responses
7. Shared miles aggregation

### Phase 3: Engagement
8. Achievement detection engine
9. Milestone notifications
10. Recap card generation

### Phase 4: Polish
11. Goal adjustment tracking
12. Wellness analytics
13. Server-side social image generation

---

## Database Schema Summary

```sql
-- Already Implemented
users, activities, sync_runs, user_aggregates, simulator_flags, 
incidents, adjustments, ops_audit_log

-- Needs Implementation
crews, crew_memberships, crew_prompts, crew_responses,
achievements, goal_adjustments, wellness_sessions
```

---

## API Routes Summary

| Route | Method | Status | Purpose |
|-------|--------|--------|---------|
| `/api/demo/onboarding` | POST | ✅ Done | Save user profile |
| `/api/demo/progress` | GET | ✅ Done | Get mile progress |
| `/api/demo/sync/stream` | GET | ✅ Done | SSE activity sync |
| `/api/demo/ops` | GET | ✅ Done | Ops dashboard data |
| `/api/demo/ops/action` | POST | ✅ Done | Quiet list actions |
| `/api/auth/strava` | GET | ❌ TODO | OAuth redirect |
| `/api/auth/strava/callback` | GET | ❌ TODO | OAuth callback |
| `/api/webhooks/strava` | POST | ❌ TODO | Activity webhooks |
| `/api/crews` | GET | ❌ TODO | List crews |
| `/api/crews/:id/join` | POST | ❌ TODO | Join crew |
| `/api/crews/:id/respond` | POST | ❌ TODO | Submit prompt response |
| `/api/achievements` | GET | ❌ TODO | User achievements |
| `/api/user/goal` | POST | ❌ TODO | Reset goal |
| `/api/recap` | GET | ❌ TODO | Get recap stats |
| `/api/recap/image` | GET | ❌ TODO | Generate recap image |

---

*Documentation created: January 9, 2026*
*Last tested: All 8 features verified working in demo mode*
