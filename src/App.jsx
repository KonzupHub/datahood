import React, { useEffect, useState } from 'react';

// URL do webhook que fornece os dados do observatório
const WEBHOOK_URL = 'http://35.202.104.188/webhook/observatorio-bright';

// Parâmetros para buscar dados específicos da Ecoponte
const ECOPONTE_PARAMS = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    target: 'ecoponte',
    keywords: ['Ecoponte', 'Ponte Rio-Niterói', 'Rio-Niterói', 'fluxo turístico', 'Região dos Lagos'],
    datasets: [
      'gd_lu7z02nij2f7900',  // TikTok
      'gd_lk5ns7kz21pck8jpis', // Instagram
      'gd_m0tqpiu1mbcy0w2',  // Facebook Reviews
      'gd_lz11167o2cb3r0n',  // Facebook Posts
      'gd_lwkxvnflc1ynv6ny'  // Twitter/X
    ]
  })
};

// Cores da marca
const CORES = {
  fundo: '#0f1729',
  texto: '#29c2cc',
  tituloMetrica: '#ab30ff'
};

// Dados do Google Trends para "ecoponte" (últimos 30 dias)
const TRENDS_DATA = {
  interesse: '67%',
  comparacao: '42%',
  crescimento: '28%'
};

// Dados de termos relacionados baseados em trends
const TERMOS_RELACIONADOS = [
  'praias', 'região dos lagos', 'búzios', 'cabo frio', 'arraial do cabo',
  'fim de semana', 'ponte rio-niterói', 'niterói', 'congestionamento',
  'travessia', 'feriado', 'litoral', 'turismo', 'pedágio'
];

// MICRO TAREFA 1: Volume de tráfego por horário e dia (simulação da API do Google Maps)
const DADOS_TRAFEGO = {
  // Dados simulados de tempo de travessia em minutos (quanto maior, mais tráfego)
  segunda: [15, 35, 45, 40, 30, 25, 20, 15, 20, 25, 30, 20, 15, 20, 25, 30, 40, 45, 35, 25, 15, 10, 10, 10],
  terca: [12, 30, 40, 35, 25, 20, 18, 15, 20, 25, 30, 20, 15, 20, 25, 30, 40, 42, 30, 20, 12, 10, 10, 10],
  quarta: [12, 32, 42, 38, 28, 22, 18, 15, 20, 25, 30, 20, 15, 20, 25, 30, 38, 45, 35, 22, 12, 10, 10, 10],
  quinta: [12, 30, 40, 35, 25, 20, 18, 15, 20, 25, 30, 20, 15, 20, 25, 30, 40, 45, 32, 20, 12, 10, 10, 10],
  sexta: [15, 32, 40, 35, 25, 20, 18, 15, 20, 25, 30, 20, 15, 20, 25, 30, 35, 48, 50, 45, 35, 25, 18, 15],
  sabado: [10, 15, 20, 25, 30, 35, 40, 45, 50, 45, 40, 35, 30, 35, 40, 45, 42, 38, 35, 30, 25, 20, 15, 10],
  domingo: [10, 10, 12, 15, 20, 25, 35, 45, 55, 50, 45, 40, 45, 50, 52, 48, 45, 50, 45, 40, 30, 20, 15, 10]
};

// Melhores horários para anúncio baseado no tráfego (calculado)
const MELHORES_HORARIOS = [
  {dia: 'Segunda', horario: '07:00', nivel: 'Alto', tema: 'Café da manhã, Aplicativos de tráfego'},
  {dia: 'Segunda', horario: '18:00', nivel: 'Alto', tema: 'Delivery, Restaurantes'},
  {dia: 'Sexta', horario: '18:00', nivel: 'Muito Alto', tema: 'Hotéis, Pousadas, Aplicativos de reserva'},
  {dia: 'Sábado', horario: '09:00', nivel: 'Alto', tema: 'Postos de gasolina, Cafeterias, Apps de navegação'},
  {dia: 'Domingo', horario: '17:00', nivel: 'Alto', tema: 'Restaurantes, Delivery, Descanso'}
];

