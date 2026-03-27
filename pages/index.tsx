/**
 * @owner   Welbert Cruz <welbertcruz12@gmail.com>
 * @project XLink Digital — PLX Platform
 * @repo    github.com/marceloyago
 * @built   with Marcelo Yago | Claude (Anthropic)
 *
 * Unauthorized use or distribution is prohibited.
 * © 2026 Welbert Cruz. All rights reserved.
 */

'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { TrendingUp, TrendingDown, Minus, Pause, DollarSign, Zap, MousePointer2, Activity, Shield, ScanSearch, Bell, X } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { mockStats, mockDecisions, mockAlerts, mockChartData } from '../lib/mock-data'
import { isLoggedIn } from '../lib/auth'

const ResponsiveContainer = dynamic(() => import('recharts').then(m=>({default:m.ResponsiveContainer})), { ssr:false })
const AreaChart = dynamic(() => import('recharts').then(m=>({default:m.AreaChart})), { ssr:false })
const Area = dynamic(() => import('recharts').then(m=>({default:m.Area})), { ssr:false })
const BarChart = dynamic(() => import('recharts').then(m=>({default:m.BarChart})), { ssr:false })
const Bar = dynamic(() => import('recharts').then(m=>({default:m.Bar})), { ssr:false })
const XAxis = dynamic(() => import('recharts').then(m=>({default:m.XAxis})), { ssr:false })
const YAxis = dynamic(() => import('recharts').then(m=>({default:m.YAxis})), { ssr:false })
const Tooltip = dynamic(() => import('recharts').then(m=>({default:m.Tooltip})), { ssr:false })

const DEC_CFG: Record<string,{color:string;icon:any}> = {
  ESCALAR:{ color:'#22c55e', icon:TrendingUp },
  MANTER: { color:'#3b82f6', icon:Minus },
  REDUZIR:{ color:'#f97316', icon:TrendingDown },
  PAUSAR: { color:'#ef4444', icon:Pause },
  TESTAR: { color:'#a855f7', icon:Zap },
}

const SEV_CFG = {
  critical:{ color:'#ef4444', bg:'rgba(239,68,68,0.1)',  border:'rgba(239,68,68,0.25)',  label:'🚨' },
  warning: { color:'#f97316', bg:'rgba(249,115,22,0.1)', border:'rgba(249,115,22,0.25)', label:'⚠️' },
  info:    { color:'#3b82f6', bg:'rgba(59,130,246,0.1)', border:'rgba(59,130,246,0.25)', label:'💡' },
  success: { color:'#22c55e', bg:'rgba(34,197,94,0.1)',  border:'rgba(34,197,94,0.25)',  label:'✅' },
}

function timeAgo(d:string){
  const m=Math.floor((Date.now()-new Date(d).getTime())/60000)
  if(m<1) return 'agora'; if(m<60) return m+'min'
  const h=Math.floor(m/60); if(h<24) return h+'h'
  return new Date(d).toLocaleDateString('pt-BR')
}

