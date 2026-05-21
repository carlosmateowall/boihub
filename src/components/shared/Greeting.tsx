import { cn } from '@/lib/utils'

interface GreetingProps {
  /** Primeiro nome */
  nome: string
  /** Subtítulo (ex.: "Fazenda Sete Estrelas · Cristalina, GO") */
  sub?: string
  /** Eyebrow opcional (ex.: "Produtor rural") */
  eyebrow?: string
  /** Texto adicional informativo (ex.: "3 solicitações aguardando · 4 consultas hoje") */
  info?: string
  /** Texto da saudação. Se omitido, usa "Bom dia/Boa tarde/Boa noite" automaticamente */
  saudacao?: string
  className?: string
}

function getDefaultSaudacao(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function Greeting({ nome, sub, eyebrow, info, saudacao, className }: GreetingProps) {
  const s = saudacao ?? getDefaultSaudacao()
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {eyebrow && <span className="bh-eyebrow text-mute">{eyebrow}</span>}
      <h1 className="bh-display text-[30px] lg:text-[36px] leading-[1.05] text-ink m-0">
        {s}, <span className="text-verde-900">{nome}</span>.
      </h1>
      {sub && <p className="m-0 text-[14px] text-ink-soft">{sub}</p>}
      {info && <p className="m-0 text-[13.5px] text-ink-soft">{info}</p>}
    </div>
  )
}
