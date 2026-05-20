import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://yfnvfzjftrgyryrcfvih.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmbnZmempmdHJneXJ5cmNmdmloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NzUxMjEsImV4cCI6MjA5MzI1MTEyMX0.H38xf3yR51MxzYxAT0M2n649Dp3l-OwJAJeUUTXW7hA'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── VETERINÁRIOS ──────────────────────────────────────────────────────────────
const veterinarios = [
  { nome: 'Dr. Ricardo Alves',    crmv: 'DF 4.823',  especialidades: ['Clínica Geral','Cirurgia','Emergência'],          cidade: 'Brasília',      estado: 'DF', avaliacao: 4.9, total_consultas: 312, online: true,  preco_consulta: 80,  bio: 'Especialista em clínica bovina com 12 anos de experiência no Cerrado. Atende gado de corte e leite.',              whatsapp: '61991110001' },
  { nome: 'Dra. Fernanda Costa',  crmv: 'GO 7.441',  especialidades: ['Reprodução','Fertilidade','Genética Bovina'],     cidade: 'Goiânia',       estado: 'GO', avaliacao: 4.8, total_consultas: 189, online: false, preco_consulta: 95,  bio: 'Médica veterinária especializada em reprodução bovina, IATF e transferência de embriões.',                         whatsapp: '62991110002' },
  { nome: 'Dr. Marcos Vieira',    crmv: 'MG 12.304', especialidades: ['Nutrição','Ruminantes','Produção Leiteira'],      cidade: 'Uberlândia',    estado: 'MG', avaliacao: 5.0, total_consultas: 403, online: true,  preco_consulta: 110, bio: 'Doutor em nutrição de ruminantes. Consultor de fazendas leiteiras em todo o Brasil.',                              whatsapp: '34991110003' },
  { nome: 'Dra. Ana Paula Ramos', crmv: 'MT 9.117',  especialidades: ['Sanidade Animal','Biosseguridade','Aftosa'],      cidade: 'Cuiabá',        estado: 'MT', avaliacao: 4.9, total_consultas: 256, online: true,  preco_consulta: 90,  bio: 'Especialista em sanidade bovina e programas de biosseguridade para fazendas certificadas.',                        whatsapp: '65991110004' },
  { nome: 'Dr. Leandro Borges',   crmv: 'MS 5.388',  especialidades: ['Ortopedia Bovina','Cascos','Claudicação'],        cidade: 'Campo Grande',  estado: 'MS', avaliacao: 4.7, total_consultas: 134, online: false, preco_consulta: 120, bio: 'Referência em ortopedia e podologia bovina no Centro-Oeste. Tratamentos para claudicação e doenças de casco.',     whatsapp: '67991110005' },
  { nome: 'Dra. Carla Mendes',    crmv: 'SP 18.762', especialidades: ['Clínica Geral','Neonatologia','Bezerros'],        cidade: 'Ribeirão Preto', estado: 'SP', avaliacao: 4.8, total_consultas: 298, online: true,  preco_consulta: 85,  bio: 'Especialista em cuidados com bezerros e neonatologia bovina. Atende fazendas leiteiras e de cria.',                whatsapp: '16991110006' },
  { nome: 'Dr. Roberto Pinheiro', crmv: 'GO 11.203', especialidades: ['Reprodução','IATF','Transferência de Embriões'],  cidade: 'Goiânia',       estado: 'GO', avaliacao: 4.9, total_consultas: 374, online: true,  preco_consulta: 130, bio: 'Especialista em biotécnicas reprodutivas — IATF, TE e FIV. Mais de 15 anos de mercado.',                            whatsapp: '62991110007' },
  { nome: 'Dra. Juliana Freitas', crmv: 'BA 6.514',  especialidades: ['Nutrição','Suplementação Mineral','Confinamento'], cidade: 'Salvador',      estado: 'BA', avaliacao: 4.6, total_consultas:  87, online: false, preco_consulta: 75,  bio: 'Consultora em nutrição mineral para bovinos de corte. Especialista em formulação de suplementos à pasto.',           whatsapp: '71991110008' },
  { nome: 'Dr. Fábio Magalhães',  crmv: 'PR 14.091', especialidades: ['Doenças Infecciosas','Vacinologia','Tuberculose'], cidade: 'Londrina',      estado: 'PR', avaliacao: 4.8, total_consultas: 221, online: true,  preco_consulta: 100, bio: 'Especialista em doenças infecciosas bovinas. Consultor de programas de vacinação e controle de tuberculose.',       whatsapp: '43991110009' },
  { nome: 'Dra. Patricia Nunes',  crmv: 'RS 8.932',  especialidades: ['Clínica Geral','Bem-estar Animal','Auditoria'],   cidade: 'Porto Alegre',  estado: 'RS', avaliacao: 4.7, total_consultas: 165, online: false, preco_consulta: 95,  bio: 'Médica veterinária especializada em bem-estar animal e auditoria rural. Certificação para exportação.',              whatsapp: '51991110010' },
]

