import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { Sparkles, Image, PlaySquare, LayoutGrid, BookOpen, CheckCircle2, FlaskConical, FileText, PauseCircle, ChevronDown, Send, Brain, ArrowUpRight, ArrowDownRight, ArrowRight, MousePointer2, Eye, TrendingUp, Timer } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { mockCreatives } from '../lib/mock-data'
import { isLoggedIn } from '../lib/auth'

const STATUS_CFG: Record<string,{color:string;bg:string;border:string;icon:any;label:string}> = {
  PUBLICADO: { color:'#22c55e', bg:'rgba(34,197,94,0.1)',   border:'rgba(34,197,94,0.25)',   icon:CheckCircle2,  label:'Publicado'  },
  TESTANDO:  { color:'#3b82f6', bg:'rgba(59,130,246,0.1)',  border:'rgba(59,130,246,0.25)',  icon:FlaskConical,  label:'Testando'   },
  RASCUNHO:  { color:'#946F40', bg:'rgba(148,111,64,0.1)',  border:'rgba(148,111,64,0.25)',  icon:FileText,      label:'Rascunho'   },
  PAUSADO:   { color:'#ef4444', bg:'rgba(239,68,68,0.1)',   border:'rgba(239,68,68,0.25)',   icon:PauseCircle,   label:'Pausado'    },
}

const FORMAT_CFG: Record<string,{color:string;icon:any}> = {
  FEED:      { color:'#a855f7', icon:Image       },
  STORIES:   { color:'#00F5CC', icon:PlaySquare  },
  CARROSSEL: { color:'#f97316', icon:LayoutGrid  },
  REELS:     { color:'#3b82f6', icon:PlaySquare  },
}

const SORT_OPTIONS = [
  { value:'recent',    label:'Mais recente'  },
  { value:'quality',   label:'Qualidade'     },
  { value:'ctr',       label:'CTR'           },
  { value:'campaign',  label:'Campanha'      },
]

function timeAgo(d:string){
  const m=Math.floor((Date.now()-new Date(d).getTime())/60000)
  if(m<60) return m+'min atrás'
  return Math.floor(m/60)+'h atrás'
}

function TrendArrow({ current, prev, higherIsBetter=true }:{ current:number; prev:number; higherIsBetter?:boolean }) {
  if (prev===0) return null
  const diff = current - prev
  if (Math.abs(diff) < 0.01) return <ArrowRight size={10} color='rgba(242,228,185,0.4)' />
  const up = diff > 0
  const good = higherIsBetter ? up : !up
  const color = good ? '#22c55e' : '#ef4444'
  return up ? <ArrowUpRight size={10} color={color} /> : <ArrowDownRight size={10} color={color} />
}

