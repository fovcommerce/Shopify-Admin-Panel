export type OnboardingStep = 'store_installed' | 'walmart_connected' | 'completed'

export type PricingPlan = 'free' | 'starter' | 'growth' | 'enterprise' | string

export type StoreStatus = 'active' | 'inactive' | 'uninstalled'

export interface WalmartScopes {
  scopes?: Record<string, boolean>
  missing?: string[]
  all_ok?: boolean
}

export interface Store {
  id: string
  shop: string
  status: StoreStatus
  plan: PricingPlan
  billingStatus: string | null
  onboardingStep: OnboardingStep
  onboardingProgress: number
  walmartConnected: boolean
  walmartClientId: string | null
  returnsEnabled: boolean
  orderCreditsUsed: number
  orderCreditsLimit: number
  installedAt: string
  uninstalledAt: string | null
  updatedAt: string
  lastOrderSync: string | null
  settings: Record<string, unknown>
  webhookCount: number
  walmartScopes: WalmartScopes | null
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'viewer'
}

export interface DashboardStats {
  totalStores: number
  activeStores: number
  uninstalledStores: number
  newThisMonth: number
  planBreakdown: Record<string, number>
  onboardingBreakdown: Record<OnboardingStep, number>
}
