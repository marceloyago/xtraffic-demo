'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { Eye, EyeOff, Loader2, Zap, TrendingUp, Target, Shield } from 'lucide-react'
import { login, isLoggedIn } from '@/lib/auth'

function CircuitCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    type Node = { x:number; y:number; vx:number; vy:number; pulse:number; speed:number }
    const nodes: Node[] = Array.from({length:55}, () => ({
      x:Math.random()*canvas.width, y:Math.random()*canvas.height,
      vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.35,
      pulse:Math.random()*Math.PI*2, speed:.02+Math.random()*.015,
    }))
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height)
      for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
        const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y
        const dist=Math.sqrt(dx*dx+dy*dy)
        if(dist<160){
          const a=(1-dist/160)*.18
          const g=ctx.createLinearGradient(nodes[i].x,nodes[i].y,nodes[j].x,nodes[j].y)
          g.addColorStop(0,`rgba(0,245,204,${a})`); g.addColorStop(1,`rgba(0,170,255,${a})`)
          ctx.strokeStyle=g; ctx.lineWidth=.8; ctx.beginPath()
          ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.stroke()
        }
      }
      nodes.forEach(n=>{
        n.pulse+=n.speed; const glow=(Math.sin(n.pulse)+1)/2; const r=2+glow*2
        const rg=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,r*5)
        rg.addColorStop(0,`rgba(0,245,204,${.12*glow})`); rg.addColorStop(1,'rgba(0,245,204,0)')
        ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(n.x,n.y,r*5,0,Math.PI*2); ctx.fill()
        ctx.fillStyle=`rgba(0,${180+75*glow},${200+55*glow},${.7+.3*glow})`
        ctx.beginPath(); ctx.arc(n.x,n.y,r,0,Math.PI*2); ctx.fill()
        n.x+=n.vx; n.y+=n.vy
        if(n.x<0||n.x>canvas.width) n.vx*=-1
        if(n.y<0||n.y>canvas.height) n.vy*=-1
      })
      raf=requestAnimationFrame(draw)
    }
    draw()
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize',resize) }
  },[])
  return <canvas ref={ref} style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0}} />
}

