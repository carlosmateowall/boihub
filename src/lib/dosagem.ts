/**
 * BoiHub — Calculadora de dosagem veterinária.
 *
 * Suporta duas convenções de fórmula:
 *   FIXA:{dose}|{via}              ex: FIXA:5|SC      → 5 ml/animal, subcutâneo
 *   PESO:{fator}|{base}|{via}      ex: PESO:1|50|SC   → 1 ml a cada 50 kg, SC
 *
 * Vias suportadas: SC (subcutânea), IM (intramuscular), IV (intravenosa),
 * oral (oral), topica (tópica).
 */

export type Via = 'SC' | 'IM' | 'IV' | 'oral' | 'topica'

export const VIAS_LABEL: Record<Via, string> = {
  SC: 'Subcutânea (SC)',
  IM: 'Intramuscular (IM)',
  IV: 'Intravenosa (IV)',
  oral: 'Oral',
  topica: 'Tópica',
}

export type DoseTipo = 'FIXA' | 'PESO'

export interface DoseFormula {
  tipo: DoseTipo
  via: Via
  /** ml por animal quando FIXA */
  dose?: number
  /** numerador (ml) quando PESO */
  fator?: number
  /** denominador (kg) quando PESO */
  base?: number
}

/**
 * Faz parse de uma string `dose_formula` do banco. Aceita os formatos:
 *  - "FIXA:5|SC"
 *  - "PESO:1|50|SC"
 *  - "1ml para cada 50kg" (formato livre legacy)
 *  - "5ml por animal" (formato livre legacy)
 *
 * Retorna null se não conseguir interpretar.
 */
export function parseDoseFormula(formula: string | null | undefined): DoseFormula | null {
  if (!formula) return null
  const trimmed = formula.trim()

  // FIXA:{dose}|{via}
  const fixaMatch = /^FIXA\s*:\s*(\d+(?:[.,]\d+)?)\s*\|\s*(SC|IM|IV|oral|topica)\s*$/i.exec(trimmed)
  if (fixaMatch) {
    return {
      tipo: 'FIXA',
      dose: parseFloat(fixaMatch[1].replace(',', '.')),
      via: fixaMatch[2].toUpperCase() as Via,
    }
  }

  // PESO:{fator}|{base}|{via}
  const pesoMatch = /^PESO\s*:\s*(\d+(?:[.,]\d+)?)\s*\|\s*(\d+(?:[.,]\d+)?)\s*\|\s*(SC|IM|IV|oral|topica)\s*$/i.exec(trimmed)
  if (pesoMatch) {
    return {
      tipo: 'PESO',
      fator: parseFloat(pesoMatch[1].replace(',', '.')),
      base: parseFloat(pesoMatch[2].replace(',', '.')),
      via: pesoMatch[3].toUpperCase() as Via,
    }
  }

  // Legacy: "X ml para cada Y kg"
  const legacyPeso = /(\d+(?:[.,]\d+)?)\s*ml\s+para\s+cada\s+(\d+(?:[.,]\d+)?)\s*kg/i.exec(trimmed)
  if (legacyPeso) {
    return {
      tipo: 'PESO',
      fator: parseFloat(legacyPeso[1].replace(',', '.')),
      base: parseFloat(legacyPeso[2].replace(',', '.')),
      via: 'SC',
    }
  }

  // Legacy: "X ml por animal"
  const legacyFixa = /(\d+(?:[.,]\d+)?)\s*ml\s+por\s+animal/i.exec(trimmed)
  if (legacyFixa) {
    return {
      tipo: 'FIXA',
      dose: parseFloat(legacyFixa[1].replace(',', '.')),
      via: 'SC',
    }
  }

  return null
}

/**
 * Serializa uma DoseFormula no formato canônico (PESO:X|Y|SC ou FIXA:X|SC).
 */
