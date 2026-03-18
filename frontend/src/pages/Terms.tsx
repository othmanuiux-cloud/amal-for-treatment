export default function Terms() {
    return (
        <div className="min-h-screen pt-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-right">
                <h1 className="text-4xl font-black text-slate-900 mb-8">شروط الاستخدام</h1>

                <div className="prose prose-slate prose-lg max-w-none font-bold text-slate-600 leading-relaxed space-y-8">
                    <section>
                        <h2 className="text-2xl font-black text-slate-800 mb-4">1. قبول الشروط</h2>
                        <p>باستخدامك لمنصة أمل، فإنك توافق على الالتزام بشروط الاستخدام المذكورة هنا وفي سياسة الخصوصية.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-800 mb-4">2. دور المنصة</h2>
                        <p>منصة أمل هي وسيط تطوعي مجاني يهدف لربط المتبرعين بالمستشفيات لعلاج الحالات الطبية. المنصة لا تقدم خدمات طبية ولا تستلم أية تبرعات مالية.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-800 mb-4">3. مسؤولية المتبرع</h2>
                        <p>يتحمل المتبرع مسؤولية التأكد من رقم ملف المريض والتواصل المباشر مع الحساب البنكي الرسمي للمستشفى المنشور في صفحة الحالة. المنصة تخلي مسؤوليتها عن أي مبالغ تدفع لأي جهات أخرى أو أشخاص.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-800 mb-4">4. صحة المعلومات</h2>
                        <p>يلتزم مقدم الحالة بتقديم معلومات وتقارير طبية صحيحة وحديثة. في حال اكتشاف تلاعب، سيتم حذف الحالة واتخاذ الإجراءات اللازمة.</p>
                    </section>

                    <footer className="pt-10 border-t border-slate-100">
                        <p className="text-sm text-slate-400">آخر تحديث: مارس 2024</p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
