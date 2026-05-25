import { useNavigate } from 'react-router-dom'

const steps = [
  {n:1,title:'Lock funds',desc:'Alice locks XLM or pays via M-Pesa. Funds go to the Stellar ledger, not escrowd.'},
  {n:2,title:'Deliver goods',desc:'Bob delivers the digital goods or service. Alice reviews.'},
  {n:3,title:'Release payment',desc:'Alice marks complete. Bob receives funds directly from the blockchain.'},
  {n:4,title:'Dispute resolution',desc:'Either party raises a dispute. Admin reviews evidence and resolves.'},
]

export default function Landing() {
  const nav = useNavigate()
  return (
    <>
      <div style={{background:'#fff',borderBottom:'0.5px solid #e5e5e3',padding:'3.5rem 1.5rem 2.5rem',textAlign:'center'}}>
        <h1 style={{fontSize:'34px',fontWeight:500,lineHeight:1.2,marginBottom:'.75rem'}}>Trade with strangers.<br/><span style={{color:'#1D9E75'}}>Without trusting them.</span></h1>
        <p style={{fontSize:'16px',color:'#666',maxWidth:'500px',margin:'0 auto 1.75rem'}}>Escrowd locks funds on the Stellar blockchain until both parties are satisfied. No bank. No middleman. No risk.</p>
        <div style={{display:'flex',gap:'10px',justifyContent:'center',flexWrap:'wrap'}}>
          <button onClick={() => nav('/create')} style={{padding:'9px 22px',borderRadius:'6px',background:'#1D9E75',color:'#fff',border:'none',fontSize:'14px',fontWeight:500,cursor:'pointer'}}>Create an escrow deal</button>
          <button onClick={() => nav('/deals')} style={{padding:'9px 22px',borderRadius:'6px',background:'transparent',border:'0.5px solid #e5e5e3',fontSize:'14px',cursor:'pointer'}}>Track a deal</button>
        </div>
      </div>
      <div style={{display:'flex',gap:'1.5rem',justifyContent:'center',flexWrap:'wrap',padding:'1.25rem 1.5rem',background:'#fafaf8',borderBottom:'0.5px solid #e5e5e3'}}>
        {['Stellar blockchain','M-Pesa supported','Discord bot','AES-256 encrypted','Auto-expiry'].map(t=>(
          <div key={t} style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'12px',color:'#666'}}>
            <span style={{color:'#1D9E75'}}>✓</span> {t}
          </div>
        ))}
      </div>
      <div style={{maxWidth:'860px',margin:'0 auto',padding:'1.75rem 1.5rem'}}>
        <p style={{fontSize:'12px',fontWeight:500,color:'#888',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:'.875rem'}}>How it works</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'10px'}}>
          {steps.map(s=>(
            <div key={s.n} style={{background:'#fff',border:'0.5px solid #e5e5e3',borderRadius:'10px',padding:'1.1rem'}}>
              <div style={{width:26,height:26,borderRadius:'50%',background:'#E1F5EE',color:'#0F6E56',fontSize:'12px',fontWeight:500,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'8px'}}>{s.n}</div>
              <div style={{fontSize:'13px',fontWeight:500,marginBottom:'3px'}}>{s.title}</div>
              <div style={{fontSize:'12px',color:'#888',lineHeight:1.45}}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
