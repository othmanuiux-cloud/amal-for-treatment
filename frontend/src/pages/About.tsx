import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className="min-h-screen pt-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-slate-900 py-24 md:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-slate-900 to-slate-900 z-0"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-right">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                            تعرف على <span className="text-primary-400">منصة أمل</span>
                        </h1>
                        <p className="text-xl text-slate-300 mb-10 leading-relaxed font-medium">
                            نحن جسر إنساني يربط بين المرضى المحتاجين وأصحاب الأيادي البيضاء، لضمان وصول المساعدة الطبية لمن يستحقها بشفافية مطلقة وأمان كامل.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 space-y-8 text-right">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 mb-4 flex items-center gap-3 justify-end">
                                    رسالتنا
                                    <span className="w-2 h-8 bg-primary-600 rounded-full"></span>
                                </h2>
                                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                    تخفيف معاناة المرضى في اليمن من خلال توفير منصة تقنية متطورة تعرض حالاتهم الطبية الموثقة، وتتيح للمتبرعين المساهمة في تكاليف علاجهم مباشرة للمستشفيات المعالجة.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 mb-4 flex items-center gap-3 justify-end">
                                    رؤيتنا
                                    <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                                </h2>
                                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                    أن نكون الموقع الأول والأكثر موثوقية في اليمن والمنطقة للوساطة الطبية التطوعية، مع تحقيق صفر عمولة وضمان وصول كل ريال للمرفق الطبي مباشرة.
                                </p>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-primary-600 blur-2xl opacity-10 group-hover:opacity-20 transition-opacity rounded-full"></div>
                                <div className="relative bg-slate-50 border border-slate-100 rounded-[40px] p-12 shadow-2xl shadow-slate-200/50">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 text-center">
                                            <div className="text-3xl font-black text-primary-600 mb-1">+500</div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">حالة عولجت</div>
                                        </div>
                                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 text-center translate-y-8">
                                            <div className="text-3xl font-black text-emerald-600 mb-1">0%</div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">عمولة تشغيل</div>
                                        </div>
                                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 text-center">
                                            <div className="text-3xl font-black text-indigo-600 mb-1">+50</div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">مستشفى شريك</div>
                                        </div>
                                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 text-center translate-y-8">
                                            <div className="text-3xl font-black text-amber-600 mb-1">+200</div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">متطوع نشط</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-16">قيمنا الجوهرية</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-10 rounded-[32px] shadow-xl shadow-slate-200/40 border border-white">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-4">الشفافية المطلقة</h3>
                            <p className="text-slate-600 leading-relaxed font-bold text-sm">لا نستلم أي تبرعات نقدية، بل نوجه المتبرع للدفع المباشر لحساب المستشفى، مما يضمن وصول المساعدة لهدفها.</p>
                        </div>
                        <div className="bg-white p-10 rounded-[32px] shadow-xl shadow-slate-200/40 border border-white">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-4">الإنسانية أولاً</h3>
                            <p className="text-slate-600 leading-relaxed font-bold text-sm">نتعامل مع كل حالة بكرامة وخصوصية، ونسعى لتوفير أفضل رعاية ممكنة بغض النظر عن انتمائات المريض.</p>
                        </div>
                        <div className="bg-white p-10 rounded-[32px] shadow-xl shadow-slate-200/40 border border-white">
                            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-4">السرعة والاستجابة</h3>
                            <p className="text-slate-600 leading-relaxed font-bold text-sm">ندرك أن عامل الوقت حاسم في الحالات الطبية، لذا نعمل على تدقيق ونشر الحالات في أسرع وقت ممكن.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-primary-600 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight">
                        انضم إلينا في مسيرتنا الإنسانية
                    </h2>
                    <p className="text-primary-100 text-lg mb-12 font-medium">
                        تواصل معنا للمقترحات، أو سجل كمتطوع لتساعد في التحقق من الحالات الميدانية.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/contact" className="bg-white text-primary-600 px-12 py-4 rounded-2xl font-black hover:bg-primary-50 transition-all shadow-xl">
                            تواصل معنا
                        </Link>
                        <Link to="/register" className="bg-primary-700 text-white border border-primary-500 px-12 py-4 rounded-2xl font-black hover:bg-primary-800 transition-all">
                            سجل كمتطوع
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
