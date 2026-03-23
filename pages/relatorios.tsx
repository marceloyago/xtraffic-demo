import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { BarChart3, TrendingUp, DollarSign, MousePointer2 } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { mockChartData, mockCampaigns } from '../lib/mock-data'
import { isLoggedIn } from '../lib/auth'

const ResponsiveContainer = dynamic(()=>import('recharts').then(m=>({default:m.ResponsiveContainer})),{ssr:false})
const LineChart = dynamic(()=>import('recharts').then(m=>({default:m.LineChart})),{ssr:false})
const Line = dynamic(()=>import('recharts').then(m=>({default:m.Line})),{ssr:false})
const BarChart = dynamic(()=>import('recharts').then(m=>({default:m.BarChart})),{ssr:false})
const Bar = dynamic(()=>import('recharts').then(m=>({default:m.Bar})),{ssr:false})
const XAxis = dynamic(()=>import('recharts').then(m=>({default:m.XAxis})),{ssr:false})
const YAxis = dynamic(()=>import('recharts').then(m=>({default:m.YAxis})),{ssr:false})
const Tooltip = dynamic(()=>import('recharts').then(m=>({default:m.Tooltip})),{ssr:false})
const Legend = dynamic(()=>import('recharts').then(m=>({default:m.Legend})),{ssr:false})