function QualityBar({ quality, breakdown }:{ quality:number; breakdown:{relevancia:number;engajamento:number;clareza:number} }) {
  const color = quality>=85 ? '#22c55e' : quality>=70 ? '#f97316' : '#ef4444'
  return (
    <div style={{minWidth:'150px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'4px'}}>
        <span style={{fontSize:'10px',color:'#a855f7',fontWeight:'600'}}>Qualidade</span>
        <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:'12px',fontWeight:'700',color}}>{quality}%</span>
      </div>
      <div style={{height:'4px',background:'rgba(255,255,255,0.07)',borderRadius:'4px',overflow:'hidden',marginBottom:'6px'}}>
        <div style={{width:quality+'%',height:'100%',background:color,borderRadius:'4px',transition:'width 0.4s'}} />
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'3px'}}>
        {[
          { label:'REL',  pct:breakdown.relevancia,  color:'#a855f7' },
          { label:'ENG',  pct:breakdown.engajamento, color:'#00F5CC' },
          { label:'CLA',  pct:breakdown.clareza,     color:'#3b82f6' },
        ].map(f=>(
          <div key={f.label} style={{display:'flex',alignItems:'center',gap:'4px'}}>
            <span style={{fontSize:'8px',color:'rgba(242,228,185,0.35)',width:'22px',flexShrink:0}}>{f.label}</span>
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

function Toast({ message, onDone }:{ message:string; onDone:()=>void }) {
  useEffect(()=>{ const t=setTimeout(onDone,2800); return ()=>clearTimeout(t) },[])
  return (
    <div style={{position:'fixed',bottom:'28px',right:'28px',zIndex:9999,background:'linear-gradient(135deg,#0d1f3c,#081220)',border:'1px solid rgba(168,85,247,0.4)',borderRadius:'12px',padding:'12px 18px',display:'flex',alignItems:'center',gap:'10px',boxShadow:'0 4px 24px rgba(0,0,0,0.5)'}}>
      <Sparkles size={14} color='#a855f7' />
      <span style={{fontSize:'13px',fontWeight:'600',color:'#a855f7'}}>{message}</span>
    </div>
  )
}

function useEdisonUptime() {
  const [elapsed, setElapsed] = useState(0)
  const start = useRef(Date.now() - 3 * 3600 * 1000) // pretend Edison has been running 3h
  useEffect(()=>{
    const t = setInterval(()=> setElapsed(Date.now() - start.current), 1000)
    return ()=>clearInterval(t)
  },[])
  const h = Math.floor(elapsed/3600000)
  const m = Math.floor((elapsed%3600000)/60000)
  const s = Math.floor((elapsed%60000)/1000)
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

export default function GeracaoEdison() {
  const router = useRouter()
  const [filter, setFilter] = useState<string|null>(null)
  const [sort, setSort] = useState('recent')
  const [publishedIds, setPublishedIds] = useState<Set<string>>(new Set(
    mockCreatives.filter(c=>c.status==='PUBLICADO').map(c=>c.id)
  ))
  const [toast, setToast] = useState<string|null>(null)
  const uptime = useEdisonUptime()

  useEffect(()=>{ if(!isLoggedIn()) router.push('/login') },[])

  const filtered = mockCreatives.filter(c=> filter===null || c.status===filter)
  const sorted = [...filtered].sort((a,b)=>{
    if(sort==='quality')  return b.quality - a.quality
    if(sort==='ctr')      return b.ctr - a.ctr
    if(sort==='campaign') return a.campaign_name.localeCompare(b.campaign_name)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  function togglePublish(id:string, name:string, currentStatus:string) {
    const isLive = publishedIds.has(id)
    setPublishedIds(s=>{ const n=new Set(s); isLive ? n.delete(id) : n.add(id); return n })
    setToast(isLive ? `Pausado: "${name}"` : `Publicado: "${name}" ✓`)
  }

  const totalPublicados = mockCreatives.filter(c=>c.status==='PUBLICADO').length
  const avgCtr = (mockCreatives.filter(c=>c.ctr>0).reduce((s,c)=>s+c.ctr,0) / mockCreatives.filter(c=>c.ctr>0).length).toFixed(2)
  const totalImpressions = mockCreatives.reduce((s,c)=>s+c.impressions,0)

  return (
    <DashboardLayout title="Edison — Criativos IA" description="Geração e gestão de criativos por inteligência artificial">
      {/* Edison agent status bar */}
      <div style={{display:'flex',alignItems:'center',gap:'20px',marginBottom:'20px',padding:'12px 16px',background:'linear-gradient(135deg,rgba(168,85,247,0.06),rgba(59,130,246,0.04))',border:'1px solid rgba(168,85,247,0.15)',borderRadius:'12px',flexWrap:'wrap'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#a855f7',boxShadow:'0 0 8px #a855f7'}} />
          <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:'12px',fontWeight:'700',color:'#a855f7'}}>EDISON</span>
          <span style={{fontSize:'11px',color:'rgba(242,228,185,0.4)'}}>Online</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
          <Timer size={12} color='rgba(242,228,185,0.4)' />
          <span style={{fontSize:'11px',color:'rgba(242,228,185,0.4)'}}>Uptime:</span>
          <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:'12px',fontWeight:'700',color:'#a855f7'}}>{uptime}</span>
        </div>
        <div style={{marginLeft:'auto',display:'flex',gap:'20px'}}>
          {[
            { label:'Criativos ativos', value:String(totalPublicados), color:'#22c55e' },
            { label:'CTR médio', value:avgCtr+'%', color:'#00F5CC' },
            { label:'Impressões', value:(totalImpressions/1000).toFixed(1)+'k', color:'#a855f7' },
          ].map(s=>(
            <div key={s.label} style={{textAlign:'right'}}>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'14px',fontWeight:'700',color:s.color}}>{s.value}</div>
              <div style={{fontSize:'9px',color:'rgba(242,228,185,0.35)'}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary / Filter cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'16px'}}>
        {Object.entries(STATUS_CFG).map(([key,cfg])=>{
          const count = mockCreatives.filter(c=>c.status===key).length
          const active = filter===key
          return (
            <button key={key} onClick={()=>setFilter(active?null:key)} style={{background: active ? cfg.bg : 'linear-gradient(135deg,#0d1f3c,#081220)', border:'1px solid '+(active?cfg.color:cfg.border), borderRadius:'12px', padding:'14px', textAlign:'center', cursor:'pointer', outline:'none', transition:'all 0.2s', transform:active?'scale(1.04)':'scale(1)'}}>
              <cfg.icon size={20} color={cfg.color} style={{margin:'0 auto 8px'}} />
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'20px',fontWeight:'700',color:cfg.color}}>{count}</div>
              <div style={{fontSize:'10px',color:active?cfg.color:'rgba(242,228,185,0.5)',marginTop:'2px'}}>{cfg.label}</div>
            </button>
          )
        })}
      </div>

      {/* Sort bar */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
        <span style={{fontSize:'12px',color:'rgba(242,228,185,0.4)'}}>
          {sorted.length} criativo{sorted.length!==1?'s':''}{filter ? ` · ${STATUS_CFG[filter].label}` : ''}
        </span>
        <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
          <span style={{fontSize:'11px',color:'rgba(242,228,185,0.4)'}}>Ordenar:</span>
          <div style={{position:'relative'}}>
            <select value={sort} onChange={e=>setSort(e.target.value)} style={{appearance:'none',background:'linear-gradient(135deg,#0d1f3c,#081220)',border:'1px solid rgba(148,111,64,0.2)',borderRadius:'8px',padding:'6px 28px 6px 10px',fontSize:'12px',color:'#F2E4B9',cursor:'pointer',outline:'none'}}>
              {SORT_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={12} color='rgba(242,228,185,0.4)' style={{position:'absolute',right:'8px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}} />
          </div>
        </div>
      </div>

      {/* Creative cards */}
      <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
        {sorted.map(c=>{
          const stCfg = STATUS_CFG[c.status]
          const fmtCfg = FORMAT_CFG[c.format] || FORMAT_CFG.FEED
          const FmtIcon = fmtCfg.icon
          const StIcon = stCfg.icon
          const isLive = publishedIds.has(c.id)

          return (
            <div key={c.id} style={{background:'linear-gradient(135deg,#0d1f3c,#081220)',border:'1px solid rgba(148,111,64,0.13)',borderRadius:'14px',padding:'20px'}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:'16px'}}>
                {/* Format badge */}
                <div style={{background:'rgba(168,85,247,0.1)',border:'1px solid rgba(168,85,247,0.2)',borderRadius:'12px',padding:'12px',flexShrink:0,textAlign:'center',minWidth:'76px'}}>
                  <FmtIcon size={22} color={fmtCfg.color} style={{margin:'0 auto 4px'}} />
                  <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'9px',fontWeight:'700',color:fmtCfg.color}}>{c.format}</div>
                  <div style={{fontSize:'9px',color:'rgba(242,228,185,0.4)',marginTop:'2px'}}>VAR {c.variant}</div>
                </div>

                {/* Content */}
                <div style={{flex:1,minWidth:0}}>
                  {/* Header row */}
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'8px',flexWrap:'wrap',gap:'8px'}}>
                    <div>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'2px'}}>
                        <h3 style={{fontSize:'14px',fontWeight:'700',color:'#F2E4B9',margin:0}}>{c.headline}</h3>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                        <span style={{fontSize:'10px',color:'rgba(242,228,185,0.35)'}}>📌</span>
                        <span style={{fontSize:'10px',color:'rgba(242,228,185,0.45)'}}>{c.campaign_name}</span>
                        <span style={{fontSize:'10px',color:'rgba(242,228,185,0.25)'}}>·</span>
                        <StIcon size={10} color={stCfg.color} />
                        <span style={{fontSize:'10px',color:stCfg.color,fontWeight:'600'}}>{stCfg.label}</span>
                        <span style={{fontSize:'10px',color:'rgba(242,228,185,0.25)'}}>·</span>
                        <span style={{fontSize:'10px',color:'rgba(242,228,185,0.35)'}}>{timeAgo(c.created_at)}</span>
                      </div>
                    </div>
                    <QualityBar quality={c.quality} breakdown={c.quality_breakdown as any} />
                  </div>

                  {/* Copy preview */}
                  <div style={{background:'rgba(168,85,247,0.04)',border:'1px solid rgba(168,85,247,0.1)',borderRadius:'8px',padding:'10px 12px',marginBottom:'10px'}}>
                    <p style={{fontSize:'12px',color:'rgba(242,228,185,0.65)',lineHeight:1.6,margin:0}}>{c.body}</p>
                    <div style={{marginTop:'8px',display:'inline-block',background:'rgba(168,85,247,0.15)',border:'1px solid rgba(168,85,247,0.25)',borderRadius:'6px',padding:'3px 10px'}}>
                      <span style={{fontSize:'10px',fontWeight:'700',color:'#a855f7',letterSpacing:'0.5px'}}>{c.cta}</span>
                    </div>
                  </div>

                  {/* Metrics row */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px',marginBottom:'10px'}}>
                    {[
                      { label:'CTR',         value:c.ctr>0 ? c.ctr.toFixed(2)+'%' : '—',        color:'#00F5CC', icon:MousePointer2, trend: c.ctr>0 ? <TrendArrow current={c.ctr} prev={c.prev_ctr} higherIsBetter={true}/> : null },
                      { label:'IMPRESSÕES',  value:c.impressions>0 ? (c.impressions/1000).toFixed(1)+'k' : '—', color:'#a855f7', icon:Eye, trend:null },
                      { label:'CLIQUES',     value:c.clicks>0 ? c.clicks.toLocaleString('pt-BR') : '—', color:'#F2E4B9', icon:MousePointer2, trend:null },
                      { label:'CPC',         value:c.cpc>0 ? 'R$'+c.cpc.toFixed(2) : '—',       color:c.cpc>0&&c.cpc<2?'#22c55e':'#946F40', icon:TrendingUp, trend:null },
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

                  {/* Edison analysis + action button */}
                  <div style={{display:'flex',gap:'10px',alignItems:'flex-start'}}>
                    <div style={{flex:1,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:'8px',padding:'10px 12px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'4px'}}>
                        <Sparkles size={12} color='#a855f7' />
                        <span style={{fontSize:'10px',color:'#a855f7',fontWeight:'600',letterSpacing:'0.5px'}}>ANÁLISE DO EDISON</span>
                      </div>
                      <p style={{fontSize:'12px',color:'rgba(242,228,185,0.7)',lineHeight:1.5,margin:0}}>{c.reason}</p>
                    </div>
                    <button
                      onClick={()=>togglePublish(c.id, c.headline, c.status)}
                      style={{
                        flexShrink:0, display:'flex', alignItems:'center', gap:'6px',
                        background: isLive ? 'rgba(239,68,68,0.1)' : 'rgba(168,85,247,0.12)',
                        border:'1px solid '+(isLive ? 'rgba(239,68,68,0.3)' : 'rgba(168,85,247,0.3)'),
                        borderRadius:'8px', padding:'8px 12px', cursor:'pointer',
                        outline:'none', transition:'all 0.2s', whiteSpace:'nowrap',
                      }}
                    >
                      {isLive
                        ? <><PauseCircle size={12} color='#ef4444'/><span style={{fontSize:'11px',fontWeight:'600',color:'#ef4444'}}>Pausar</span></>
                        : <><Send size={12} color='#a855f7'/><span style={{fontSize:'11px',fontWeight:'600',color:'#a855f7'}}>Publicar</span></>
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {sorted.length===0 && (
          <div style={{textAlign:'center',padding:'48px',color:'rgba(242,228,185,0.3)',fontSize:'13px'}}>
            Nenhum criativo encontrado para este filtro.
          </div>
        )}
      </div>

      {toast && <Toast message={toast} onDone={()=>setToast(null)} />}
    </DashboardLayout>
  )
}
