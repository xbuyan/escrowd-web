import { useState, useEffect } from 'react'
import { adminGetDeals, getAuditLog, getDeal } from '../api/client'
import DisputePanel from './DisputePanel'

const DEMO_DEALS = [
  {id:'ESC-7F2A',title:'Steam key — Elden Ring',buyer:'Lucciano',seller:'Bob',amount:'25',currency:'XLM',status:'funded'},
  {id:'ESC-3B9C',title:'Logo design',buyer:'Lucciano',seller:'Alice',amount:'500',currency:'KES',status:'pending'},
  {id:'ESC-1D4E',title:'USDT ↔ KES swap',buyer:'Kariuki',seller:'Lucciano',amount:'200',currency:'USDT',status:'disputed'},
  {id:'ESC-0A1B',title:'Minecraft account',buyer:'Amara',seller:'Lucciano',amount:'15',currency:'XLM',status:'completed'},
]
const DEMO_AUDIT = [
  {created_at:'09:14:22',event:'Dispute raised',deal_id:'ESC-1D4E',actor:'Kariuki'},
  {created_at:'09:03:11',event:'Deal funded',deal_id:'ESC-7F2A',actor:'Lucciano'},
  {created_at:'08:55:44',event:'Deal created',deal_id:'ESC-3B9C',actor:'Lucciano'},
  {created_at:'May 22 · 18:30',event:'Evidence submitted',deal_id:'ESC-1D4E',actor:'Amara'},
  {created_at:'May 22 · 17:12',event:'Deal complete',deal_id:'ESC-0A1B',actor:'Admin'},
]
const badgeBg={pending:'#FAEEDA',funded:'#E1F5EE',disputed:'#FCEBEB',completed:'#E1F5EE',expired:'#F1EFE8'}
const badgeTx={pending:'#633806',funded:'#085041',disputed:'#501313',completed:'#085041',expired:'#2C2C2A'}

