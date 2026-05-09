import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { DashboardStats } from '@/types'
import { Users, TrendingUp, UserCheck, UserX } from 'lucide-react'

const ONBOARDING_LABELS: Record<string, string> = {
  account_created: 'Account Created',
  store_connected: 'Store Connected',
  products_synced: 'Products Synced',
  first_campaign: 'First Campaign',
  completed: 'Completed',
}

const PLAN_COLORS = {
  free: 'secondary',
  starter: 'info',
  growth: 'warning',
  enterprise: 'success',
} as const

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getStats()
      .then(setStats)
      .catch(() => setError('Failed to load stats. Make sure the backend is running on port 4000.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Shell><p className="text-muted-foreground">Loading dashboard…</p></Shell>
  if (error) return <Shell><p className="text-red-500 text-sm bg-red-50 p-4 rounded-md">{error}</p></Shell>
  if (!stats) return null

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Users', value: stats.activeUsers, icon: UserCheck, color: 'bg-green-50 text-green-600' },
    { label: 'New This Month', value: stats.newThisMonth, icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
    { label: 'Churned This Month', value: stats.churnedThisMonth, icon: UserX, color: 'bg-red-50 text-red-600' },
  ]

  return (
    <Shell>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Users by Plan</CardTitle>
              <CardDescription>Distribution across pricing tiers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(stats.planBreakdown).map(([plan, count]) => {
                const pct = Math.round((count / stats.totalUsers) * 100)
                return (
                  <div key={plan}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={PLAN_COLORS[plan as keyof typeof PLAN_COLORS] ?? 'default'} className="capitalize">
                          {plan}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{count} users</span>
                      </div>
                      <span className="text-sm font-medium">{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Onboarding Progress</CardTitle>
              <CardDescription>Users at each step of the onboarding flow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(stats.onboardingBreakdown).map(([step, count]) => {
                const pct = Math.round((count / stats.totalUsers) * 100)
                return (
                  <div key={step}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{ONBOARDING_LABELS[step] ?? step}</span>
                      <span className="text-sm text-muted-foreground">{count} users ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your user base and growth metrics</p>
      </div>
      {children}
    </div>
  )
}