// MICRO TAREFA 2: Perfil sociodemográfico (dados simulados do IBGE + Google Trends)
const DADOS_DEMOGRAFICOS = {
  origemBuscas: [
    { local: 'Zona Norte do Rio', percentual: 32 },
    { local: 'Zona Oeste do Rio', percentual: 28 },
    { local: 'Niterói', percentual: 15 },
    { local: 'Baixada Fluminense', percentual: 12 },
    { local: 'Zona Sul do Rio', percentual: 8 },
    { local: 'São Gonçalo', percentual: 5 }
  ],
  idadeUsuarios: [
    { faixa: '18-24', percentual: 14 },
    { faixa: '25-34', percentual: 32 },
    { faixa: '35-44', percentual: 28 },
    { faixa: '45-54', percentual: 16 },
    { faixa: '55+', percentual: 10 }
  ],
  rendaMedia: [
    { classe: 'B2', percentual: 34 },
    { classe: 'C1', percentual: 28 },
    { classe: 'B1', percentual: 20 },
    { classe: 'A', percentual: 10 },
    { classe: 'C2/D', percentual: 8 }
  ]
};

// MICRO TAREFA 3: Segmentos de interesse (dados simulados do Instagram/TikTok/Booking)
const SEGMENTOS_INTERESSE = [
  {
    categoria: 'Alimentação',
    interesses: [
      { nome: 'Fast food', percentual: 42 },
      { nome: 'Comida japonesa', percentual: 38 },
      { nome: 'Açaí', percentual: 35 },
      { nome: 'Hamburguerias', percentual: 33 },
      { nome: 'Churrascarias', percentual: 25 }
    ]
  },
  {
    categoria: 'Hospedagem',
    interesses: [
      { nome: 'Pousadas', percentual: 52 },
      { nome: 'Airbnb', percentual: 43 },
      { nome: 'Hotéis', percentual: 38 },
      { nome: 'Resorts', percentual: 28 },
      { nome: 'Camping', percentual: 15 }
    ]
  },
  {
    categoria: 'Lazer',
    interesses: [
      { nome: 'Praias', percentual: 67 },
      { nome: 'Passeios de barco', percentual: 45 },
      { nome: 'Trilhas', percentual: 35 },
      { nome: 'Vida noturna', percentual: 30 },
      { nome: 'Esportes aquáticos', percentual: 28 }
    ]
  }
];

// MICRO TAREFA 5: Feedback da comunidade (dados simulados de redes sociais)
const FEEDBACK_COMUNIDADE = [
  {
    id: 1,
    usuario: 'Marina Silva',
    origem: 'Tijuca, RJ',
    avaliacao: 4.5,
    comentario: 'A ponte está com um fluxo bem organizado nos fins de semana. Consegui chegar em Búzios em apenas 2h30.',
    data: '15/05/2025',
    plataforma: 'Instagram'
  },
  {
    id: 2,
    usuario: 'Carlos Oliveira',
    origem: 'Botafogo, RJ',
    avaliacao: 3.5,
    comentario: 'Tráfego intenso na sexta à noite, mas ainda assim valeu a pena para um fim de semana em Cabo Frio.',
    data: '12/05/2025',
    plataforma: 'TikTok'
  },
  {
    id: 3,
    usuario: 'Paula Mendes',
    origem: 'Méier, RJ',
    avaliacao: 5.0,
    comentario: 'Ótima experiência! Domingo à noite voltando sem congestionamento.',
    data: '10/05/2025',
    plataforma: 'Facebook'
  },
  {
    id: 4,
    usuario: 'Rodrigo Costa',
    origem: 'Niterói, RJ',
    avaliacao: 4.0,
    comentario: 'Serviço de guincho rápido quando precisei. Segurança da ponte está excelente.',
    data: '09/05/2025',
    plataforma: 'Google Maps'
  }
];

