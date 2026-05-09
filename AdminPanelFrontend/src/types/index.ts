export type OnboardingStep =
  | 'account_created'
  | 'store_connected'
  | 'products_synced'
  | 'first_campaign'
  | 'completed'

export type PricingPlan = 'free' | 'starter' | 'growth' | 'enterprise'

export type UserStatus = 'active' | 'inactive' | 'suspended'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  status: UserStatus
  plan: PricingPlan
  onboardingStep: OnboardingStep
  onboardingProgress: number
  shopifyStore: string
  country: string
  joinedAt: string
  lastActiveAt: string
  totalRevenue: number
  ordersCount: number
  accountDetails: {
    phone?: string
    company?: string
    website?: string
    billingEmail: string
    address?: string
  }
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'viewer'
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  newThisMonth: number
  churnedThisMonth: number
  planBreakdown: Record<PricingPlan, number>
  onboardingBreakdown: Record<OnboardingStep, number>
}
