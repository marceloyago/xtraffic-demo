import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { TrendingUp, TrendingDown, Minus, Pause, Zap, Brain } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { mockDecisions } from '../lib/mock-data'
import { isLoggedIn } from '../lib/auth'

const DEC_CFG: Record<string,{color:string;bg:string;border:string;icon:any;label:string}> = {
  ESCALAR:{ color:'#22c55e', bg:'rgba(34,197,94,0.1)',   border:'rgba(34,197,94,0.25)',   icon:TrendingUp,  label:'Escalar' },
  MANTER: { color:'#3b82f6', bg:'rgba(59,130,246,0.1)',  border:'rgba(59,130,246,0.25)',  icon:Minus,       label:'Manter' },
  REDUZIR:{ color:'#f97316', bg:'rgba(249,115,22,0.1)',  border:'rgba(249,115,22,0.25)',  icon:TrendingDown,label:'Reduzir' },
  PAUSAR: { color:'#ef4444', bg:'rgba(239,68,68,0.1)',   border:'rgba(239,68,68,0.25)',   icon:Pause,       label:'Pausar' },
  TESTAR: { color:'#a855f7', bg:'rgba(168,85,247,0.1)',  border:'rgba(168,85,247,0.25)',  icon:Zap,         label:'Testar' },
}

function timeAgo(d:string){
  const m=Math.floor((Date.now()-new Date(d).getTime())/60000)
  if(m<60) return m+'min atrás'
  return Math.floor(m/60)+'h atrás'
}

export default function DecisoesIA() {
  const router = useRouter()
  useEffect(()=>{ if(!isLoggedIn()) router.push('/login') },[])

  return (
    <DashboardLayout title="Decisões IA" description="Análises e recomendações geradas pelo Sherlock">
      {/* Summary */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'12px',marginBottom:'24px'}}>
        {Object.entries(DEC_CFG).map(([key,cfg])=>{
          const count = mockDecisions.filter(d=>d.decision===key).length
          return (
            <div key={key} style={{background:'linear-gradient(135deg,#0d1f3c,#081220)',border:'1px solid '+cfg.border,borderRadius:'12px',padding:'14px',textAlign:'center'}}>
              <cfg.icon size={20} color={cfg.color} style={{margin:'0 auto 8px'}} />
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'20px',fontWeight:'700',color:cfg.color}}>{count}</div>
              <div style={{fontSize:'10px',color:'rgba(242,228,185,0.5)',marginTop:'2px'}}>{cfg.label}</div>
            </div>
          )
        })}
      </div>

      {/* Decision cards */}
      <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
        {mockDecisions.map(d=>{
          const cfg=DEC_CFG[d.decision]; const Icon=cfg.icon
          return (
            <div key={d.id} style={{background:'linear-gradient(135deg,#0d1f3c,#081220)',border:'1px solid rgba(148,111,64,0.13)',borderRadius:'14px',padding:'20px'}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:'16px'}}>
                {/* Decision badge */}
                <div style={{background:cfg.bg,border:'1px solid '+cfg.border,borderRadius:'12px',padding:'12px',flexShrink:0,textAlign:'center',minWidth:'80px'}}>
                  <Icon size={22} color={cfg.color} style={{margin:'0 auto 4px'}} />
                  <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'10px',fontWeight:'700',color:cfg.color}}>{d.decision}</div>
                </div>

                {/* Content */}
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'8px'}}>
                    <h3 style={{fontSize:'15px',fontWeight:'700',color:'#F2E4B9'}}>{d.campaign_name}</h3>
                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                      <div style={{background:'rgba(148,111,64,0.1)',border:'1px solid rgba(148,111,64,0.2)',borderRadius:'8px',padding:'4px 10px'}}>
                        <span style={{fontSize:'11px',color:'#946F40',fontWeight:'600'}}>Confiança: </span>
                        <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:'12px',fontWeight:'700',color:'#F2E4B9'}}>{d.confidence}%</span>
                      </div>
                      <span style={{fontSize:'11px',color:'rgba(242,228,185,0.4)'}}>{timeAgo(d.created_at)}</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'8px',marginBottom:'12px'}}>
                    {[
                      {label:'ROAS',    value:d.roas+'x',          color:d.roas>=4?'#22c55e':'#946F40'},
                      {label:'GASTO',   value:'R$'+d.spend.toFixed(0), color:'#946F40'},
                      {label:'CPA',     value:'R$'+d.cpa.toFixed(2),   color:'#F2E4B9'},
                      {label:'CTR',     value:d.ctr.toFixed(2)+'%',    color:'#00F5CC'},
                      {label:'CPM',     value:'R$'+d.cpm.toFixed(2),   color:'#F2E4B9'},
                      {label:'FREQ',    value:d.frequency.toFixed(1),  color:d.frequency>2.5?'#f97316':'#F2E4B9'},
                    ].map(m=>(
                      <div key={m.label} style={{background:'rgba(255,255,255,0.03)',borderRadius:'8px',padding:'8px',textAlign:'center'}}>
                        <div style={{fontSize:'9px',color:'rgba(242,228,185,0.4)',letterSpacing:'0.5px',marginBottom:'4px'}}>{m.label}</div>
                        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'13px',fontWeight:'700',color:m.color}}>{m.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Reason */}
                  <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:'8px',padding:'10px 12px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'4px'}}>
                      <Brain size={12} color='#00F5CC' />
                      <span style={{fontSize:'10px',color:'#00F5CC',fontWeight:'600',letterSpacing:'0.5px'}}>ANÁLISE DO SHERLOCK</span>
                    </div>
                    <p style={{fontSize:'12px',color:'rgba(242,228,185,0.7)',lineHeight:1.5}}>{d.reason}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
