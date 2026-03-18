import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { casesApi } from '../api';
import { Case } from '../types';

import CaseCard from '../components/cases/CaseCard';

export default function Home() {
  const { t } = useTranslation();

  const { data: casesData, isLoading } = useQuery({
    queryKey: ['cases', 'published'],
    queryFn: async () => {
      const response = await casesApi.getPublished({ page: 1 });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 pt-8 md:pt-32 pb-16 md:pb-40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-slate-900 to-slate-900 z-0"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-right">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500/30 mb-8 slide-up">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-300 text-xs font-bold tracking-widest uppercase">المنصة لا تتلقى تبرعات - الدفع للمستشفى مباشرة</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-6 md:mb-8 leading-[1.3] md:leading-[1.15]">
              ساعد في علاج المحتاجين <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary-400 to-emerald-400">بشكل آمن ومباشر</span>
            </h1>
            <p className="text-base md:text-xl text-slate-300 mb-10 md:mb-12 max-w-2xl leading-relaxed font-medium">
              منصة أمل وسيط موثوق لعرض الحالات الطبية المعتمدة. الدفع يتم مباشرة لحسابات المستشفيات الرسمية - المنصة لا تتلقى أي مبالغ مالية لضمان الشفافية المطلقة.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8 md:mb-16">
              <Link
                to="/cases/published"
                className="w-full sm:w-auto bg-primary-600 text-white px-8 md:px-10 py-4 min-h-[44px] rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-primary-700 hover:shadow-2xl hover:shadow-primary-500/30 transition-opacity transition-transform duration-300 text-center flex items-center justify-center gap-2"
              >
                تصفح الحالات
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </Link>
              <Link
                to="/dashboard/cases/submit"
                className="w-full sm:w-auto bg-white/10 text-white backdrop-blur-sm border border-white/20 px-8 md:px-10 py-4 min-h-[44px] rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-white/20 transition-opacity transition-transform duration-300 text-center flex items-center justify-center gap-2"
              >
                قدم حالتك الطبية
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </Link>
            </div>

            {/* Trust Bar inside Hero */}
            <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center shrink-0">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div className="text-right">
                    <h2 className="text-lg font-bold text-white mb-0.5">حالات مُتحقق منها</h2>
                    <p className="text-sm text-slate-300">جميع الحالات مراجعة ومعتمدة طبياً</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center shrink-0">
                    <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <div className="text-right">
                    <h2 className="text-lg font-bold text-white mb-0.5">دفع مباشر وآمن</h2>
                    <p className="text-sm text-slate-300">يتم الدفع لحساب المستشفى مباشرة</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center shrink-0">
                    <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  </div>
                  <div className="text-right">
                    <h2 className="text-lg font-bold text-white mb-0.5">+500 حالة تم علاجها</h2>
                    <p className="text-sm text-slate-300">مئات الحالات شفيت بفضل الله</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Warning */}
      <section className="bg-rose-50 border-y border-rose-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shrink-0 animate-bounce-slow">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div className="text-center md:text-right">
              <h3 className="text-xl font-black text-rose-900 mb-1">تحذير هام لجميع المتبرعين</h3>
              <p className="text-rose-700 font-bold text-lg">
                الدفع يتم مباشرة لحساب المستشفى أو الجهة المعالجة فقط دون وسيط. يحظر تحويل أي أموال لأي شخص يدعي تمثيل المنصة، إذ تقتصر مهمتها على نشر الحالات وليس لها علاقة بأي تحويلات مالية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Amal */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-16">
            لماذا منصة أمل؟
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">تحقيق موثوق</h3>
              <p className="text-slate-600 leading-relaxed font-medium">يقوم فريقنا الطبي بالتأكد من التقارير والتواصل مع المستشفى المعالج لاعتماد الحالة بدقة قبل نشرها.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">دفع آمن</h3>
              <p className="text-slate-600 leading-relaxed font-medium">أنت تدفع للمستشفى مباشرة لتسديد فاتورة العلاج عبر حساباتهم البنكية المعتمدة دون وجود طرف ثالث.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="w-16 h-16 mx-auto bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">شفافية كاملة</h3>
              <p className="text-slate-600 leading-relaxed font-medium">كل المعلومات معلنة وتصلك تحديثات مستمرة عن تفاصيل العلاج وتطورات حالة المريض ونجاح العملية.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              كيف تتم مساعدة المرضى؟
            </h2>
            <div className="w-20 h-1.5 bg-primary-600 mx-auto rounded-full"></div>
            <p className="text-lg text-slate-600 mt-6 font-medium">خطوات بسيطة وشفافة تربط أصحاب الأيادي البيضاء بالمحتاجين للعلاج.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 lg:gap-10">
            {[
              { step: 1, title: 'المريض يقدم الحالة', desc: 'يقدم المريض أو أسرته طلب العلاج مرفقاً للتقارير وفاتورة المستشفى.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { step: 2, title: 'المنصة تتحقق', desc: 'استلام وتقييم التقارير والتواصل مع المستشفى للتأكد من الحالة.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
              { step: 3, title: 'نشر الحالة', desc: 'اعتماد ونشر بيانات الحالة بشفافية مع إخفاء الهوية للمحافظة على الخصوصية.', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
              { step: 4, title: 'الزائر يدفع مباشرة', desc: 'المتبرع يرى الحالة ويدفع مباشرة لحساب المستشفى دون أن تستلم المنصة مبالغ.', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-opacity transition-transform duration-300 relative group">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-600 transition-opacity transition-transform duration-300">
                  <svg className="w-7 h-7 text-primary-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-3 relative z-10">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-xs font-bold relative z-10">
                  {item.desc}
                </p>
                <div className="absolute top-6 left-6 text-6xl font-black text-slate-700 z-0 select-none transition-transform group-hover:scale-110 group-hover:text-primary-600">0{item.step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Cases */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="text-right">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                الحالات المعتمدة مؤخراً
              </h2>
              <p className="text-slate-500 font-medium">ساهم في نشر الأمل من خلال متابعة ودعم هذه الحالات</p>
            </div>
            <Link
              to="/cases/published"
              className="text-primary-600 hover:text-primary-700 font-bold flex items-center gap-2 group"
            >
              عرض جميع الحالات
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-50 rounded-3xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : casesData?.data?.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {casesData.data.slice(0, 6).map((caseItem: Case) => (
                <CaseCard key={caseItem.id} caseData={caseItem} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl py-20 text-center">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-slate-500 font-bold">{t('common.no_results')}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
            هل أنت مستعد لتكون جزءاً من التغيير؟
          </h2>
          <p className="text-primary-100 text-lg mb-12">
            سواء كنت مريضاً يحتاج للمساعدة، أو متطوعاً يرغب في المساهمة، بابنا مفتوح للجميع.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="bg-white text-primary-600 px-12 py-4 rounded-2xl font-bold hover:bg-primary-50 transition-opacity transition-transform shadow-xl">
              ابدأ الآن
            </Link>
            <Link to="/contact" className="bg-primary-700 text-white border border-primary-500 px-12 py-4 rounded-2xl font-bold hover:bg-primary-800 transition-opacity transition-transform">
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