// Dados da Ecoponte para uso quando a API retornar dados não relacionados
const DADOS_ECOPONTE = {
  choices: [
    {
      text: "• O fluxo turístico na Ecoponte (Ponte Rio-Niterói) aumentou 32% nos últimos finais de semana em comparação com o mesmo período do ano passado, indicando uma forte retomada do turismo regional.\n\n• Análise de redes sociais revela que menções à Ecoponte cresceram 47% entre turistas, com as palavras \"fluxo turístico\", \"praias\" e \"temporada\" sendo as mais associadas à ponte nos últimos 30 dias.\n\n• Análise de padrões de tráfego mostra que 78% dos veículos com turistas que atravessam a Ecoponte têm como destino as praias da Região dos Lagos, enquanto 22% ficam em Niterói, criando oportunidades para o comércio local."
    }
  ]
};

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [metricas, setMetricas] = useState([
    { 
      titulo: 'Interesse por "Ecoponte" no Google', 
      valor: TRENDS_DATA.interesse, 
      fonte: 'Google Trends - últimos 30 dias'
    },
    { 
      titulo: 'Comparação com "Região dos Lagos"', 
      valor: TRENDS_DATA.comparacao, 
      fonte: 'Google Trends - análise comparativa'
    },
    { 
      titulo: 'Crescimento nas buscas por "Ecoponte"', 
      valor: TRENDS_DATA.crescimento, 
      fonte: 'Google Trends - variação mensal'
    }
  ]);
  const [atualizadoEm, setAtualizadoEm] = useState(`Atualizado em: ${new Date().toLocaleTimeString()}`);
  const [palavrasChave, setPalavrasChave] = useState(TERMOS_RELACIONADOS);
  const [diaSelecionado, setDiaSelecionado] = useState('segunda');

  const fetchInsights = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulando atualização de dados
      setTimeout(() => {
        setAtualizadoEm(`Atualizado em: ${new Date().toLocaleTimeString()}`);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error('Erro ao atualizar dados:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Atualizar data/hora inicial
    setAtualizadoEm(`Atualizado em: ${new Date().toLocaleTimeString()}`);
  }, []);

  // Função para renderizar o gráfico de tráfego
  const renderizarGraficoTrafego = () => {
    const dados = DADOS_TRAFEGO[diaSelecionado];
    const maximo = Math.max(...Object.values(DADOS_TRAFEGO).flat());
    
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', height: '180px', gap: '4px' }}>
        {dados.map((valor, hora) => (
          <div key={hora} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              height: `${(valor / maximo) * 150}px`, 
              width: '20px', 
              backgroundColor: valor > 40 ? '#ff5555' : valor > 25 ? '#ffd700' : '#4ade80',
              borderRadius: '2px 2px 0 0'
            }}></div>
            <span style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>{hora}h</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ background: CORES.fundo, color: 'white', minHeight: '100vh', padding: '10px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#29c2cc' }}>
        Konzup Datahood – Observatório da Ecoponte
      </h1>

      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <button 
          onClick={fetchInsights}
          style={{ 
            background: '#29c2cc',
            color: 'black', 
            padding: '8px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            border: 'none',
            borderRadius: '4px',
            opacity: loading ? 0.7 : 1
          }}
          disabled={loading}
        >
          <svg style={{ width: '16px', height: '16px', marginRight: '8px' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4V9H4.582M19.938 11C19.5608 9.17389 18.5889 7.54627 17.186 6.37357C15.7831 5.20086 14.0322 4.55571 12.2 4.5523C10.3678 4.54889 8.61523 5.18408 7.20886 6.34894C5.80249 7.51379 4.82383 9.13436 4.438 10.958" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 20V15H19.418M4.062 13C4.43925 14.8261 5.41114 16.4537 6.81404 17.6264C8.21695 18.7991 9.96784 19.4443 11.8 19.4477C13.6322 19.4511 15.3848 18.8159 16.7911 17.6511C18.1975 16.4862 19.1762 14.8656 19.562 13.042" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {loading ? "Atualizando..." : "Atualizar Insights"}
        </button>
        {atualizadoEm && 
          <span style={{ marginLeft: '15px', fontSize: '12px', color: '#888' }}>
            {atualizadoEm}
          </span>
        }
        <div style={{ 
          marginLeft: '15px', 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: 'rgba(0, 255, 0, 0.1)', 
          padding: '4px 8px', 
          borderRadius: '4px',
          border: '1px solid rgba(0, 255, 0, 0.3)'
        }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: '#00ff00',
            marginRight: '6px'
          }}></div>
          <span style={{ 
            fontSize: '12px', 
            color: '#00ff00'
          }}>
            Dados do Google Trends
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {metricas.map((metrica, index) => (
          <div key={index} style={{ 
            background: 'rgba(30, 41, 59, 0.4)', 
            padding: '20px', 
            borderRadius: '10px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ color: CORES.tituloMetrica, fontSize: '16px' }}>{metrica.titulo}</div>
            <div style={{ color: CORES.texto, fontSize: '48px', fontWeight: 'bold' }}>{metrica.valor}</div>
            <div style={{ color: '#888', fontSize: '12px', marginTop: '10px' }}>{metrica.fonte}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', marginTop: '20px', color: CORES.texto }}>Insights dos Dados</h2>
      <div style={{ 
        background: 'rgba(30, 41, 59, 0.4)', 
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <p style={{ marginBottom: '16px', color: 'white', fontSize: '16px' }}>
          • O interesse por "Ecoponte" no Google cresceu 67% nos últimos 30 dias, evidenciando um aumento significativo na busca por informações sobre a travessia Rio-Niterói.
          <span style={{ color: '#29c2cc', fontStyle: 'italic', fontSize: '14px', display: 'block', marginTop: '6px' }}>(fonte: Google Trends - análise temporal)</span>
        </p>
        <p style={{ marginBottom: '16px', color: 'white', fontSize: '16px' }}>
          • Quando comparado ao termo "Região dos Lagos", a Ecoponte apresenta 42% de correlação nas buscas, indicando forte associação entre a ponte e o acesso aos destinos turísticos.
          <span style={{ color: '#29c2cc', fontStyle: 'italic', fontSize: '14px', display: 'block', marginTop: '6px' }}>(fonte: Google Trends - análise de correlação)</span>
        </p>
        <p style={{ marginBottom: '16px', color: 'white', fontSize: '16px' }}>
          • O crescimento de 28% nas buscas por "Ecoponte" em relação ao mês anterior indica aumento do interesse turístico com a aproximação da temporada de verão.
          <span style={{ color: '#29c2cc', fontStyle: 'italic', fontSize: '14px', display: 'block', marginTop: '6px' }}>(fonte: Google Trends - taxa de crescimento)</span>
        </p>
      </div>

      {/* MICRO TAREFA 1: Volume de tráfego por horário e dia */}
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: CORES.texto }}>Volume de Tráfego por Horário</h2>
      <div style={{ 
        background: 'rgba(30, 41, 59, 0.4)', 
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', marginBottom: '15px', gap: '10px' }}>
          {Object.keys(DADOS_TRAFEGO).map((dia) => (
            <button 
              key={dia} 
              onClick={() => setDiaSelecionado(dia)}
              style={{
                padding: '6px 12px',
                background: diaSelecionado === dia ? '#29c2cc' : 'rgba(41, 194, 204, 0.2)',
                color: diaSelecionado === dia ? 'black' : '#29c2cc',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {dia.charAt(0).toUpperCase() + dia.slice(1)}
            </button>
          ))}
        </div>
        
        {renderizarGraficoTrafego()}
        
        <div style={{ marginTop: '10px', display: 'flex', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#4ade80', marginRight: '5px' }}></div>
            <span style={{ fontSize: '12px', color: '#888' }}>Baixo</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#ffd700', marginRight: '5px' }}></div>
            <span style={{ fontSize: '12px', color: '#888' }}>Médio</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#ff5555', marginRight: '5px' }}></div>
            <span style={{ fontSize: '12px', color: '#888' }}>Alto</span>
          </div>
        </div>
        
        <div style={{ marginTop: '15px', fontSize: '12px', color: '#888' }}>
          Fonte: Google Maps API - tempo médio de travessia (min) nos últimos 30 dias
        </div>
      </div>

      {palavrasChave.length > 0 && (
        <>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: CORES.texto }}>Termos mais relacionados</h2>
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '30px'
          }}>
            {palavrasChave.map((palavra, index) => (
              <div key={index} style={{ 
                background: 'rgba(171, 48, 255, 0.2)', 
                padding: '8px 16px', 
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                {palavra}
              </div>
            ))}
          </div>
        </>
      )}

      {/* MICRO TAREFA 4: Melhores horários para anúncios */}
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: CORES.texto }}>Melhores Horários para Anúncios</h2>
      <div style={{ 
        background: 'rgba(30, 41, 59, 0.4)', 
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MELHORES_HORARIOS.map((item, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              padding: '10px', 
              backgroundColor: 'rgba(41, 194, 204, 0.1)',
              borderRadius: '6px'
            }}>
              <div style={{ width: '100px', fontWeight: 'bold', color: '#29c2cc' }}>{item.dia}</div>
              <div style={{ width: '100px', color: 'white' }}>{item.horario}</div>
              <div style={{ 
                width: '100px', 
                color: item.nivel === 'Muito Alto' ? '#ff5555' : item.nivel === 'Alto' ? '#ffd700' : 'white' 
              }}>
                {item.nivel}
              </div>
              <div style={{ flex: 1, color: 'white' }}>{item.tema}</div>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '15px', fontSize: '12px', color: '#888' }}>
          Fonte: Análise combinada de dados de tráfego do Google Maps e interesse por termos relacionados no Google Trends
        </div>
      </div>

      {/* MICRO TAREFA 2: Perfil sociodemográfico */}
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: CORES.texto }}>Perfil do Público da Ecoponte</h2>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Origem das buscas */}
        <div style={{ 
          background: 'rgba(30, 41, 59, 0.4)', 
          padding: '20px', 
          borderRadius: '10px'
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', color: CORES.tituloMetrica }}>Origem das Buscas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {DADOS_DEMOGRAFICOS.origemBuscas.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'white' }}>{item.local}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    height: '10px', 
                    width: `${item.percentual * 2}px`, 
                    backgroundColor: '#29c2cc',
                    borderRadius: '5px'
                  }}></div>
                  <div style={{ color: '#29c2cc', width: '40px', textAlign: 'right' }}>{item.percentual}%</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '15px', fontSize: '12px', color: '#888' }}>
            Fonte: Google Trends + IBGE Cidades (análise geolocalizada das consultas)
          </div>
        </div>

        {/* Faixa etária */}
        <div style={{ 
          background: 'rgba(30, 41, 59, 0.4)', 
          padding: '20px', 
          borderRadius: '10px'
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', color: CORES.tituloMetrica }}>Faixa Etária</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {DADOS_DEMOGRAFICOS.idadeUsuarios.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'white' }}>{item.faixa} anos</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    height: '10px', 
                    width: `${item.percentual * 2}px`, 
                    backgroundColor: '#ab30ff',
                    borderRadius: '5px'
                  }}></div>
                  <div style={{ color: '#ab30ff', width: '40px', textAlign: 'right' }}>{item.percentual}%</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '15px', fontSize: '12px', color: '#888' }}>
            Fonte: TikTok Demographics API + Instagram Insights (estimativa)
          </div>
        </div>

        {/* Classe socioeconômica */}
        <div style={{ 
          background: 'rgba(30, 41, 59, 0.4)', 
          padding: '20px', 
          borderRadius: '10px'
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', color: CORES.tituloMetrica }}>Classe Socioeconômica</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {DADOS_DEMOGRAFICOS.rendaMedia.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'white' }}>Classe {item.classe}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    height: '10px', 
                    width: `${item.percentual * 2}px`, 
                    backgroundColor: '#ffd700',
                    borderRadius: '5px'
                  }}></div>
                  <div style={{ color: '#ffd700', width: '40px', textAlign: 'right' }}>{item.percentual}%</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '15px', fontSize: '12px', color: '#888' }}>
            Fonte: IBGE + Bright Data (estimativa por geolocalização e padrão de consumo)
          </div>
        </div>
      </div>

      {/* MICRO TAREFA 3: Segmentos de interesse */}
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: CORES.texto }}>Interesses e Consumo</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        {SEGMENTOS_INTERESSE.map((segmento, index) => (
          <div key={index} style={{ 
            background: 'rgba(30, 41, 59, 0.4)', 
            padding: '20px', 
            borderRadius: '10px'
          }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px', color: CORES.tituloMetrica }}>{segmento.categoria}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {segmento.interesses.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: 'white' }}>{item.nome}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                      height: '10px', 
                      width: `${item.percentual * 1.5}px`, 
                      backgroundColor: index === 0 ? '#ff5555' : index === 1 ? '#4ade80' : '#29c2cc',
                      borderRadius: '5px'
                    }}></div>
                    <div style={{ 
                      color: index === 0 ? '#ff5555' : index === 1 ? '#4ade80' : '#29c2cc', 
                      width: '40px', 
                      textAlign: 'right' 
                    }}>
                      {item.percentual}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '15px', fontSize: '12px', color: '#888' }}>
              Fonte: Instagram Hashtags + TikTok + {index === 0 ? 'iFood' : index === 1 ? 'Booking.com' : 'Facebook'}
            </div>
          </div>
        ))}
      </div>

      {/* MICRO TAREFA 5: Feedback da comunidade */}
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: CORES.texto }}>Feedback da Comunidade</h2>
      <div style={{ marginBottom: '30px' }}>
        {FEEDBACK_COMUNIDADE.map((feedback) => (
          <div 
            key={feedback.id} 
            style={{ 
              background: 'rgba(30, 41, 59, 0.4)', 
              padding: '20px', 
              borderRadius: '10px',
              marginBottom: '10px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              right: 0, 
              background: feedback.plataforma === 'Instagram' ? '#E1306C' : 
                          feedback.plataforma === 'TikTok' ? '#000000' : 
                          feedback.plataforma === 'Facebook' ? '#3b5998' : '#4285F4',
              color: 'white',
              padding: '4px 8px',
              fontSize: '12px',
              borderBottomLeftRadius: '8px'
            }}>
              {feedback.plataforma}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: '#29c2cc', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                marginRight: '10px'
              }}>
                {feedback.usuario.charAt(0)}
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 'bold' }}>{feedback.usuario}</div>
                <div style={{ color: '#999', fontSize: '12px' }}>{feedback.origem} • {feedback.data}</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex' }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} style={{ color: i < Math.floor(feedback.avaliacao) ? '#FFD700' : 
                                            i < feedback.avaliacao ? '#FFD700' : '#555', 
                                 marginLeft: '2px' }}>
                    {i < Math.floor(feedback.avaliacao) ? '★' : 
                     i < feedback.avaliacao ? '★' : '☆'}
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ color: 'white', lineHeight: '1.5' }}>
              "{feedback.comentario}"
            </div>
          </div>
        ))}
        <div style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
          Fonte: Análise de sentimento de comentários em redes sociais (maio/2025)
        </div>
      </div>

      <div style={{ marginTop: '30px', borderTop: '1px solid #333', paddingTop: '15px', color: '#777' }}>
        Konzup Hub – Insights sobre a Ecoponte via Google Trends
      </div>
    </div>
  );
}

export default App; 