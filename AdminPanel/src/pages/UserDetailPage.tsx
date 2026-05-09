import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '@/lib/api'
import type { User } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Store, Mail, Phone, Globe, MapPin, Building2, CreditCard, Calendar, ShoppingCart, DollarSign } from 'lucide-react'

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

const ONBOARDING_STEPS = [
  { key: 'account_created', label: 'Account Created' },
  { key: 'store_connected', label: 'Store Connected' },
  { key: 'products_synced', label: 'Products Synced' },
  { key: 'first_campaign', label: 'First Campaign' },
  { key: 'completed', label: 'Completed' },
]

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api
      .getUser(id)
      .then(setUser)
      .catch(() => setError('User not found.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Shell><p className="text-muted-foreground">Loading user…</p></Shell>
  if (error || !user) return <Shell><p className="text-red-500">{error || 'User not found.'}</p></Shell>

  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
  const currentStepIndex = ONBOARDING_STEPS.findIndex((s) => s.key === user.onboardingStep)

  return (
    <Shell>
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <Link to="/users">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <div className="flex items-center gap-4 flex-1">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-muted-foreground text-sm">{user.email}</p>
            <div className="flex gap-2 mt-1.5">
              <Badge variant={STATUS_VARIANT[user.status]} className="capitalize">{user.status}</Badge>
              <Badge variant={PLAN_VARIANT[user.plan]} className="capitalize">{user.plan}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Onboarding progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Onboarding Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${user.onboardingProgress}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-blue-600">{user.onboardingProgress}%</span>
              </div>
              <div className="flex justify-between gap-1">
                {ONBOARDING_STEPS.map((step, i) => {
                  const done = i <= currentStepIndex
                  const current = i === currentStepIndex
                  return (
                    <div key={step.key} className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs font-bold
                          ${current ? 'border-blue-500 bg-blue-500 text-white' : done ? 'border-blue-500 bg-blue-100 text-blue-600' : 'border-muted bg-muted text-muted-foreground'}`}
                      >
                        {done ? '✓' : i + 1}
                      </div>
                      <p className="text-[10px] text-center text-muted-foreground leading-tight">{step.label}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Account stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">${user.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{user.ordersCount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{new Date(user.joinedAt).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">Joined</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={Mail} label="Email" value={user.email} />
              <InfoRow icon={Mail} label="Billing Email" value={user.accountDetails.billingEmail} />
              <InfoRow icon={Phone} label="Phone" value={user.accountDetails.phone} />
              <InfoRow icon={Building2} label="Company" value={user.accountDetails.company} />
              <InfoRow icon={Globe} label="Website" value={user.accountDetails.website} />
              <InfoRow icon={MapPin} label="Address" value={user.accountDetails.address} />
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Store Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={Store} label="Shopify Store" value={user.shopifyStore} />
              <InfoRow icon={Globe} label="Country" value={user.country} />
              <Separator />
              <InfoRow icon={Calendar} label="Joined" value={new Date(user.joinedAt).toLocaleString()} />
              <InfoRow icon={Calendar} label="Last Active" value={new Date(user.lastActiveAt).toLocaleString()} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold capitalize">{user.plan} Plan</p>
                  <p className="text-xs text-muted-foreground">Current pricing tier</p>
                </div>
              </div>
              <Badge
                variant={PLAN_VARIANT[user.plan]}
                className="capitalize w-full justify-center py-1"
              >
                {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
              </Badge>
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
        <h1 className="text-2xl font-bold text-slate-900">User Detail</h1>
        <p className="text-muted-foreground">Full profile and account information</p>
      </div>
      {children}
    </div>
  )
}
