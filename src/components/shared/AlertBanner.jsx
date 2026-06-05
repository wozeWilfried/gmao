import { AlertTriangle, X } from 'lucide-react';

const VARIANTS = {
  warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: 'text-yellow-500', text: 'text-yellow-800' },
  danger: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-500', text: 'text-red-800' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-500', text: 'text-blue-800' },
  success: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-500', text: 'text-green-800' },
};

export default function AlertBanner({ variant = 'warning', title, children, onDismiss }) {
  const v = VARIANTS[variant];
  return (
    <div className={`${v.bg} ${v.border} border rounded-lg p-4`}>
      <div className="flex gap-3">
        <AlertTriangle className={`${v.icon} flex-shrink-0 mt-0.5`} size={18} />
        <div className="flex-1">
          {title && <h4 className={`text-sm font-semibold ${v.text}`}>{title}</h4>}
          <div className={`text-sm ${v.text} mt-1`}>{children}</div>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className={`${v.icon} hover:opacity-70`}>
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