const features = [
  { icon: Zap,       title:'Agentes IA 24/7',    desc:'Sherlock audita e Watson executa automaticamente' },
  { icon: TrendingUp,title:'ROAS Maximizado',     desc:'IA otimiza campanhas em tempo real com precisão cirúrgica' },
  { icon: Target,    title:'Decisões Inteligentes',desc:'Recomendações baseadas em dados reais da Meta Ads API' },
  { icon: Shield,    title:'100% Seguro',          desc:'Integração oficial Meta Business, dados protegidos' },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isLoggedIn()) router.push('/')
    // Pre-fill demo credentials
    setEmail('demo@xtraffic.com.br')
    setPassword('demo123')
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    await new Promise(r => setTimeout(r, 1200))
    if (login(email, password)) {
      router.push('/')
    } else {
      setError('Credenciais inválidas. Use: demo@xtraffic.com.br / demo123')
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh', background:'#04071A', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', fontFamily:"'Exo 2', sans-serif"}}>
      <CircuitCanvas />

      {/* Glow orbs */}
      <div style={{position:'fixed',top:'-20%',left:'-10%',width:'600px',height:'600px',background:'radial-gradient(circle,rgba(0,245,204,0.06) 0%,transparent 70%)',pointerEvents:'none'}} />
      <div style={{position:'fixed',bottom:'-20%',right:'-10%',width:'600px',height:'600px',background:'radial-gradient(circle,rgba(148,111,64,0.06) 0%,transparent 70%)',pointerEvents:'none'}} />

      <div style={{position:'relative',zIndex:1,width:'100%',maxWidth:'1100px',margin:'0 auto',padding:'20px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'60px',alignItems:'center'}}>

        {/* Left — branding */}
        <div style={{display:'flex',flexDirection:'column',gap:'40px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px'}}>
              <div style={{width:'48px',height:'48px',background:'linear-gradient(135deg,#00F5CC,#3b82f6)',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <span style={{color:'#04071A',fontSize:'24px',fontWeight:'900',fontFamily:"'Orbitron',sans-serif"}}>X</span>
              </div>
              <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:'22px',fontWeight:'700',color:'#00F5CC',letterSpacing:'2px'}}>XTraffic IA</span>
            </div>
            <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'38px',fontWeight:'900',lineHeight:1.1,color:'#F2E4B9',marginBottom:'16px'}}>
              Tráfego Pago<br />
              <span style={{background:'linear-gradient(90deg,#00F5CC,#3b82f6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>com IA</span>
            </h1>
            <p style={{color:'rgba(242,228,185,0.6)',fontSize:'16px',lineHeight:1.6}}>
              Seus agentes de IA trabalham enquanto você dorme. Sherlock audita, Watson executa, Edison cria — 24h por dia.
            </p>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
            {features.map(f => (
              <div key={f.title} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(148,111,64,0.13)',borderRadius:'12px',padding:'16px'}}>
                <f.icon size={20} color='#00F5CC' style={{marginBottom:'8px'}} />
                <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'11px',fontWeight:'700',color:'#F2E4B9',marginBottom:'4px',letterSpacing:'0.5px'}}>{f.title}</div>
                <div style={{fontSize:'12px',color:'rgba(242,228,185,0.5)',lineHeight:1.4}}>{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Demo badge */}
          <div style={{background:'rgba(0,245,204,0.08)',border:'1px solid rgba(0,245,204,0.2)',borderRadius:'12px',padding:'14px 20px',display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#00F5CC',boxShadow:'0 0 8px #00F5CC',flexShrink:0}} />
            <div>
              <div style={{fontSize:'12px',color:'#00F5CC',fontWeight:'600',marginBottom:'2px'}}>Modo Demo</div>
              <div style={{fontSize:'11px',color:'rgba(242,228,185,0.5)'}}>Dados simulados para visualização. Credenciais pré-preenchidas.</div>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div style={{background:'linear-gradient(135deg,rgba(13,31,60,0.95),rgba(8,18,32,0.95))',border:'1px solid rgba(148,111,64,0.2)',borderRadius:'20px',padding:'40px',backdropFilter:'blur(20px)'}}>
          <div style={{marginBottom:'32px',textAlign:'center'}}>
            <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'20px',fontWeight:'700',color:'#F2E4B9',marginBottom:'8px'}}>Entrar na plataforma</h2>
            <p style={{fontSize:'13px',color:'rgba(242,228,185,0.5)'}}>Credenciais demo já preenchidas</p>
          </div>

          <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:'20px'}}>
            {/* Email */}
            <div>
              <label style={{fontSize:'12px',color:'rgba(242,228,185,0.6)',fontWeight:'600',letterSpacing:'0.5px',display:'block',marginBottom:'8px'}}>EMAIL</label>
              <input
                type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'12px 16px',color:'#F2E4B9',fontSize:'14px',outline:'none',fontFamily:"'Exo 2',sans-serif"}}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{fontSize:'12px',color:'rgba(242,228,185,0.6)',fontWeight:'600',letterSpacing:'0.5px',display:'block',marginBottom:'8px'}}>SENHA</label>
              <div style={{position:'relative'}}>
                <input
                  type={showPw?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required
                  style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'12px 44px 12px 16px',color:'#F2E4B9',fontSize:'14px',outline:'none',fontFamily:"'Exo 2',sans-serif"}}
                />
                <button type="button" onClick={()=>setShowPw(!showPw)} style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'rgba(242,228,185,0.5)'}}>
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {error && (
              <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'8px',padding:'10px 14px',fontSize:'13px',color:'#ef4444'}}>{error}</div>
            )}

            <button
              type="submit" disabled={loading}
              style={{background:'linear-gradient(135deg,#00F5CC,#3b82f6)',border:'none',borderRadius:'10px',padding:'14px',color:'#04071A',fontFamily:"'Orbitron',sans-serif",fontSize:'13px',fontWeight:'700',letterSpacing:'1px',cursor:loading?'not-allowed':'pointer',opacity:loading?.7:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}
            >
              {loading ? <><Loader2 size={16} className="animate-spin" />ENTRANDO...</> : 'ENTRAR NA PLATAFORMA →'}
            </button>
          </form>

          {/* Stats */}
          <div style={{marginTop:'32px',paddingTop:'24px',borderTop:'1px solid rgba(255,255,255,0.06)',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px',textAlign:'center'}}>
            {[['4.2x','ROAS Médio'],['89','Leads/mês'],['24/7','IA Ativa']].map(([v,l])=>(
              <div key={l}>
                <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'18px',fontWeight:'700',color:'#00F5CC'}}>{v}</div>
                <div style={{fontSize:'10px',color:'rgba(242,228,185,0.4)',marginTop:'2px'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive style */}
      <style>{`@media(max-width:768px){.login-grid{grid-template-columns:1fr!important;}.login-left{display:none!important;}}`}</style>
    </div>
  )
}
