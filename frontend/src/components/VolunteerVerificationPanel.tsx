import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { volunteerApi } from '../api';

export default function VolunteerVerificationPanel({ caseData }: { caseData: any }) {
    const queryClient = useQueryClient();
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState<'approved' | 'rejected'>('approved');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');

    // A volunteer can start verification if case is pending or verifying, and they haven't started yet.
    // Check if current user is already in verifications list
    // Wait, we don't have user id here easily without useAuthStore, but we can pass it as a prop or get from store.

    const startMutation = useMutation({
        mutationFn: () => volunteerApi.startVerification(caseData.id, 'Starting verification process'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['case', String(caseData.id)] });
            queryClient.invalidateQueries({ queryKey: ['volunteer-cases'] });
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to start verification');
        }
    });

    const submitMutation = useMutation({
        mutationFn: () => volunteerApi.submitVerification(caseData.id, {
            status,
            notes,
            evidence_file: file || undefined
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['case', String(caseData.id)] });
            queryClient.invalidateQueries({ queryKey: ['volunteer-cases'] });
            setNotes('');
            setFile(null);
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to submit verification');
        }
    });

    // If status is not pending or verifying, don't show or show it's completed
    if (caseData.status === 'verified' || caseData.status === 'approved' || caseData.status === 'rejected') {
        return (
            <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 mt-8">
                <h3 className="text-xl font-black text-indigo-900 mb-2">لجنة التحقق (مغلق)</h3>
                <p className="text-indigo-800 font-bold">هذه الحالة قد استوفت جميع متطلبات التحقق وهي الآن في مرحلة متقدمة من المعالجة.</p>
            </div>
        );
    }

    // To check if this volunteer already started it, we'll see if `startMutation` fails or succeeds, or if we can see it in caseData.verifications
    // For simplicity, we can show "Start Verification" if they haven't submitted yet.

    return (
        <div className="bg-white rounded-[40px] shadow-2xl shadow-indigo-200/40 border border-indigo-50 p-8 mt-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-black text-slate-900">لوحة المتطوع للتحقق</h3>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-2xl font-bold text-sm border border-rose-100">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-3xl space-y-4 border border-slate-100">
                    <p className="text-slate-600 font-bold leading-relaxed">
                        كمتطوع، دورك هو التحقق من صحة هذه الحالة الطبية من خلال التواصل المباشر مع المرفق الطبي أو زيارة المريض للتأكد من احتياجه الفعلي.
                    </p>

                    <button
                        onClick={() => startMutation.mutate()}
                        disabled={startMutation.isPending}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50"
                    >
                        {startMutation.isPending ? 'جاري بدء التحقق...' : 'إعلان البدء في عملية التحقق'}
                    </button>
                </div>

                <div className="border-t border-slate-100 pt-6 space-y-4">
                    <h4 className="font-black text-slate-900 text-lg">تقديم نتيجة التحقق النهائي</h4>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setStatus('approved')}
                            className={`py-3 rounded-2xl font-black text-sm transition-all border-2 ${status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-500' : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'}`}
                        >
                            ✅ الحالة موثوقة ومطابقة
                        </button>
                        <button
                            onClick={() => setStatus('rejected')}
                            className={`py-3 rounded-2xl font-black text-sm transition-all border-2 ${status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-500' : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'}`}
                        >
                            ❌ الحالة غير مطابقة/مرفوضة
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-black text-slate-700 mb-2">ملاحظات ونتيجة التحري (إلزامي)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                            placeholder="اكتب بالتفصيل نتائج تواصلك أو زيارتك وما يثبت كلامك..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-black text-slate-700 mb-2">مرفق إثبات (اختياري)</label>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all"
                        />
                    </div>

                    <button
                        onClick={() => submitMutation.mutate()}
                        disabled={submitMutation.isPending || !notes.trim()}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50 mt-4"
                    >
                        {submitMutation.isPending ? 'جاري الإرسال...' : 'اعتماد وإرسال التقرير'}
                    </button>
                </div>
            </div>
        </div>
    );
}
