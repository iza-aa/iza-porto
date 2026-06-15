'use client'

/**
 * Signature — the artist signs the work. The name is drawn in the existing
 * Pinyon-Script calligraphy face and "written" by sweeping a left→right reveal
 * with a glowing gold nib of light riding the leading edge.
 *
 * Implemented as a clip-path wipe (reliable for real text, unlike hand-authored
 * SVG stroke paths) plus a moving radial highlight that reads as the pen tip.
 *   play → run the write animation once; fires onDone when finished.
 *   done → after the catalogue takes over, the signature shrinks to a header.
 */
export default function Signature({
  play,
  done = false,
  onDone,
}: {
  play: boolean
  done?: boolean
  onDone?: () => void
}) {
  return (
    <div className="relative flex items-center justify-center select-none">
      <span
        className={`font-pinyon-script transition-all duration-700 ${
          done ? 'text-4xl md:text-5xl' : 'text-5xl md:text-7xl lg:text-8xl'
        } ${play ? 'sig-write' : 'opacity-0'}`}
        style={{
          color: '#e8c87a',
          textShadow: '0 0 18px rgba(232,200,122,0.55), 0 0 42px rgba(201,162,39,0.35)',
        }}
        onAnimationEnd={() => onDone?.()}
      >
        Rezki Haikal Izami
      </span>

      {/* the glowing pen-nib that rides the writing edge */}
      {play && !done && <span aria-hidden className="sig-nib" />}

      <style jsx>{`
        .sig-write {
          animation: sigReveal 2.4s cubic-bezier(0.6, 0, 0.2, 1) forwards;
          clip-path: inset(0 100% 0 0);
        }
        @keyframes sigReveal {
          0% { clip-path: inset(0 100% 0 0); opacity: 1; }
          100% { clip-path: inset(0 0 0 0); opacity: 1; }
        }
        .sig-nib {
          position: absolute;
          top: 50%;
          left: 0;
          width: 26px;
          height: 26px;
          border-radius: 9999px;
          transform: translateY(-50%);
          background: radial-gradient(circle, #fff6da 0%, #e8c87a 40%, rgba(201,162,39,0) 72%);
          filter: blur(1px);
          animation: sigNib 2.4s cubic-bezier(0.6, 0, 0.2, 1) forwards;
          pointer-events: none;
        }
        @keyframes sigNib {
          0% { left: 0%; opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  )
}
