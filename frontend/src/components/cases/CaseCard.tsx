import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Case } from '../../types';
import { Eye, MapPin, Building2, Banknote, AlertCircle, ChevronLeft, Share2 } from 'lucide-react';
import ShareCaseModal from './ShareCaseModal';

interface CaseCardProps {
  caseData: Case;
}

export default function CaseCard({ caseData }: CaseCardProps) {
  const { t } = useTranslation();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    setIsShareModalOpen(false);
  }, []);

  const shareCaseDataProps = useMemo(() => ({
    id: caseData.id,
    patientName: caseData.patient_name,
    title: caseData.disease,
    cost: caseData.estimated_cost || 0,
    country: caseData.hospital_country,
    hospital: caseData.hospital_name
  }), [caseData.id, caseData.patient_name, caseData.disease, caseData.estimated_cost, caseData.hospital_country, caseData.hospital_name]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-900';
      case 'verifying':
        return 'bg-blue-100 text-blue-900';
      case 'verified':
        return 'bg-indigo-100 text-indigo-900';
      case 'rejected':
        return 'bg-rose-100 text-rose-900';
      default:
        return 'bg-slate-100 text-slate-900';
    }
  };

  const getPriorityBadgeClasses = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'high':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-xl shadow-slate-200/30 border border-slate-100 p-7 hover:shadow-2xl hover:shadow-primary-500/15 hover:-translate-y-2 transition-all duration-500 h-full flex flex-col relative overflow-hidden group/card">
      
      {/* Decorative background blob */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary-50/50 rounded-full blur-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"></div>
      
      {/* Top Header: Stats & Badges */}
      <div className="flex justify-between items-center mb-6 relative z-10 w-full">
        <div className="flex items-center gap-3">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${getStatusColor(caseData.status)}`}>
            {t(`case.statuses.${caseData.status}`)}
          </span>
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-sm ${getPriorityBadgeClasses(caseData.priority)}`}>
            <AlertCircle className="w-3.5 h-3.5" />
            {t(`case.priorities.${caseData.priority}`)}
          </span>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-50/80 backdrop-blur-sm px-3 py-1.5 rounded-2xl border border-slate-100/50 text-slate-600 group-hover/card:text-primary-600 transition-colors">
          <Eye className="w-4 h-4" />
          <span className="text-xs font-black tracking-tighter">{caseData.views || 0}</span>
        </div>
      </div>

      {/* Body: High-Hierarchy Title */}
      <div className="flex-1 mb-6 relative z-10 flex flex-col">
        <div className="mb-4">
          <h3 className="text-2xl font-black text-slate-900 group-hover/card:text-primary-600 transition-colors leading-[1.2] mb-2 antialiased">
            {caseData.patient_name}
          </h3>
          <div className="inline-flex items-center px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-black text-[10px] uppercase tracking-wider">
            {caseData.disease}
          </div>
        </div>

        {/* Details List with perfect alignment */}
        <div className="space-y-4 bg-slate-50/30 p-5 rounded-3xl border border-slate-100/40 mt-auto">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover/card:text-primary-400 transition-colors shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">المستشفى</span>
              <span className="text-sm font-black text-slate-700 truncate">{caseData.hospital_name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover/card:text-primary-400 transition-colors shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">الموقع الجغرافي</span>
              <span className="text-sm font-black text-slate-700 flex items-center gap-1.5">
                {caseData.hospital_country}
                {caseData.city && <span className="w-1 h-1 bg-slate-300 rounded-full"></span>}
                {caseData.city && <span className="text-slate-500 font-bold">{caseData.city}</span>}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Balanced Actions */}
      <div className="flex flex-col gap-5 pt-6 border-t border-slate-100 mt-auto relative z-10">
        {caseData.estimated_cost && (
          <div className="flex items-end justify-between px-1">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">التكلفة التقديرية</span>
              <div className="flex items-center gap-2 text-primary-600 font-black text-2xl tracking-tighter">
                <Banknote className="w-6 h-6 opacity-40" />
                <span>{caseData.estimated_cost.toLocaleString()} <span className="text-sm font-bold">{caseData.currency}</span></span>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsShareModalOpen(true);
              }
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsShareModalOpen(true);
              }
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-4 bg-white text-slate-600 rounded-lg font-black text-sm border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-200 hover:text-slate-900 transition-all active:scale-95 group/share"
            aria-label="مشاركة الحالة"
          >
            <Share2 className="w-5 h-5 group-hover/share:rotate-12 transition-transform" />
            <span>مشاركة حالة</span>
          </button>
          
          <Link
            to={`/cases/${caseData.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-4 bg-primary-600 text-white rounded-lg font-black text-sm shadow-xl shadow-primary-900/20 hover:bg-primary-500 hover:-translate-y-0.5 transition-all active:scale-95 group/btn"
          >
            {t('common.view')}
            <ChevronLeft className="w-5 h-5 group-hover/btn:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <ShareCaseModal 
        isOpen={isShareModalOpen}
        onClose={handleCloseModal}
        caseData={shareCaseDataProps}
      />
    </div>
  );
}
