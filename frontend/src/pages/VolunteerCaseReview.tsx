import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { 
  Loader2, FileText, Calendar, User, Clock, Check, X, 
  ChevronLeft, AlertCircle, CheckCircle, AlertTriangle, 
  Stethoscope, MapPin, DollarSign, Phone, Mail
} from 'lucide-react';

export const VolunteerCaseReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState('');
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: caseData, isLoading } = useQuery({
    queryKey: ['volunteer-case', id],
    queryFn: () => api.get(`/volunteer/cases/${id}`),
    enabled: !!id,
  });

  const caseItem = caseData?.data?.data;

  const handleSubmit = async () => {
    if (!decision) {
      alert('الرجاء اختيار قرار (اعتماد أو رفض)');
      return;
    }
    if (decision === 'rejected' && !notes.trim()) {
      alert('الرجاء إضافة سبب الرفض');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/volunteer/cases/${id}/verify`, {
        status: decision,
        notes: notes
      });
      queryClient.invalidateQueries({ queryKey: ['volunteer-cases'] });
      navigate('/volunteer/cases');
      alert(decision === 'approved' ? '✅ تم اعتماد الحالة بنجاح' : '❌ تم رفض الحالة');
    } catch (error) {
      alert('❌ فشل إرسال القرار');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!caseItem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-xl font-bold text-slate-700">الحالة غير موجودة</p>
          <Link to="/volunteer/cases" className="text-primary-600 font-bold mt-4 inline-block">
            العودة للقائمة
          </Link>
        </div>
      </div>
    );
  }

  const isVerifying = caseItem.status === 'verifying';
  const isCompleted = caseItem.status === 'verified' || caseItem.status === 'rejected';

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/volunteer/cases')}
          className="flex items-center gap-2 text-slate-600 font-bold mb-4 hover:text-slate-900"
        >
          <ChevronLeft className="w-5 h-5" />
          العودة للقائمة
        </button>

        {/* Compact Status Alert */}
        {!isCompleted && (
          <div className={`rounded-xl p-4 mb-6 ${
            isVerifying ? 'bg-blue-50 border border-blue-200' : 'bg-amber-50 border border-amber-200'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                {isVerifying ? (
                  <Clock className="w-5 h-5 text-blue-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                )}
                <div>
                  <p className="font-bold text-slate-900">
                    {isVerifying ? 'قيد المراجعة والتدقيق' : 'بانتظار المراجعة'}
                  </p>
                  <p className="text-sm text-slate-600">
                    {isVerifying ? 'أكمل المراجعة واعتمد أو رفض الحالة' : 'ابدأ المراجعة للتحقق من المستندات'}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                caseItem.priority === 'critical' ? 'bg-red-100 text-red-700' :
                caseItem.priority === 'urgent' ? 'bg-orange-100 text-orange-700' :
                'bg-slate-100 text-slate-600'
              }`}>
                {caseItem.priority === 'critical' ? 'حرجة' : 
                 caseItem.priority === 'urgent' ? 'عاجلة' : 'عادية'}
              </span>
            </div>
          </div>
        )}

        {/* Completed Status Banner */}
        {caseItem.status === 'verified' && (
          <div className="rounded-xl p-4 mb-6 bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="font-bold text-emerald-900">تم اعتماد هذه الحالة</p>
                <p className="text-sm text-emerald-700">تم التحقق من المستندات واعتماد الحالة</p>
              </div>
            </div>
          </div>
        )}

        {caseItem.status === 'rejected' && (
          <div className="rounded-xl p-4 mb-6 bg-red-50 border border-red-200">
            <div className="flex items-center gap-3">
              <X className="w-6 h-6 text-red-600" />
              <div>
                <p className="font-bold text-red-900">تم رفض هذه الحالة</p>
                <p className="text-sm text-red-700">{caseItem.verification_notes || 'رفضت لعدم استيفاء الشروط'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Sticky Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-4 space-y-4">
              
              {/* Verification Panel */}
              {!isCompleted && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                  <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                    قرار المراجعة
                  </h3>
                  
                  {/* Decision Selection */}
                  <div className="space-y-3 mb-4">
                    <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      decision === 'approved' 
                        ? 'border-emerald-500 bg-emerald-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input 
                        type="radio" 
                        name="decision" 
                        checked={decision === 'approved'}
                        onChange={() => setDecision('approved')}
                        className="w-5 h-5 text-emerald-600"
                      />
                      <Check className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-slate-900">اعتماد الحالة</span>
                    </label>
                    
                    <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      decision === 'rejected' 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input 
                        type="radio" 
                        name="decision" 
                        checked={decision === 'rejected'}
                        onChange={() => setDecision('rejected')}
                        className="w-5 h-5 text-red-600"
                      />
                      <X className="w-5 h-5 text-red-600" />
                      <span className="font-bold text-slate-900">رفض الحالة</span>
                    </label>
                  </div>

                  {/* Notes */}
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={decision === 'rejected' ? "أضف سبب الرفض..." : "ملاحظاتك (اختياري)..."}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none min-h-[100px] resize-none mb-4 text-sm"
                  />

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !decision}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      decision === 'rejected'
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : decision === 'rejected' ? (
                      <>
                        <X className="w-5 h-5" />
                        رفض الحالة
                      </>
                    ) : decision === 'approved' ? (
                      <>
                        <Check className="w-5 h-5" />
                        اعتماد الحالة
                      </>
                    ) : (
                      'اختر قراراً للمتابعة'
                    )}
                  </button>
                </div>
              )}

              {/* Cost Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary-600" />
                  التكلفة التقديرية
                </h3>
                <p className="font-black text-primary-600 text-3xl text-center py-2">
                  {caseItem.currency} {caseItem.estimated_cost?.toLocaleString()}
                </p>
              </div>

              {/* Case Info Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="font-black text-slate-900 mb-4">معلومات الحالة</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">تاريخ التقديم</p>
                      <p className="font-bold text-slate-900 text-sm">
                        {new Date(caseItem.created_at).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">المستندات</p>
                      <p className="font-bold text-slate-900 text-sm">{caseItem.documents?.length || 0} مستند</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">مقدم الطلب</p>
                      <p className="font-bold text-slate-900 text-sm">{caseItem.user?.name || 'غير معروف'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="font-black text-slate-900 mb-4">سجل الحالة</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">تم تقديم الحالة</p>
                      <p className="text-xs text-slate-500">
                        {new Date(caseItem.created_at).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                  {(caseItem.status === 'verifying' || caseItem.status === 'verified' || caseItem.status === 'rejected') && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">قيد المراجعة</p>
                        <p className="text-xs text-slate-500">بدأ المتطوع المراجعة</p>
                      </div>
                    </div>
                  )}
                  {caseItem.status === 'verified' && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">تم الاعتماد</p>
                        <p className="text-xs text-slate-500">تحقق المتطوع من المستندات</p>
                      </div>
                    </div>
                  )}
                  {caseItem.status === 'rejected' && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">تم الرفض</p>
                        <p className="text-xs text-slate-500">لم تستوفِ الشروط</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-4">
            
            {/* Patient Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-600" />
                  معلومات المريض
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">اسم المريض</p>
                  <p className="font-bold text-slate-900">{caseItem.patient_name}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">العمر</p>
                  <p className="font-bold text-slate-900">{caseItem.age} سنة</p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <Stethoscope className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-500 mb-1">الحالة المرضية</p>
                    <p className="font-bold text-slate-900 text-lg">{caseItem.disease}</p>
                    {caseItem.description && (
                      <p className="text-sm text-slate-600 mt-2">{caseItem.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Hospital Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-600" />
                معلومات المستشفى
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">اسم المستشفى</p>
                  <p className="font-bold text-slate-900">{caseItem.hospital_name}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">الموقع</p>
                  <p className="font-bold text-slate-900">{caseItem.hospital_country} - {caseItem.city}</p>
                </div>
              </div>
            </div>

            {/* Documents Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-600" />
                المستندات ({caseItem.documents?.length || 0})
              </h2>
              {caseItem.documents && caseItem.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {caseItem.documents.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-slate-400" />
                        <div>
                          <p className="font-bold text-slate-700 text-sm">{doc.file_name || `مستند ${index + 1}`}</p>
                          <p className="text-xs text-slate-500">{doc.file_type || 'PDF'}</p>
                        </div>
                      </div>
                      <button className="text-primary-600 font-bold text-sm hover:underline px-3 py-1">
                        عرض
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>لا توجد مستندات مرفقة</p>
                </div>
              )}
            </div>

            {/* Contact Info (if available) */}
            {caseItem.contact_phone && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary-600" />
                  معلومات الاتصال
                </h2>
                <div className="flex flex-wrap gap-4">
                  {caseItem.contact_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="font-bold text-slate-900">{caseItem.contact_phone}</span>
                    </div>
                  )}
                  {caseItem.contact_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="font-bold text-slate-900">{caseItem.contact_email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerCaseReview;
