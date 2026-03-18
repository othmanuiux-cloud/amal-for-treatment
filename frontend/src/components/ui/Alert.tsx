import { AlertCircle, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert = ({ variant = 'info', title, children, onClose, className }: AlertProps) => {
  const variants = {
    success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: CheckCircle },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: XCircle },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: AlertTriangle },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: AlertCircle },
  };

  const style = variants[variant];
  const Icon = style.icon;

  return (
    <div className={cn('rounded-xl border p-4', style.bg, style.border, className)}>
      <div className="flex items-start gap-3">
        <Icon className={cn('w-5 h-5', style.text, 'flex-shrink-0 mt-0.5')} />
        <div className="flex-1">
          {title && <p className={cn('font-bold mb-1', style.text)}>{title}</p>}
          <div className={cn('text-sm', style.text)}>{children}</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
