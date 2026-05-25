import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register, saveAuth } from '../api/client'

const inp = { padding: '8px 12px', borderRadius: '6px', border: '0.5px solid #e5e5e3', fontSize: '14px', fontFamily: 'inherit', outline: 'none', width: '100%' }
const lbl = { fontSize: '12px', fontWeight: 500, color: '#666', marginBottom: '5px', display: 'block' }

export default function Auth() {
  const nav = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit() {
    setError(null)
    if (!form.email || !form.password) { setError('Email and password are required.'); return }
    if (mode === 'register' && !form.username) { setError('Username is required.'); return }
    if (mode === 'register' && form.password.length < 8) { setError('Password must be at least 8 characters.'); return }

    setLoading(true)
    try {
      const fn = mode === 'login' ? login : register
      const data = await fn(form)
      saveAuth(data)
      nav('/')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f3', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1D9E75' }} />
            <span style={{ fontSize: '18px', fontWeight: 500 }}>Escrowd</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '.5rem' }}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p style={{ fontSize: '13px', color: '#888' }}>
            {mode === 'login' ? 'Sign in to manage your escrow deals' : 'Start trading safely on Stellar'}
          </p>
        </div>

        <div style={{ background: '#fff', border: '0.5px solid #e5e5e3', borderRadius: '12px', padding: '1.5rem' }}>
          {error && (
            <div style={{ background: '#FCEBEB', border: '0.5px solid #F7C1C1', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', color: '#501313', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={lbl}>Username</label>
              <input style={inp} placeholder="lucciano" value={form.username} onChange={e => set('username', e.target.value)} />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={lbl}>Email</label>
            <input style={inp} type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={lbl}>Password</label>
            <input style={inp} type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', background: loading ? '#ccc' : '#1D9E75', color: '#fff', border: 'none', fontSize: '14px', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '13px', color: '#888' }}>
          {mode === 'login' ? (
            <>Don't have an account? <button onClick={() => { setMode('register'); setError(null) }}
              style={{ background: 'none', border: 'none', color: '#1D9E75', cursor: 'pointer', fontWeight: 500, fontSize: '13px' }}>Sign up</button></>
          ) : (
            <>Already have an account? <button onClick={() => { setMode('login'); setError(null) }}
              style={{ background: 'none', border: 'none', color: '#1D9E75', cursor: 'pointer', fontWeight: 500, fontSize: '13px' }}>Sign in</button></>
          )}
        </div>
      </div>
    </div>
  )
}
