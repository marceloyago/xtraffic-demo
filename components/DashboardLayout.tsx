'use client'
import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  LayoutDashboard, Target, Brain, Sparkles, BarChart2,
  Settings, LogOut, User, Bell, Menu, X, ChevronRight,
  Zap, Globe2, Info, CreditCard
} from 'lucide-react'
import { logout, getUser } from '@/lib/auth'

const navItems = [
  { icon:LayoutDashboard, label:'Dashboard',      href:'/' },
  { icon:Target,          label:'Campanhas',      href:'/campanhas' },
  { icon:Brain,           label:'Decisões IA',    href:'/decisoes-ia' },
  { icon:Sparkles,        label:'Geração',        href:'/geracao' },
  { icon:Globe2,          label:'Contas',         href:'/contas' },
  { icon:BarChart2,       label:'Relatório',      href:'/relatorios' },
  { icon:Settings,        label:'Configurações',  href:'/configuracoes' },
  { icon:Info,            label:'Suporte',        href:'/suporte' },
  { icon:CreditCard,      label:'Plano',          href:'/plano' },
]

interface Props { children:ReactNode; title:string; description?:string }

export default function DashboardLayout({ children, title, description }:Props) {
  const router   = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mobile, setMobile] = useState(false)
  const [sideOpen, setSideOpen] = useState(false)

  useEffect(() => {
    const u = getUser()
    if (!u) { router.push('/login'); return }
    setUser(u)
  }, [])

  const handleLogout = () => { logout(); router.push('/login') }

  const Sidebar = ({ mobile=false }) => (
    <div style={{
      width: mobile?'100%':'240px',
      background:'linear-gradient(180deg,#0a1428 0%,#060e1e 100%)',
      borderRight:'1px solid rgba(148,111,64,0.12)',
      display:'flex', flexDirection:'column',
      height:mobile?'auto':'100vh',
      position:mobile?'relative':'sticky', top:0,
      flexShrink:0, overflow:'hidden',
    }}>
      {/* Logo */}
      <div style={{padding:'24px 20px',borderBottom:'1px solid rgba(148,111,64,0.1)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'36px',height:'36px',background:'linear-gradient(135deg,#00F5CC,#3b82f6)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <span style={{color:'#04071A',fontWeight:'900',fontSize:'18px',fontFamily:"'Orbitron',sans-serif"}}>X</span>
          </div>
          <div>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'13px',fontWeight:'700',color:'#00F5CC',letterSpacing:'1px'}}>XTraffic IA</div>
            <div style={{fontSize:'10px',color:'rgba(242,228,185,0.4)'}}>by XLink Digital</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{flex:1,padding:'16px 12px',display:'flex',flexDirection:'column',gap:'2px',overflowY:'auto'}}>
        {navItems.map(item => {
          const active = router.pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{
              display:'flex', alignItems:'center', gap:'10px',
              padding:'10px 12px', borderRadius:'10px', textDecoration:'none',
              background: active ? 'linear-gradient(135deg,rgba(0,245,204,0.12),rgba(59,130,246,0.08))' : 'transparent',
              border: active ? '1px solid rgba(0,245,204,0.15)' : '1px solid transparent',
              color: active ? '#00F5CC' : 'rgba(242,228,185,0.55)',
              fontSize:'13px', fontWeight:active?'600':'400',
              transition:'all 0.2s',
            }}>
              <item.icon size={16} />
              {item.label}
              {active && <ChevronRight size={12} style={{marginLeft:'auto'}} />}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div style={{padding:'16px 12px',borderTop:'1px solid rgba(148,111,64,0.1)'}}>
        {/* Demo badge */}
        <div style={{background:'rgba(0,245,204,0.08)',border:'1px solid rgba(0,245,204,0.15)',borderRadius:'8px',padding:'8px 10px',marginBottom:'12px',display:'flex',alignItems:'center',gap:'8px'}}>
          <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#00F5CC',boxShadow:'0 0 6px #00F5CC'}} />
          <span style={{fontSize:'10px',color:'#00F5CC',fontWeight:'600'}}>MODO DEMO</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px',borderRadius:'10px',background:'rgba(255,255,255,0.03)'}}>
          <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,#946F40,#F2E4B9)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <User size={14} color='#04071A' />
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:'12px',color:'#F2E4B9',fontWeight:'600',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.name}</div>
            <div style={{fontSize:'10px',color:'rgba(242,228,185,0.4)'}}>{user?.plan}</div>
          </div>
          <button onClick={handleLogout} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(242,228,185,0.4)',padding:'4px'}}>
            <LogOut size={14}/>
          </button>
        </div>
      </div>
    </div>
  )

  if (!user) return null

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#04071A',fontFamily:"'Exo 2',sans-serif"}}>
      {/* Desktop sidebar */}
      <div style={{display:'none'}} className="sidebar-desktop">
        <Sidebar />
      </div>
      <div className="sidebar-show">
        <Sidebar />
      </div>

      {/* Mobile header */}
      <div className="mobile-header" style={{display:'none',position:'fixed',top:0,left:0,right:0,height:'60px',background:'#060e1e',borderBottom:'1px solid rgba(148,111,64,0.12)',zIndex:100,alignItems:'center',padding:'0 16px',gap:'12px'}}>
        <button onClick={()=>setSideOpen(!sideOpen)} style={{background:'none',border:'none',cursor:'pointer',color:'#F2E4B9'}}>
          {sideOpen?<X size={20}/>:<Menu size={20}/>}
        </button>
        <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:'14px',color:'#00F5CC',fontWeight:'700'}}>XTraffic IA</span>
      </div>

      {/* Main content */}
      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
        {/* Header */}
        <div style={{padding:'24px 32px 0',borderBottom:'1px solid rgba(148,111,64,0.08)',paddingBottom:'20px'}}>
          <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'20px',fontWeight:'700',color:'#F2E4B9',marginBottom:'4px'}}>{title}</h1>
          {description && <p style={{fontSize:'13px',color:'rgba(242,228,185,0.5)'}}>{description}</p>}
        </div>

        {/* Page content */}
        <div style={{flex:1,padding:'24px 32px',overflow:'auto'}}>
          {children}
        </div>
      </div>

      <style>{`
        @media(min-width:769px){.sidebar-show{display:block!important;}.mobile-header{display:none!important;}}
        @media(max-width:768px){.sidebar-show{display:none!important;}.mobile-header{display:flex!important;}}
      `}</style>
    </div>
  )
}