// ── MOTORISTAS ────────────────────────────────────────────────────────────────
const motoristas = [
  { nome: 'João Batista',          caminhao: 'Scania R450',         placa: 'ABC1D23', capacidade: 24, cidade: 'Planaltina',  estado: 'DF', avaliacao: 4.9, total_viagens: 312, online: true,  raio_atuacao_km: 300, preco_por_cabeca: 28, whatsapp: '61992220001' },
  { nome: 'Carlos Mendonça',       caminhao: 'Volvo FH 460',         placa: 'DEF4G56', capacidade: 18, cidade: 'Sobradinho',  estado: 'DF', avaliacao: 4.7, total_viagens: 187, online: true,  raio_atuacao_km: 250, preco_por_cabeca: 25, whatsapp: '61992220002' },
  { nome: 'Antônio Silva',         caminhao: 'Mercedes Actros 2651', placa: 'GHI7J89', capacidade: 30, cidade: 'Luziânia',    estado: 'GO', avaliacao: 4.5, total_viagens:  94, online: false, raio_atuacao_km: 400, preco_por_cabeca: 22, whatsapp: '61992220003' },
  { nome: 'Sebastião Rocha',       caminhao: 'Scania G450',          placa: 'JKL0M12', capacidade: 26, cidade: 'Alexânia',    estado: 'GO', avaliacao: 4.8, total_viagens: 241, online: true,  raio_atuacao_km: 350, preco_por_cabeca: 27, whatsapp: '62992220004' },
  { nome: 'Paulo Henrique Lima',   caminhao: 'Volvo FH 500',         placa: 'NOP3Q45', capacidade: 20, cidade: 'Goiânia',     estado: 'GO', avaliacao: 4.6, total_viagens: 156, online: true,  raio_atuacao_km: 500, preco_por_cabeca: 24, whatsapp: '62992220005' },
  { nome: 'Raimundo Ferreira',     caminhao: 'Ford Cargo 2429',      placa: 'RST6U78', capacidade: 16, cidade: 'Anápolis',    estado: 'GO', avaliacao: 4.4, total_viagens:  73, online: false, raio_atuacao_km: 200, preco_por_cabeca: 20, whatsapp: '62992220006' },
  { nome: 'Marcos Aurélio Costa',  caminhao: 'Scania R500',          placa: 'VWX9Y01', capacidade: 32, cidade: 'Formosa',     estado: 'GO', avaliacao: 5.0, total_viagens: 489, online: true,  raio_atuacao_km: 600, preco_por_cabeca: 30, whatsapp: '61992220007' },
  { nome: 'Edilson Nóbrega',       caminhao: 'MAN TGX 29.480',       placa: 'ZAB2C34', capacidade: 22, cidade: 'Cuiabá',      estado: 'MT', avaliacao: 4.7, total_viagens: 118, online: false, raio_atuacao_km: 800, preco_por_cabeca: 23, whatsapp: '65992220008' },
]

