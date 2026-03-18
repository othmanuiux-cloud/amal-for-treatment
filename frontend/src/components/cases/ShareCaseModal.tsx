'use client';

import { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, MessageCircle, Twitter, Facebook, Mail, MessageSquare, Link, Check } from 'lucide-react';

interface ShareCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: {
    id: string | number;
    patientName: string;
    title: string;
    cost: number;
    country: string;
    hospital: string;
    url?: string;
  };
}

// ✅ استخدام memo لمنع الـ re-rendering غير الضروري
const ShareCaseModal = memo(({ isOpen, onClose, caseData }: ShareCaseModalProps) => {
  const [copied, setCopied] = useState(false);
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // التأكد من أن المكون مركب في المتصفح لاستخدام Portals
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // ✅ إدارة الـ keyboard events ومنع الـ scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, onClose]);

  const caseUrl = useMemo(() => {
    if (caseData.url) return caseData.url;
    return typeof window !== 'undefined' ? window.location.href : '';
  }, [caseData.url]);
  
  const safeCost = useMemo(() => {
    const cost = Number(caseData.cost);
    return isNaN(cost) ? 0 : cost;
  }, [caseData.cost]);

  const whatsappMessage = useMemo(() => `🤝 حالة مرضية متعثرة

💰 قيمة العلاج: $${safeCost.toLocaleString()}
📍 الدولة: ${caseData.country || ''}
🏥 المستشفى: ${caseData.hospital || ''}

✨ ساهم في إنقاذ حياة هذا المريض
${caseUrl}`, [safeCost, caseData.country, caseData.hospital, caseUrl]);

  const twitterMessage = useMemo(() => `🤝 حالة مرضية متعثرة بقيمة $${safeCost.toLocaleString()} في ${caseData.country || ''}
🏥 ${caseData.hospital || ''}
${caseUrl}`, [safeCost, caseData.country, caseData.hospital, caseUrl]);

  const facebookMessage = useMemo(() => `حالة مرضية متعثرة تحتاج لدعمكم
قيمة العلاج: $${safeCost.toLocaleString()}
${caseUrl}`, [safeCost, caseUrl]);

  const emailSubject = useMemo(() => `مشاركة حالة مرضية - ${caseData.patientName || ''}`, [caseData.patientName]);
  const emailBody = useMemo(() => `السلام عليكم،

أود مشاركة حالة مرضية متعثرة تحتاج لدعمكم.

المريض: ${caseData.patientName || ''}
قيمة العلاج: $${safeCost.toLocaleString()}
الدولة: ${caseData.country || ''}
المستشفى: ${caseData.hospital || ''}

رابط الحالة: ${caseUrl}

جزاكم الله خيراً`, [caseData.patientName, safeCost, caseData.country, caseData.hospital, caseUrl]);

  const smsMessage = useMemo(() => `حالة مرضية متعثرة بقيمة $${safeCost.toLocaleString()} في ${caseData.country || ''} - ${caseUrl}`, [safeCost, caseData.country, caseUrl]);

  const handleShare = useCallback((platform: string) => {
    setActivePlatform(platform);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterMessage)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(caseUrl)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        break;
      case 'sms':
        shareUrl = `sms:?body=${encodeURIComponent(smsMessage)}`;
        break;
      case 'copy':
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(caseUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
        setActivePlatform(null);
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setTimeout(() => setActivePlatform(null), 1000);
    }
  }, [caseUrl, whatsappMessage, twitterMessage, facebookMessage, emailSubject, emailBody, smsMessage]);

  const handleClose = useCallback(() => {
    setActivePlatform(null);
    setCopied(false);
    onClose();
  }, [onClose]);

  const shareOptions = useMemo(() => [
    {
      id: 'whatsapp',
      name: 'واتساب',
      icon: MessageCircle,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      id: 'twitter',
      name: 'تويتر',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      textColor: 'text-sky-600',
      bgColor: 'bg-sky-50',
    },
    {
      id: 'facebook',
      name: 'فيسبوك',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'email',
      name: 'إيميل',
      icon: Mail,
      color: 'bg-purple-500 hover:bg-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'sms',
      name: 'رسالة',
      icon: MessageSquare,
      color: 'bg-amber-500 hover:bg-amber-600',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      id: 'copy',
      name: copied ? 'تم النسخ' : 'نسخ الرابط',
      icon: copied ? Check : Link,
      color: copied ? 'bg-emerald-500' : 'bg-slate-600 hover:bg-slate-700',
      textColor: copied ? 'text-emerald-600' : 'text-slate-600',
      bgColor: copied ? 'bg-emerald-50' : 'bg-slate-50',
    },
  ], [copied]);

  if (!mounted || !isOpen) return null;

  // استخدام Portal لمنع مشاكل الـ Stacking Context والـ Flickering
  return createPortal(
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
      onClick={handleClose}
      style={{ isolation: 'isolate' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 id="share-modal-title" className="text-xl font-bold text-slate-900">مشاركة الحالة</h3>
            <p className="text-sm text-slate-500 mt-1">اختر طريقة المشاركة</p>
          </div>
          <button 
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-lg"
            aria-label="إغلاق"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Case Preview */}
        <div className="p-6 bg-slate-50/50">
          <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-lg">
                  {(caseData.patientName || 'H').charAt(0)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 truncate">{caseData.patientName || 'حالة طبية'}</p>
                <p className="text-xs text-slate-500 truncate">{caseData.title || ''}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm gap-4">
              <div className="flex items-center gap-2 text-slate-600 min-w-0 flex-1">
                <span className="flex-shrink-0">🏥</span>
                <span className="truncate">{caseData.hospital || ''}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 min-w-0 flex-1 justify-end">
                <span className="flex-shrink-0">📍</span>
                <span className="truncate">{caseData.country || ''}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-lg font-bold text-emerald-600">
                ${safeCost.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500">قيمة العلاج</p>
            </div>
          </div>
        </div>

        {/* Share Options Grid */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-3">
            {shareOptions.map((option) => {
              const Icon = option.icon;
              const isActive = activePlatform === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleShare(option.id)}
                  disabled={isActive}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'scale-95 opacity-70 cursor-not-allowed' 
                      : 'hover:scale-105 cursor-pointer'
                  } ${option.bgColor}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${option.color} text-white transition-all`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-medium ${option.textColor} text-center`}>
                    {option.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            🤝 شكراً لمساهمتك في نشر الخير
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
});

ShareCaseModal.displayName = 'ShareCaseModal';

export default ShareCaseModal;
