export type Incident = {
    id: number
    msg: string
    type: 'warning' | 'error' | 'info'
    ts: string
    acknowledged?: boolean
    affectedUser?: string
    affectedProvider?: string
}

export type TimelineEvent = {
    id: number
    title: string
    subtitle: string
    type: 'sync' | 'audit' | 'incident'
    status: 'success' | 'warning' | 'error' | 'info'
    timestamp: string
}

export type OpsMetrics = {
    activeUsers: number
    totalMiles: number
    activityCount: number
    providerHealth: { provider: string; success: number; errors: number; latency: number; status?: 'healthy' | 'degraded' | 'down' }[]
    quietList: { id: string; name: string; daysInactive: number; crew: string; contacted: boolean; nudgeCount?: number; lastNudge?: string }[]
    recentIncidents: Incident[]
    scheduledSyncs: { success: number; retrying: number; delayed: number; total: number; queueDepth?: number; p95Age?: string }
    dataHealth: { totalRows: number; dbSize: string; cacheHealth: string; latency: string; tokenStability?: number }
    cloudSyncEnabled?: boolean
}

export type Flags = {
    rate_limit: boolean
    delay: boolean
    duplicates: boolean
    outage: boolean
}
