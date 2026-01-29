import { Link } from 'react-router-dom';

const Bareacts = () => {
    return (
        <div className="relative min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-16 px-4 bg-gradient-to-b from-slate-50 via-white to-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a365d' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-navy/5 to-gold/5 border border-navy/10 rounded-full mb-10 animate-slideUp shadow-sm">
                        <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
                        <span className="text-sm font-medium text-navy tracking-wide">Legal Documents & References</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-navy mb-6 animate-slideUp">
                        Bare Acts
                    </h1>

                    <div className="divider-gold animate-slideUp" style={{ animationDelay: '0.1s' }}></div>

                    <p className="text-xl md:text-2xl text-gray-600 mb-4 animate-slideUp font-light" style={{ animationDelay: '0.2s' }}>
                        Your Complete Legal Reference Library
                    </p>

                    <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto animate-slideUp leading-relaxed" style={{ animationDelay: '0.3s' }}>
                        Access authentic texts of statutes and legislations. Browse through our comprehensive collection of
                        Indian Bare Acts for your legal research and reference needs.
                    </p>
                </div>
            </section>

            {/* Coming Soon Section */}
            <section className="py-24 px-4 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="card-elevated p-12">
                        <div className="w-24 h-24 bg-navy/5 rounded-2xl flex items-center justify-center mx-auto mb-8">
                            <span className="text-5xl">📜</span>
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-navy mb-4">
                            Coming Soon
                        </h2>
                        <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
                            We are curating a comprehensive collection of Bare Acts for you.
                            This section will feature authentic legislative texts, constitutional provisions,
                            and important statutory documents.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/blogs" className="btn-primary group inline-flex items-center justify-center">
                                Explore Our Blogs
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link to="/" className="btn-secondary inline-flex items-center justify-center">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* What to Expect Section */}
            <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="section-title">What to Expect</h2>
                        <div className="divider-gold"></div>
                        <p className="section-subtitle">
                            Features we're preparing for you
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: '⚖️', title: 'Constitutional Laws', desc: 'Complete text of the Constitution of India with all amendments' },
                            { icon: '📋', title: 'Civil Laws', desc: 'CPC, Evidence Act, Limitation Act, and more civil statutes' },
                            { icon: '🏛️', title: 'Criminal Laws', desc: 'IPC, CrPC, and other criminal law provisions' },
                            { icon: '💼', title: 'Commercial Laws', desc: 'Companies Act, Contract Act, and business legislations' },
                            { icon: '🔍', title: 'Search Functionality', desc: 'Quick search across all acts and sections' },
                            { icon: '📱', title: 'Mobile Friendly', desc: 'Access bare acts on any device, anywhere' },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="card-elevated text-center group cursor-pointer"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="w-16 h-16 bg-navy/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-navy/10 transition-colors">
                                    <span className="text-3xl">{feature.icon}</span>
                                </div>
                                <h3 className="text-xl font-serif font-bold text-navy mb-3">{feature.title}</h3>
                                <p className="text-gray-500">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 bg-navy-dark text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-serif font-bold">Law-gically Yours</span>
                            <span className="text-gray-400 text-sm">| Legal Excellence</span>
                        </div>
                        <div className="flex items-center gap-6 text-gray-400 text-sm">
                            <Link to="/" className="hover:text-white transition-colors">Home</Link>
                            <Link to="/blogs" className="hover:text-white transition-colors">Insights</Link>
                            <Link to="/bareacts" className="hover:text-white transition-colors">Bare Acts</Link>
                            <Link to="/admin/login" className="hover:text-white transition-colors">Admin</Link>
                        </div>
                        <p className="text-gray-500 text-sm">
                            © 2025 Law-gically Yours. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Bareacts;
