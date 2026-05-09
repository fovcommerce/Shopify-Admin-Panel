import type { User, DashboardStats } from '@/types'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export interface UsersResponse {
  data: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface UsersQuery {
  page?: number
  limit?: number
  search?: string
  status?: string
  plan?: string
}

export const api = {
  getUsers: (query: UsersQuery = {}): Promise<UsersResponse> => {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([k, v]) => {
      if (v != null && v !== '') params.set(k, String(v))
    })
    return request<UsersResponse>(`/users?${params}`)
  },
  getUser: (id: string): Promise<User> => request<User>(`/users/${id}`),
  getStats: (): Promise<DashboardStats> => request<DashboardStats>('/users/stats'),
}
