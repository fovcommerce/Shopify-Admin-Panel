/**
 * User repository — the only layer that reads/writes user data.
 * To connect a real DB: replace the in-memory operations below with
 * your ORM/query calls (Prisma, Mongoose, Knex, etc.).
 */
const { users } = require('../data/users')

async function findAll({ page = 1, limit = 20, search = '', status = '', plan = '' } = {}) {
  let result = [...users]

  if (search) {
    const q = search.toLowerCase()
    result = result.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.shopifyStore.includes(q)
    )
  }
  if (status) result = result.filter((u) => u.status === status)
  if (plan) result = result.filter((u) => u.plan === plan)

  const total = result.length
  const data = result.slice((page - 1) * limit, page * limit)
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
}

async function findById(id) {
  return users.find((u) => u.id === id) ?? null
}

async function getStats() {
  const total = users.length
  const active = users.filter((u) => u.status === 'active').length
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const newThisMonth = users.filter((u) => new Date(u.joinedAt) >= startOfMonth).length
  const churnedThisMonth = users.filter((u) => u.status === 'inactive' && new Date(u.lastActiveAt) >= startOfMonth).length

  const planBreakdown = users.reduce((acc, u) => { acc[u.plan] = (acc[u.plan] || 0) + 1; return acc }, {})
  const onboardingBreakdown = users.reduce((acc, u) => { acc[u.onboardingStep] = (acc[u.onboardingStep] || 0) + 1; return acc }, {})

  return { totalUsers: total, activeUsers: active, newThisMonth, churnedThisMonth, planBreakdown, onboardingBreakdown }
}

module.exports = { findAll, findById, getStats }