export function serializeDoseFormula(f: DoseFormula): string {
  if (f.tipo === 'FIXA') return `FIXA:${f.dose}|${f.via}`
  return `PESO:${f.fator}|${f.base}|${f.via}`
}

/**
 * Texto humano em pt-BR pra exibir num cartão de produto.
 * Ex: "5 ml por animal" ou "1 ml a cada 50 kg"
 */
export function describeFormula(f: DoseFormula): string {
  if (f.tipo === 'FIXA') return `${formatMl(f.dose!)} por animal`
  return `${formatMl(f.fator!)} a cada ${f.base} kg`
}

function formatMl(value: number): string {
  if (Number.isInteger(value)) return `${value} ml`
  return `${value.toFixed(2).replace('.', ',')} ml`
}

/**
 * Calcula dose individual em ml.
 *  - FIXA: ignora o peso e retorna dose direta.
 *  - PESO: peso * fator / base.
 */
export function calcularDose(f: DoseFormula, pesoKg: number): number {
  if (f.tipo === 'FIXA') return f.dose ?? 0
  if (!pesoKg || pesoKg <= 0) return 0
  return (pesoKg * (f.fator ?? 0)) / (f.base ?? 1)
}

export interface CalculoLote {
  /** ml por animal */
  dosePorAnimal: number
  /** ml totais pro lote inteiro */
  volumeTotalMl: number
  /** quantidade mínima de frascos arredondada pra cima */
  frascosNecessarios: number
  /** ml restantes no último frasco (pra avisar de sobra) */
  sobraMl: number
  /** custo total estimado (R$) — se precoPorFrasco passado */
  custoTotal?: number
  /** custo por animal (R$) */
  custoPorAnimal?: number
}

/**
 * Calcula tudo que importa pra aplicação em lote.
 *
 * @param formula     - fórmula da dose
 * @param pesoKg      - peso médio dos animais
 * @param qtdAnimais  - número de animais a aplicar
 * @param frascoMl    - volume de cada frasco
 * @param precoFrasco - opcional, R$ por frasco
 */
export function calcularLote(opts: {
  formula: DoseFormula
  pesoKg: number
  qtdAnimais: number
  frascoMl: number
  precoFrasco?: number
}): CalculoLote {
  const { formula, pesoKg, qtdAnimais, frascoMl, precoFrasco } = opts
  const dosePorAnimal = calcularDose(formula, pesoKg)
  const volumeTotalMl = dosePorAnimal * Math.max(qtdAnimais, 0)
  const frascosNecessarios =
    frascoMl > 0 && volumeTotalMl > 0 ? Math.ceil(volumeTotalMl / frascoMl) : 0
  const sobraMl = Math.max(frascosNecessarios * frascoMl - volumeTotalMl, 0)
  const custoTotal =
    precoFrasco != null && frascosNecessarios > 0 ? precoFrasco * frascosNecessarios : undefined
  const custoPorAnimal =
    custoTotal != null && qtdAnimais > 0 ? custoTotal / qtdAnimais : undefined
  return { dosePorAnimal, volumeTotalMl, frascosNecessarios, sobraMl, custoTotal, custoPorAnimal }
}

/**
 * Presets de medicamentos veterinários comuns no Brasil.
 * Usados como atalho quando o produto não está cadastrado no catálogo da
 * loja. Fórmulas e carências são referências amplas — sempre confirmar
 * com a bula do produto específico antes de aplicar.
 */
export interface PresetDosagem {
  id: string
  nome: string
  formula: string
  carencia_dias: number
  descricao: string
  categoria: 'vacina' | 'antiparasitario' | 'antibiotico' | 'vitamina'
}

