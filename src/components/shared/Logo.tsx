interface LogoProps {
  size?: number
  dark?: boolean
  className?: string
}

/**
 * Logo BoiHub — chifre de boi estilizado como hub. Entregue pelo Cloud Design.
 * `dark={true}` usa verde-neon (sobre fundo escuro). `dark={false}` usa
 * verde-900 (sobre fundo claro).
 */
export function Logo({ size = 24, dark = true, className }: LogoProps) {
  const stroke = dark ? '#4ade80' : '#0d2818'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="16" cy="16" r="14" stroke={stroke} strokeWidth="1.6" opacity="0.4" />
      <path
        d="M9 19 C 9 13, 12 10, 16 10 C 20 10, 23 13, 23 19"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M11 19 L 11 22" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M21 19 L 21 22" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="16" r="1.6" fill={stroke} />
    </svg>
  )
}
