import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import type { Store } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Search, ChevronLeft, ChevronRight, ArrowRight, ShoppingBag, Wifi, WifiOff } from 'lucide-react'

const STATUS_VARIANT: Record<string, 'success' | 'secondary' | 'destructive'> = {
  active: 'success',
  inactive: 'secondary',
  uninstalled: 'destructive',
}

const PLAN_VARIANT: Record<string, 'secondary' | 'info' | 'warning' | 'success'> = {
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

function shopInitials(shop: string): string {
  return shop
    .replace('.myshopify.com', '')
    .split(/[-_]/)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2)
}

export default function UsersPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter, planFilter])

  useEffect(() => {
    setLoading(true)
    api
      .getStores({ page, limit: 10, search, status: statusFilter, plan: planFilter })
      .then((res) => {
        setStores(res.data)
        setTotal(res.total)
        setTotalPages(res.totalPages)
      })
      .catch(() => {
        setStores([])
      })
      .finally(() => setLoading(false))
  }, [page, search, statusFilter, planFilter])

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Stores</h1>
        <p className="text-muted-foreground">{total} total stores</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by shop name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="uninstalled">Uninstalled</option>
        </select>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All Plans</option>
          <option value="free">Free</option>
          <option value="starter">Starter</option>
          <option value="growth">Growth</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground">Loading stores…</div>
          ) : stores.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">No stores found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {['Store', 'Status', 'Plan', 'Walmart', 'Onboarding', 'Credits', 'Installed', ''].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store) => {
                    const initials = shopInitials(store.shop)
                    const onboardingLabel = ONBOARDING_LABELS[store.onboardingStep] ?? store.onboardingStep
                    const creditPct =
                      store.orderCreditsLimit > 0
                        ? Math.min(100, Math.round((store.orderCreditsUsed / store.orderCreditsLimit) * 100))
                        : 0

                    return (
                      <tr
                        key={store.id}
                        className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                <ShoppingBag className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-900 font-mono text-xs">{store.shop}</p>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                {initials}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={STATUS_VARIANT[store.status] ?? 'secondary'}
                            className="capitalize"
                          >
                            {store.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={PLAN_VARIANT[store.plan] ?? 'secondary'}
                            className="capitalize"
                          >
                            {store.plan}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {store.walmartConnected ? (
                            <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                              <Wifi className="h-3.5 w-3.5" /> Connected
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-muted-foreground text-xs">
                              <WifiOff className="h-3.5 w-3.5" /> Not connected
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1 min-w-[150px]">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">{onboardingLabel}</span>
                              <span className="font-medium">{store.onboardingProgress}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-blue-500"
                                style={{ width: `${store.onboardingProgress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs">
                          <span className="font-medium">{store.orderCreditsUsed}</span>
                          <span className="text-muted-foreground"> / {store.orderCreditsLimit}</span>
                          <div className="h-1 rounded-full bg-muted overflow-hidden mt-1 w-16">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${creditPct}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                          {new Date(store.installedAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <Link to={`/users/${store.id}`}>
                            <Button variant="ghost" size="sm" className="gap-1 text-xs">
                              View <ArrowRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({total} stores)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
