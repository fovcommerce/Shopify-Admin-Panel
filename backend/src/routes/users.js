const express = require('express')
const router = express.Router()
const userRepo = require('../repositories/userRepository')

router.get('/stats', async (_req, res) => {
  try {
    res.json(await userRepo.getStats())
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

router.get('/', async (req, res) => {
  try {
    const { page, limit, search, status, plan } = req.query
    res.json(await userRepo.findAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      search: search || '',
      status: status || '',
      plan: plan || '',
    }))
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const user = await userRepo.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

module.exports = router
