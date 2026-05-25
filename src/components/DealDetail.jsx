import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDeal, completeDeal, refundDeal } from '../api/client'
import DisputePanel from './DisputePanel'

const DEMO_DEALS = {
  'ESC-7F2A':{id:'ESC-7F2A',title:'Steam game key — Elden Ring',amount:'25',currency:'XLM',status:'funded',role:'Buyer',counterparty:'Bob#1234',expires:'31h remaining',stellar_balance_id:'000000008a2f...c4e9',stellar_tx_hash:'3a9f...b721',
    timeline:[{label:'Deal created',sub:'May 22, 2026 · 14:03',state:'done'},{label:'Funds locked on Stellar',sub:'25 XLM · claimable balance active',state:'done'},{label:'Awaiting delivery',sub:'Bob to deliver the game key',state:'active'},{label:'Confirm receipt',sub:'Mark complete to release funds to Bob',state:'waiting'}]},
  'ESC-3B9C':{id:'ESC-3B9C',title:'Logo design — 3 concepts',amount:'500',currency:'KES',status:'pending',role:'Buyer',counterparty:'Alice#5678',expires:'6d remaining',stellar_balance_id:null,stellar_tx_hash:null,
    timeline:[{label:'Deal created',sub:'May 23, 2026 · 09:11',state:'done'},{label:'Awaiting M-Pesa payment',sub:'STK push sent to +254 7XX XXX XXX',state:'active'},{label:'Delivery',sub:'Alice to deliver logo files',state:'waiting'},{label:'Confirm receipt',sub:'Mark complete to release funds',state:'waiting'}]},
  'ESC-1D4E':{id:'ESC-1D4E',title:'USDT ↔ KES swap · 200 USDT',amount:'200',currency:'USDT',status:'disputed',role:'Seller',counterparty:'Kariuki#9901',expires:'2h remaining',stellar_balance_id:'000000003c11...a8d2',stellar_tx_hash:'9b3e...f014',
    timeline:[{label:'Deal created',sub:'May 23, 2026 · 07:45',state:'done'},{label:'Funds locked on Stellar',sub:'200 USDT · claimable balance active',state:'done'},{label:'Dispute raised by Kariuki',sub:'"I sent KES but no USDT received"',state:'warn'},{label:'Admin review',sub:'Evidence submitted — awaiting resolution',state:'active'}]},
}

const dotColor = {done:'#E1F5EE',active:'#FAEEDA',warn:'#FCEBEB',waiting:'#f5f5f3'}
const dotText = {done:'#0F6E56',active:'#854F0B',warn:'#A32D2D',waiting:'#aaa'}
const dotIcon = {done:'✓',active:'·',warn:'!',waiting:'○'}

