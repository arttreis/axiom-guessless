import { useEffect, useRef, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

let toastListeners: ((toasts: ToastItem[]) => void)[] = [];
let currentToasts: ToastItem[] = [];

function notifyListeners() {
  toastListeners.forEach(fn => fn([...currentToasts]));
}

export function showToast(type: ToastItem['type'], message: string) {
  const id = `${Date.now()}-${Math.random()}`;
  currentToasts = [...currentToasts, { id, type, message }];
  notifyListeners();
  setTimeout(() => {
    currentToasts = currentToasts.filter(t => t.id !== id);
    notifyListeners();
  }, 4500);
}

const TOAST_CONFIG = {
  success: { icon: <CheckCircle size={16} />, color: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)' },
  error:   { icon: <XCircle   size={16} />, color: '#F87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.35)' },
  info:    { icon: <Info      size={16} />, color: '#3D6FF8', bg: 'rgba(61,111,248,0.12)',  border: 'rgba(61,111,248,0.35)' },
};

const DURATION = 4500;

function ToastItem({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  const cfg = TOAST_CONFIG[toast.type];
  const [progress, setProgress] = useState(100);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const frame = () => {
      const elapsed = Date.now() - startRef.current;
      setProgress(Math.max(0, 100 - (elapsed / DURATION) * 100));
      if (elapsed < DURATION) requestAnimationFrame(frame);
    };
    const id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="toast" style={{ background: cfg.bg, borderColor: cfg.border }}>
      <span className="toast-icon" style={{ color: cfg.color }}>{cfg.icon}</span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={() => onDismiss(toast.id)} style={{ color: cfg.color }}>
        <X size={13} />
      </button>
      <div
        className="toast-progress"
        style={{ background: cfg.color, width: `${progress}%` }}
      />
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener = (updated: ToastItem[]) => setToasts(updated);
    toastListeners.push(listener);
    return () => { toastListeners = toastListeners.filter(l => l !== listener); };
  }, []);

  const dismiss = (id: string) => {
    currentToasts = currentToasts.filter(t => t.id !== id);
    notifyListeners();
  };

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />)}
    </div>
  );
}