export default function Relatorios() {
  const router = useRouter()
  const [period, setPeriod] = useState('14d')
  const [mounted, setMounted] = useState(false)
  useEffect(()=>{ if(!isLoggedIn()){router.push('/login');return}; setMounted(true) },[])

  const data = period==='7d' ? mockChartData.slice(-7) : period==='30d' ? [...mockChartData,...mockChartData].slice(0,28) : mockChartData

  const totSpend = data.reduce((s,d)=>s+d.gasto,0)
  const totConv  = data.reduce((s,d)=>s+d.conversoes,0)
  const avgRoas  = (data.reduce((s,d)=>s+d.roas,0)/data.length).toFixed(2)
  const totImpr  = data.reduce((s,d)=>s+d.impressoes,0)

  return (
    <DashboardLayout title="Relatórios" description="Análise detalhada de performance">
      {/* Period filter */}
      <div style={{display:'flex',gap:'8px',marginBottom:'24px'}}>
        {[['7d','7 dias'],['14d','14 dias'],['30d','30 dias']].map(([v,l])=>(
          <button key={v} onClick={()=>setPeriod(v)} style={{padding:'8px 20px',borderRadius:'8px',border:'1px solid',borderColor:period===v?'rgba(0,245,204,0.4)':'rgba(255,255,255,0.1)',background:period===v?'rgba(0,245,204,0.1)':'transparent',color:period===v?'#00F5CC':'rgba(242,228,185,0.5)',fontSize:'12px',fontWeight:'600',cursor:'pointer',fontFamily:"'Orbitron',sans-serif"}}>
            {l}
          </button>
        ))}
      </div>

      {/* Summary KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'24px'}}>
        {[
          {icon:DollarSign,   label:'GASTO TOTAL',   value:'R$'+totSpend.toFixed(2), color:'#946F40'},
          {icon:TrendingUp,   label:'ROAS MÉDIO',    value:avgRoas+'x',              color:'#22c55e'},
          {icon:MousePointer2,label:'CONVERSÕES',    value:totConv.toString(),        color:'#00F5CC'},
          {icon:BarChart3,    label:'IMPRESSÕES',    value:(totImpr/1000).toFixed(1)+'K', color:'#3b82f6'},
        ].map(k=>(
          <div key={k.label} style={{background:'linear-gradient(135deg,#0d1f3c,#081220)',border:'1px solid rgba(148,111,64,0.13)',borderRadius:'14px',padding:'20px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}>
              <span style={{fontSize:'10px',color:'rgba(242,228,185,0.5)',letterSpacing:'0.5px',fontWeight:'700'}}>{k.label}</span>
              <div style={{background:k.color+'18',borderRadius:'8px',padding:'4px'}}>
                <k.icon size={14} color={k.color}/>
              </div>
            </div>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'22px',fontWeight:'700',color:'#F2E4B9'}}>{k.value}</div>
          </div>
        ))}
      </div>

      {mounted && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'24px'}}>
          {/* ROAS line */}
          <div style={{background:'linear-gradient(135deg,#0d1f3c,#081220)',border:'1px solid rgba(148,111,64,0.13)',borderRadius:'14px',padding:'20px'}}>
            <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'13px',fontWeight:'700',color:'#F2E4B9',marginBottom:'16px'}}>Evolução do ROAS</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <XAxis dataKey="date" tick={{fill:'rgba(242,228,185,0.4)',fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:'rgba(242,228,185,0.4)',fontSize:10}} axisLine={false} tickLine={false} width={35}/>
                <Tooltip contentStyle={{background:'#0d1f3c',border:'1px solid rgba(148,111,64,0.2)',borderRadius:'8px',fontSize:12}} labelStyle={{color:'#F2E4B9'}}/>
                <Line type="monotone" dataKey="roas" stroke="#00F5CC" strokeWidth={2} dot={false} name="ROAS"/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gasto bar */}
          <div style={{background:'linear-gradient(135deg,#0d1f3c,#081220)',border:'1px solid rgba(148,111,64,0.13)',borderRadius:'14px',padding:'20px'}}>
            <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'13px',fontWeight:'700',color:'#F2E4B9',marginBottom:'16px'}}>Gasto Diário R$</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data}>
                <XAxis dataKey="date" tick={{fill:'rgba(242,228,185,0.4)',fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:'rgba(242,228,185,0.4)',fontSize:10}} axisLine={false} tickLine={false} width={40}/>
                <Tooltip contentStyle={{background:'#0d1f3c',border:'1px solid rgba(148,111,64,0.2)',borderRadius:'8px',fontSize:12}} labelStyle={{color:'#F2E4B9'}}/>
                <Bar dataKey="gasto" fill="#946F40" radius={[3,3,0,0]} name="Gasto R$"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Campaign breakdown */}
      <div style={{background:'linear-gradient(135deg,#0d1f3c,#081220)',border:'1px solid rgba(148,111,64,0.13)',borderRadius:'14px',padding:'20px'}}>
        <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'13px',fontWeight:'700',color:'#F2E4B9',marginBottom:'16px'}}>Performance por Campanha</h3>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                {['Campanha','Gasto','Impressões','Cliques','CTR','CPA','ROAS'].map(h=>(
                  <th key={h} style={{padding:'10px 14px',textAlign:'left',fontSize:'10px',color:'rgba(242,228,185,0.5)',fontWeight:'700',letterSpacing:'0.5px'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockCampaigns.filter(c=>c.status==='ACTIVE').map((c,i)=>(
                <tr key={c.id} style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <td style={{padding:'12px 14px',fontSize:'13px',color:'#F2E4B9',fontWeight:'600'}}>{c.name}</td>
                  <td style={{padding:'12px 14px',fontSize:'13px',color:'#946F40'}}>R${c.spend.toFixed(2)}</td>
                  <td style={{padding:'12px 14px',fontSize:'13px',color:'rgba(242,228,185,0.7)'}}>{c.impressions.toLocaleString('pt-BR')}</td>
                  <td style={{padding:'12px 14px',fontSize:'13px',color:'rgba(242,228,185,0.7)'}}>{c.clicks.toLocaleString('pt-BR')}</td>
                  <td style={{padding:'12px 14px',fontSize:'13px',color:'#00F5CC'}}>{c.ctr.toFixed(2)}%</td>
                  <td style={{padding:'12px 14px',fontSize:'13px',color:'rgba(242,228,185,0.7)'}}>R${c.cpa.toFixed(2)}</td>
                  <td style={{padding:'12px 14px'}}>
                    <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:'14px',fontWeight:'700',color:c.roas>=4?'#22c55e':c.roas>=2?'#946F40':'#ef4444'}}>{c.roas.toFixed(2)}x</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
