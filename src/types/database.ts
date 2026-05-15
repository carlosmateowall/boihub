export type PerfilTipo = 'produtor' | 'veterinario' | 'revenda' | 'fabricante' | 'motorista'
export type LojaTipo = 'revenda' | 'fabricante'
export type ProdutoTipo = 'vacina' | 'anti' | 'antibio' | 'vit'
export type SuplementoCategoria = 'mineral' | 'suplemento' | 'proteinado' | 'energetico' | 'premix'
export type GadoTipo = 'corte' | 'leite' | 'bezerro' | 'touro'
export type FreteStatus = 'pendente' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado'
export type ConsultaStatus = 'agendada' | 'em_andamento' | 'concluida' | 'cancelada'
export type EstoqueStatus = 'ok' | 'low' | 'out'

export interface Profile {
  id: string
  nome: string
  perfil: PerfilTipo
  fazenda: string | null
  cidade: string | null
  estado: string
  cabecas: number
  hectares: number
  fretes_count: number
  avaliacao: number
  whatsapp: string | null
  foto_url: string | null
  onboarding_completo: boolean
  created_at: string
  updated_at: string
}

export interface Veterinario {
  id: string
  user_id: string | null
  nome: string
  crmv: string
  especialidades: string[] | null
  cidade: string | null
  estado: string
  avaliacao: number
  total_consultas: number
  online: boolean
  preco_consulta: number | null
  bio: string | null
  foto_url: string | null
  whatsapp: string | null
  created_at: string
  updated_at: string
}

export interface Motorista {
  id: string
  user_id: string | null
  nome: string
  caminhao: string | null
  placa: string | null
  capacidade: number | null
  cidade: string | null
  estado: string
  avaliacao: number
  total_viagens: number
  online: boolean
  raio_atuacao_km: number
  preco_por_cabeca: number | null
  preco_por_km: number | null
  foto_url: string | null
  whatsapp: string | null
  created_at: string
  updated_at: string
}

export interface Loja {
  id: string
  user_id: string | null
  nome: string
  tipo: LojaTipo
  endereco: string | null
  cidade: string | null
  estado: string
  latitude: number | null
  longitude: number | null
  whatsapp: string | null
  telefone: string | null
  email: string | null
  premium: boolean
  categorias: string[] | null
  descricao: string | null
  logo_url: string | null
  horario_funcionamento: string | null
  created_at: string
  updated_at: string
}

export interface ProdutoSaude {
  id: string
  nome: string
  tipo: ProdutoTipo
  marca: string | null
  descricao: string | null
  via: string | null
  dose_formula: string
  indicacao: string | null
  carencia_dias: number
  preco: number
  preco_unidade: string
  loja_id: string | null
  estoque: EstoqueStatus
  foto_url: string | null
  created_at: string
  updated_at: string
  lojas?: { nome: string; cidade: string | null } | null
}

export interface Suplemento {
  id: string
  nome: string
  marca: string | null
  categoria: SuplementoCategoria
  embalagem: string | null
  peso_kg: number | null
  descricao: string | null
  indicacao: string | null
  preco: number | null
  loja_id: string | null
  foto_url: string | null
  created_at: string
  updated_at: string
}

export interface Frete {
  id: string
  produtor_id: string
  motorista_id: string | null
  origem: string
  destino: string
  cabecas: number
  tipo_gado: GadoTipo
  peso_medio_kg: number | null
  data_embarque: string
  horario: string | null
  distancia_km: number | null
  preco_total: number | null
  observacoes: string | null
  status: FreteStatus
  avaliacao_produtor: number | null
  avaliacao_motorista: number | null
  created_at: string
  updated_at: string
  motoristas?: { nome: string; caminhao: string | null; avaliacao: number; whatsapp: string | null } | null
}

export interface ConsultaVet {
  id: string
  produtor_id: string
  veterinario_id: string
  tipo: string
  motivo: string | null
  data_consulta: string | null
  duracao_min: number | null
  preco: number | null
  status: ConsultaStatus
  anotacoes: string | null
  receita: string | null
  avaliacao: number | null
  created_at: string
  updated_at: string
  veterinarios?: { nome: string; crmv: string; especialidades: string[] | null } | null
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      veterinarios: {
        Row: Veterinario
        Insert: Omit<Veterinario, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Veterinario, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      motoristas: {
        Row: Motorista
        Insert: Omit<Motorista, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Motorista, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      lojas: {
        Row: Loja
        Insert: Omit<Loja, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Loja, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      produtos_saude: {
        Row: Omit<ProdutoSaude, 'lojas'>
        Insert: Omit<ProdutoSaude, 'id' | 'created_at' | 'updated_at' | 'lojas'>
        Update: Partial<Omit<ProdutoSaude, 'id' | 'created_at' | 'updated_at' | 'lojas'>>
        Relationships: []
      }
      suplementos: {
        Row: Suplemento
        Insert: Omit<Suplemento, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Suplemento, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      fretes: {
        Row: Omit<Frete, 'motoristas'>
        Insert: Omit<Frete, 'id' | 'created_at' | 'updated_at' | 'motoristas'>
        Update: Partial<Omit<Frete, 'id' | 'created_at' | 'updated_at' | 'motoristas'>>
        Relationships: []
      }
      consultas_vet: {
        Row: Omit<ConsultaVet, 'veterinarios'>
        Insert: Omit<ConsultaVet, 'id' | 'created_at' | 'updated_at' | 'veterinarios'>
        Update: Partial<Omit<ConsultaVet, 'id' | 'created_at' | 'updated_at' | 'veterinarios'>>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      perfil_tipo: PerfilTipo
      loja_tipo: LojaTipo
      produto_tipo: ProdutoTipo
      suplemento_categoria: SuplementoCategoria
      gado_tipo: GadoTipo
      frete_status: FreteStatus
      consulta_status: ConsultaStatus
      estoque_status: EstoqueStatus
    }
    CompositeTypes: Record<string, never>
  }
}
