import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Play, Pause, TrendingUp, Eye, MousePointer2, DollarSign, RefreshCw } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { mockCampaigns } from '../lib/mock-data'
import { isLoggedIn } from '../lib/auth'

export default function Campanhas() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState(mockCampaigns.map(c=>({...c})))
  const [refreshing, setRefreshing] = useState(false)

  useEffect(()=>{ if(!isLoggedIn()) router.push('/login') },[])

  const toggleStatus = (id:string) => {
    setCampaigns(cs=>cs.map(c=>c.id===id ? {...c, status:c.status==='ACTIVE'?'PAUSED':'ACTIVE'} : c))
  }

  const refresh = async () => {
    setRefreshing(true)
    await new Promise(r=>setTimeout(r,1500))
    setRefreshing(false)
  }

  return (
    <DashboardLayout title="Campanhas" description="Gerencie suas campanhas do Meta Ads">
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'20px'}}>
        <button onClick={refresh} disabled={refreshing} style={{display:'flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#00F5CC,#3b82f6)',border:'none',borderRadius:'10px',padding:'10px 20px',color:'#04071A',fontFamily:"'Orbitron',sans-serif",fontSize:'11px',fontWeight:'700',cursor:refreshing?'not-allowed':'pointer',opacity:refreshing?.7:1}}>
          <RefreshCw size={14} style={{animation:refreshing?'spin 1s linear infinite':undefined}} />
          {refreshing?'SINCRONIZANDO...':'SINCRONIZAR META'}
        </button>
      </div>

      <div style={{background:'linear-gradient(135deg,#0d1f3c,#081220)',border:'1px solid rgba(148,111,64,0.13)',borderRadius:'14px',overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                {['Campanha','Status','Orçamento','Gasto','Impressões','Cliques','CTR','CPA','ROAS','Ação'].map(h=>(
                  <th key={h} style={{padding:'12px 16px',textAlign:'left',fontSize:'10px',color:'rgba(242,228,185,0.5)',fontWeight:'700',letterSpacing:'0.5px',whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c,i)=>(
                <tr key={c.id} style={{borderBottom:'1px solid rgba(255,255,255,0.04)',background:i%2===0?'transparent':'rgba(255,255,255,0.01)'}}>
                  <td style={{padding:'14px 16px'}}>
                    <div style={{fontSize:'13px',color:'#F2E4B9',fontWeight:'600',maxWidth:'220px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.name}</div>
                    <div style={{fontSize:'11px',color:'rgba(242,228,185,0.4)',marginTop:'2px'}}>{c.objective} · {c.adsets} adsets</div>
                  </td>
                  <td style={{padding:'14px 16px'}}>
                    <span style={{
                      padding:'3px 10px',borderRadius:'20px',fontSize:'10px',fontWeight:'700',
                      background:c.status==='ACTIVE'?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)',
                      color:c.status==='ACTIVE'?'#22c55e':'#ef4444',
                      border:`1px solid ${c.status==='ACTIVE'?'rgba(34,197,94,0.3)':'rgba(239,68,68,0.3)'}`,
                    }}>{c.status==='ACTIVE'?'● Ativa':'● Pausada'}</span>
                  </td>
                  <td style={{padding:'14px 16px',fontSize:'13px',color:'#F2E4B9'}}>R${c.budget}/dia</td>
                  <td style={{padding:'14px 16px',fontSize:'13px',color:'#946F40',fontWeight:'600'}}>R${c.spend.toFixed(2)}</td>
                  <td style={{padding:'14px 16px',fontSize:'13px',color:'rgba(242,228,185,0.7)'}}>{c.impressions.toLocaleString('pt-BR')}</td>
                  <td style={{padding:'14px 16px',fontSize:'13px',color:'rgba(242,228,185,0.7)'}}>{c.clicks.toLocaleString('pt-BR')}</td>
                  <td style={{padding:'14px 16px',fontSize:'13px',color:'#00F5CC'}}>{c.ctr.toFixed(2)}%</td>
                  <td style={{padding:'14px 16px',fontSize:'13px',color:'rgba(242,228,185,0.7)'}}>R${c.cpa.toFixed(2)}</td>
                  <td style={{padding:'14px 16px'}}>
                    <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:'14px',fontWeight:'700',color:c.roas>=4?'#22c55e':c.roas>=2?'#946F40':'#ef4444'}}>{c.roas.toFixed(2)}x</span>
                  </td>
                  <td style={{padding:'14px 16px'}}>
                    <button onClick={()=>toggleStatus(c.id)} title={c.status==='ACTIVE'?'Pausar':'Ativar'} style={{background:'none',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'6px 8px',cursor:'pointer',color:c.status==='ACTIVE'?'#ef4444':'#22c55e',display:'flex',alignItems:'center',gap:'4px',fontSize:'11px'}}>
                      {c.status==='ACTIVE' ? <><Pause size={12}/>Pausar</> : <><Play size={12}/>Ativar</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </DashboardLayout>
  )
}
