/**
 * @owner   Welbert Cruz <welbertcruz12@gmail.com>
 * @project XLink Digital — PLX Platform
 * @repo    github.com/marceloyago
 * @built   with Marcelo Yago | Claude (Anthropic)
 *
 * Unauthorized use or distribution is prohibited.
 * © 2026 Welbert Cruz. All rights reserved.
 */

export const DEMO_USER = {
  email: 'demo@xtraffic.com.br',
  password: 'demo123',
  name: 'Conta Demo',
  plan: 'Professional',
  avatar: '',
}

export const mockCampaigns = [
  { id:'c1', name:'XTraffic IA | Leads | BR', status:'ACTIVE', budget:50, spend:38.42, impressions:12840, clicks:387, ctr:3.01, cpm:29.92, cpa:15.20, roas:4.21, objective:'LEADS', adsets:3 },
  { id:'c2', name:'Produto X | Conversões | SP', status:'ACTIVE', budget:120, spend:97.15, impressions:31200, clicks:1124, ctr:3.60, cpm:31.14, cpa:21.50, roas:6.83, objective:'CONVERSIONS', adsets:5 },
  { id:'c3', name:'Remarketing | Visitantes | 7d', status:'ACTIVE', budget:30, spend:22.80, impressions:8430, clicks:312, ctr:3.70, cpm:27.05, cpa:11.20, roas:8.12, objective:'CONVERSIONS', adsets:2 },
  { id:'c4', name:'Awareness | Marca | BR', status:'PAUSED', budget:80, spend:0, impressions:0, clicks:0, ctr:0, cpm:0, cpa:0, roas:0, objective:'REACH', adsets:2 },
  { id:'c5', name:'E-commerce | Carrinho | Nac', status:'ACTIVE', budget:200, spend:178.90, impressions:58300, clicks:2140, ctr:3.67, cpm:30.68, cpa:18.70, roas:9.44, objective:'CONVERSIONS', adsets:8 },
]

export const mockDecisions = [
  { id:'d1', campaign_name:'Produto X | Conversões | SP',  decision:'ESCALAR', roas:6.83, spend:97.15,  cpa:21.50, ctr:3.60, cpm:31.14, frequency:1.8, confidence:92, prev_roas:5.91, prev_cpa:24.10, prev_frequency:2.0, confidence_breakdown:{roas:40,cpa:35,frequency:25}, reason:'ROAS acima de 6x, CPA estável e frequência saudável. Recomendado aumentar orçamento em 30% para capturar mais volume.',  created_at: new Date(Date.now()-3*3600000).toISOString() },
  { id:'d2', campaign_name:'Remarketing | Visitantes | 7d', decision:'ESCALAR', roas:8.12, spend:22.80,  cpa:11.20, ctr:3.70, cpm:27.05, frequency:2.1, confidence:88, prev_roas:6.80, prev_cpa:13.50, prev_frequency:1.9, confidence_breakdown:{roas:45,cpa:30,frequency:25}, reason:'Remarketing com ROAS excepcional. Audience ainda tem muito espaço. Escalar orçamento agressivamente.', created_at: new Date(Date.now()-5*3600000).toISOString() },
  { id:'d3', campaign_name:'E-commerce | Carrinho | Nac',  decision:'MANTER',  roas:9.44, spend:178.90, cpa:18.70, ctr:3.67, cpm:30.68, frequency:2.4, confidence:85, prev_roas:9.50, prev_cpa:18.20, prev_frequency:2.2, confidence_breakdown:{roas:35,cpa:40,frequency:25}, reason:'Performance excelente e estável. Manter orçamento atual e monitorar frequência para evitar fadiga.',  created_at: new Date(Date.now()-7*3600000).toISOString() },
  { id:'d4', campaign_name:'XTraffic IA | Leads | BR',     decision:'TESTAR',  roas:4.21, spend:38.42,  cpa:15.20, ctr:3.01, cpm:29.92, frequency:1.5, confidence:72, prev_roas:3.90, prev_cpa:14.80, prev_frequency:1.6, confidence_breakdown:{roas:30,cpa:45,frequency:25}, reason:'CPA aceitável mas ROAS pode melhorar. Testar novos criativos e audiências para otimizar.',             created_at: new Date(Date.now()-9*3600000).toISOString() },
  { id:'d5', campaign_name:'Awareness | Marca | BR',       decision:'PAUSAR',  roas:0,    spend:0,      cpa:0,     ctr:0,    cpm:0,     frequency:0,   confidence:95, prev_roas:1.20, prev_cpa:42.00, prev_frequency:0.2, confidence_breakdown:{roas:20,cpa:50,frequency:30}, reason:'Campanha pausada manualmente. Nenhuma entrega nas últimas 24h. Verificar configurações.',            created_at: new Date(Date.now()-11*3600000).toISOString() },
]