export default function DealDetail() {
  const {id} = useParams()
  const nav = useNavigate()
  const [deal,setDeal] = useState(null)
  const [acting,setActing] = useState(false)
  const [showDispute,setShowDispute] = useState(false)

  const load = () => getDeal(id).then(setDeal).catch(()=>setDeal(DEMO_DEALS[id]||null))
  useEffect(()=>{load()},[id])

  async function act(fn) {
    setActing(true)
    try{await fn();await load()}catch(e){alert(e.message)}finally{setActing(false)}
  }

  if(!deal) return <div style={{textAlign:'center',padding:'3rem',color:'#888'}}>Loading...</div>

  return (
    <div style={{maxWidth:'860px',margin:'0 auto',padding:'1.75rem 1.5rem'}}>
      <button onClick={()=>nav('/deals')} style={{display:'inline-flex',alignItems:'center',gap:'5px',padding:'5px 10px',borderRadius:'6px',border:'0.5px solid #e5e5e3',background:'transparent',color:'#888',fontSize:'12px',cursor:'pointer',marginBottom:'10px'}}>← Back</button>
      <div style={{background:'#fff',border:'0.5px solid #e5e5e3',borderRadius:'10px',overflow:'hidden'}}>
        <div style={{padding:'1.1rem 1.25rem',borderBottom:'0.5px solid #e5e5e3',display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'12px'}}>
          <div>
            <div style={{fontSize:'11px',fontFamily:'monospace',color:'#aaa',marginBottom:'3px'}}>#{deal.id}</div>
            <div style={{fontSize:'14px',fontWeight:500}}>{deal.title}</div>
            <div style={{fontSize:'11px',color:'#888',marginTop:'2px'}}>{deal.role} · with {deal.counterparty} · {deal.expires}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:'14px',fontWeight:500}}>{deal.amount} {deal.currency}</div>
            <div style={{marginTop:'5px'}}><span style={{padding:'2px 7px',borderRadius:'20px',fontSize:'11px',fontWeight:500,background:'#E1F5EE',color:'#085041'}}>{deal.status}</span></div>
          </div>
        </div>
        <div style={{padding:'1.1rem 1.25rem'}}>
          {deal.timeline?.map((s,i)=>(
            <div key={i} style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
              <div>
                <div style={{width:20,height:20,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',background:dotColor[s.state],color:dotText[s.state],flexShrink:0,marginTop:'1px'}}>{dotIcon[s.state]}</div>
                {i<deal.timeline.length-1&&<div style={{width:'1px',height:'18px',background:'#e5e5e3',marginLeft:'10px'}}/>}
              </div>
              <div style={{flex:1,paddingBottom:i<deal.timeline.length-1?'8px':0}}>
                <div style={{fontSize:'13px',fontWeight:500}}>{s.label}</div>
                <div style={{fontSize:'11px',color:'#888',marginTop:'1px'}}>{s.sub}</div>
              </div>
            </div>
          ))}

          {deal.stellar_balance_id&&(
            <div style={{marginTop:'.875rem',paddingTop:'.875rem',borderTop:'0.5px solid #e5e5e3'}}>
              <span style={{display:'inline-flex',alignItems:'center',gap:'4px',padding:'3px 8px',borderRadius:'20px',background:'#E6F1FB',color:'#0C447C',fontSize:'11px',fontWeight:500}}>◆ On-chain</span>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px',marginTop:'6px'}}>
                <div><div style={{fontSize:'11px',color:'#aaa'}}>Balance ID</div><div style={{fontSize:'11px',fontFamily:'monospace',fontWeight:500}}>{deal.stellar_balance_id}</div></div>
                <div><div style={{fontSize:'11px',color:'#aaa'}}>Lock tx</div><div style={{fontSize:'11px',fontFamily:'monospace',fontWeight:500}}>{deal.stellar_tx_hash}</div></div>
              </div>
            </div>
          )}

          <div style={{display:'flex',gap:'7px',flexWrap:'wrap',marginTop:'.875rem'}}>
            {deal.status==='funded'&&<button disabled={acting} onClick={()=>act(()=>completeDeal(id))} style={{padding:'7px 14px',borderRadius:'6px',border:'0.5px solid #0F6E56',background:'#E1F5EE',color:'#0F6E56',fontSize:'12px',fontWeight:500,cursor:'pointer'}}>Mark complete</button>}
            {['funded','pending'].includes(deal.status)&&<button onClick={()=>setShowDispute(v=>!v)} style={{padding:'7px 14px',borderRadius:'6px',border:'0.5px solid #A32D2D',background:'transparent',color:'#A32D2D',fontSize:'12px',fontWeight:500,cursor:'pointer'}}>{showDispute?'Hide dispute':'Raise dispute'}</button>}
            {deal.status==='funded'&&<button disabled={acting} onClick={()=>act(()=>refundDeal(id))} style={{padding:'7px 14px',borderRadius:'6px',border:'0.5px solid #e5e5e3',background:'transparent',fontSize:'12px',cursor:'pointer'}}>Request refund</button>}
          </div>

          {(showDispute||deal.status==='disputed')&&(
            <div style={{marginTop:'.875rem'}}>
              <DisputePanel dealId={id} evidence={deal.evidence||[]} isAdmin={false} onUpdate={load}/>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
