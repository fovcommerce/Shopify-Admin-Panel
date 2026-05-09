/**
 * Demo data. When you connect a real database, replace this file's exports
 * with your DB query results. Only userRepository.js touches this data.
 */
const users = [
  {
    id: 'u1', name: 'Alice Johnson', email: 'alice@glamourstore.com', avatarUrl: null,
    status: 'active', plan: 'growth', onboardingStep: 'completed', onboardingProgress: 100,
    shopifyStore: 'glamour-store.myshopify.com', country: 'US',
    joinedAt: '2024-01-15T09:00:00Z', lastActiveAt: '2026-05-08T14:32:00Z',
    totalRevenue: 84200, ordersCount: 1340,
    accountDetails: { phone: '+1 415-555-0101', company: 'Glamour Store Inc.', website: 'https://glamourstore.com', billingEmail: 'billing@glamourstore.com', address: '123 Market St, San Francisco, CA 94103' },
  },
  {
    id: 'u2', name: 'Bob Martinez', email: 'bob@techtrendsshop.com', avatarUrl: null,
    status: 'active', plan: 'starter', onboardingStep: 'first_campaign', onboardingProgress: 80,
    shopifyStore: 'tech-trends.myshopify.com', country: 'CA',
    joinedAt: '2024-03-22T11:00:00Z', lastActiveAt: '2026-05-07T09:15:00Z',
    totalRevenue: 12450, ordersCount: 230,
    accountDetails: { phone: '+1 604-555-0177', company: 'Tech Trends Ltd.', website: 'https://techtrendsshop.com', billingEmail: 'bob@techtrendsshop.com', address: '456 Robson St, Vancouver, BC V6B 2B3' },
  },
  {
    id: 'u3', name: 'Priya Sharma', email: 'priya@ethnicfusion.in', avatarUrl: null,
    status: 'active', plan: 'enterprise', onboardingStep: 'completed', onboardingProgress: 100,
    shopifyStore: 'ethnic-fusion.myshopify.com', country: 'IN',
    joinedAt: '2023-11-05T06:30:00Z', lastActiveAt: '2026-05-09T08:00:00Z',
    totalRevenue: 215000, ordersCount: 5820,
    accountDetails: { phone: '+91 98765-43210', company: 'Ethnic Fusion Pvt Ltd', website: 'https://ethnicfusion.in', billingEmail: 'accounts@ethnicfusion.in', address: 'Plot 7, Sector 18, Noida, UP 201301' },
  },
  {
    id: 'u4', name: 'Carlos Rivera', email: 'carlos@elcomercio.mx', avatarUrl: null,
    status: 'inactive', plan: 'free', onboardingStep: 'store_connected', onboardingProgress: 40,
    shopifyStore: 'el-comercio.myshopify.com', country: 'MX',
    joinedAt: '2025-08-10T15:00:00Z', lastActiveAt: '2025-12-01T10:45:00Z',
    totalRevenue: 320, ordersCount: 18,
    accountDetails: { phone: '+52 55 5555-0199', company: null, website: null, billingEmail: 'carlos@elcomercio.mx', address: 'Av. Insurgentes Sur 1234, CDMX 03100' },
  },
  {
    id: 'u5', name: 'Sarah Kim', email: 'sarah@seoulstyle.kr', avatarUrl: null,
    status: 'active', plan: 'growth', onboardingStep: 'products_synced', onboardingProgress: 60,
    shopifyStore: 'seoul-style.myshopify.com', country: 'KR',
    joinedAt: '2025-12-01T03:00:00Z', lastActiveAt: '2026-05-08T22:10:00Z',
    totalRevenue: 29800, ordersCount: 670,
    accountDetails: { phone: '+82 10-5555-1234', company: 'Seoul Style Co.', website: 'https://seoulstyle.kr', billingEmail: 'finance@seoulstyle.kr', address: '123 Gangnam-daero, Gangnam-gu, Seoul 06234' },
  },
  {
    id: 'u6', name: 'David Okafor', email: 'david@afromarket.ng', avatarUrl: null,
    status: 'active', plan: 'starter', onboardingStep: 'account_created', onboardingProgress: 20,
    shopifyStore: 'afro-market.myshopify.com', country: 'NG',
    joinedAt: '2026-04-28T12:00:00Z', lastActiveAt: '2026-05-01T16:00:00Z',
    totalRevenue: 0, ordersCount: 0,
    accountDetails: { phone: '+234 801-555-0122', company: 'Afro Market Ltd', website: null, billingEmail: 'david@afromarket.ng', address: '45 Adeola Odeku St, Victoria Island, Lagos' },
  },
  {
    id: 'u7', name: 'Emma Wilson', email: 'emma@botanicbliss.co.uk', avatarUrl: null,
    status: 'suspended', plan: 'starter', onboardingStep: 'completed', onboardingProgress: 100,
    shopifyStore: 'botanic-bliss.myshopify.com', country: 'GB',
    joinedAt: '2024-06-14T08:00:00Z', lastActiveAt: '2026-03-15T11:30:00Z',
    totalRevenue: 8900, ordersCount: 195,
    accountDetails: { phone: '+44 20 5555 0133', company: 'Botanic Bliss Ltd', website: 'https://botanicbliss.co.uk', billingEmail: 'emma@botanicbliss.co.uk', address: '22 Oxford Street, London, W1D 1AN' },
  },
  {
    id: 'u8', name: 'Liam Chen', email: 'liam@urbanedge.sg', avatarUrl: null,
    status: 'active', plan: 'growth', onboardingStep: 'completed', onboardingProgress: 100,
    shopifyStore: 'urban-edge.myshopify.com', country: 'SG',
    joinedAt: '2024-09-03T00:00:00Z', lastActiveAt: '2026-05-09T07:45:00Z',
    totalRevenue: 67400, ordersCount: 2100,
    accountDetails: { phone: '+65 9555-1122', company: 'Urban Edge Pte Ltd', website: 'https://urbanedge.sg', billingEmail: 'finance@urbanedge.sg', address: '80 Raffles Place, #14-01, Singapore 048624' },
  },
]

module.exports = { users }
