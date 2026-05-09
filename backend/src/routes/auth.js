const express = require('express')
const router = express.Router()

const DEMO_ADMINS = [
  { id: '1', name: 'Harsh Vikram Singh', email: 'admin@shopify-panel.com', role: 'super_admin', password: 'admin123' },
  { id: '2', name: 'Jane Admin', email: 'jane@shopify-panel.com', role: 'admin', password: 'admin123' },
]

router.post('/login', (req, res) => {
  const { email, password } = req.body
  const admin = DEMO_ADMINS.find((a) => a.email === email && a.password === password)
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' })
  const { password: _, ...adminData } = admin
  void _
  res.json({ admin: adminData, token: `demo-token-${adminData.id}` })
})

module.exports = router
