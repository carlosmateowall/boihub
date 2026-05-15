'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Stethoscope } from 'lucide-react'
import { SearchBar } from '@/components/shared/SearchBar'
import { ProdutoCard } from './ProdutoCard'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ProdutoSaude } from '@/types/database'
import { PRODUTO_TIPO_LABELS } from '@/lib/constants'

const CATEGORIAS = ['todos', 'vacina', 'anti', 'antibio', 'vit'] as const

interface Props { produtos: ProdutoSaude[] }

export function SaudeClient({ produtos }: Props) {
  const [query, setQuery] = useState('')
  const [categoria, setCategoria] = useState<string>('todos')

  const filtered = useMemo(() =>
    produtos.filter(p => {
      const matchQuery = p.nome.toLowerCase().includes(query.toLowerCase())
      const matchCat = categoria === 'todos' || p.tipo === categoria
      return matchQuery && matchCat
    }),
    [produtos, query, categoria]
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Buscar produto..." className="flex-1" />
        <Button variant="secondary" asChild>
          <Link href="/saude/veterinarios">
            <Stethoscope className="h-4 w-4" /> Veterinários
          </Link>
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIAS.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoria(cat)}
            className={cn(
              'px-6 py-3 rounded-pill text-sm font-semibold whitespace-nowrap transition-colors',
              categoria === cat
                ? 'bg-ink text-canvas'
                : 'bg-canvas text-body hover:bg-canvas-soft'
            )}
          >
            {cat === 'todos' ? 'Todos' : PRODUTO_TIPO_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(p => <ProdutoCard key={p.id} produto={p} />)}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-mute py-12">Nenhum produto encontrado.</p>
      )}
    </div>
  )
}
