interface OrnamentalDividerProps {
  className?: string
  align?: 'left' | 'center'
  flourish?: boolean
}

/**
 * Classical divider: tapering hairlines, diamond accents, and a central fleuron.
 * Inherits color from `currentColor` so it adapts to any section palette —
 * set the tone via text-* classes on `className`.
 */
export default function OrnamentalDivider({
  className = '',
  align = 'center',
  flourish = true,
}: OrnamentalDividerProps) {
  return (
    <div
      aria-hidden
      className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : 'justify-start'} ${className}`}
    >
      <span className={`h-px ${align === 'center' ? 'w-16 md:w-24' : 'w-10 md:w-14'} bg-gradient-to-l from-current to-transparent opacity-50`} />
      <span className="w-1.5 h-1.5 rotate-45 border border-current opacity-60 shrink-0" />
      {flourish && (
        <span className="text-lg leading-none opacity-70 -translate-y-[1px] select-none">❦</span>
      )}
      <span className="w-1.5 h-1.5 rotate-45 border border-current opacity-60 shrink-0" />
      <span className="h-px w-16 md:w-24 bg-gradient-to-r from-current to-transparent opacity-50" />
    </div>
  )
}
