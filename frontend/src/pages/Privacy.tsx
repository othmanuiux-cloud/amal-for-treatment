export default function Privacy() {
    return (
        <div className="min-h-screen pt-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-right">
                <h1 className="text-4xl font-black text-slate-900 mb-8">سياسة الخصوصية</h1>

                <div className="prose prose-slate prose-lg max-w-none font-bold text-slate-600 leading-relaxed space-y-8">
                    <section>
                        <h2 className="text-2xl font-black text-slate-800 mb-4">1. مقدمة</h2>
                        <p>تلتزم منصة أمل بحماية خصوصية مستخدميها وحماية بياناتهم الشخصية. توضح هذه السياسة كيفية جمع البيانات واستخدامها وحمايتها.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-800 mb-4">2. المعلومات التي نجمعها</h2>
                        <ul className="list-disc pr-6 space-y-2">
                            <li>المعلومات الشخصية التي تقدمها عند التسجيل (الاسم، البريد الإلكتروني، رقم الهاتف).</li>
                            <li>التقارير الطبية والمستندات المرفقة عند تقديم حالة طبية.</li>
                            <li>بيانات الاستخدام وملفات تعريف الارتباط لتحسين تجربة المستخدم.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-800 mb-4">3. كيف نستخدم معلوماتك</h2>
                        <p>نستخدم المعلومات المحصلة فقط لغرض التحقق من الحالات الطبية ونشرها على المنصة، وللتواصل مع المستخدمين بخصوص طلباتهم.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-800 mb-4">4. حماية البيانات</h2>
                        <p>نطبق معايير أمنية صارمة لحماية بياناتكم من الوصول غير المصرح به أو التغيير أو الإفصاح.</p>
                    </section>

                    <section className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                        <h2 className="text-2xl font-black text-slate-800 mb-4">ملاحظة هامة</h2>
                        <p>لا تقوم المنصة بمشاركة بيانات المرضى الشخصية الحساسة (مثل الاسم الكامل أو الموقع الدقيق) للعلن، وتكتفي بنشر المعلومات الضرورية لجذب التبرعات فقط حفاظاً على كرامة المريض.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