export const mockAlerts = [
  { id:'a1', severity:'success', title:'Campanha escalada com sucesso', description:'Watson executou escalonamento de 30% em "Produto X | Conversões | SP"', category:'WATSON', created_at: new Date(Date.now()-1*3600000).toISOString() },
  { id:'a2', severity:'warning', title:'Frequência elevada detectada', description:'"E-commerce | Carrinho | Nac" com frequência 2.4 — risco de fadiga de audiência nas próximas 48h', category:'SHERLOCK', created_at: new Date(Date.now()-3*3600000).toISOString() },
  { id:'a3', severity:'info', title:'Sherlock concluiu auditoria', description:'5 campanhas auditadas — 2 para escalar, 1 manter, 1 testar, 1 pausar', category:'SHERLOCK', created_at: new Date(Date.now()-6*3600000).toISOString() },
  { id:'a4', severity:'critical', title:'CPA acima do limite', description:'"Produto X" CPA R$21.50 — 7% acima do target. Watson em análise.', category:'WATSON', created_at: new Date(Date.now()-9*3600000).toISOString() },
]

export const mockChartData = Array.from({length:14}, (_, i) => {
  const d = new Date(); d.setDate(d.getDate()-13+i)
  const base = 3000 + i*150 + Math.sin(i)*400
  return {
    date: d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}),
    gasto: +(base*0.12).toFixed(2),
    conversoes: Math.floor(base/180),
    roas: +(3.8 + i*0.15 + Math.sin(i)*0.3).toFixed(2),
    impressoes: Math.floor(base),
  }
})

