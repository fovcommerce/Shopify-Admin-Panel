import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '@/lib/api'
import type { Store } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  ShoppingBag,
  Calendar,
  Webhook,
  RefreshCw,
  Wifi,
  WifiOff,
  CheckCircle2,
  Circle,
} from 'lucide-react'

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

const ONBOARDING_STEPS = [
  { key: 'store_installed', label: 'Store Installed' },
  { key: 'walmart_connected', label: 'Walmart Connected' },
  { key: 'completed', label: 'Fully Active' },
]

const STEP_ORDER = ['store_installed', 'walmart_connected', 'completed']

function shopInitials(shop: string): string {
  return shop
    .replace('.myshopify.com', '')
    .split(/[-_]/)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2)
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium break-all">{value}</p>
    </div>
  )
}

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api
      .getStore(id)
      .then(setStore)
      .catch(() => setError('Store not found.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <Shell>
        <p className="text-muted-foreground">Loading store…</p>
      </Shell>
    )
  }

  if (error || !store) {
    return (
      <Shell>
        <p className="text-red-500">{error || 'Store not found.'}</p>
      </Shell>
    )
  }

  const initials = shopInitials(store.shop)
  const currentStepIndex = STEP_ORDER.indexOf(store.onboardingStep)
  const creditPct =
    store.orderCreditsLimit > 0
      ? Math.min(100, Math.round((store.orderCreditsUsed / store.orderCreditsLimit) * 100))
      : 0

  const wfsEnabled = store.settings.wfs_enabled
  const mcsEnabled = store.settings.mcs_enabled
  const matchStrategy = store.settings.match_strategy
  const inventorySyncDirection = store.settings.inventory_sync_direction

  const scopeEntries = store.walmartScopes?.scopes
    ? Object.entries(store.walmartScopes.scopes).filter(([, v]) => v)
    : []

  return (
    <Shell>
      <div className="flex items-start gap-4 mb-6">
        <Link to="/users">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <div className="flex items-center gap-4 flex-1">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">
              {initials || <ShoppingBag className="h-6 w-6" />}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-mono">{store.shop}</h2>
            <div className="flex gap-2 mt-1.5 flex-wrap">
              <Badge variant={STATUS_VARIANT[store.status] ?? 'secondary'} className="capitalize">
                {store.status}
              </Badge>
              <Badge variant={PLAN_VARIANT[store.plan] ?? 'secondary'} className="capitalize">
                {store.plan}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Onboarding Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Onboarding Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-5">
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${store.onboardingProgress}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-blue-600 shrink-0">
                  {store.onboardingProgress}%
                </span>
              </div>
              <div className="flex justify-between gap-2">
                {ONBOARDING_STEPS.map((step, i) => {
                  const done = i <= currentStepIndex
                  return (
                    <div key={step.key} className="flex flex-col items-center gap-1.5 flex-1">
                      {done ? (
                        <CheckCircle2 className="h-6 w-6 text-blue-500" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground/40" />
                      )}
                      <p className="text-[11px] text-center text-muted-foreground leading-tight">
                        {step.label}
                      </p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Credits & Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Credits &amp; Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Order Credits Used</p>
                  <p className="text-2xl font-bold">
                    {store.orderCreditsUsed}
                    <span className="text-base font-normal text-muted-foreground">
                      {' '}
                      / {store.orderCreditsLimit}
                    </span>
                  </p>
                </div>
                <Badge
                  variant={store.returnsEnabled ? 'success' : 'secondary'}
                  className="mb-1"
                >
                  Returns {store.returnsEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    creditPct >= 90 ? 'bg-red-500' : creditPct >= 70 ? 'bg-amber-500' : 'bg-primary'
                  }`}
                  style={{ width: `${creditPct}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{creditPct}% of limit used</p>
            </CardContent>
          </Card>

          {/* Store Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Store Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground">WFS Enabled</p>
                  <Badge
                    variant={wfsEnabled ? 'success' : 'secondary'}
                    className="w-fit"
                  >
                    {wfsEnabled ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground">MCS Enabled</p>
                  <Badge
                    variant={mcsEnabled ? 'success' : 'secondary'}
                    className="w-fit"
                  >
                    {mcsEnabled ? 'Yes' : 'No'}
                  </Badge>
                </div>
                {matchStrategy != null && (
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground">Match Strategy</p>
                    <p className="text-sm font-medium capitalize">
                      {String(matchStrategy).replace(/_/g, ' ')}
                    </p>
                  </div>
                )}
                {inventorySyncDirection != null && (
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground">Inventory Sync Direction</p>
                    <p className="text-sm font-medium capitalize">
                      {String(inventorySyncDirection).replace(/_/g, ' ')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column — 1/3 */}
        <div className="space-y-6">
          {/* Store Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Store Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-0.5">
                <p className="text-xs text-muted-foreground">Shop URL</p>
                <p className="text-sm font-medium font-mono break-all">{store.shop}</p>
              </div>
              {store.billingStatus && (
                <>
                  <Separator />
                  <InfoRow label="Billing Status" value={store.billingStatus} />
                </>
              )}
              <Separator />
              <div className="flex items-center gap-2">
                <Webhook className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Webhooks</p>
                  <p className="text-sm font-medium">{store.webhookCount}</p>
                </div>
              </div>
              {store.lastOrderSync && (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Last Order Sync</p>
                    <p className="text-sm font-medium">
                      {new Date(store.lastOrderSync).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Installed At</p>
                  <p className="text-sm font-medium">
                    {new Date(store.installedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {store.uninstalledAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-red-400 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Uninstalled At</p>
                    <p className="text-sm font-medium text-red-600">
                      {new Date(store.uninstalledAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Walmart Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Walmart Connection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                {store.walmartConnected ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-600" />
                    <Badge variant="success">Connected</Badge>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary">Not Connected</Badge>
                  </>
                )}
              </div>
              {store.walmartClientId && (
                <>
                  <Separator />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground">Client ID</p>
                    <p className="text-sm font-medium font-mono break-all">
                      {store.walmartClientId}
                    </p>
                  </div>
                </>
              )}
              {store.walmartScopes && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">Scopes Status</p>
                    <Badge variant={store.walmartScopes.all_ok ? 'success' : 'warning'}>
                      {store.walmartScopes.all_ok ? 'All OK' : 'Missing Scopes'}
                    </Badge>
                  </div>
                  {scopeEntries.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {scopeEntries.map(([scope]) => (
                        <Badge key={scope} variant="outline" className="text-xs">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              )}
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
        <h1 className="text-2xl font-bold text-slate-900">Store Detail</h1>
        <p className="text-muted-foreground">Full profile and store information</p>
      </div>
      {children}
    </div>
  )
}
