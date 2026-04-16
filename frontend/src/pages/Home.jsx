import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, ArrowRight, ChartColumnBig, MessageSquareText, ShieldCheck, Sparkles, Users, GraduationCap } from 'lucide-react';
import { getAuthUser } from '../lib/auth';

const Home = () => {
    const authUser = getAuthUser();

    const highlights = [
        {
            label: 'Quiz',
            value: '6 câu hỏi ngắn',
            detail: 'Xây dựng chân dung hướng nghiệp nhanh từ hành vi và sở thích',
            href: '/quiz',
            icon: BrainCircuit,
        },
        {
            label: 'Grades',
            value: 'Nhập tay hoặc auto-fill',
            detail: 'Cho thấy dữ liệu học tập đi vào khuyến nghị như thế nào',
            href: '/grades',
            icon: ChartColumnBig,
        },
        {
            label: 'Results',
            value: 'Top ngành + top trường',
            detail: 'Kết quả có giải thích rõ ràng để hỗ trợ quyết định thực tế',
            href: '/recommendations',
            icon: GraduationCap,
        },
        {
            label: 'Chatbot',
            value: 'Hỏi đáp hướng nghiệp',
            detail: 'Tạo cảm giác sản phẩm thông minh và có chiều sâu',
            href: '/chatbot',
            icon: MessageSquareText,
        },
    ];

    const pillars = [
        {
            title: 'Giải quyết một pain point rõ ràng',
            text: 'Học sinh cần một nơi gom quiz, điểm học, gợi ý ngành và giải thích theo cùng một trải nghiệm.',
        },
        {
            title: 'Vận hành được ngay trong môi trường thực tế',
            text: 'Luồng nghiệp vụ đủ rõ để dùng trong tư vấn hướng nghiệp nội bộ và các phiên làm việc với học sinh.',
        },
        {
            title: 'Khung mở rộng tốt',
            text: 'Khi cần, có thể thay mock bằng dữ liệu thật mà không phá vỡ toàn bộ UI đang có.',
        },
    ];

    return (
        <div className="space-y-8 lg:space-y-10">
            <section className="glass-card rounded-[2rem] p-6 md:p-8 lg:p-10 relative overflow-hidden">
                <div className="relative z-10 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
                    <div className="space-y-6 max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 border border-white/80 shadow-sm w-fit">
                            <Sparkles className="w-4 h-4 text-coral-500" />
                            Insight career intelligence platform
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.02]">
                                {authUser ? `Chào ${authUser.username}, chào mừng quay lại Insight.` : 'Insight giúp bạn chọn ngành học bằng dữ liệu, đánh giá học lực và AI đồng hành.'}
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
                                Insight kết hợp quiz, điểm học, gợi ý ngành - trường và hội thoại AI vào một hành trình thống nhất, giúp học sinh và cố vấn ra quyết định nhanh, có cơ sở và dễ theo dõi.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link to="/quiz" className="btn-primary px-5 py-3 rounded-2xl font-semibold inline-flex items-center gap-2">
                                Bắt đầu hành trình <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link to="/recommendations" className="btn-pastel px-5 py-3 rounded-2xl font-semibold inline-flex items-center gap-2">
                                Xem gợi ý gần nhất
                            </Link>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            {[
                                { value: '4', label: 'module cốt lõi đã tích hợp' },
                                { value: '1', label: 'hành trình xuyên suốt từ dữ liệu đến gợi ý' },
                                { value: '24/7', label: 'trợ lý AI hỗ trợ định hướng' },
                            ].map((item) => (
                                <div key={item.label} className="rounded-2xl bg-white/70 border border-white/80 px-4 py-4 shadow-sm">
                                    <div className="text-2xl font-bold text-slate-900">{item.value}</div>
                                    <div className="text-sm text-slate-500 mt-1">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="glass-panel rounded-[1.75rem] p-5 md:p-6 border-white/80">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Product snapshot</p>
                                    <h2 className="text-2xl font-semibold text-slate-900 mt-1">What Insight delivers</h2>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-100 to-coral-100 flex items-center justify-center text-slate-800">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                {[
                                    'Người dùng đăng nhập và bắt đầu phiên hướng nghiệp cá nhân.',
                                    'Điểm học và quiz được dùng làm tín hiệu đầu vào.',
                                    'Hệ thống tạo top ngành, top trường và phần giải thích minh bạch.',
                                    'AI hỗ trợ đào sâu câu hỏi theo đúng ngữ cảnh của người dùng.',
                                ].map((step, index) => (
                                    <div key={step} className="flex items-start gap-3 rounded-2xl bg-white/80 px-4 py-3 border border-white/80">
                                        <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                                            {index + 1}
                                        </div>
                                        <p className="text-sm md:text-base text-slate-600 leading-relaxed">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="absolute -bottom-6 -right-4 hidden lg:block w-28 h-28 rounded-[2rem] bg-slate-900/90 text-white p-4 shadow-2xl rotate-6">
                            <Users className="w-6 h-6 text-coral-200" />
                            <div className="mt-5 text-xs uppercase tracking-[0.2em] text-slate-300">Audience</div>
                            <div className="mt-1 text-sm font-semibold">Students and counselors</div>
                        </div>
                    </div>
                </div>

                <div className="absolute top-0 right-0 w-80 h-80 bg-coral-100 rounded-full blur-3xl opacity-60 -translate-y-1/3 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-100 rounded-full blur-3xl opacity-60 translate-y-1/3 -translate-x-1/3"></div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {highlights.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link key={item.label} to={item.href} className="group glass-card rounded-3xl p-5 md:p-6 transition-all hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(41,31,20,0.12)]">
                            <div className="flex items-start justify-between gap-3 mb-5">
                                <div>
                                    <div className="text-xs uppercase tracking-[0.25em] text-slate-400">{item.label}</div>
                                    <div className="text-xl font-semibold text-slate-900 mt-2 leading-tight">{item.value}</div>
                                </div>
                                <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-coral-500 transition-colors">
                                    <Icon className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">{item.detail}</p>
                        </Link>
                    );
                })}
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
                {pillars.map((item) => (
                    <div key={item.title} className="glass-card rounded-3xl p-6">
                        <div className="inline-flex items-center gap-2 rounded-full bg-sand-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                            <Sparkles className="w-3 h-3 text-coral-500" />
                            Product value
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mt-4">{item.title}</h3>
                        <p className="mt-3 text-slate-600 leading-relaxed">{item.text}</p>
                    </div>
                ))}
            </section>

            <section className="glass-card rounded-[2rem] p-6 md:p-8 overflow-hidden relative">
                <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Insight flow</p>
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mt-2">Bắt đầu từ dữ liệu cá nhân và kết thúc bằng khuyến nghị có thể hành động ngay</h2>
                        <p className="mt-3 text-slate-600 max-w-2xl leading-relaxed">
                            Người dùng trả lời quiz, bổ sung điểm học, xem khuyến nghị, rồi hỏi AI để tinh chỉnh lộ trình. Toàn bộ tiến trình được thiết kế để rõ ràng, nhanh và đủ chiều sâu cho quyết định thật.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link to="/grades" className="btn-pastel px-5 py-3 rounded-2xl font-semibold">Nhập điểm</Link>
                        <Link to="/chatbot" className="btn-primary px-5 py-3 rounded-2xl font-semibold inline-flex items-center gap-2">
                            Mở chatbot <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2"></div>
            </section>
        </div>
    );
};

export default Home;
