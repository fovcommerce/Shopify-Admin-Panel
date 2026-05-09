import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ShoppingBag, Users, LayoutDashboard, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/users', label: 'Users', icon: Users },
]

export default function Layout() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = admin?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2) ?? 'AD'

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-white border-r border-border shadow-sm shrink-0">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <ShoppingBag className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-slate-900">Shopify Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{admin?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{admin?.role.replace('_', ' ')}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-slate-600" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
