import { useEffect } from 'react'
import { useRouter } from 'next/router'
import DashboardLayout from '../components/DashboardLayout'
import { isLoggedIn } from '../lib/auth'

export default function Page() {
  const router = useRouter()
  useEffect(()=>{ if(!isLoggedIn()) router.push('/login') },[])
  return (
    <DashboardLayout title="Configurações" description="Preferências e integrações">
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'400px',gap:'16px'}}>
        <div style={{width:'80px',height:'80px',borderRadius:'20px',background:'linear-gradient(135deg,rgba(0,245,204,0.1),rgba(59,130,246,0.1))',border:'1px solid rgba(0,245,204,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px'}}>
          ⚙️
        </div>
        <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'18px',color:'#F2E4B9',fontWeight:'700'}}>Configurações</h2>
        <p style={{fontSize:'14px',color:'rgba(242,228,185,0.5)',textAlign:'center',maxWidth:'400px'}}>
          Esta seção está disponível na versão completa do XTraffic IA.<br/>
          <span style={{color:'#00F5CC',fontWeight:'600'}}>Acesse gestor.xlinkdigital.com.br para usar a plataforma completa.</span>
        </p>
        <a href="https://gestor.xlinkdigital.com.br" target="_blank" rel="noreferrer"
          style={{background:'linear-gradient(135deg,#00F5CC,#3b82f6)',borderRadius:'10px',padding:'12px 28px',color:'#04071A',fontFamily:"'Orbitron',sans-serif",fontSize:'12px',fontWeight:'700',letterSpacing:'1px',textDecoration:'none'}}>
          ACESSAR PLATAFORMA COMPLETA →
        </a>
      </div>
    </DashboardLayout>
  )
}
