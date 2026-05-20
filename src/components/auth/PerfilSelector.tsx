'use client'

import { Tractor, Stethoscope, Store, Factory, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PerfilTipo } from '@/types/database'

const perfis = [
  { id: 'produtor' as PerfilTipo, label: 'Produtor Rural', desc: 'Gado de corte ou leite', icon: Tractor },
  { id: 'veterinario' as PerfilTipo, label: 'Veterinário', desc: 'Consultas online e presenciais', icon: Stethoscope },
  { id: 'motorista' as PerfilTipo, label: 'Motorista', desc: 'Transporte de bovinos', icon: Truck },
  { id: 'revenda' as PerfilTipo, label: 'Revenda', desc: 'Venda de insumos agropecuários', icon: Store },
  { id: 'fabricante' as PerfilTipo, label: 'Fabricante', desc: 'Produção de insumos e suplementos', icon: Factory },
]

interface PerfilSelectorProps {
  value: PerfilTipo | ''
  onChange: (value: PerfilTipo) => void
}

export function PerfilSelector({ value, onChange }: PerfilSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-ink">Qual é o seu perfil?</p>
      <div className="grid grid-cols-1 gap-2">
        {perfis.map(p => {
          const selected = value === p.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(p.id)}
              className={cn(
                'flex items-center gap-4 p-6 rounded-xl border-2 text-left transition-all',
                selected
                  ? 'border-primary bg-primary-pale'
                  : 'border-border bg-canvas hover:border-border-strong'
              )}
            >
              <div className={cn('p-2 rounded-lg', selected ? 'bg-primary' : 'bg-canvas')}>
                <p.icon className="h-5 w-5 text-ink" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold text-sm text-ink">{p.label}</p>
                <p className="text-xs text-mute">{p.desc}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