// ── LOJAS ─────────────────────────────────────────────────────────────────────
const lojas = [
  { nome: 'Tortuga — Nutrição Animal',  tipo: 'fabricante', endereco: 'Distribuição nacional',  cidade: 'São Paulo',      estado: 'SP', whatsapp: '11940010001', premium: true,  categorias: ['Nutrição','Minerais','Suplementos','Premix'],       descricao: 'Líder nacional em suplementação mineral bovina. Linha Fosbovi e Proteinados para todas as fases.' },
  { nome: 'Ourofino Agronegócio',       tipo: 'fabricante', endereco: 'Distribuição nacional',  cidade: 'São Paulo',      estado: 'SP', whatsapp: '17940010002', premium: true,  categorias: ['Vacinas','Antiparasitários','Antibióticos'],         descricao: 'Multinacional líder em saúde animal. Portfólio completo de vacinas, vermífugos e antibióticos bovinos.' },
  { nome: 'Vaccinar — Saúde Animal',    tipo: 'fabricante', endereco: 'Distribuição nacional',  cidade: 'Belo Horizonte', estado: 'MG', whatsapp: '31940010003', premium: false, categorias: ['Vacinas','Biológicos'],                              descricao: 'Fabricante especializado em vacinas para bovinos: aftosa, brucelose, raiva e clostridioses.' },
  { nome: 'Agropecuária Planaltina',    tipo: 'revenda',    endereco: 'Rodovia DF-128, km 3',   cidade: 'Planaltina',     estado: 'DF', whatsapp: '61988880001', premium: false, categorias: ['Medicamentos','Nutrição','Insumos','Equipamentos'], descricao: 'Revenda completa de insumos agropecuários com 20 anos de experiência no DF e entorno.' },
  { nome: 'Campo & Pasto Agro',         tipo: 'revenda',    endereco: 'Av. Principal, 450',     cidade: 'Sobradinho',     estado: 'DF', whatsapp: '61988880002', premium: false, categorias: ['Medicamentos','Nutrição','Sementes'],                descricao: 'Especializada em sementes forrageiras, suplementos minerais e medicamentos veterinários.' },
  { nome: 'VetCenter Brasília',         tipo: 'revenda',    endereco: 'QS 3, Rua 300, lj 12',   cidade: 'Taguatinga',     estado: 'DF', whatsapp: '61988880003', premium: false, categorias: ['Medicamentos','Genética','Reprodução'],              descricao: 'Centro especializado em produtos para reprodução bovina e genética animal. Sêmen de touros provados.' },
  { nome: 'Agro Gama — Comércio Rural', tipo: 'revenda',    endereco: 'Av. Central, 1200',      cidade: 'Gama',           estado: 'DF', whatsapp: '61988880004', premium: false, categorias: ['Medicamentos','Nutrição','Ferramentas'],             descricao: 'Revenda com foco em ferramentas de manejo, currais e produtos veterinários de uso comum.' },
  { nome: 'Pecuária Total — Goianésia', tipo: 'revenda',    endereco: 'Av. Brasil, 700',        cidade: 'Goianésia',      estado: 'GO', whatsapp: '62988880005', premium: false, categorias: ['Medicamentos','Nutrição','Máquinas'],                descricao: 'Atacado rural com balança eletrônica, cochos metálicos, máquinas e insumos para grandes propriedades.' },
  { nome: 'Agropecuária Central GO',    tipo: 'revenda',    endereco: 'Rod. BR-153, km 142',    cidade: 'Anápolis',       estado: 'GO', whatsapp: '62988880006', premium: false, categorias: ['Medicamentos','Insumos','Sementes'],                 descricao: 'Distribuidor oficial de grandes marcas no interior de Goiás. Atende produtores rurais de toda a região.' },
  { nome: 'InsumosBov — Atacado Rural', tipo: 'revenda',    endereco: 'Av. Brasília, 950',      cidade: 'Luziânia',       estado: 'GO', whatsapp: '61988880007', premium: false, categorias: ['Nutrição','Minerais','Cochos'],                      descricao: 'Atacado de suplementos minerais e cochos plásticos e metálicos para bovinos. Preços de distribuidor.' },
]

