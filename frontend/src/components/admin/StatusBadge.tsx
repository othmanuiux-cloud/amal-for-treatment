import React from 'react';

export type StatusType = 
  | 'approved'      
  | 'pending'       
  | 'urgent'        
  | 'rejected'      
  | 'completed'    
  | 'active'        
  | 'inactive'      
  | 'patient'       
  | 'volunteer'     
  | 'admin';

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

const statusConfig: Record<StatusType, { 
  className: string; 
  dotColor: string; 
  arabicLabel: string 
}> = {
  approved: { 
    className: 'bg-success-50 text-success-700 ring-1 ring-success-600/20', 
    dotColor: 'bg-success-500', 
    arabicLabel: 'معتمد' 
  },
  pending: { 
    className: 'bg-warning-50 text-warning-700 ring-1 ring-warning-600/20', 
    dotColor: 'bg-warning-500', 
    arabicLabel: 'قيد الانتظار' 
  },
  urgent: { 
    className: 'bg-error-50 text-error-700 ring-1 ring-error-600/20', 
    dotColor: 'bg-error-500', 
    arabicLabel: 'عاجل' 
  },
  rejected: { 
    className: 'bg-slate-50 text-slate-700 ring-1 ring-slate-600/20', 
    dotColor: 'bg-slate-500', 
    arabicLabel: 'مرفوض' 
  },
  completed: { 
    className: 'bg-primary-50 text-primary-700 ring-1 ring-primary-600/20', 
    dotColor: 'bg-primary-500', 
    arabicLabel: 'مكتمل' 
  },
  active: { 
    className: 'bg-success-50 text-success-700 ring-1 ring-success-600/20', 
    dotColor: 'bg-success-500', 
    arabicLabel: 'نشط' 
  },
  inactive: { 
    className: 'bg-slate-50 text-slate-700 ring-1 ring-slate-600/20', 
    dotColor: 'bg-slate-500', 
    arabicLabel: 'غير نشط' 
  },
  patient: { 
    className: 'bg-pink-50 text-pink-700 ring-1 ring-pink-600/20', 
    dotColor: 'bg-pink-500', 
    arabicLabel: 'مريض' 
  },
  volunteer: { 
    className: 'bg-primary-50 text-primary-700 ring-1 ring-primary-600/20', 
    dotColor: 'bg-primary-500', 
    arabicLabel: 'متطوع' 
  },
  admin: { 
    className: 'bg-violet-50 text-violet-700 ring-1 ring-violet-600/20', 
    dotColor: 'bg-violet-500', 
    arabicLabel: 'أدمن' 
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  label, 
  showDot = true, 
  size = 'md' 
}) => {
  const config = statusConfig[status as StatusType] || { 
    className: 'bg-slate-50 text-slate-700 ring-1 ring-slate-600/20', 
    dotColor: 'bg-slate-500', 
    arabicLabel: status 
  };
  
  const displayLabel = label || config.arabicLabel;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  
  return (
    <span className={`inline-flex items-center ${sizeClasses} rounded-full font-medium ${config.className}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ml-1.5 ${config.dotColor}`} />}
      {displayLabel}
    </span>
  );
};

export { statusConfig };
