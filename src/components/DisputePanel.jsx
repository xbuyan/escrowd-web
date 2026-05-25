import { useState } from 'react'
import { submitEvidence, adminResolve } from '../api/client'

const DEMO_EVIDENCE = [
  {actor:'Kariuki',role:'buyer',text:'I sent 26,000 KES via M-Pesa at 08:12. Reference: QHJ7823KL. Lucciano has not released the USDT.',created_at:'May 23, 2026 · 09:14'},
  {actor:'Lucciano',role:'seller',text:'I have not received any M-Pesa payment as of 09:30. My Safaricom statement shows no inbound transaction.',created_at:'May 23, 2026 · 09:31'},
]

const avatarBg = {buyer:'#E1F5EE',seller:'#E6F1FB',admin:'#EEEDFE'}
const avatarColor = {buyer:'#0F6E56',seller:'#0C447C',admin:'#3C3489'}

export default function DisputePanel({dealId, evidence=[], isAdmin, onUpdate}) {
  const [text,setText] = useState('')
  const [resolution,setResolution] = useState(null)
  const [note,setNote] = useState('')
  const [loading,setLoading] = useState(false)
  const [showResolve,setShowResolve] = useState(false)

  const items = evidence.length ? evidence : DEMO_EVIDENCE

  async function handleEvidence() {
    if(!text.trim()) return
    setLoading(true)
    try{await submitEvidence(dealId,{text});setText('');onUpdate?.()}
    catch(e){alert(e.message)}
    finally{setLoading(false)}
  }

  async function handleResolve() {
    if(!resolution){alert('Select a resolution direction.');return}
    setLoading(true)
    try{await adminResolve(dealId,{resolution,note});onUpdate?.()}
    catch(e){alert(e.message)}
    finally{setLoading(false)}
  }

  return (
    <div style={{border:'0.5px solid #e5e5e3',borderRadius:'10px',overflow:'hidden'}}>
      <div style={{padding:'1rem 1.25rem',background:'#FCEBEB',borderBottom:'0.5px solid #F7C1C1',display:'flex',alignItems:'center',gap:'8px'}}>
        <span style={{fontSize:'16px'}}>⚠</span>
        <div style={{fontSize:'14px',fontWeight:500,color:'#501313'}}>Dispute — #{dealId}</div>
        <div style={{marginLeft:'auto'}}><span style={{padding:'2px 7px',borderRadius:'20px',fontSize:'11px',fontWeight:500,background:'#EEEDFE',color:'#3C3489'}}>Under review</span></div>
      </div>
      <div style={{padding:'1.25rem'}}>
        <div style={{fontSize:'12px',fontWeight:500,color:'#888',marginBottom:'10px'}}>Evidence thread</div>
        {items.map((ev,i)=>(
          <div key={i} style={{display:'flex',gap:'10px',alignItems:'flex-start',padding:'10px',background:'#fafaf8',borderRadius:'8px',border:'0.5px solid #e5e5e3',marginBottom:'8px'}}>
            <div style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:500,flexShrink:0,background:avatarBg[ev.role]||'#eee',color:avatarColor[ev.role]||'#333'}}>
              {ev.actor?.[0]?.toUpperCase()}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:'11px',fontWeight:500,marginBottom:'2px'}}>{ev.actor} ({ev.role})</div>
              <div style={{fontSize:'12px',color:'#666',lineHeight:1.5}}>{ev.text}</div>
              <div style={{fontSize:'10px',color:'#aaa',marginTop:'2px'}}>{ev.created_at}</div>
            </div>
          </div>
        ))}
        <div style={{paddingTop:'10px'}}>
          <textarea style={{width:'100%',padding:'7px 11px',borderRadius:'6px',border:'0.5px solid #e5e5e3',fontSize:'13px',fontFamily:'inherit',resize:'vertical',marginBottom:'8px',outline:'none'}}
            rows={3} placeholder="Add your evidence or statement..." value={text} onChange={e=>setText(e.target.value)}/>
          <div style={{display:'flex',gap:'7px'}}>
            <button disabled={loading} onClick={handleEvidence} style={{flex:1,padding:'7px 14px',borderRadius:'6px',border:'0.5px solid #e5e5e3',background:'transparent',fontSize:'12px',cursor:'pointer'}}>Submit evidence</button>
            {isAdmin&&<button onClick={()=>setShowResolve(v=>!v)} style={{padding:'7px 14px',borderRadius:'6px',border:'0.5px solid #534AB7',background:'#EEEDFE',color:'#3C3489',fontSize:'12px',fontWeight:500,cursor:'pointer'}}>Resolve dispute</button>}
          </div>
        </div>
        {isAdmin&&showResolve&&(
          <div style={{background:'#fafaf8',borderRadius:'8px',border:'0.5px solid #e5e5e3',padding:'1rem',marginTop:'.875rem'}}>
            <div style={{fontSize:'13px',fontWeight:500,marginBottom:'.75rem'}}>Resolution decision</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'.875rem'}}>
              {['buyer','seller'].map(side=>(
                <div key={side} onClick={()=>setResolution(side)} style={{padding:'.875rem',borderRadius:'8px',border:`0.5px solid ${resolution===side?'#1D9E75':'#e5e5e3'}`,background:resolution===side?'#E1F5EE':'#fff',cursor:'pointer'}}>
                  <div style={{fontSize:'13px',fontWeight:500,marginBottom:'2px'}}>Release to {side}</div>
                  <div style={{fontSize:'11px',color:'#888'}}>{side==='buyer'?'Refund funds — seller did not fulfil.':'Release funds — buyer claim invalid.'}</div>
                </div>
              ))}
            </div>
            <textarea style={{width:'100%',padding:'7px 11px',borderRadius:'6px',border:'0.5px solid #e5e5e3',fontSize:'13px',fontFamily:'inherit',resize:'vertical',marginBottom:'8px',outline:'none'}}
              rows={2} placeholder="Admin resolution note (goes into audit log)..." value={note} onChange={e=>setNote(e.target.value)}/>
            <button disabled={loading} onClick={handleResolve} style={{width:'100%',padding:'7px 14px',borderRadius:'6px',border:'0.5px solid #534AB7',background:'#EEEDFE',color:'#3C3489',fontSize:'13px',fontWeight:500,cursor:'pointer'}}>
              Confirm resolution
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