// ── SUPLEMENTOS ───────────────────────────────────────────────────────────────
const suplementos = [
  { nome: 'Fosbovi 30 — Corte',     marca: 'Tortuga',  categoria: 'mineral',    embalagem: 'Saco', peso_kg: 30, preco: 89,  descricao: 'Suplemento mineral-proteico-energético para bovinos de corte em pastejo extensivo. Fórmula para baixa estação.',       indicacao: 'Bovinos de corte em pastagem no período seco. Fornecimento à vontade, médio consumo 30g/cab/dia.' },
  { nome: 'Fosbovi 72 — Recria',    marca: 'Tortuga',  categoria: 'proteinado', embalagem: 'Saco', peso_kg: 30, preco: 112, descricao: 'Alta concentração de fósforo e proteínas para recria intensiva. Indicado para novilhas e novilhos em crescimento.',     indicacao: 'Novilhas de reposição e novilhos em recria. Consumo: 50-80g/cab/dia.' },
  { nome: 'Total Ureia Premium',    marca: 'BoiSaúde', categoria: 'proteinado', embalagem: 'Saco', peso_kg: 25, preco: 98,  descricao: 'Suplemento proteico-energético com ureia de liberação lenta. Para bovinos em pastagem no período de seca.',           indicacao: 'Bovinos adultos em pastagem degradada ou baixa qualidade. Consumo controlado: até 150g/cab/dia.' },
  { nome: 'Sal Branco Iodado',      marca: 'Marinho',  categoria: 'mineral',    embalagem: 'Saco', peso_kg: 25, preco: 28,  descricao: 'Sal comum iodado para bovinos. Fornecimento à vontade como base mineral mínima para o rebanho.',                       indicacao: 'Todo o rebanho. Fornecimento à vontade em cochos cobertos. Consumo médio: 10-15g/cab/dia.' },
  { nome: 'Premix Bovinos Engorda', marca: 'Nutron',   categoria: 'premix',     embalagem: 'Saco', peso_kg: 30, preco: 134, descricao: 'Premix vitamínico-mineral completo para confinamento. Inclui monensina sódica para eficiência alimentar e ionóforo.',  indicacao: 'Bovinos em confinamento. Misturar na ração conforme formulação do nutricionista. 1-1,5% da MS.' },
  { nome: 'Núcleo Leiteiro 20%',   marca: 'Vaccinar', categoria: 'energetico', embalagem: 'Saco', peso_kg: 25, preco: 157, descricao: 'Núcleo proteico-energético para vacas em lactação de alta produção. Vitaminas A, D, E e minerais quelatos.',          indicacao: 'Vacas em lactação acima de 20L/dia. Misturar com silagem e volumoso. 2-3kg/cab/dia.' },
]

