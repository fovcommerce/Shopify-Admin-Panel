import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import type { User } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Search, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

const STATUS_VARIANT = {
  active: 'success',
  inactive: 'secondary',
  suspended: 'destructive',
} as const

const PLAN_VARIANT = {
  free: 'secondary',
  starter: 'info',
  growth: 'warning',
  enterprise: 'success',
} as const

const ONBOARDING_STEPS: Record<string, { label: string; pct: number }> = {
  account_created: { label: 'Account Created', pct: 20 },
  store_connected: { label: 'Store Connected', pct: 40 },
  products_synced: { label: 'Products Synced', pct: 60 },
  first_campaign: { label: 'First Campaign', pct: 80 },
  completed: { label: 'Completed', pct: 100 },
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { setPage(1) }, [search, statusFilter, planFilter])

  useEffect(() => {
    setLoading(true)
    api
      .getUsers({ page, limit: 10, search, status: statusFilter, plan: planFilter })
      .then((res) => {
        setUsers(res.data)
        setTotal(res.total)
        setTotalPages(res.totalPages)
      })
      .finally(() => setLoading(false))
  }, [page, search, statusFilter, planFilter])

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <p className="text-muted-foreground">{total} total users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email, store…"
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
          <option value="suspended">Suspended</option>
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
            <div className="p-12 text-center text-muted-foreground">Loading users…</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {['User', 'Store', 'Status', 'Plan', 'Onboarding', 'Joined', ''].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const step = ONBOARDING_STEPS[user.onboardingStep]
                    const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
                    return (
                      <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-900">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{user.shopifyStore}</td>
                        <td className="px-4 py-3">
                          <Badge variant={STATUS_VARIANT[user.status]} className="capitalize">{user.status}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={PLAN_VARIANT[user.plan]} className="capitalize">{user.plan}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1 min-w-[140px]">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">{step?.label}</span>
                              <span className="font-medium">{step?.pct}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                              <div className="h-full rounded-full bg-blue-500" style={{ width: `${step?.pct ?? 0}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                          {new Date(user.joinedAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <Link to={`/users/${user.id}`}>
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
          <p className="text-sm text-muted-foreground">Page {page} of {totalPages} ({total} users)</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