function StatCard({ icon:Icon, label, value, sub, color }:any) {
  return (
    <div style={{background:'linear-gradient(135deg,#0d1f3c,#081220)',border:'1px solid rgba(148,111,64,0.13)',borderRadius:'14px',padding:'20px 24px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
        <span style={{fontSize:'11px',color:'rgba(242,228,185,0.5)',letterSpacing:'0.5px',fontWeight:'600'}}>{label}</span>
        <div style={{width:'32px',height:'32px',borderRadius:'8px',background:color+'18',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Icon size={16} color={color} />
        </div>
      </div>
      <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'24px',fontWeight:'700',color:'#F2E4B9',marginBottom:'4px'}}>{value}</div>
      {sub && <div style={{fontSize:'12px',color:'rgba(242,228,185,0.4)'}}>{sub}</div>}
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [alerts, setAlerts] = useState(mockAlerts)
  const [mounted, setMounted] = useState(false)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return }
    setMounted(true)
    const t = setInterval(()=>setPulse(p=>!p), 2000)
    return ()=>clearInterval(t)
  }, [])

  return (
    <DashboardLayout title="Dashboard" description="Visão geral das suas campanhas em tempo real">
      {/* Agent status */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'24px'}}>
        {[
          {name:'Sherlock',status:'Auditando',color:'#00F5CC',desc:'Próx: 2h30'},
          {name:'Watson',  status:'Standby',  color:'#3b82f6',desc:'2 ações hoje'},
          {name:'Edison',  status:'Online',   color:'#a855f7',desc:'3 criativos'},
          {name:'Tef',     status:'Online',   color:'#22c55e',desc:'Bot ativo'},
        ].map(a=>(
          <div key={a.name} style={{background:'linear-gradient(135deg,#0d1f3c,#081220)',border:'1px solid '+a.color+'22',borderRadius:'12px',padding:'12px 16px',display:'flex',alignItems:'center',gap:'10px'}}>
            <div style={{width:'8px',height:'8px',borderRadius:'50%',background:a.color,boxShadow:'0 0 8px '+a.color,flexShrink:0}} />
            <div>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'11px',fontWeight:'700',color:'#F2E4B9'}}>{a.name}</div>
              <div style={{fontSize:'10px',color:a.color}}>{a.status}</div>
              <div style={{fontSize:'10px',color:'rgba(242,228,185,0.4)'}}>{a.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'24px'}}>
        <StatCard icon={DollarSign}    label="GASTO TOTAL"  value={'R$'+mockStats.totalSpend.toFixed(2)} sub="Últimos 14 dias" color="#946F40" />
        <StatCard icon={TrendingUp}    label="ROAS MÉDIO"   value={mockStats.avgRoas+'x'}  sub="Meta: 4.0x ✅" color="#22c55e" />
        <StatCard icon={MousePointer2} label="CONVERSÕES"   value={mockStats.totalConversions} sub={'CPA R$'+mockStats.avgCpa} color="#00F5CC" />
        <StatCard icon={Activity}      label="CAMPANHAS"    value={mockStats.activeCampaigns}  sub="de 5 ativas" color="#3b82f6" />
      </div>

      {/* Charts */}
      {mounted && (
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'16px',marginBottom:'24px'}}>
          <div style={{background:'linear-gradient(135deg,#0d1f3c,#081220)',border:'1px solid rgba(148,111,64,0.13)',borderRadius:'14px',padding:'20px'}}>
            <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'13px',fontWeight:'700',color:'#F2E4B9',marginBottom:'4px'}}>Gasto & ROAS — 14 dias</h3>
            <p style={{fontSize:'11px',color:'rgba(242,228,185,0.4)',marginBottom:'16px'}}>Evolução de performance</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#946F40" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#946F40" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F5CC" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00F5CC" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{fill:'rgba(242,228,185,0.4)',fontSize:10}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill:'rgba(242,228,185,0.4)',fontSize:10}} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{background:'#0d1f3c',border:'1px solid rgba(148,111,64,0.2)',borderRadius:'8px',fontSize:12}} labelStyle={{color:'#F2E4B9'}} />
                <Area type="monotone" dataKey="gasto" stroke="#946F40" fill="url(#g1)" strokeWidth={2} name="Gasto R$" />
                <Area type="monotone" dataKey="roas"  stroke="#00F5CC" fill="url(#g2)" strokeWidth={2} name="ROAS" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{background:'linear-gradient(135deg,#0d1f3c,#081220)',border:'1px solid rgba(148,111,64,0.13)',borderRadius:'14px',padding:'20px'}}>
            <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'13px',fontWeight:'700',color:'#F2E4B9',marginBottom:'4px'}}>Conversões</h3>
            <p style={{fontSize:'11px',color:'rgba(242,228,185,0.4)',marginBottom:'16px'}}>Últimos 7 dias</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockChartData.slice(-7)}>
                <XAxis dataKey="date" tick={{fill:'rgba(242,228,185,0.4)',fontSize:10}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill:'rgba(242,228,185,0.4)',fontSize:10}} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{background:'#0d1f3c',border:'1px solid rgba(148,111,64,0.2)',borderRadius:'8px',fontSize:12}} labelStyle={{color:'#F2E4B9'}} />
                <Bar dataKey="conversoes" fill="#00F5CC" radius={[4,4,0,0]} name="Conversões" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Decisions + Alerts */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
        <div style={{background:'linear-gradient(135deg,#0d1f3c,#081220)',border:'1px solid rgba(148,111,64,0.13)',borderRadius:'14px',padding:'20px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}}>
            <ScanSearch size={16} color='#00F5CC' />
            <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'13px',fontWeight:'700',color:'#F2E4B9'}}>Decisões do Sherlock</h3>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {mockDecisions.slice(0,4).map(d=>{
              const cfg=DEC_CFG[d.decision]; const Icon=cfg.icon
              return (
                <div key={d.id} style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',borderRadius:'10px',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.04)'}}>
                  <div style={{width:'28px',height:'28px',borderRadius:'8px',background:cfg.color+'18',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <Icon size={14} color={cfg.color} />
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:'12px',color:'#F2E4B9',fontWeight:'600',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.campaign_name}</div>
                    <div style={{display:'flex',gap:'8px',marginTop:'2px'}}>
                      <span style={{fontSize:'10px',fontWeight:'700',color:cfg.color,fontFamily:"'Orbitron',sans-serif"}}>{d.decision}</span>
                      <span style={{fontSize:'10px',color:'rgba(242,228,185,0.4)'}}>ROAS {d.roas}x · {d.confidence}%</span>
                    </div>
                  </div>
                  <span style={{fontSize:'10px',color:'rgba(242,228,185,0.3)',flexShrink:0}}>{timeAgo(d.created_at)}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{background:'linear-gradient(135deg,#0d1f3c,#081220)',border:'1px solid rgba(148,111,64,0.13)',borderRadius:'14px',padding:'20px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}}>
            <Bell size={16} color='#946F40' />
            <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'13px',fontWeight:'700',color:'#F2E4B9'}}>Alertas</h3>
            {alerts.length>0 && <span style={{marginLeft:'auto',background:'#ef4444',color:'#fff',fontSize:'10px',fontWeight:'700',borderRadius:'50%',width:'18px',height:'18px',display:'flex',alignItems:'center',justifyContent:'center'}}>{alerts.length}</span>}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {alerts.map(a=>{
              const cfg=SEV_CFG[a.severity as keyof typeof SEV_CFG]
              return (
                <div key={a.id} style={{padding:'10px 12px',borderRadius:'10px',background:cfg.bg,border:'1px solid '+cfg.border}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:'8px'}}>
                    <span style={{fontSize:'14px'}}>{cfg.label}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:'12px',color:cfg.color,fontWeight:'600',marginBottom:'2px'}}>{a.title}</div>
                      <div style={{fontSize:'11px',color:'rgba(242,228,185,0.5)',lineHeight:1.4}}>{a.description}</div>
                    </div>
                    <button onClick={()=>setAlerts(al=>al.filter(x=>x.id!==a.id))} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(242,228,185,0.3)',flexShrink:0}}>
                      <X size={12}/>
                    </button>
                  </div>
                </div>
              )
            })}
            {alerts.length===0 && (
              <div style={{textAlign:'center',padding:'24px',color:'rgba(242,228,185,0.3)',fontSize:'13px'}}>
                <Shield size={24} style={{margin:'0 auto 8px',opacity:0.3}} />
                Nenhum alerta pendente
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
