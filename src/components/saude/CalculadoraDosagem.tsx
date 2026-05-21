'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  Syringe,
  Beef,
  Package,
  Printer,
  MessageCircle,
  Clock,
  Pipette,
  TriangleAlert,
  RotateCcw,
  CheckCircle2,
  Wrench,
  ListChecks,
} from 'lucide-react'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { whatsappLink } from '@/lib/constants'
import {
  parseDoseFormula,
  serializeDoseFormula,
  describeFormula,
  calcularLote,
  PRESETS_DOSAGEM,
  VOLUMES_FRASCO_COMUNS,
  VIAS_LABEL,
  BOAS_PRATICAS,
  type DoseFormula,
  type DoseTipo,
  type Via,
  type PresetDosagem,
} from '@/lib/dosagem'
import type { ProdutoSaude } from '@/types/database'
import { cn } from '@/lib/utils'

type Fonte = 'preset' | 'catalogo' | 'manual'

interface Props {
  produtos: ProdutoSaude[]
  initialPresetId?: string
  initialProdutoId?: string
}

const CATEGORIA_LABEL: Record<PresetDosagem['categoria'], string> = {
  vacina: 'Vacina',
  antiparasitario: 'Antiparasitário',
  antibiotico: 'Antibiótico',
  vitamina: 'Vitamina',
}