export default function AdminPanel() {
  const [deals,setDeals] = useState(DEMO_DEALS)
  const [audit,setAudit] = useState(DEMO_AUDIT)
  const [tab,setTab] = useState('disputes')
  const [selected,setSelected] = useState(null)
  const [selectedDeal,setSelectedDeal] = useState(null)

  useEffect(()=>{
    adminGetDeals().then(setDeals).catch(()=>{})
    getAuditLog().then(setAudit).catch(()=>{})
  },[])

  const disputed = deals.filter(d=>d.status==='disputed')
  const stats = [
    {label:'Active deals',val:deals.filter(d=>!['completed','expired'].includes(d.status)).length,color:'#111'},
    {label:'Disputed',val:disputed.length,color:'#A32D2D'},
    {label:'Completed',val:deals.filter(d=>d.status==='completed').length,color:'#1D9E75'},
    {label:'Total locked',val:deals.filter(d=>d.status==='funded').reduce((a,d)=>a+parseFloat(d.amount||0),0).toFixed(0)+' XLM',color:'#534AB7'},
  ]

  async function openDispute(id) {
    setSelected(id)
    getDeal(id).then(setSelectedDeal).catch(()=>setSelectedDeal(null))
  }

  const refresh = () => {
    adminGetDeals().then(setDeals).catch(()=>{})
    if(selected) getDeal(selected).then(setSelectedDeal).catch(()=>{})
  }

  const th = {textAlign:'left',padding:'8px 10px',borderBottom:'0.5px solid #e5e5e3',fontSize:'11px',fontWeight:500,color:'#888'}
  const td = {padding:'9px 10px',borderBottom:'0.5px solid #e5e5e3',verticalAlign:'middle'}

  return (
    <>
      <div style={{background:'#fff',borderBottom:'0.5px solid #e5e5e3',padding:'.875rem 1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{fontSize:'15px',fontWeight:500}}>Admin panel</div>
          <span style={{fontSize:'12px',fontWeight:500,padding:'3px 8px',borderRadius:'20px',background:'#EEEDFE',color:'#3C3489'}}>Escrowd Admin</span>
        </div>
        <div style={{fontSize:'12px',color:'#888'}}>klucianob_95373</div>
      </div>
      <div style={{maxWidth:'860px',margin:'0 auto',padding:'1.75rem 1.5rem'}}>
        <p style={{fontSize:'12px',fontWeight:500,color:'#888',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:'.875rem'}}>Overview</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:'10px',marginBottom:'1.25rem'}}>
          {stats.map(s=>(
            <div key={s.label} style={{background:'#fafaf8',borderRadius:'8px',padding:'.875rem 1rem'}}>
              <div style={{fontSize:'11px',color:'#888',marginBottom:'4px'}}>{s.label}</div>
              <div style={{fontSize:'22px',fontWeight:500,color:s.color}}>{s.val}</div>
            </div>
          ))}
        </div>

        <div style={{display:'flex',gap:'2px',marginBottom:'1.25rem',background:'#fafaf8',borderRadius:'8px',padding:'3px'}}>
          {['disputes','deals','audit'].map(t=>(
            <button key={t} onClick={()=>{setTab(t);setSelected(null)}} style={{flex:1,padding:'6px 10px',borderRadius:'6px',border:tab===t?'0.5px solid #e5e5e3':'none',background:tab===t?'#fff':'transparent',fontSize:'13px',fontWeight:500,cursor:'pointer',color:tab===t?'#111':'#888'}}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        {tab==='disputes'&&(
          selected?(
            <div>
              <button onClick={()=>setSelected(null)} style={{display:'inline-flex',alignItems:'center',gap:'5px',padding:'5px 10px',borderRadius:'6px',border:'0.5px solid #e5e5e3',background:'transparent',color:'#888',fontSize:'12px',cursor:'pointer',marginBottom:'10px'}}>← All disputes</button>
              <DisputePanel dealId={selected} evidence={selectedDeal?.evidence||[]} isAdmin={true} onUpdate={refresh}/>
            </div>
          ):(
            <div style={{background:'#fff',border:'0.5px solid #e5e5e3',borderRadius:'10px',overflow:'hidden'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
                <thead><tr><th style={th}>Deal</th><th style={th}>Parties</th><th style={th}>Amount</th><th style={th}>Status</th><th style={th}/></tr></thead>
                <tbody>
                  {disputed.length===0?(
                    <tr><td colSpan={5} style={{textAlign:'center',padding:'2rem',color:'#888',fontSize:'13px'}}>No active disputes</td></tr>
                  ):disputed.map(d=>(
                    <tr key={d.id} style={{cursor:'pointer'}} onClick={()=>openDispute(d.id)}>
                      <td style={td}><div style={{fontSize:'11px',fontFamily:'monospace',color:'#aaa'}}>#{d.id}</div><div style={{fontSize:'12px',fontWeight:500}}>{d.title}</div></td>
                      <td style={{...td,fontSize:'11px',color:'#888'}}>{d.buyer} vs {d.seller}</td>
                      <td style={{...td,fontSize:'13px',fontWeight:500}}>{d.amount} {d.currency}</td>
                      <td style={td}><span style={{padding:'2px 7px',borderRadius:'20px',fontSize:'11px',fontWeight:500,background:'#FCEBEB',color:'#501313'}}>Disputed</span></td>
                      <td style={td}><button onClick={e=>{e.stopPropagation();openDispute(d.id)}} style={{padding:'4px 10px',borderRadius:'6px',border:'0.5px solid #534AB7',background:'#EEEDFE',color:'#3C3489',fontSize:'11px',fontWeight:500,cursor:'pointer'}}>Resolve</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {tab==='deals'&&(
          <div style={{background:'#fff',border:'0.5px solid #e5e5e3',borderRadius:'10px',overflow:'hidden'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
              <thead><tr><th style={th}>Deal ID</th><th style={th}>Title</th><th style={th}>Buyer</th><th style={th}>Seller</th><th style={th}>Amount</th><th style={th}>Status</th></tr></thead>
              <tbody>{deals.map(d=>(
                <tr key={d.id}>
                  <td style={{...td,fontFamily:'monospace',fontSize:'11px',color:'#aaa'}}>#{d.id}</td>
                  <td style={{...td,fontSize:'12px'}}>{d.title}</td>
                  <td style={{...td,fontSize:'11px'}}>{d.buyer}</td>
                  <td style={{...td,fontSize:'11px'}}>{d.seller}</td>
                  <td style={{...td,fontSize:'12px',fontWeight:500}}>{d.amount} {d.currency}</td>
                  <td style={td}><span style={{padding:'2px 7px',borderRadius:'20px',fontSize:'11px',fontWeight:500,background:badgeBg[d.status],color:badgeTx[d.status]}}>{d.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {tab==='audit'&&(
          <div style={{background:'#fff',border:'0.5px solid #e5e5e3',borderRadius:'10px',overflow:'hidden'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
              <thead><tr><th style={th}>Time</th><th style={th}>Event</th><th style={th}>Deal</th><th style={th}>Actor</th></tr></thead>
              <tbody>{audit.map((a,i)=>(
                <tr key={i}>
                  <td style={{...td,fontSize:'11px',color:'#aaa'}}>{a.created_at}</td>
                  <td style={{...td,fontSize:'12px'}}>{a.event}</td>
                  <td style={{...td,fontFamily:'monospace',fontSize:'11px',color:'#aaa'}}>#{a.deal_id}</td>
                  <td style={{...td,fontSize:'11px'}}>{a.actor}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