async function seed() {
  let hasErrors = false

  // ── Veterinários ────────────────────────────────────────────────────────────
  console.log('\n[1/4] Inserindo veterinários...')
  const { data: vets, error: vetError } = await supabase
    .from('veterinarios')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // delete all

  const { error: vetInsertError } = await supabase
    .from('veterinarios')
    .insert(veterinarios)

  if (vetInsertError) {
    console.error('  ERRO veterinários:', vetInsertError.message)
    hasErrors = true
  } else {
    console.log(`  OK — ${veterinarios.length} veterinários inseridos`)
  }

  // ── Motoristas ──────────────────────────────────────────────────────────────
  console.log('\n[2/4] Inserindo motoristas...')
  await supabase.from('motoristas').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const { error: motorInsertError } = await supabase
    .from('motoristas')
    .insert(motoristas)

  if (motorInsertError) {
    console.error('  ERRO motoristas:', motorInsertError.message)
    hasErrors = true
  } else {
    console.log(`  OK — ${motoristas.length} motoristas inseridos`)
  }

  // ── Lojas ───────────────────────────────────────────────────────────────────
  console.log('\n[3/4] Inserindo lojas...')
  await supabase.from('lojas').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const { data: lojasData, error: lojaInsertError } = await supabase
    .from('lojas')
    .insert(lojas)
    .select('id, nome')

  if (lojaInsertError) {
    console.error('  ERRO lojas:', lojaInsertError.message)
    hasErrors = true
  } else {
    console.log(`  OK — ${lojas.length} lojas inseridas`)
  }

  // ── Suplementos ─────────────────────────────────────────────────────────────
  console.log('\n[4/4] Inserindo suplementos...')
  await supabase.from('suplementos').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const { error: suplInsertError } = await supabase
    .from('suplementos')
    .insert(suplementos)

  if (suplInsertError) {
    console.error('  ERRO suplementos:', suplInsertError.message)
    hasErrors = true
  } else {
    console.log(`  OK — ${suplementos.length} suplementos inseridos`)
  }

  // ── Produtos de saúde (com loja_id real) ───────────────────────────────────
  if (lojasData && lojasData.length > 0) {
    console.log('\n[+] Inserindo produtos de saúde...')

    const planaltina = lojasData.find(l => l.nome.includes('Planaltina'))?.id
    const vetcenter  = lojasData.find(l => l.nome.includes('VetCenter'))?.id
    const campoPasto = lojasData.find(l => l.nome.includes('Campo'))?.id

    if (planaltina && vetcenter && campoPasto) {
      await supabase.from('produtos_saude').delete().neq('id', '00000000-0000-0000-0000-000000000000')

      const produtos = [
        { nome: 'Poli-Star — MSD',         tipo: 'vacina',  marca: 'MSD',     dose_formula: 'FIXA:2|SC', via: 'SC', preco: 68,  estoque: 'ok',  loja_id: planaltina },
        { nome: 'Bovilis Poli-Star T',      tipo: 'vacina',  marca: 'MSD',     dose_formula: 'FIXA:2|SC', via: 'SC', preco: 145, estoque: 'ok',  loja_id: vetcenter  },
        { nome: 'StarVac — Labovet',        tipo: 'vacina',  marca: 'Labovet', dose_formula: 'FIXA:2|SC', via: 'SC', preco: 72,  estoque: 'ok',  loja_id: campoPasto },
        { nome: 'Carbun-Vet Polivalente',   tipo: 'vacina',  marca: 'Vaccinar',dose_formula: 'FIXA:5|SC', via: 'SC', preco: 44,  estoque: 'ok',  loja_id: planaltina },
        { nome: 'Anavac B-19',              tipo: 'vacina',  marca: 'Vaccinar',dose_formula: 'FIXA:2|SC', via: 'SC', preco: 89,  estoque: 'ok',  loja_id: vetcenter  },
        { nome: 'Aftomune Polivalente',     tipo: 'vacina',  marca: 'Ourofino',dose_formula: 'FIXA:2|SC', via: 'SC', preco: 127, estoque: 'ok',  loja_id: campoPasto },
        { nome: 'Raivac',                   tipo: 'vacina',  marca: 'Vaccinar',dose_formula: 'FIXA:2|IM', via: 'IM', preco: 96,  estoque: 'low', loja_id: planaltina },
        { nome: 'Spirovac',                 tipo: 'vacina',  marca: 'Zoetis',  dose_formula: 'FIXA:5|SC', via: 'SC', preco: 84,  estoque: 'ok',  loja_id: vetcenter  },
        { nome: 'Ivermectina 1% Injetável', tipo: 'anti',    marca: 'Ourofino',dose_formula: 'PESO:1|50|SC', via: 'SC', preco: 48, estoque: 'ok', loja_id: planaltina },
        { nome: 'Dectomax Injetável',       tipo: 'anti',    marca: 'Zoetis',  dose_formula: 'PESO:1|33|SC', via: 'SC', preco: 186, estoque: 'ok', loja_id: vetcenter },
        { nome: 'Oxitetraciclina LA 20%',   tipo: 'antibio', marca: 'Agener',  dose_formula: 'PESO:1|10|IM', via: 'IM', preco: 62, estoque: 'ok', loja_id: planaltina },
        { nome: 'Vitamina ADE Injetável',   tipo: 'vit',     marca: 'Vetnil',  dose_formula: 'PESO:1|10|IM', via: 'IM', preco: 34, estoque: 'ok', loja_id: campoPasto },
      ]

      const { error: prodError } = await supabase.from('produtos_saude').insert(produtos)

      if (prodError) {
        console.error('  ERRO produtos_saude:', prodError.message)
        hasErrors = true
      } else {
        console.log(`  OK — ${produtos.length} produtos de saúde inseridos`)
      }
    } else {
      console.warn('  AVISO: IDs de lojas não encontrados para produtos de saúde. Pulando...')
    }
  }

  console.log('\n' + (hasErrors ? '⚠️  Seed concluído com erros.' : '✅  Seed concluído com sucesso!'))
  if (hasErrors) {
    console.log('\nSe houve erros de "new row violates row-level security policy",')
    console.log('o Supabase está bloqueando inserts com a anon key.')
    console.log('Solução: execute o seed.sql diretamente no SQL Editor do Supabase:')
    console.log('https://supabase.com/dashboard/project/yfnvfzjftrgyryrcfvih/sql/new')
  }
}

seed().catch(console.error)
