/**
 * Store repository — all DB access goes through here.
 * Backed by MongoDB / Mongoose.
 */
const Store = require('../models/Store')

// Never expose tokens or secrets to the API
const SAFE_FIELDS = { access_token: 0, refresh_token: 0, walmart_client_secret: 0 }

function deriveStatus(store) {
  if (store.uninstalled_at) return 'uninstalled'
  if (store.active) return 'active'
  return 'inactive'
}

function deriveOnboardingStep(store) {
  if (!store.walmart_connected) return 'store_installed'
  if (!store.order_credits_used || store.order_credits_used === 0) return 'walmart_connected'
  return 'completed'
}

function deriveOnboardingProgress(store) {
  const map = { store_installed: 33, walmart_connected: 66, completed: 100 }
  return map[deriveOnboardingStep(store)] ?? 0
}

function formatStore(store) {
  return {
    id: store._id.toString(),
    shop: store.shop,
    status: deriveStatus(store),
    plan: store.billing_plan || 'free',
    billingStatus: store.billing_status || null,
    onboardingStep: deriveOnboardingStep(store),
    onboardingProgress: deriveOnboardingProgress(store),
    walmartConnected: store.walmart_connected || false,
    walmartClientId: store.walmart_client_id || null,
    returnsEnabled: store.returns_enabled || false,
    orderCreditsUsed: store.order_credits_used || 0,
    orderCreditsLimit: store.order_credits_limit || 0,
    installedAt: store.installed_at,
    uninstalledAt: store.uninstalled_at || null,
    updatedAt: store.updated_at,
    lastOrderSync: store.wfs_last_order_sync || null,
    settings: store.settings || {},
    webhookCount: store.webhook_ids?.length || 0,
    walmartScopes: store.walmart_scopes || null,
  }
}

async function findAll({ page = 1, limit = 20, search = '', status = '', plan = '' } = {}) {
  const query = {}

  if (search) query.shop = { $regex: search, $options: 'i' }

  if (status === 'active') { query.active = true; query.uninstalled_at = null }
  else if (status === 'inactive') { query.active = false; query.uninstalled_at = null }
  else if (status === 'uninstalled') query.uninstalled_at = { $ne: null }

  if (plan) query.billing_plan = plan

  const [total, stores] = await Promise.all([
    Store.countDocuments(query),
    Store.find(query, SAFE_FIELDS)
      .sort({ installed_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ])

  return { data: stores.map(formatStore), total, page, limit, totalPages: Math.ceil(total / limit) }
}

async function findById(id) {
  const store = await Store.findById(id, SAFE_FIELDS).lean()
  return store ? formatStore(store) : null
}

async function getStats() {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

  const [total, active, uninstalled, newThisMonth, planAgg, allForOnboarding] = await Promise.all([
    Store.countDocuments(),
    Store.countDocuments({ active: true, uninstalled_at: null }),
    Store.countDocuments({ uninstalled_at: { $ne: null } }),
    Store.countDocuments({ installed_at: { $gte: startOfMonth } }),
    Store.aggregate([{ $group: { _id: '$billing_plan', count: { $sum: 1 } } }]),
    Store.find({}, { walmart_connected: 1, order_credits_used: 1 }).lean(),
  ])

  const planBreakdown = {}
  planAgg.forEach(({ _id, count }) => { if (_id) planBreakdown[_id] = count })

  const onboardingBreakdown = { store_installed: 0, walmart_connected: 0, completed: 0 }
  allForOnboarding.forEach((s) => {
    const step = deriveOnboardingStep(s)
    onboardingBreakdown[step] = (onboardingBreakdown[step] || 0) + 1
  })

  return { totalStores: total, activeStores: active, uninstalledStores: uninstalled, newThisMonth, planBreakdown, onboardingBreakdown }
}

module.exports = { findAll, findById, getStats }
