import { useState } from 'react';

export default function Contact() {
    const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // In a real app, you'd send this to an API
    };

    return (
        <div className="min-h-screen pt-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">تواصل معنا</h1>
                    <p className="text-lg text-slate-500 font-bold max-w-2xl mx-auto">نحن هنا للإجابة على جميع استفساراتكم. تواصلوا معنا وسنقوم بالرد في أقرب وقت ممكن.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/40 border border-white">
                            <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 00-2 2z" /></svg>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2">البريد الإلكتروني</h3>
                            <p className="text-slate-500 font-bold">info@amal-yemen.org</p>
                        </div>

                        <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/40 border border-white">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2">المقر الرئيسي</h3>
                            <p className="text-slate-500 font-bold">حضرموت، اليمن</p>
                        </div>

                        <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/40 border border-white">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2">ساعات العمل</h3>
                            <p className="text-slate-500 font-bold">الأحد - الخميس: 9:00 ص - 5:00 م</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2">
                        <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-white">
                            {submitted ? (
                                <div className="text-center py-20">
                                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-4">تم الإرسال بنجاح!</h2>
                                    <p className="text-slate-500 font-bold">شكراً لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.</p>
                                    <button onClick={() => setSubmitted(false)} className="mt-8 text-primary-600 font-black hover:underline px-4">إرسال رسالة أخرى</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-black text-slate-700 mb-2 text-right">الاسم بالكامل</label>
                                            <input
                                                type="text"
                                                required
                                                value={formState.name}
                                                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                                placeholder="أدخل اسمك"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-slate-700 mb-2 text-right">البريد الإلكتروني</label>
                                            <input
                                                type="email"
                                                required
                                                value={formState.email}
                                                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                                placeholder="example@mail.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black text-slate-700 mb-2 text-right">الموضوع</label>
                                        <input
                                            type="text"
                                            required
                                            value={formState.subject}
                                            onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                            placeholder="كيف يمكننا مساعدتك؟"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black text-slate-700 mb-2 text-right">الرسالة</label>
                                        <textarea
                                            required
                                            rows={6}
                                            value={formState.message}
                                            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-primary-500 transition-all outline-none min-h-[150px]"
                                            placeholder="اكتب رسالتك هنا..."
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all hover:-translate-y-1 active:scale-95">
                                        إرسال الرسالة
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
