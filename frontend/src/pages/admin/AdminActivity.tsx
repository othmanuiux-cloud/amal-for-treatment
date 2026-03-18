import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../api';

// SVG Icons
const ActivityIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const CaseIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export default function AdminActivity() {
    // Since we don't have a specific activity endpoint in the API yet,
    // we'll combine recent cases and recent users as "Activity".
    const { data: casesData, isLoading: isLoadingCases } = useQuery({
        queryKey: ['admin', 'recent-cases'],
        queryFn: () => adminApi.getCasesForApproval({ page: 1 }),
    });

    const { data: usersData, isLoading: isLoadingUsers } = useQuery({
        queryKey: ['admin', 'recent-users'],
        queryFn: () => adminApi.getUsers({ page: 1 }),
    });

    const isLoading = isLoadingCases || isLoadingUsers;

    const cases = casesData?.data?.data || [];
    const users = usersData?.data?.data || [];

    // Transform into a unified activity feed
    const activity = [
        ...cases.map((c: any) => ({
            id: `case-${c.id}`,
            type: 'case',
            title: 'حالة طبية جديدة',
            content: `تم تسجيل حالة "${c.patient_name}" بتشخيص "${c.disease}"`,
            time: c.created_at,
            icon: CaseIcon,
            color: 'bg-primary-50 text-primary-600',
        })),
        ...users.map((u: any) => ({
            id: `user-${u.id}`,
            type: 'user',
            title: 'مستخدم جديد',
            content: `انضم "${u.name}" إلى المنصة كـ ${u.role === 'admin' ? 'مدير' : u.role === 'volunteer' ? 'متطوع' : 'مريض'}`,
            time: u.created_at,
            icon: UserIcon,
            color: 'bg-indigo-50 text-indigo-600',
        })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Immersive Header */}
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">سجل النشاطات</h1>
                <p className="text-slate-500 font-bold max-w-lg">متابعة كافة العمليات والتحركات الأخيرة على المنصة بشكل مباشر.</p>
            </div>

            <div className="bg-white rounded-[48px] shadow-2xl shadow-slate-200/40 border border-slate-50 overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                            <ActivityIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">النشاطات الأخيرة</h3>
                    </div>
                    <span className="px-4 py-2 bg-slate-50 text-slate-400 rounded-full text-xs font-black uppercase tracking-widest">Live Updates</span>
                </div>

                <div className="p-10">
                    {isLoading ? (
                        <div className="space-y-6">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex gap-6 animate-pulse">
                                    <div className="w-14 h-14 bg-slate-100 rounded-2xl shrink-0"></div>
                                    <div className="flex-1 space-y-3 py-2">
                                        <div className="h-4 bg-slate-100 rounded-full w-1/4"></div>
                                        <div className="h-6 bg-slate-50 rounded-full w-3/4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : activity.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 font-bold">لا توجد نشاطات مسجلة حالياً</div>
                    ) : (
                        <div className="space-y-0 relative">
                            {/* Timeline Line */}
                            <div className="absolute right-7 top-0 bottom-0 w-px bg-slate-100"></div>

                            {activity.map((item) => (
                                <div key={item.id} className="relative flex gap-8 pb-12 last:pb-0 group">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform duration-500 group-hover:scale-110 relative z-10 ${item.color}`}>
                                        <item.icon className="w-6 h-6" />
                                    </div>

                                    <div className="flex-1 py-1">
                                        <div className="flex items-center justify-between gap-4 mb-2">
                                            <h4 className="text-lg font-black text-slate-900">{item.title}</h4>
                                            <span className="text-xs font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">
                                                {new Date(item.time).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 font-bold leading-relaxed">{item.content}</p>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">
                                            {new Date(item.time).toLocaleDateString('ar-SA', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-10 bg-slate-50/50 text-center border-t border-slate-50">
                    <button className="text-primary-600 font-black text-sm hover:underline underline-offset-8 transition-all">تحميل المزيد من السجلات</button>
                </div>
            </div>
        </div>
    );
}
