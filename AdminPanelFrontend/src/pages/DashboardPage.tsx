import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { DashboardStats } from '@/types'
import { Store, TrendingUp, ShoppingBag, PackageX } from 'lucide-react'

const PLAN_COLORS: Record<string, 'secondary' | 'info' | 'warning' | 'success'> = {
  free: 'secondary',
  starter: 'info',
  growth: 'warning',
  enterprise: 'success',
}

const ONBOARDING_LABELS: Record<string, string> = {
  store_installed: 'Store Installed',
  walmart_connected: 'Walmart Connected',
  completed: 'Fully Active',
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getStats()
      .then(setStats)
      .catch(() => setError('Failed to load stats. Make sure the backend is running.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Shell>
        <p className="text-muted-foreground">Loading dashboard…</p>
      </Shell>
    )
  }

  if (error) {
    return (
      <Shell>
        <p className="text-red-500 text-sm bg-red-50 p-4 rounded-md">{error}</p>
      </Shell>
    )
  }

  if (!stats) return null

  const statCards = [
    {
      label: 'Total Stores',
      value: stats.totalStores,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Active Stores',
      value: stats.activeStores,
      icon: Store,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'New This Month',
      value: stats.newThisMonth,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Uninstalled',
      value: stats.uninstalledStores,
      icon: PackageX,
      color: 'bg-red-50 text-red-600',
    },
  ]

  const totalForPlan = Object.values(stats.planBreakdown).reduce((a, b) => a + b, 0) || 1
  const totalForOnboarding = Object.values(stats.onboardingBreakdown).reduce((a, b) => a + b, 0) || 1

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
              <CardTitle>Stores by Plan</CardTitle>
              <CardDescription>Distribution across pricing tiers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(stats.planBreakdown).map(([plan, count]) => {
                const pct = Math.round((count / totalForPlan) * 100)
                return (
                  <div key={plan}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={PLAN_COLORS[plan] ?? 'default'}
                          className="capitalize"
                        >
                          {plan}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{count} stores</span>
                      </div>
                      <span className="text-sm font-medium">{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Onboarding Progress</CardTitle>
              <CardDescription>Stores at each step of the onboarding flow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(stats.onboardingBreakdown).map(([step, count]) => {
                const pct = Math.round((count / totalForOnboarding) * 100)
                return (
                  <div key={step}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        {ONBOARDING_LABELS[step] ?? step}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {count} stores ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
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
        <p className="text-muted-foreground">Overview of all connected Shopify stores</p>
      </div>
      {children}
    </div>
  )
}
