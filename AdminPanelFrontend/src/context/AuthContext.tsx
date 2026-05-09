import React, { createContext, useContext, useState } from 'react'
import type { AdminUser } from '@/types'

interface AuthContextType {
  admin: AdminUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const DEMO_ADMINS: Array<AdminUser & { password: string }> = [
  { id: '1', name: 'Harsh Vikram Singh', email: 'admin@shopify-panel.com', role: 'super_admin', password: 'admin123' },
  { id: '2', name: 'Jane Admin', email: 'jane@shopify-panel.com', role: 'admin', password: 'admin123' },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const stored = localStorage.getItem('admin_session')
    return stored ? (JSON.parse(stored) as AdminUser) : null
  })

  const login = async (email: string, password: string): Promise<boolean> => {
    const found = DEMO_ADMINS.find((a) => a.email === email && a.password === password)
    if (!found) return false
    const { password: _pw, ...adminData } = found
    void _pw
    setAdmin(adminData)
    localStorage.setItem('admin_session', JSON.stringify(adminData))
    return true
  }

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem('admin_session')
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
