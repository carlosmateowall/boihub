-- BoiHub — Seed Data Rico (compatível com Next.js + novo schema)
-- Execute no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/yfnvfzjftrgyryrcfvih/sql/new
--
-- ATENÇÃO: este script usa TRUNCATE + INSERT.
-- Rode apenas uma vez para popular o banco.

-- ──────────────────────────────────────────────────────────
-- VETERINÁRIOS (10 profissionais)
-- ──────────────────────────────────────────────────────────
TRUNCATE TABLE veterinarios RESTART IDENTITY CASCADE;

INSERT INTO veterinarios (nome, crmv, especialidades, cidade, estado, avaliacao, total_consultas, online, preco_consulta, bio, whatsapp) VALUES
  ('Dr. Ricardo Alves',     'DF 4.823',  ARRAY['Clínica Geral','Cirurgia','Emergência'],         'Brasília',   'DF', 4.9, 312, true,  80,  'Especialista em clínica bovina com 12 anos de experiência no Cerrado. Atende gado de corte e leite.',              '61991110001'),
  ('Dra. Fernanda Costa',   'GO 7.441',  ARRAY['Reprodução','Fertilidade','Genética Bovina'],    'Goiânia',    'GO', 4.8, 189, false, 95,  'Médica veterinária especializada em reprodução bovina, IATF e transferência de embriões.',                         '62991110002'),
  ('Dr. Marcos Vieira',     'MG 12.304', ARRAY['Nutrição','Ruminantes','Produção Leiteira'],     'Uberlândia', 'MG', 5.0, 403, true,  110, 'Doutor em nutrição de ruminantes. Consultor de fazendas leiteiras em todo o Brasil.',                              '34991110003'),
  ('Dra. Ana Paula Ramos',  'MT 9.117',  ARRAY['Sanidade Animal','Biosseguridade','Aftosa'],     'Cuiabá',     'MT', 4.9, 256, true,  90,  'Especialista em sanidade bovina e programas de biosseguridade para fazendas certificadas.',                        '65991110004'),
  ('Dr. Leandro Borges',    'MS 5.388',  ARRAY['Ortopedia Bovina','Cascos','Claudicação'],       'Campo Grande','MS', 4.7, 134, false, 120, 'Referência em ortopedia e podologia bovina no Centro-Oeste. Tratamentos para claudicação e doenças de casco.',     '67991110005'),
  ('Dra. Carla Mendes',     'SP 18.762', ARRAY['Clínica Geral','Neonatologia','Bezerros'],      'Ribeirão Preto','SP',4.8, 298, true,  85,  'Especialista em cuidados com bezerros e neonatologia bovina. Atende fazendas leiteiras e de cria.',                '16991110006'),
  ('Dr. Roberto Pinheiro',  'GO 11.203', ARRAY['Reprodução','IATF','Transferência de Embriões'],'Goiânia',    'GO', 4.9, 374, true,  130, 'Especialista em biotécnicas reprodutivas — IATF, TE e FIV. Mais de 15 anos de mercado.',                            '62991110007'),
  ('Dra. Juliana Freitas',  'BA 6.514',  ARRAY['Nutrição','Suplementação Mineral','Confinamento'],'Salvador',  'BA', 4.6,  87, false, 75,  'Consultora em nutrição mineral para bovinos de corte. Especialista em formulação de suplementos à pasto.',           '71991110008'),
  ('Dr. Fábio Magalhães',   'PR 14.091', ARRAY['Doenças Infecciosas','Vacinologia','Tuberculose'],'Londrina',  'PR', 4.8, 221, true,  100, 'Especialista em doenças infecciosas bovinas. Consultor de programas de vacinação e controle de tuberculose.',       '43991110009'),
  ('Dra. Patricia Nunes',   'RS 8.932',  ARRAY['Clínica Geral','Bem-estar Animal','Auditoria'], 'Porto Alegre','RS', 4.7, 165, false, 95,  'Médica veterinária especializada em bem-estar animal e auditoria rural. Certificação para exportação.',              '51991110010');


-- ──────────────────────────────────────────────────────────
-- MOTORISTAS (8 profissionais)
-- ──────────────────────────────────────────────────────────
TRUNCATE TABLE motoristas RESTART IDENTITY CASCADE;
 
