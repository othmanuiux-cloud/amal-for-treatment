// Design Tokens - Yemen Medical Donation Platform
// Use ONLY these colors, typography, and spacing across the entire app

// Color Palette
export const colors = {
  // Primary (Blue)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  // Success (Emerald)
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },
  // Warning (Amber)
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  // Error (Red)
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  // Info (Violet)
  info: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
  },
  // Neutral (Slate)
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
};

// Typography Scale
export const typography = {
  // Headings
  pageTitle: 'text-2xl font-semibold text-slate-900',
  sectionTitle: 'text-xl font-semibold text-slate-900',
  cardTitle: 'text-lg font-semibold text-slate-900',
  // Body Text
  body: 'text-sm text-slate-700',
  bodyMuted: 'text-sm text-slate-500',
  small: 'text-xs text-slate-500',
  // Special
  tableHeader: 'text-xs font-semibold text-slate-500 uppercase tracking-wider',
  tableCell: 'text-sm text-slate-700',
  badge: 'text-xs font-medium',
  button: 'text-sm font-medium',
  statValue: 'text-3xl font-bold text-slate-900',
};

// Spacing & Layout
export const spacing = {
  card: 'rounded-2xl p-6',
  cardHeader: 'px-6 py-5 border-b border-slate-100',
  cardFooter: 'px-6 py-4 border-t border-slate-100 bg-slate-50/30 rounded-b-2xl',
  tableCell: 'px-6 py-4',
  tableHeader: 'px-6 py-4',
  gap: 'gap-6',
  gapSm: 'gap-4',
  gapLg: 'gap-8',
};

// Component Classes
export const components = {
  // Cards
  card: 'bg-white rounded-2xl border border-slate-200/60 shadow-sm',
  cardHover: 'hover:shadow-md transition-shadow',
  // Tables
  table: 'w-full text-right border-collapse',
  tableHeader: 'bg-slate-50/50',
  tableRow: 'hover:bg-slate-50/50 transition-colors group',
  tableDivider: 'divide-y divide-slate-100',
  // Buttons
  buttonPrimary: 'flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]',
  buttonSecondary: 'flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-all min-h-[44px]',
  buttonSuccess: 'flex items-center justify-center gap-2 bg-success-500 hover:bg-success-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm min-h-[44px]',
  buttonDanger: 'flex items-center justify-center gap-2 bg-error-500 hover:bg-error-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm min-h-[44px]',
  // Inputs
  input: 'w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400',
  select: 'w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none cursor-pointer',
  // Badges
  badgeBase: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
  // Status Badges
  badgePending: 'bg-warning-50 text-warning-700 border border-warning-200',
  badgeApproved: 'bg-success-50 text-success-700 border border-success-200',
  badgeRejected: 'bg-error-50 text-error-700 border border-error-200',
  badgeVerifying: 'bg-info-50 text-info-700 border border-info-200',
  badgeActive: 'bg-success-50 text-success-700 border border-success-200',
  badgeInactive: 'bg-slate-100 text-slate-600 border border-slate-200',
  // Action Buttons
  actionButton: 'p-2 rounded-xl transition-colors',
  actionView: 'text-blue-600 hover:bg-blue-50',
  actionEdit: 'text-amber-600 hover:bg-amber-50',
  actionDelete: 'text-error-600 hover:bg-error-50',
  // Avatars
  avatar: 'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm',
  avatarSm: 'w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs',
  avatarLg: 'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-base',
};

// Status Badge Helper
export const getStatusBadge = (status: string): string => {
  const badges: Record<string, string> = {
    pending: components.badgePending,
    verifying: components.badgeVerifying,
    verified: components.badgeVerifying,
    approved: components.badgeApproved,
    rejected: components.badgeRejected,
    active: components.badgeActive,
    inactive: components.badgeInactive,
  };
  return badges[status] || components.badgeInactive;
};

// Helper Functions
export const formatNumber = (num: number | string): string => {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '0';
  return n.toLocaleString('en-US');
};

export const formatCurrency = (amount: number | string, currency: string = 'USD'): string => {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(n)) return '0';
  const symbols: Record<string, string> = { USD: '$', SAR: 'ر.س', YER: 'ر.ي', EUR: '€' };
  return `${symbols[currency] || ''}${formatNumber(n)}`;
};

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateArabic = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 12) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  return phone;
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Avatar Colors
export const avatarColors = [
  'bg-primary-100 text-primary-700',
  'bg-success-100 text-success-700',
  'bg-warning-100 text-warning-700',
  'bg-error-100 text-error-700',
  'bg-info-100 text-info-700',
];

export const getAvatarColor = (name: string): string => {
  const index = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
};

// Standardized Design Tokens - Use these values consistently
export const designTokens = {
  // Border Radius
  borderRadius: {
    sm: 'rounded-lg',      // 0.5rem
    md: 'rounded-xl',      // 0.75rem
    lg: 'rounded-2xl',     // 1rem
    xl: 'rounded-3xl',     // 1.5rem
    full: 'rounded-full',
  },
  
  // Spacing
  spacing: {
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  },

  // Shadows
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  },

  // Typography
  typography: {
    heading1: 'text-3xl font-black',
    heading2: 'text-2xl font-black',
    heading3: 'text-xl font-bold',
    body: 'text-base font-normal',
    small: 'text-sm',
    caption: 'text-xs text-slate-500',
  },

  // Colors (semantic)
  colors: {
    primary: {
      bg: 'bg-primary-600',
      bgHover: 'hover:bg-primary-700',
      text: 'text-primary-600',
      border: 'border-primary-600',
    },
    success: {
      bg: 'bg-green-500',
      bgLight: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-200',
    },
    warning: {
      bg: 'bg-amber-500',
      bgLight: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-200',
    },
    error: {
      bg: 'bg-red-500',
      bgLight: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-200',
    },
  },
};

// Standard component classes
export const standardClasses = {
  // Cards
  card: 'bg-white rounded-2xl shadow-sm border border-slate-200 p-6',
  cardHover: 'bg-white rounded-2xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow',

  // Buttons
  buttonPrimary: 'bg-primary-600 text-white rounded-xl px-4 py-2.5 min-h-[44px] font-bold hover:bg-primary-700 transition-colors',
  buttonSecondary: 'bg-slate-100 text-slate-900 rounded-xl px-4 py-2.5 min-h-[44px] font-bold hover:bg-slate-200 transition-colors',
  buttonOutline: 'border-2 border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 min-h-[44px] font-bold hover:bg-slate-50 transition-colors',
  buttonDanger: 'bg-red-600 text-white rounded-xl px-4 py-2.5 min-h-[44px] font-bold hover:bg-red-700 transition-colors',

  // Forms
  input: 'w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors min-h-[44px]',
  select: 'w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors min-h-[44px] bg-white',
  textarea: 'w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none',

  // Alerts
  alertSuccess: 'bg-green-50 border-r-4 border-green-500 text-green-800 rounded-xl p-4',
  alertError: 'bg-red-50 border-r-4 border-red-500 text-red-800 rounded-xl p-4',
  alertWarning: 'bg-amber-50 border-r-4 border-amber-500 text-amber-800 rounded-xl p-4',
  alertInfo: 'bg-blue-50 border-r-4 border-blue-500 text-blue-800 rounded-xl p-4',

  // Badges
  badgeSuccess: 'bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-bold',
  badgeError: 'bg-red-100 text-red-700 rounded-full px-3 py-1 text-sm font-bold',
  badgeWarning: 'bg-amber-100 text-amber-700 rounded-full px-3 py-1 text-sm font-bold',
  badgeInfo: 'bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-bold',
};
