import { useEffect, useState } from 'react';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

let toastListeners: ((toasts: ToastItem[]) => void)[] = [];
let currentToasts: ToastItem[] = [];

function notifyListeners() {
  toastListeners.forEach((fn) => fn([...currentToasts]));
}

export function showToast(type: ToastItem['type'], message: string) {
  const id = `${Date.now()}-${Math.random()}`;
  currentToasts = [...currentToasts, { id, type, message }];
  notifyListeners();
  setTimeout(() => {
    currentToasts = currentToasts.filter((t) => t.id !== id);
    notifyListeners();
  }, 4000);
}

const TOAST_COLORS = {
  success: { bg: '#1A936F22', border: '#1A936F', icon: '✓' },
  error:   { bg: '#FF6B6B22', border: '#FF6B6B', icon: '✗' },
  info:    { bg: '#4D96FF22', border: '#4D96FF', icon: 'ℹ' },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener = (updated: ToastItem[]) => setToasts(updated);
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const colors = TOAST_COLORS[toast.type];
        return (
          <div
            key={toast.id}
            className="toast"
            style={{ background: colors.bg, borderColor: colors.border }}
          >
            <span className="toast-icon" style={{ color: colors.border }}>
              {colors.icon}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
