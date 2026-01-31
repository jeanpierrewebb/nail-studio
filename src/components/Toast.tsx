'use client';

import { useToast } from '@/contexts/ToastContext';

const icons: Record<string, string> = {
  success: '✨',
  error: '😕',
  info: 'ℹ️',
};

const bgColors: Record<string, string> = {
  success: 'bg-gray-900',
  error: 'bg-red-600',
  info: 'bg-gray-800',
};

export default function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed z-[100] left-0 right-0 flex flex-col items-center gap-2 pointer-events-none"
      style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px))' }}
    >
      {toasts.map((toast) => (
        <button
          key={toast.id}
          onClick={() => dismiss(toast.id)}
          className={`pointer-events-auto ${bgColors[toast.type]} text-white px-5 py-3 rounded-full shadow-lg text-sm font-medium animate-fade-in flex items-center gap-2 max-w-[90vw]`}
        >
          <span>{icons[toast.type]}</span>
          <span className="truncate">{toast.message}</span>
        </button>
      ))}
    </div>
  );
}
