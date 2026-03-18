import { useQuery } from '@tanstack/react-query';
import { casesApi } from '../api';
import { Case } from '../types';
import CaseCard from '../components/cases/CaseCard';

export default function PublishedCases() {

    const { data: casesData, isLoading } = useQuery({
        queryKey: ['cases', 'published'],
        queryFn: async () => {
            const response = await casesApi.getPublished({ page: 1 });
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-right mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                        الحالات المعتمدة
                    </h1>
                    <p className="text-slate-500 font-bold text-lg">
                        قائمة بجميع الحالات الطبية التي تم التحقق منها واعتمادها للنشر
                    </p>
                    <div className="w-24 h-2 bg-primary-600 mt-6 rounded-full ml-auto"></div>
                </div>

                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-3xl h-80 animate-pulse border border-slate-100"></div>
                        ))}
                    </div>
                ) : casesData?.data?.length ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {casesData.data.map((caseItem: Case) => (
                            <CaseCard key={caseItem.id} caseData={caseItem} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[40px] py-32 text-center border border-slate-100 shadow-sm">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">لا توجد حالات معتمدة حالياً</h3>
                        <p className="text-slate-500 font-bold">يرجى العودة لاحقاً لمتابعة الحالات الجديدة</p>
                    </div>
                )}
            </div>
        </div>
    );
}
