const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082'

function getToken() {
  return localStorage.getItem('escrowd_token')
}

export function getUser() {
  const raw = localStorage.getItem('escrowd_user')
  return raw ? JSON.parse(raw) : null
}

export function saveAuth(data) {
  localStorage.setItem('escrowd_token', data.token)
  localStorage.setItem('escrowd_user', JSON.stringify({
    id: data.user_id,
    username: data.username,
    isAdmin: data.is_admin,
  }))
}

export function clearAuth() {
  localStorage.removeItem('escrowd_token')
  localStorage.removeItem('escrowd_user')
}

async function request(method, path, body = null) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = { method, headers }
  if (body) options.body = JSON.stringify(body)

  const res = await fetch(`${BASE_URL}${path}`, options)

  if (res.status === 401) {
    clearAuth()
    window.location.href = '/login'
    throw new Error('Session expired')
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

// Auth
export const register = (data) => request('POST', '/api/auth/register', data)
export const login = (data) => request('POST', '/api/auth/login', data)

// Deals
export const createDeal = (data) => request('POST', '/api/deals', data)
export const getDeals = () => request('GET', '/api/deals')
export const getDeal = (id) => request('GET', `/api/deals/${id}`)
export const completeDeal = (id) => request('POST', `/api/deals/${id}/claim`)
export const refundDeal = (id) => request('POST', `/api/deals/${id}/refund`)
export const raiseDispute = (id, data) => request('POST', `/api/deals/${id}/dispute`, data)
export const submitEvidence = (id, data) => request('POST', `/api/deals/${id}/evidence`, data)

// Admin
export const adminGetDeals = () => request('GET', '/api/admin/deals')
export const adminResolve = (id, data) => request('POST', `/api/admin/resolve/${id}`, data)
export const getAuditLog = () => request('GET', '/api/admin/audit')