export function CalculadoraDosagem({
  produtos,
  initialPresetId,
  initialProdutoId,
}: Props) {
  const [fonte, setFonte] = useState<Fonte>(
    initialProdutoId ? 'catalogo' : initialPresetId ? 'preset' : 'preset',
  )

  // Identificador do produto/preset escolhido
  const [presetId, setPresetId] = useState<string>(initialPresetId ?? PRESETS_DOSAGEM[0].id)
  const [produtoId, setProdutoId] = useState<string>(
    initialProdutoId ?? produtos[0]?.id ?? '',
  )

  // Modo manual
  const [tipo, setTipo] = useState<DoseTipo>('PESO')
  const [via, setVia] = useState<Via>('SC')
  const [doseFixa, setDoseFixa] = useState<string>('5')
  const [fator, setFator] = useState<string>('1')
  const [base, setBase] = useState<string>('50')
  const [carenciaManual, setCarenciaManual] = useState<string>('0')
  const [nomeManual, setNomeManual] = useState<string>('')

  // Inputs comuns
  const [pesoKg, setPesoKg] = useState<string>('400')
  const [qtdAnimais, setQtdAnimais] = useState<string>('30')
  const [frascoMl, setFrascoMl] = useState<number>(100)
  const [precoFrasco, setPrecoFrasco] = useState<string>('')

  // Persiste última calculadora em localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = window.localStorage.getItem('boihub:calculadora')
    if (!saved) return
    try {
      const parsed = JSON.parse(saved)
      if (parsed.pesoKg) setPesoKg(String(parsed.pesoKg))
      if (parsed.qtdAnimais) setQtdAnimais(String(parsed.qtdAnimais))
      if (parsed.frascoMl) setFrascoMl(parsed.frascoMl)
    } catch {
      // ignore
    }
  }, [])
  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(
      'boihub:calculadora',
      JSON.stringify({ pesoKg, qtdAnimais, frascoMl }),
    )
  }, [pesoKg, qtdAnimais, frascoMl])

  // Resolve a fórmula ativa + metadados (nome, carência, descrição, preço, etc.)
  const selecao = useMemo<{
    formula: DoseFormula | null
    nome: string
    descricao?: string
    categoria?: string
    carencia: number
    precoFrascoSugerido?: number
    erroParser?: string
  } | null>(() => {
    if (fonte === 'preset') {
      const preset = PRESETS_DOSAGEM.find(p => p.id === presetId)
      if (!preset) return null
      const formula = parseDoseFormula(preset.formula)
      return {
        formula,
        nome: preset.nome,
        descricao: preset.descricao,
        categoria: CATEGORIA_LABEL[preset.categoria],
        carencia: preset.carencia_dias,
      }
    }
    if (fonte === 'catalogo') {
      const p = produtos.find(x => x.id === produtoId)
      if (!p) return null
      const formula = parseDoseFormula(p.dose_formula)
      return {
        formula,
        nome: p.nome,
        descricao: p.descricao ?? undefined,
        categoria: p.marca ?? undefined,
        carencia: p.carencia_dias,
        precoFrascoSugerido: p.preco,
        erroParser: formula
          ? undefined
          : `Fórmula "${p.dose_formula}" não foi reconhecida. Use modo manual.`,
      }
    }
    // manual
    const f: DoseFormula =
      tipo === 'FIXA'
        ? {
            tipo: 'FIXA',
            via,
            dose: parseFloat(doseFixa.replace(',', '.')) || 0,
          }
        : {
            tipo: 'PESO',
            via,
            fator: parseFloat(fator.replace(',', '.')) || 0,
            base: parseFloat(base.replace(',', '.')) || 1,
          }
    return {
      formula: f,
      nome: nomeManual.trim() || 'Cálculo personalizado',
      carencia: parseInt(carenciaManual, 10) || 0,
    }
  }, [
    fonte,
    presetId,
    produtoId,
    produtos,
    tipo,
    via,
    doseFixa,
    fator,
    base,
    carenciaManual,
    nomeManual,
  ])

  const resultado = useMemo(() => {
    if (!selecao?.formula) return null
    const pesoNum = parseFloat(pesoKg.replace(',', '.')) || 0
    const qtdNum = parseInt(qtdAnimais, 10) || 0
    const precoNum = parseFloat(precoFrasco.replace(',', '.')) || undefined
    return calcularLote({
      formula: selecao.formula,
      pesoKg: pesoNum,
      qtdAnimais: qtdNum,
      frascoMl,
      precoFrasco: precoNum,
    })
  }, [selecao, pesoKg, qtdAnimais, frascoMl, precoFrasco])

  function handleResetar() {
    setPesoKg('400')
    setQtdAnimais('30')
    setFrascoMl(100)
    setPrecoFrasco('')
  }

  const precoEfetivo =
    precoFrasco.trim() !== ''
      ? parseFloat(precoFrasco.replace(',', '.'))
      : selecao?.precoFrascoSugerido

  // Texto WhatsApp pra enviar ao funcionário
  const textoWhatsapp = useMemo(() => {
    if (!resultado || !selecao?.formula) return ''
    const lines = [
      `*Receita ${selecao.nome}*`,
      `Animais: ${qtdAnimais}`,
      `Peso médio: ${pesoKg} kg`,
      `Dose por animal: ${formatMl(resultado.dosePorAnimal)}`,
      `Volume total: ${formatMl(resultado.volumeTotalMl)}`,
      `Frascos: ${resultado.frascosNecessarios} de ${frascoMl} ml`,
      `Via: ${VIAS_LABEL[selecao.formula.via]}`,
    ]
    if (selecao.carencia > 0) lines.push(`Carência para abate: ${selecao.carencia} dias`)
    if (resultado.custoTotal) lines.push(`Custo estimado: ${formatCurrency(resultado.custoTotal)}`)
    return lines.join('\n')
  }, [resultado, selecao, pesoKg, qtdAnimais, frascoMl])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6">
      {/* ─── Coluna esquerda: form ─────────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        <section className="rounded-lg border border-border bg-canvas p-5">
          <span className="bh-eyebrow text-mute">1. Produto</span>
          <h2 className="bh-display text-[20px] text-ink mt-1.5 mb-4">
            Qual medicamento você vai aplicar?
          </h2>

          <FonteToggle value={fonte} onChange={setFonte} catalogoCount={produtos.length} />

          {fonte === 'preset' && (
            <PresetSelector value={presetId} onChange={setPresetId} />
          )}

          {fonte === 'catalogo' && (
            <CatalogoSelector
              value={produtoId}
              onChange={setProdutoId}
              produtos={produtos}
            />
          )}

          {fonte === 'manual' && (
            <ManualForm
              tipo={tipo}
              setTipo={setTipo}
              via={via}
              setVia={setVia}
              doseFixa={doseFixa}
              setDoseFixa={setDoseFixa}
              fator={fator}
              setFator={setFator}
              base={base}
              setBase={setBase}
              carencia={carenciaManual}
              setCarencia={setCarenciaManual}
              nome={nomeManual}
              setNome={setNomeManual}
            />
          )}

          {/* Resumo da fórmula */}
          {selecao?.formula && (
            <div className="mt-4 rounded-md bg-canvas-warm border border-border px-4 py-3 flex items-center gap-3">
              <Pipette className="h-4 w-4 text-verde-700 shrink-0" strokeWidth={1.5} />
              <div className="flex-1 min-w-0 text-sm">
                <span className="font-semibold text-ink">{selecao.nome}</span>
                <span className="text-mute">
                  {' '}
                  · {describeFormula(selecao.formula)} · {selecao.formula.via}
                </span>
              </div>
            </div>
          )}

          {selecao?.erroParser && (
            <div className="mt-3 rounded-md bg-negative/[0.08] border border-negative/25 px-4 py-3 flex gap-2 text-[13px] text-negative-deep">
              <TriangleAlert className="h-4 w-4 shrink-0 mt-px" />
              {selecao.erroParser}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-border bg-canvas p-5 flex flex-col gap-4">
          <div>
            <span className="bh-eyebrow text-mute">2. Lote</span>
            <h2 className="bh-display text-[20px] text-ink mt-1.5">Quantos animais e qual peso?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NumberInput
              label="Peso médio (kg)"
              icon={Beef}
              value={pesoKg}
              onChange={setPesoKg}
              suffix="kg"
              hint="Estimativa do peso vivo médio do lote."
              disabled={selecao?.formula?.tipo === 'FIXA'}
              disabledHint={
                selecao?.formula?.tipo === 'FIXA'
                  ? 'Não usado para dose fixa.'
                  : undefined
              }
            />
            <NumberInput
              label="Quantidade de animais"
              icon={ListChecks}
              value={qtdAnimais}
              onChange={setQtdAnimais}
              suffix="cab"
            />
          </div>
        </section>

        <section className="rounded-lg border border-border bg-canvas p-5 flex flex-col gap-4">
          <div>
            <span className="bh-eyebrow text-mute">3. Frasco</span>
            <h2 className="bh-display text-[20px] text-ink mt-1.5">Volume e preço (opcional)</h2>
          </div>
          <div>
            <label className="text-sm font-semibold text-ink mb-1.5 block">
              Volume do frasco
            </label>
            <div className="flex flex-wrap gap-2">
              {VOLUMES_FRASCO_COMUNS.map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setFrascoMl(v)}
                  className={cn(
                    'px-3 py-1.5 rounded-pill text-[13px] font-semibold transition-colors border',
                    frascoMl === v
                      ? 'bg-verde-900 text-creme border-transparent'
                      : 'bg-canvas text-ink-soft border-border hover:border-border-strong',
                  )}
                >
                  {v} ml
                </button>
              ))}
            </div>
          </div>
          <NumberInput
            label="Preço por frasco (R$)"
            icon={Wrench}
            value={precoFrasco}
            onChange={setPrecoFrasco}
            placeholder={
              selecao?.precoFrascoSugerido
                ? `Sugestão: R$ ${selecao.precoFrascoSugerido.toFixed(2).replace('.', ',')}`
                : 'Ex: 89,00'
            }
            hint="Usado pra calcular o custo total do procedimento."
          />
        </section>
      </div>

      {/* ─── Coluna direita: resultado (sticky no desktop) ───────────────── */}
      <aside className="flex flex-col gap-4 lg:sticky lg:top-6 self-start">
        <ResultadoCard
          nome={selecao?.nome ?? 'Selecione um produto'}
          categoria={selecao?.categoria}
          descricao={selecao?.descricao}
          dosePorAnimal={resultado?.dosePorAnimal ?? 0}
          via={selecao?.formula?.via}
          carencia={selecao?.carencia ?? 0}
        />

        <div className="grid grid-cols-2 gap-3">
          <ResultadoMiniCard
            icon={Pipette}
            label="Volume total"
            value={formatMl(resultado?.volumeTotalMl ?? 0)}
            sub={`p/ ${qtdAnimais || 0} animais`}
          />
          <ResultadoMiniCard
            icon={Package}
            label="Frascos"
            value={String(resultado?.frascosNecessarios ?? 0)}
            sub={`de ${frascoMl} ml`}
          />
        </div>

        {(resultado?.custoTotal != null || precoEfetivo != null) && (
          <div className="grid grid-cols-2 gap-3">
            <ResultadoMiniCard
              icon={Wrench}
              label="Custo total"
              value={
                resultado?.custoTotal != null
                  ? formatCurrency(resultado.custoTotal)
                  : '—'
              }
              sub="frascos + sobra"
              tone="gold"
            />
            <ResultadoMiniCard
              icon={Beef}
              label="Por animal"
              value={
                resultado?.custoPorAnimal != null
                  ? formatCurrency(resultado.custoPorAnimal)
                  : '—'
              }
              sub="custo unit."
              tone="gold"
            />
          </div>
        )}

        {resultado && resultado.sobraMl > 0 && (
          <div className="rounded-md bg-info-soft/40 border border-info/30 px-4 py-3 text-[13px] text-[#1f4d80] flex gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-px" />
            <div>
              Sobrarão <strong>{formatMl(resultado.sobraMl)}</strong> no último frasco. Use em
              até 24h após aberto e guarde refrigerado.
            </div>
          </div>
        )}

        <BoasPraticas formula={selecao?.formula} />

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="primary"
            size="md"
            className="flex-1"
            disabled={!resultado || resultado.dosePorAnimal <= 0}
            asChild
          >
            <Link
              href={whatsappLink(textoWhatsapp)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" /> Enviar receita
            </Link>
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => typeof window !== 'undefined' && window.print()}
            disabled={!resultado || resultado.dosePorAnimal <= 0}
          >
            <Printer className="h-4 w-4" /> Imprimir
          </Button>
          <Button variant="ghost" size="md" onClick={handleResetar}>
            <RotateCcw className="h-4 w-4" /> Limpar
          </Button>
        </div>
      </aside>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────── */
