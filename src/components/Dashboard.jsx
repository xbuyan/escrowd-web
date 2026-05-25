import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDeals } from '../api/client'

const badgeColor = { locked: '#E1F5EE', refunded: '#FAEEDA', disputed: '#FCEBEB', claimed: '#E1F5EE', resolved: '#EEEDFE' }
const badgeText = { locked: '#085041', refunded: '#633806', disputed: '#501313', claimed: '#085041', resolved: '#26215C' }
const badgeLabel = { locked: 'Funded', refunded: 'Refunded', disputed: 'Disputed', claimed: 'Complete', resolved: 'Resolved' }

export default function Dashboard() {
  const nav = useNavigate()
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('active')

  useEffect(() => {
    getDeals()
      .then(setDeals)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const active = deals.filter(d => !['claimed', 'refunded', 'resolved'].includes(d.status))
  const history = deals.filter(d => ['claimed', 'refunded', 'resolved'].includes(d.status))
  const list = tab === 'active' ? active : history

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '1.75rem 1.5rem' }}>
      <div style={{ display: 'flex', gap: '2px', marginBottom: '1.25rem', background: '#fafaf8', borderRadius: '8px', padding: '3px' }}>
        {['active', 'history'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: tab === t ? '0.5px solid #e5e5e3' : 'none', background: tab === t ? '#fff' : 'transparent', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: tab === t ? '#111' : '#888' }}>
            {t === 'active' ? `Active (${active.length})` : `History (${history.length})`}
          </button>
        ))}
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '3rem', color: '#888', fontSize: '13px' }}>Loading deals...</div>}

      {error && <div style={{ background: '#FCEBEB', border: '0.5px solid #F7C1C1', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#501313', marginBottom: '1rem' }}>
        Could not connect to API: {error}
      </div>}

      {!loading && !error && list.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888', fontSize: '13px' }}>
          No {tab} deals yet.
          {tab === 'active' && <div style={{ marginTop: '12px' }}>
            <button onClick={() => nav('/create')} style={{ padding: '7px 16px', borderRadius: '6px', border: '0.5px solid #e5e5e3', background: 'transparent', fontSize: '13px', cursor: 'pointer' }}>Create your first deal</button>
          </div>}
        </div>
      )}

      {!loading && list.length > 0 && (
        <div style={{ background: '#fff', border: '0.5px solid #e5e5e3', borderRadius: '10px', padding: '0 1.25rem' }}>
          {list.map(d => (
            <div key={d.id} onClick={() => nav(`/deals/${d.id}`)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '0.5px solid #e5e5e3', gap: '10px', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '.75'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#aaa', marginBottom: '2px' }}>#{d.id.slice(0, 8)}</div>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{d.title}</div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>With {d.counterparty} · {d.expires}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>{d.amount} {d.currency}</div>
                <div style={{ marginTop: '4px' }}>
                  <span style={{ padding: '2px 7px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, background: badgeColor[d.status] || '#f5f5f3', color: badgeText[d.status] || '#333' }}>
                    {badgeLabel[d.status] || d.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
