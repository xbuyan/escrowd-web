import { useNavigate } from 'react-router-dom'
import { getUser, clearAuth } from '../api/client'

export default function Nav() {
  const nav = useNavigate()
  const user = getUser()

  function logout() {
    clearAuth()
    nav('/login')
  }

  return (
    <nav style={{ background: '#fff', borderBottom: '0.5px solid #e5e5e3', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '52px', position: 'sticky', top: 0, zIndex: 20 }}>
      <div onClick={() => nav('/')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '16px' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1D9E75' }} />
        Escrowd
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {user ? (
          <>
            <span style={{ fontSize: '12px', color: '#888' }}>{user.username}</span>
            <button onClick={() => nav('/deals')} style={{ padding: '5px 12px', borderRadius: '6px', border: '0.5px solid #e5e5e3', background: 'transparent', fontSize: '13px', cursor: 'pointer' }}>My deals</button>
            <button onClick={() => nav('/create')} style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', background: '#1D9E75', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>New deal</button>
            {user.isAdmin && <button onClick={() => nav('/admin')} style={{ padding: '5px 12px', borderRadius: '6px', border: '0.5px solid #AFA9EC', background: '#EEEDFE', color: '#3C3489', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Admin</button>}
            <button onClick={logout} style={{ padding: '5px 12px', borderRadius: '6px', border: '0.5px solid #e5e5e3', background: 'transparent', fontSize: '13px', cursor: 'pointer', color: '#888' }}>Logout</button>
          </>
        ) : (
          <button onClick={() => nav('/login')} style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', background: '#1D9E75', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Sign in</button>
        )}
      </div>
    </nav>
  )
}
