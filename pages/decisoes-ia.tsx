import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { TrendingUp, TrendingDown, Minus, Pause, Zap, Brain, ArrowUpRight, ArrowDownRight, ArrowRight, Send, ChevronDown, Timer } from 'lucide-react'
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

const SORT_OPTIONS = [
  { value:'recent',     label:'Mais recente' },
  { value:'confidence', label:'Confiança' },
  { value:'roas',       label:'ROAS' },
  { value:'spend',      label:'Gasto' },
]

function timeAgo(d:string){
  const m=Math.floor((Date.now()-new Date(d).getTime())/60000)
  if(m<60) return m+'min atrás'
  return Math.floor(m/60)+'h atrás'
}

function TrendArrow({ current, prev, higherIsBetter=true }:{ current:number; prev:number; higherIsBetter?:boolean }) {
  const diff = current - prev
  if (Math.abs(diff) < 0.01) return <ArrowRight size={10} color='rgba(242,228,185,0.4)' />
  const up = diff > 0
  const good = higherIsBetter ? up : !up
  const color = good ? '#22c55e' : '#ef4444'
  return up
    ? <ArrowUpRight size={10} color={color} />
    : <ArrowDownRight size={10} color={color} />
}

function ConfidenceBar({ confidence, breakdown }:{ confidence:number; breakdown:{roas:number;cpa:number;frequency:number} }) {
  const color = confidence>=85 ? '#22c55e' : confidence>=65 ? '#f97316' : '#ef4444'
  return (
    <div style={{minWidth:'140px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'4px'}}>
        <span style={{fontSize:'10px',color:'#946F40',fontWeight:'600'}}>Confiança</span>
        <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:'12px',fontWeight:'700',color}}>{confidence}%</span>
      </div>
      {/* Overall bar */}
      <div style={{height:'4px',background:'rgba(255,255,255,0.07)',borderRadius:'4px',overflow:'hidden',marginBottom:'6px'}}>
        <div style={{width:confidence+'%',height:'100%',background:color,borderRadius:'4px',transition:'width 0.4s'}} />
      </div>
      {/* Factor bars */}
      <div style={{display:'flex',flexDirection:'column',gap:'3px'}}>
        {[
          { label:'ROAS',  pct: breakdown.roas,      color:'#00F5CC' },
          { label:'CPA',   pct: breakdown.cpa,       color:'#946F40' },
          { label:'FREQ',  pct: breakdown.frequency, color:'#a855f7' },
        ].map(f=>(
          <div key={f.label} style={{display:'flex',alignItems:'center',gap:'4px'}}>
            <span style={{fontSize:'8px',color:'rgba(242,228,185,0.35)',width:'26px',flexShrink:0}}>{f.label}</span>
            <div style={{flex:1,height:'3px',background:'rgba(255,255,255,0.05)',borderRadius:'3px',overflow:'hidden'}}>
              <div style={{width:f.pct+'%',height:'100%',background:f.color,opacity:0.7,borderRadius:'3px'}} />
            </div>
            <span style={{fontSize:'8px',color:'rgba(242,228,185,0.35)',width:'22px',textAlign:'right'}}>{f.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function useCountdown(targetMs:number) {
  const [remaining, setRemaining] = useState(Math.max(0, targetMs - Date.now()))
  useEffect(()=>{
    const t = setInterval(()=> setRemaining(r => Math.max(0, r - 1000)), 1000)
    return ()=>clearInterval(t)
  },[])
  const totalSec = Math.floor(remaining / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return h>0
    ? `${h}h ${String(m).padStart(2,'0')}m`
    : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

function Toast({ message, onDone }:{ message:string; onDone:()=>void }) {
  useEffect(()=>{
    const t = setTimeout(onDone, 2800)
    return ()=>clearTimeout(t)
  },[])
  return (
    <div style={{position:'fixed',bottom:'28px',right:'28px',zIndex:9999,background:'linear-gradient(135deg,#0d1f3c,#081220)',border:'1px solid rgba(34,197,94,0.4)',borderRadius:'12px',padding:'12px 18px',display:'flex',alignItems:'center',gap:'10px',boxShadow:'0 4px 24px rgba(0,0,0,0.5)',animation:'fadeSlideUp 0.3s ease'}}>
      <Send size={14} color='#22c55e' />
      <span style={{fontSize:'13px',fontWeight:'600',color:'#22c55e'}}>{message}</span>
    </div>
  )
}

export default function DecisoesIA() {
  const router = useRouter()
  const [filter, setFilter] = useState<string|null>(null)
  const [sort, setSort] = useState('recent')
  const [sentIds, setSentIds] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<string|null>(null)
  // Next audit is 2h30 from now
  const nextAuditTarget = useRef(Date.now() + 2.5*3600*1000).current
  const countdown = useCountdown(nextAuditTarget)

  useEffect(()=>{ if(!isLoggedIn()) router.push('/login') },[])

  const filtered = mockDecisions.filter(d=> filter===null || d.decision===filter)
  const sorted = [...filtered].sort((a,b)=>{
    if(sort==='confidence') return b.confidence - a.confidence
    if(sort==='roas')       return b.roas - a.roas
    if(sort==='spend')      return b.spend - a.spend
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  function sendToWatson(id:string, name:string) {
    setSentIds(s=>new Set(s).add(id))
    setToast(`Enviado ao Watson: "${name}"`)
  }

  return (
    <DashboardLayout title="Decisões IA" description="Análises e recomendações geradas pelo Sherlock">
      {/* Countdown header */}
      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px',padding:'10px 14px',background:'rgba(0,245,204,0.04)',border:'1px solid rgba(0,245,204,0.12)',borderRadius:'10px',width:'fit-content'}}>
        <Timer size={13} color='#00F5CC' />
        <span style={{fontSize:'11px',color:'rgba(242,228,185,0.5)'}}>Próxima auditoria do Sherlock em</span>
        <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:'13px',fontWeight:'700',color:'#00F5CC'}}>{countdown}</span>
      </div>

      {/* Summary / Filter cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'12px',marginBottom:'16px'}}>
        {Object.entries(DEC_CFG).map(([key,cfg])=>{
          const count = mockDecisions.filter(d=>d.decision===key).length
          const active = filter===key
          return (
            <button key={key} onClick={()=>setFilter(active?null:key)} style={{background: active ? cfg.bg : 'linear-gradient(135deg,#0d1f3c,#081220)', border:'1px solid '+(active ? cfg.color : cfg.border), borderRadius:'12px', padding:'14px', textAlign:'center', cursor:'pointer', outline:'none', transition:'all 0.2s', transform: active?'scale(1.04)':'scale(1)'}}>
              <cfg.icon size={20} color={cfg.color} style={{margin:'0 auto 8px'}} />
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'20px',fontWeight:'700',color:cfg.color}}>{count}</div>
              <div style={{fontSize:'10px',color: active ? cfg.color : 'rgba(242,228,185,0.5)',marginTop:'2px'}}>{cfg.label}</div>
            </button>
          )
        })}
      </div>

      {/* Sort bar */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
        <span style={{fontSize:'12px',color:'rgba(242,228,185,0.4)'}}>
          {sorted.length} decisão{sorted.length!==1?'s':''}{filter ? ` · ${DEC_CFG[filter].label}` : ''}
        </span>
        <div style={{position:'relative',display:'flex',alignItems:'center',gap:'6px'}}>
          <span style={{fontSize:'11px',color:'rgba(242,228,185,0.4)'}}>Ordenar:</span>
          <div style={{position:'relative'}}>
            <select value={sort} onChange={e=>setSort(e.target.value)} style={{appearance:'none',background:'linear-gradient(135deg,#0d1f3c,#081220)',border:'1px solid rgba(148,111,64,0.2)',borderRadius:'8px',padding:'6px 28px 6px 10px',fontSize:'12px',color:'#F2E4B9',cursor:'pointer',outline:'none'}}>
              {SORT_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={12} color='rgba(242,228,185,0.4)' style={{position:'absolute',right:'8px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}} />
          </div>
        </div>
      </div>

      {/* Decision cards */}
      <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
        {sorted.map(d=>{
          const cfg=DEC_CFG[d.decision]; const Icon=cfg.icon
          const isSent = sentIds.has(d.id)
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
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'8px',flexWrap:'wrap',gap:'8px'}}>
                    <h3 style={{fontSize:'15px',fontWeight:'700',color:'#F2E4B9'}}>{d.campaign_name}</h3>
                    <div style={{display:'flex',alignItems:'flex-start',gap:'12px'}}>
                      <ConfidenceBar confidence={d.confidence} breakdown={d.confidence_breakdown as any} />
                      <span style={{fontSize:'11px',color:'rgba(242,228,185,0.4)',whiteSpace:'nowrap'}}>{timeAgo(d.created_at)}</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'8px',marginBottom:'12px'}}>
                    {[
                      {label:'ROAS', value:d.roas+'x',             color:d.roas>=4?'#22c55e':'#946F40', trend:<TrendArrow current={d.roas}      prev={d.prev_roas}      higherIsBetter={true} />},
                      {label:'GASTO',value:'R$'+d.spend.toFixed(0),color:'#946F40',                     trend:null},
                      {label:'CPA',  value:'R$'+d.cpa.toFixed(2),  color:'#F2E4B9',                     trend:<TrendArrow current={d.cpa}       prev={d.prev_cpa}       higherIsBetter={false} />},
                      {label:'CTR',  value:d.ctr.toFixed(2)+'%',   color:'#00F5CC',                     trend:null},
                      {label:'CPM',  value:'R$'+d.cpm.toFixed(2),  color:'#F2E4B9',                     trend:null},
                      {label:'FREQ', value:d.frequency.toFixed(1), color:d.frequency>2.5?'#f97316':'#F2E4B9', trend:<TrendArrow current={d.frequency} prev={d.prev_frequency} higherIsBetter={false} />},
                    ].map(m=>(
                      <div key={m.label} style={{background:'rgba(255,255,255,0.03)',borderRadius:'8px',padding:'8px',textAlign:'center'}}>
                        <div style={{fontSize:'9px',color:'rgba(242,228,185,0.4)',letterSpacing:'0.5px',marginBottom:'4px'}}>{m.label}</div>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}>
                          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'13px',fontWeight:'700',color:m.color}}>{m.value}</div>
                          {m.trend}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reason + Watson button */}
                  <div style={{display:'flex',gap:'10px',alignItems:'flex-start'}}>
                    <div style={{flex:1,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:'8px',padding:'10px 12px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'4px'}}>
                        <Brain size={12} color='#00F5CC' />
                        <span style={{fontSize:'10px',color:'#00F5CC',fontWeight:'600',letterSpacing:'0.5px'}}>ANÁLISE DO SHERLOCK</span>
                      </div>
                      <p style={{fontSize:'12px',color:'rgba(242,228,185,0.7)',lineHeight:1.5}}>{d.reason}</p>
                    </div>
                    <button
                      onClick={()=>!isSent && sendToWatson(d.id, d.campaign_name)}
                      style={{
                        flexShrink:0, display:'flex', alignItems:'center', gap:'6px',
                        background: isSent ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.12)',
                        border:'1px solid '+(isSent ? 'rgba(34,197,94,0.3)' : 'rgba(59,130,246,0.3)'),
                        borderRadius:'8px', padding:'8px 12px', cursor: isSent ? 'default' : 'pointer',
                        outline:'none', transition:'all 0.2s', whiteSpace:'nowrap',
                      }}
                    >
                      <Send size={12} color={isSent ? '#22c55e' : '#3b82f6'} />
                      <span style={{fontSize:'11px',fontWeight:'600',color: isSent ? '#22c55e' : '#3b82f6'}}>
                        {isSent ? 'Enviado ✓' : 'Enviar ao Watson'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {sorted.length===0 && (
          <div style={{textAlign:'center',padding:'48px',color:'rgba(242,228,185,0.3)',fontSize:'13px'}}>
            Nenhuma decisão encontrada para este filtro.
          </div>
        )}
      </div>

      {toast && <Toast message={toast} onDone={()=>setToast(null)} />}
    </DashboardLayout>
  )
}