/* Sub-componentes                                                          */
/* ────────────────────────────────────────────────────────────────────── */

function formatMl(value: number): string {
  if (!value || value <= 0) return '0 ml'
  if (Number.isInteger(value)) return `${value} ml`
  return `${value.toFixed(2).replace('.', ',')} ml`
}

function FonteToggle({
  value,
  onChange,
  catalogoCount,
}: {
  value: Fonte
  onChange: (v: Fonte) => void
  catalogoCount: number
}) {
  const items: { id: Fonte; label: string; sub?: string }[] = [
    { id: 'preset', label: 'Comum', sub: `${PRESETS_DOSAGEM.length} produtos` },
    {
      id: 'catalogo',
      label: 'Catálogo',
      sub: catalogoCount > 0 ? `${catalogoCount} da sua região` : 'em breve',
    },
    { id: 'manual', label: 'Personalizado' },
  ]
  return (
    <div className="grid grid-cols-3 gap-2 rounded-md bg-canvas-warm p-1 mb-4">
      {items.map(it => (
        <button
          key={it.id}
          type="button"
          onClick={() => onChange(it.id)}
          disabled={it.id === 'catalogo' && catalogoCount === 0}
          className={cn(
            'flex flex-col items-center gap-0.5 px-3 py-2 rounded-md text-[13px] font-semibold transition-colors',
            value === it.id
              ? 'bg-canvas text-ink shadow-sm border border-border'
              : 'text-mute hover:text-ink',
            it.id === 'catalogo' && catalogoCount === 0 && 'opacity-40 cursor-not-allowed',
          )}
        >
          {it.label}
          {it.sub && (
            <span className="text-[11px] font-normal text-mute lowercase">{it.sub}</span>
          )}
        </button>
      ))}
    </div>
  )
}

function PresetSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (id: string) => void
}) {
  const grouped = useMemo(() => {
    const map: Record<string, PresetDosagem[]> = {}
    PRESETS_DOSAGEM.forEach(p => {
      map[p.categoria] ??= []
      map[p.categoria].push(p)
    })
    return map
  }, [])
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-canvas border border-border-strong rounded-md px-3.5 py-2.5 text-[14px] text-ink focus:outline-none focus:ring-2 focus:ring-verde-400"
    >
      {Object.entries(grouped).map(([cat, items]) => (
        <optgroup key={cat} label={CATEGORIA_LABEL[cat as PresetDosagem['categoria']]}>
          {items.map(p => (
            <option key={p.id} value={p.id}>
              {p.nome} — {describeFormulaShort(p.formula)}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  )
}

function CatalogoSelector({
  value,
  onChange,
  produtos,
}: {
  value: string
  onChange: (id: string) => void
  produtos: ProdutoSaude[]
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-canvas border border-border-strong rounded-md px-3.5 py-2.5 text-[14px] text-ink focus:outline-none focus:ring-2 focus:ring-verde-400"
    >
      {produtos.map(p => (
        <option key={p.id} value={p.id}>
          {p.nome}
          {p.marca ? ` — ${p.marca}` : ''} · {describeFormulaShort(p.dose_formula)}
        </option>
      ))}
    </select>
  )
}

function describeFormulaShort(formula: string): string {
  const f = parseDoseFormula(formula)
  if (!f) return formula
  return describeFormula(f)
}

interface ManualFormProps {
  tipo: DoseTipo
  setTipo: (v: DoseTipo) => void
  via: Via
  setVia: (v: Via) => void
  doseFixa: string
  setDoseFixa: (v: string) => void
  fator: string
  setFator: (v: string) => void
  base: string
  setBase: (v: string) => void
  carencia: string
  setCarencia: (v: string) => void
  nome: string
  setNome: (v: string) => void
}

function ManualForm({
  tipo, setTipo, via, setVia, doseFixa, setDoseFixa,
  fator, setFator, base, setBase, carencia, setCarencia, nome, setNome,
}: ManualFormProps) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-sm font-semibold text-ink mb-1.5 block">
          Nome do produto (opcional)
        </label>
        <input
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Ex: Ivermectina 3,15% genérica"
          className="w-full bg-canvas border border-border-strong rounded-md px-3.5 py-2.5 text-[14px] text-ink placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-verde-400"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-ink mb-1.5 block">Tipo de dose</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTipo('PESO')}
            className={cn(
              'rounded-md border px-3.5 py-2.5 text-left text-[13px]',
              tipo === 'PESO'
                ? 'bg-verde-900 text-creme border-transparent'
                : 'bg-canvas text-ink border-border hover:border-border-strong',
            )}
          >
            <div className="font-semibold">Por peso</div>
            <div className="text-[11.5px] opacity-80 mt-0.5">
              dose = peso × fator / base
            </div>
          </button>
          <button
            type="button"
            onClick={() => setTipo('FIXA')}
            className={cn(
              'rounded-md border px-3.5 py-2.5 text-left text-[13px]',
              tipo === 'FIXA'
                ? 'bg-verde-900 text-creme border-transparent'
                : 'bg-canvas text-ink border-border hover:border-border-strong',
            )}
          >
            <div className="font-semibold">Dose fixa</div>
            <div className="text-[11.5px] opacity-80 mt-0.5">
              mesma dose por animal
            </div>
          </button>
        </div>
      </div>

      {tipo === 'FIXA' ? (
        <NumberInput
          label="Dose por animal (ml)"
          value={doseFixa}
          onChange={setDoseFixa}
          suffix="ml"
        />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Fator"
            value={fator}
            onChange={setFator}
            suffix="ml"
            hint="quantos ml"
          />
          <NumberInput
            label="A cada"
            value={base}
            onChange={setBase}
            suffix="kg"
            hint="por quantos kg"
          />
        </div>
      )}

      <div>
        <label className="text-sm font-semibold text-ink mb-1.5 block">Via de aplicação</label>
        <select
          value={via}
          onChange={e => setVia(e.target.value as Via)}
          className="w-full bg-canvas border border-border-strong rounded-md px-3.5 py-2.5 text-[14px] text-ink focus:outline-none focus:ring-2 focus:ring-verde-400"
        >
          {Object.entries(VIAS_LABEL).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <NumberInput
        label="Carência (dias)"
        value={carencia}
        onChange={setCarencia}
        suffix="dias"
        hint="período de espera para abate ou consumo do leite"
      />
    </div>
  )
}

interface NumberInputProps {
  label: string
  value: string
  onChange: (v: string) => void
  suffix?: string
  placeholder?: string
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>
  hint?: string
  disabled?: boolean
  disabledHint?: string
}

function NumberInput({
  label, value, onChange, suffix, placeholder, icon: Icon, hint, disabled, disabledHint,
}: NumberInputProps) {
  return (
    <div>
      <label className="text-sm font-semibold text-ink mb-1.5 block">{label}</label>
      <div
        className={cn(
          'flex items-stretch rounded-md border bg-canvas overflow-hidden focus-within:ring-2 focus-within:ring-verde-400 focus-within:border-transparent',
          disabled ? 'opacity-50 cursor-not-allowed' : 'border-border-strong',
        )}
      >
        {Icon && (
          <div className="px-3 flex items-center justify-center text-mute border-r border-border">
            <Icon className="h-4 w-4" strokeWidth={1.5} />
          </div>
        )}
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 px-3.5 py-2.5 text-[14px] text-ink placeholder:text-mute bg-transparent outline-none disabled:cursor-not-allowed"
        />
        {suffix && (
          <span className="px-3 flex items-center text-[12.5px] text-mute font-medium bg-canvas-warm border-l border-border">
            {suffix}
          </span>
        )}
      </div>
      {(hint || disabledHint) && (
        <p className="text-[11.5px] text-mute mt-1">{disabled ? disabledHint : hint}</p>
      )}
    </div>
  )
}

function ResultadoCard({
  nome,
  categoria,
  descricao,
  dosePorAnimal,
  via,
  carencia,
}: {
  nome: string
  categoria?: string
  descricao?: string
  dosePorAnimal: number
  via?: Via
  carencia: number
}) {
  return (
    <div className="rounded-xl bg-verde-900 text-ink-on-dark p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="bh-eyebrow text-verde-400">dose por animal</span>
          <p className="bh-display text-[20px] leading-tight mt-1">{nome}</p>
          {descricao && (
            <p className="text-[12.5px] text-ink-on-dark-mute mt-1 leading-snug">
              {descricao}
            </p>
          )}
        </div>
        {categoria && (
          <Badge variant="onDark" size="sm">
            {categoria}
          </Badge>
        )}
      </div>

      <div className="flex items-end gap-2">
        <span className="bh-num text-[64px] leading-none text-ink-on-dark">
          {dosePorAnimal > 0
            ? dosePorAnimal.toFixed(2).replace('.', ',').replace(/,?0+$/, '')
            : '—'}
        </span>
        {dosePorAnimal > 0 && (
          <span className="text-[18px] text-ink-on-dark-mute pb-2">ml</span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 text-[12px] border-t border-white/10 pt-4">
        {via && (
          <span className="inline-flex items-center gap-1.5 text-ink-on-dark-mute">
            <Syringe className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>{VIAS_LABEL[via]}</span>
          </span>
        )}
        {carencia > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-warning-soft">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>Carência {carencia} dias até abate</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-verde-400">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>Sem período de carência</span>
          </span>
        )}
      </div>
    </div>
  )
}

function ResultadoMiniCard({
  icon: Icon,
  label,
  value,
  sub,
  tone = 'neutral',
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  value: string
  sub?: string
  tone?: 'neutral' | 'gold'
}) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        tone === 'gold'
          ? 'bg-ouro-soft border-ouro/30 text-warning-content'
          : 'bg-canvas border-border text-ink',
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={cn(
            'text-[12px] font-medium tracking-wide lowercase',
            tone === 'gold' ? 'text-warning-deep' : 'text-mute',
          )}
        >
          {label}
        </span>
        <Icon
          className={cn('h-4 w-4', tone === 'gold' ? 'text-warning-deep' : 'text-mute')}
          strokeWidth={1.5}
        />
      </div>
      <p className="bh-num text-[24px] leading-none">{value}</p>
      {sub && (
        <p
          className={cn(
            'text-[11.5px] mt-1',
            tone === 'gold' ? 'text-warning-deep' : 'text-mute',
          )}
        >
          {sub}
        </p>
      )}
    </div>
  )
}

function BoasPraticas({ formula }: { formula?: DoseFormula | null }) {
  const extras: string[] = []
  if (formula?.via === 'SC') {
    extras.push('Aplicar na tábua do pescoço, atrás da escápula.')
  }
  if (formula?.via === 'IM') {
    extras.push('Aplicar na musculatura do pescoço ou garupa.')
  }
  if (formula?.via === 'IV') {
    extras.push('Aplicação IV exige contenção firme e veterinário habilitado.')
  }
  return (
    <details className="rounded-lg border border-border bg-canvas group">
      <summary className="flex items-center justify-between gap-3 px-5 py-3.5 cursor-pointer list-none">
        <span className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-ink">
          <ListChecks className="h-4 w-4 text-verde-700" strokeWidth={1.5} />
          Boas práticas e segurança
        </span>
        <span className="text-[11px] text-mute font-medium uppercase tracking-wider">
          ver
        </span>
      </summary>
      <ul className="px-5 pb-4 pt-1 flex flex-col gap-1.5 text-[13px] text-ink-soft list-disc list-inside marker:text-mute">
        {extras.map(e => (
          <li key={e} className="font-semibold text-ink">
            {e}
          </li>
        ))}
        {BOAS_PRATICAS.map(b => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </details>
  )
}