INSERT INTO motoristas (nome, caminhao, placa, capacidade, cidade, estado, avaliacao, total_viagens, online, raio_atuacao_km, preco_por_cabeca, whatsapp) VALUES
  ('João Batista',         'Scania R450',          'ABC1D23', 24, 'Planaltina',   'DF', 4.9, 312, true,  300, 28, '61992220001'),
  ('Carlos Mendonça',      'Volvo FH 460',          'DEF4G56', 18, 'Sobradinho',   'DF', 4.7, 187, true,  250, 25, '61992220002'),
  ('Antônio Silva',        'Mercedes Actros 2651',  'GHI7J89', 30, 'Luziânia',     'GO', 4.5,  94, false, 400, 22, '61992220003'),
  ('Sebastião Rocha',      'Scania G450',           'JKL0M12', 26, 'Alexânia',     'GO', 4.8, 241, true,  350, 27, '62992220004'),
  ('Paulo Henrique Lima',  'Volvo FH 500',          'NOP3Q45', 20, 'Goiânia',      'GO', 4.6, 156, true,  500, 24, '62992220005'),
  ('Raimundo Ferreira',    'Ford Cargo 2429',       'RST6U78', 16, 'Anápolis',     'GO', 4.4,  73, false, 200, 20, '62992220006'),
  ('Marcos Aurélio Costa', 'Scania R500',           'VWX9Y01', 32, 'Formosa',      'GO', 5.0, 489, true,  600, 30, '61992220007'),
  ('Edilson Nóbrega',      'MAN TGX 29.480',        'ZAB2C34', 22, 'Cuiabá',       'MT', 4.7, 118, false, 800, 23, '65992220008');

-- ──────────────────────────────────────────────────────────
-- LOJAS (10 estabelecimentos)
-- ──────────────────────────────────────────────────────────
TRUNCATE TABLE lojas RESTART IDENTITY CASCADE;

INSERT INTO lojas (nome, tipo, endereco, cidade, estado, whatsapp, premium, categorias, descricao) VALUES
  ('Tortuga — Nutrição Animal',    'fabricante', 'Distribuição nacional',        'São Paulo',      'SP', '11940010001', true,  ARRAY['Nutrição','Minerais','Suplementos','Premix'],         'Líder nacional em suplementação mineral bovina. Linha Fosbovi e Proteinados para todas as fases.'),
  ('Ourofino Agronegócio',         'fabricante', 'Distribuição nacional',        'São Paulo',      'SP', '17940010002', true,  ARRAY['Vacinas','Antiparasitários','Antibióticos'],           'Multinacional líder em saúde animal. Portfólio completo de vacinas, vermífugos e antibióticos bovinos.'),
  ('Vaccinar — Saúde Animal',      'fabricante', 'Distribuição nacional',        'Belo Horizonte', 'MG', '31940010003', false, ARRAY['Vacinas','Biológicos'],                                'Fabricante especializado em vacinas para bovinos: aftosa, brucelose, raiva e clostridioses.'),
  ('Agropecuária Planaltina',      'revenda',    'Rodovia DF-128, km 3',         'Planaltina',     'DF', '61988880001', false, ARRAY['Medicamentos','Nutrição','Insumos','Equipamentos'],    'Revenda completa de insumos agropecuários com 20 anos de experiência no DF e entorno.'),
  ('Campo & Pasto Agro',           'revenda',    'Av. Principal, 450',           'Sobradinho',     'DF', '61988880002', false, ARRAY['Medicamentos','Nutrição','Sementes'],                  'Especializada em sementes forrageiras, suplementos minerais e medicamentos veterinários.'),
  ('VetCenter Brasília',           'revenda',    'QS 3, Rua 300, lj 12',         'Taguatinga',     'DF', '61988880003', false, ARRAY['Medicamentos','Genética','Reprodução'],                'Centro especializado em produtos para reprodução bovina e genética animal. Sêmen de touros provados.'),
  ('Agro Gama — Comércio Rural',   'revenda',    'Av. Central, 1200',            'Gama',           'DF', '61988880004', false, ARRAY['Medicamentos','Nutrição','Ferramentas'],               'Revenda com foco em ferramentas de manejo, currais e produtos veterinários de uso comum.'),
  ('Pecuária Total — Goianésia',   'revenda',    'Av. Brasil, 700',              'Goianésia',      'GO', '62988880005', false, ARRAY['Medicamentos','Nutrição','Máquinas'],                  'Atacado rural com balança eletrônica, cochos metálicos, máquinas e insumos para grandes propriedades.'),
  ('Agropecuária Central GO',      'revenda',    'Rod. BR-153, km 142',          'Anápolis',       'GO', '62988880006', false, ARRAY['Medicamentos','Insumos','Sementes'],                   'Distribuidor oficial de grandes marcas no interior de Goiás. Atende produtores rurais de toda a região.'),
  ('InsumosBov — Atacado Rural',   'revenda',    'Av. Brasília, 950',            'Luziânia',       'GO', '61988880007', false, ARRAY['Nutrição','Minerais','Cochos'],                        'Atacado de suplementos minerais e cochos plásticos e metálicos para bovinos. Preços de distribuidor.');

-- ──────────────────────────────────────────────────────────
-- SUPLEMENTOS (6 produtos)
-- ──────────────────────────────────────────────────────────
TRUNCATE TABLE suplementos RESTART IDENTITY CASCADE;

