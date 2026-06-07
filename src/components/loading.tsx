import { type ReactNode } from 'react'

type LoadingType = 'spinner' | 'dots' | 'pulse' | 'progress'
type LoadingSize = 'sm' | 'md' | 'lg'

interface LoadingProps {
  type?: LoadingType
  size?: LoadingSize
  text?: string
  fullPage?: boolean
  children?: ReactNode
}

const sizeMap = {
  sm: { spinner: 20, dot: 6, pulse: 16, gap: 3, text: 'text-xs' },
  md: { spinner: 36, dot: 10, pulse: 24, gap: 5, text: 'text-sm' },
  lg: { spinner: 56, dot: 14, pulse: 36, gap: 8, text: 'text-base' },
}

function Spinner({ size }: { size: LoadingSize }) {
  const s = sizeMap[size].spinner
  return (
    <div
      className="rounded-full border-10 border-muted"
      style={{
        width: s,
        height: s,
        borderTopColor: 'currentColor',
        animation: 'loading-spin 0.7s linear infinite',
      }}
    />
  )
}

function Dots({ size }: { size: LoadingSize }) {
  const s = sizeMap[size].dot
  const gap = sizeMap[size].gap
  return (
    <div className="flex items-center" style={{ gap }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-full bg-current"
          style={{
            width: s,
            height: s,
            animation: `loading-dot-bounce 1.2s ease-in-out infinite`,
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </div>
  )
}

function Pulse({ size }: { size: LoadingSize }) {
  const s = sizeMap[size].pulse
  return (
    <div className="relative flex items-center justify-center" style={{ width: s * 2.5, height: s * 2.5 }}>
      <div
        className="absolute rounded-full border-2 border-current"
        style={{
          width: s,
          height: s,
          animation: 'loading-pulse-ring 1.5s ease-out infinite',
        }}
      />
      <div
        className="absolute rounded-full border-2 border-current"
        style={{
          width: s,
          height: s,
          animation: 'loading-pulse-ring 1.5s ease-out infinite',
          animationDelay: '0.5s',
        }}
      />
      <div
        className="rounded-full bg-current"
        style={{ width: s * 0.6, height: s * 0.6 }}
      />
    </div>
  )
}

function Progress({ size }: { size: LoadingSize }) {
  const h = size === 'sm' ? 3 : size === 'md' ? 5 : 7
  return (
    <div className="w-full max-w-xs overflow-hidden rounded-full bg-muted" style={{ height: h }}>
      <div
        className="h-full w-1/4 rounded-full bg-current"
        style={{ animation: 'loading-progress 1.5s ease-in-out infinite' }}
      />
    </div>
  )
}

function Skeleton() {
  const bar = (className: string, delay = '0s') => (
    <div
      className={`rounded-md ${className}`}
      style={{
        background: 'linear-gradient(90deg, #e4e4e7 25%, #f4f4f5 50%, #e4e4e7 75%)',
        backgroundSize: '200% 100%',
        animation: 'loading-shimmer 1.5s ease-in-out infinite',
        animationDelay: delay,
      }}
    />
  )

  return (
    <div className="flex w-full max-w-md flex-col gap-3 p-4">
      {bar('h-3 w-1/4')}
      {bar('h-4 w-3/4', '0.1s')}
      {bar('h-4 w-1/2', '0.15s')}
      {bar('h-24 w-full', '0.2s')}
      {bar('h-4 w-2/3', '0.25s')}
      {bar('h-4 w-full', '0.3s')}
    </div>
  )
}

const indicators = { spinner: Spinner, dots: Dots, pulse: Pulse, progress: Progress }

export default function Loading({
  type = 'spinner',
  size = 'md',
  text,
  fullPage = false,
  children,
}: LoadingProps) {
  const Indicator = indicators[type]

  const content = (
    <div
      className="flex flex-col items-center justify-center gap-3 text-muted-foreground"
      style={{ animation: 'loading-fade-in 0.3s ease-out' }}
    >
      <Indicator size={size} />
      {text && <span className={sizeMap[size].text}>{text}</span>}
      {children}
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return content
}

export { type LoadingType, type LoadingSize, Skeleton }
