import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, X, ExternalLink } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message: string
  txHash?: string
  duration?: number
}

interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

const ICONS = {
  success: <CheckCircle size={16} style={{ color: '#1dd1a1' }} />,
  error: <XCircle size={16} style={{ color: '#ff4757' }} />,
  info: <Info size={16} style={{ color: '#00d2d3' }} />
}

const COLORS: Record<ToastType, string> = {
  success: 'rgba(29,209,161,0.12)',
  error: 'rgba(255,71,87,0.12)',
  info: 'rgba(0,210,211,0.12)'
}

const BORDERS: Record<ToastType, string> = {
  success: 'rgba(29,209,161,0.3)',
  error: 'rgba(255,71,87,0.3)',
  info: 'rgba(0,210,211,0.3)'
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true))
    // Auto-dismiss
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss(toast.id), 300)
    }, toast.duration ?? 5000)
    return () => clearTimeout(t)
  }, [toast, onDismiss])

  return (
    <div style={{
      background: COLORS[toast.type],
      border: `1px solid ${BORDERS[toast.type]}`,
      borderRadius: '14px',
      padding: '1rem 1.1rem',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      minWidth: '300px',
      maxWidth: '380px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(30px)'
    }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <div style={{ marginTop: '2px', flexShrink: 0 }}>{ICONS[toast.type]}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>
            {toast.title}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#a4b0be', lineHeight: '1.5' }}>
            {toast.message}
          </div>
          {toast.txHash && (
            <a
              href={`https://testnet.cspr.live/deploy/${toast.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: '#00d2d3', marginTop: '0.4rem', textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace' }}
            >
              <ExternalLink size={10} />
              {toast.txHash.substring(0, 20)}... View on Explorer
            </a>
          )}
        </div>
        <button
          onClick={() => { setVisible(false); setTimeout(() => onDismiss(toast.id), 300) }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a4b0be', padding: '0', flexShrink: 0 }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.65rem',
      pointerEvents: 'none'
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'all' }}>
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  )
}

/** Hook to manage toasts */
export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { ...toast, id }])
  }

  const dismiss = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return { toasts, addToast, dismiss }
}