INSERT INTO suplementos (nome, marca, categoria, embalagem, peso_kg, preco, descricao, indicacao) VALUES
  ('Fosbovi 30 — Corte',        'Tortuga',  'mineral',    'Saco',  30,  89,  'Suplemento mineral-proteico-energético para bovinos de corte em pastejo extensivo. Fórmula para baixa estação.',        'Bovinos de corte em pastagem no período seco. Fornecimento à vontade, médio consumo 30g/cab/dia.'),
  ('Fosbovi 72 — Recria',       'Tortuga',  'proteinado', 'Saco',  30, 112,  'Alta concentração de fósforo e proteínas para recria intensiva. Indicado para novilhas e novilhos em crescimento.',      'Novilhas de reposição e novilhos em recria. Consumo: 50-80g/cab/dia.'),
  ('Total Ureia Premium',       'BoiSaúde', 'proteinado', 'Saco',  25,  98,  'Suplemento proteico-energético com ureia de liberação lenta. Para bovinos em pastagem no período de seca.',            'Bovinos adultos em pastagem degradada ou baixa qualidade. Consumo controlado: até 150g/cab/dia.'),
  ('Sal Branco Iodado',         'Marinho',  'mineral',    'Saco',  25,  28,  'Sal comum iodado para bovinos. Fornecimento à vontade como base mineral mínima para o rebanho.',                        'Todo o rebanho. Fornecimento à vontade em cochos cobertos. Consumo médio: 10-15g/cab/dia.'),
  ('Premix Bovinos Engorda',    'Nutron',   'premix',     'Saco',  30, 134,  'Premix vitamínico-mineral completo para confinamento. Inclui monensina sódica para eficiência alimentar e ionóforo.',   'Bovinos em confinamento. Misturar na ração conforme formulação do nutricionista. 1-1,5% da MS.'),
  ('Núcleo Leiteiro 20%',       'Vaccinar', 'energetico', 'Saco',  25, 157,  'Núcleo proteico-energético para vacas em lactação de alta produção. Vitaminas A, D, E e minerais quelatos.',           'Vacas em lactação acima de 20L/dia. Misturar com silagem e volumoso. 2-3kg/cab/dia.');

-- ──────────────────────────────────────────────────────────
-- PRODUTOS DE SAÚDE ANIMAL (12 produtos)
-- (requer loja_id — rode APÓS inserir lojas e obter os IDs)
-- Para obter IDs: SELECT id, nome FROM lojas ORDER BY nome;
-- Substitua {LOJA_ID_PLANALTINA}, {LOJA_ID_VETCENTER}, {LOJA_ID_CAMPO_PASTO}
-- pelos UUIDs reais retornados acima.
-- ──────────────────────────────────────────────────────────

-- Exemplo (descomentar após substituir os IDs reais):
-- INSERT INTO produtos_saude (nome, tipo, marca, dose_formula, via, preco, estoque, loja_id) VALUES
--   ('Poli-Star — MSD',        'vacina', 'MSD',          'FIXA:2|SC',          'SC', 68,  'ok',  '{LOJA_ID_PLANALTINA}'),
--   ('Bovilis Poli-Star T',    'vacina', 'MSD',          'FIXA:2|SC',          'SC', 145, 'ok',  '{LOJA_ID_VETCENTER}'),
--   ('StarVac — Labovet',      'vacina', 'Labovet',      'FIXA:2|SC',          'SC', 72,  'ok',  '{LOJA_ID_CAMPO_PASTO}'),
--   ('Carbun-Vet Polivalente', 'vacina', 'Vaccinar',     'FIXA:5|SC',          'SC', 44,  'ok',  '{LOJA_ID_PLANALTINA}'),
--   ('Anavac B-19',            'vacina', 'Vaccinar',     'FIXA:2|SC',          'SC', 89,  'ok',  '{LOJA_ID_VETCENTER}'),
--   ('Aftomune Polivalente',   'vacina', 'Ourofino',     'FIXA:2|SC',          'SC', 127, 'ok',  '{LOJA_ID_CAMPO_PASTO}'),
--   ('Raivac',                 'vacina', 'Vaccinar',     'FIXA:2|IM',          'IM', 96,  'low', '{LOJA_ID_PLANALTINA}'),
--   ('Spirovac',               'vacina', 'Zoetis',       'FIXA:5|SC',          'SC', 84,  'ok',  '{LOJA_ID_VETCENTER}'),
--   ('Ivermectina 1% Injetável','anti',  'Ourofino',     'PESO:1|50|SC',       'SC', 48,  'ok',  '{LOJA_ID_PLANALTINA}'),
--   ('Dectomax Injetável',     'anti',   'Zoetis',       'PESO:1|33|SC',       'SC', 186, 'ok',  '{LOJA_ID_VETCENTER}'),
--   ('Oxitetraciclina LA 20%', 'antibio','Agener',       'PESO:1|10|IM',       'IM', 62,  'ok',  '{LOJA_ID_PLANALTINA}'),
--   ('Vitamina ADE Injetável', 'vit',    'Vetnil',       'PESO:1|10|IM',       'IM', 34,  'ok',  '{LOJA_ID_CAMPO_PASTO}');