export const PRESETS_DOSAGEM: PresetDosagem[] = [
  {
    id: 'ivermectina-1',
    nome: 'Ivermectina 1%',
    formula: 'PESO:1|50|SC',
    carencia_dias: 35,
    descricao: 'Vermífugo endectocida de amplo espectro',
    categoria: 'antiparasitario',
  },
  {
    id: 'doramectina',
    nome: 'Doramectina',
    formula: 'PESO:1|33|SC',
    carencia_dias: 35,
    descricao: 'Endectocida de longa ação',
    categoria: 'antiparasitario',
  },
  {
    id: 'moxidectina',
    nome: 'Moxidectina 1%',
    formula: 'PESO:1|50|SC',
    carencia_dias: 35,
    descricao: 'Endectocida injetável',
    categoria: 'antiparasitario',
  },
  {
    id: 'oxitetraciclina-la',
    nome: 'Oxitetraciclina LA 20%',
    formula: 'PESO:1|10|IM',
    carencia_dias: 28,
    descricao: 'Antibiótico de longa ação',
    categoria: 'antibiotico',
  },
  {
    id: 'enrofloxacina',
    nome: 'Enrofloxacina 10%',
    formula: 'PESO:1|40|IM',
    carencia_dias: 14,
    descricao: 'Antibiótico fluoroquinolona',
    categoria: 'antibiotico',
  },
  {
    id: 'aftosa',
    nome: 'Vacina Aftosa',
    formula: 'FIXA:5|SC',
    carencia_dias: 0,
    descricao: 'Polivalente, campanha oficial',
    categoria: 'vacina',
  },
  {
    id: 'clostridiose',
    nome: 'Clostridiose Polivalente',
    formula: 'FIXA:5|SC',
    carencia_dias: 0,
    descricao: 'Carbúnculo sintomático, gangrena gasosa',
    categoria: 'vacina',
  },
  {
    id: 'raiva',
    nome: 'Antirrábica',
    formula: 'FIXA:2|IM',
    carencia_dias: 0,
    descricao: 'Raiva bovina',
    categoria: 'vacina',
  },
  {
    id: 'brucelose-b19',
    nome: 'Brucelose B19',
    formula: 'FIXA:2|SC',
    carencia_dias: 0,
    descricao: 'Bezerras 3-8 meses (dose única)',
    categoria: 'vacina',
  },
  {
    id: 'ibr-bvd',
    nome: 'IBR + BVD',
    formula: 'FIXA:2|SC',
    carencia_dias: 0,
    descricao: 'Rinotraqueíte + diarreia viral bovina',
    categoria: 'vacina',
  },
  {
    id: 'leptospirose',
    nome: 'Leptospirose',
    formula: 'FIXA:5|SC',
    carencia_dias: 0,
    descricao: 'Polivalente, reforço anual',
    categoria: 'vacina',
  },
  {
    id: 'ade',
    nome: 'Vitamina ADE Injetável',
    formula: 'PESO:1|100|IM',
    carencia_dias: 0,
    descricao: 'Suplemento vitamínico',
    categoria: 'vitamina',
  },
  {
    id: 'complexo-b',
    nome: 'Complexo B Injetável',
    formula: 'PESO:1|50|IM',
    carencia_dias: 0,
    descricao: 'Reforço vitamínico do complexo B',
    categoria: 'vitamina',
  },
]

/**
 * Volumes de frasco mais comuns na pecuária bovina brasileira.
 */
export const VOLUMES_FRASCO_COMUNS = [50, 100, 250, 500, 1000] as const

/**
 * Boas práticas universais ao manipular medicamentos veterinários.
 * Não substitui orientação profissional — são lembretes operacionais.
 */
export const BOAS_PRATICAS: string[] = [
  'Confira a bula e a data de validade antes de aplicar.',
  'Conserve entre 2°C e 8°C. Não congele.',
  'Agite bem o frasco antes de cada dose (vacinas e suspensões).',
  'Use agulha estéril e troque entre lotes para evitar contaminação.',
  'Não fure o tampão com a mesma agulha que aplica no animal.',
  'Anote lote, validade e data de aplicação na ficha do animal.',
  'Descarte agulhas em recipiente perfurocortante.',
  'Em caso de reação adversa, consulte um veterinário imediatamente.',
]
