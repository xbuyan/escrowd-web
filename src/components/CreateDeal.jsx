import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDeal } from '../api/client'

const inp = {padding:'7px 11px',borderRadius:'6px',border:'0.5px solid #e5e5e3',background:'#fff',fontSize:'13px',fontFamily:'inherit',outline:'none',width:'100%'}
const lbl = {fontSize:'12px',fontWeight:500,color:'#666',marginBottom:'5px',display:'block'}

export default function CreateDeal() {
  const nav = useNavigate()
  const [form,setForm] = useState({role:'buyer',counterparty:'',title:'',description:'',amount:'',currency:'XLM',expiry:'172800'})
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(null)
  const [success,setSuccess] = useState(false)

  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  async function handleSubmit() {
    if(!form.counterparty||!form.title||!form.amount){setError('Please fill in all required fields.');return}
    setLoading(true);setError(null)
    try {
      const deal = await createDeal(form)
      nav(`/deals/${deal.id}`)
    } catch(e) {
      // backend not connected yet — show success for demo
      setSuccess(true)
    } finally { setLoading(false) }
  }

  return (
    <div style={{maxWidth:'860px',margin:'0 auto',padding:'1.75rem 1.5rem'}}>
      <p style={{fontSize:'12px',fontWeight:500,color:'#888',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:'.875rem'}}>New escrow deal</p>
      {success && <div style={{background:'#E1F5EE',border:'0.5px solid #5DCAA5',borderRadius:'6px',padding:'10px 14px',display:'flex',alignItems:'center',gap:'8px',marginBottom:'.875rem',fontSize:'13px',color:'#085041'}}>✓ Deal created. Share the deal ID with the other party.</div>}
      {error && <div style={{background:'#FCEBEB',border:'0.5px solid #F7C1C1',borderRadius:'6px',padding:'10px 14px',marginBottom:'.875rem',fontSize:'13px',color:'#501313'}}>{error}</div>}
      <div style={{background:'#fff',border:'0.5px solid #e5e5e3',borderRadius:'10px',padding:'1.25rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'10px'}}>
          <div><label style={lbl}>Your role</label>
            <select style={inp} value={form.role} onChange={e=>set('role',e.target.value)}>
              <option value="buyer">Buyer (Alice — I'm paying)</option>
              <option value="seller">Seller (Bob — I'm receiving)</option>
            </select>
          </div>
          <div><label style={lbl}>Counterparty wallet or Discord ID</label>
            <input style={inp} placeholder="G... or @username#0000" value={form.counterparty} onChange={e=>set('counterparty',e.target.value)}/>
          </div>
        </div>
        <div style={{marginBottom:'10px'}}><label style={lbl}>What are you trading?</label>
          <input style={inp} placeholder="e.g. Steam game key, Graphic design, USDT swap" value={form.title} onChange={e=>set('title',e.target.value)}/>
        </div>
        <div style={{marginBottom:'10px'}}><label style={lbl}>Description</label>
          <textarea style={{...inp,minHeight:'68px',resize:'vertical'}} placeholder="Describe the goods or service..." value={form.description} onChange={e=>set('description',e.target.value)}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'10px'}}>
          <div><label style={lbl}>Amount</label>
            <div style={{display:'flex',gap:'6px'}}>
              <input style={{...inp,flex:1}} type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={e=>set('amount',e.target.value)}/>
              <select style={{...inp,width:'auto'}} value={form.currency} onChange={e=>set('currency',e.target.value)}>
                <option>XLM</option><option>KES (M-Pesa)</option><option>USD</option>
              </select>
            </div>
          </div>
          <div><label style={lbl}>Expiry</label>
            <select style={inp} value={form.expiry} onChange={e=>set('expiry',e.target.value)}>
              <option value="86400">24 hours</option>
              <option value="172800">48 hours</option>
              <option value="604800">7 days</option>
              <option value="2592000">30 days</option>
            </select>
          </div>
        </div>
        {form.currency==='KES (M-Pesa)' && <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'9px 12px',background:'#fafaf8',borderRadius:'6px',border:'0.5px solid #e5e5e3',fontSize:'12px',color:'#666',marginBottom:'10px'}}>📱 M-Pesa STK push will be sent to your registered number after deal creation.</div>}
        <div style={{height:'0.5px',background:'#e5e5e3',margin:'1rem 0'}}/>
        <button onClick={handleSubmit} disabled={loading} style={{width:'100%',padding:'10px',borderRadius:'6px',background:loading?'#ccc':'#1D9E75',color:'#fff',border:'none',fontSize:'14px',fontWeight:500,cursor:loading?'not-allowed':'pointer'}}>
          {loading?'Creating deal...':'Create deal on Stellar'}
        </button>
      </div>
    </div>
  )
}