export const mockCreatives = [
  {
    id:'cr1',
    campaign_name:'Produto X | Conversões | SP',
    format:'FEED',
    status:'PUBLICADO',
    variant:'A',
    headline:'Resultado em 7 dias ou seu dinheiro de volta',
    body:'Mais de 10.000 clientes já transformaram seus resultados com o Produto X. Tecnologia avançada, entrega rápida e suporte 24h. Clique agora e comece hoje.',
    cta:'COMPRAR AGORA',
    quality:91,
    quality_breakdown:{ relevancia:38, engajamento:33, clareza:29 },
    ctr:4.82,
    impressions:18400,
    clicks:887,
    cpc:1.24,
    prev_ctr:3.90,
    created_at: new Date(Date.now()-2*3600000).toISOString(),
    reason:'Alto potencial de conversão: headline com prova social + garantia elimina objeções. CTA direto alinhado ao objetivo de conversão.',
  },
  {
    id:'cr2',
    campaign_name:'Produto X | Conversões | SP',
    format:'STORIES',
    status:'TESTANDO',
    variant:'B',
    headline:'Você ainda não conhece o Produto X?',
    body:'Enquanto você lê isso, 237 pessoas já compraram hoje. Estoque limitado — aproveite o desconto de lançamento antes que acabe.',
    cta:'GARANTIR DESCONTO',
    quality:85,
    quality_breakdown:{ relevancia:35, engajamento:32, clareza:28 },
    ctr:3.61,
    impressions:9200,
    clicks:332,
    cpc:1.87,
    prev_ctr:0,
    created_at: new Date(Date.now()-4*3600000).toISOString(),
    reason:'Formato Stories favorece urgência. Testando variação com gatilho de escassez vs. versão A com garantia.',
  },
  {
    id:'cr3',
    campaign_name:'E-commerce | Carrinho | Nac',
    format:'CARROSSEL',
    status:'PUBLICADO',
    variant:'A',
    headline:'5 razões para completar sua compra agora',
    body:'Frete grátis acima de R$150 · Parcelamento em 12x · Devolução fácil · Entrega em 24h · Produto original garantido.',
    cta:'VER MAIS',
    quality:88,
    quality_breakdown:{ relevancia:32, engajamento:36, clareza:30 },
    ctr:5.14,
    impressions:31600,
    clicks:1624,
    cpc:0.98,
    prev_ctr:4.40,
    created_at: new Date(Date.now()-6*3600000).toISOString(),
    reason:'Carrossel ideal para remarketing de carrinho abandonado. Cada slide remove uma objeção diferente — estrutura provou CTR acima da média.',
  },
  {
    id:'cr4',
    campaign_name:'XTraffic IA | Leads | BR',
    format:'FEED',
    status:'TESTANDO',
    variant:'A',
    headline:'Sua agência fatura 3x mais com IA. Veja como.',
    body:'O XTraffic IA automatiza campanhas, analisa ROAS em tempo real e toma decisões sozinho. Você só acompanha os resultados.',
    cta:'QUERO SABER MAIS',
    quality:79,
    quality_breakdown:{ relevancia:30, engajamento:28, clareza:31 },
    ctr:3.20,
    impressions:7800,
    clicks:250,
    cpc:2.10,
    prev_ctr:2.80,
    created_at: new Date(Date.now()-9*3600000).toISOString(),
    reason:'Headline promessa + número específico aumenta credibilidade. CTR subindo desde ontem — aguardar 48h para decisão de escalar.',
  },
  {
    id:'cr5',
    campaign_name:'Remarketing | Visitantes | 7d',
    format:'FEED',
    status:'RASCUNHO',
    variant:'C',
    headline:'Ainda pensando? A oferta muda em 12h.',
    body:'Você visitou nossa página mas não finalizou. Hoje temos condições especiais só para quem já conhece nosso produto. Últimas horas.',
    cta:'APROVEITAR AGORA',
    quality:73,
    quality_breakdown:{ relevancia:28, engajamento:25, clareza:30 },
    ctr:0,
    impressions:0,
    clicks:0,
    cpc:0,
    prev_ctr:0,
    created_at: new Date(Date.now()-12*3600000).toISOString(),
    reason:'Variante C com urgência temporal para remarketing. Ainda em rascunho — revisar copy antes de publicar.',
  },
  {
    id:'cr6',
    campaign_name:'Awareness | Marca | BR',
    format:'REELS',
    status:'PAUSADO',
    variant:'A',
    headline:'XLink Digital: A IA que trabalha enquanto você dorme',
    body:'Campanhas otimizadas 24/7, sem esforço manual. Conheça o futuro do tráfego pago.',
    cta:'CONHECER',
    quality:66,
    quality_breakdown:{ relevancia:22, engajamento:24, clareza:30 },
    ctr:1.80,
    impressions:42000,
    clicks:756,
    cpc:3.40,
    prev_ctr:2.10,
    created_at: new Date(Date.now()-16*3600000).toISOString(),
    reason:'Campanha de awareness pausada. Criativo pausado junto — baixo ROAS da campanha pai não justifica veiculação.',
  },
]
  totalSpend: 337.27,
  totalConversions: 89,
  avgRoas: 7.15,
  avgCpa: 16.42,
  activeCampaigns: 4,
  totalImpressions: 110770,
  totalClicks: 3963,
  avgCtr: 3.58,
}
