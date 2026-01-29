import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, BAREACTS } from '../data/bareactsData';

const Bareacts = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const categoryList = Object.values(CATEGORIES);

    const getAllActs = () => {
        return Object.values(BAREACTS).flat();
    };

    const getFilteredActs = () => {
        let acts = activeCategory === 'all' ? getAllActs() : BAREACTS[activeCategory] || [];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            acts = acts.filter(act =>
                act.title.toLowerCase().includes(query) ||
                act.description.toLowerCase().includes(query)
            );
        }

        return acts;
    };

    const filteredActs = getFilteredActs();

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

                    <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto animate-slideUp leading-relaxed" style={{ animationDelay: '0.3s' }}>
                        Access authentic texts of Indian statutes and legislations. Browse through our comprehensive collection of
                        {' '}{getAllActs().length} Bare Acts for your legal research and reference needs.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-md mx-auto animate-slideUp" style={{ animationDelay: '0.4s' }}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search bare acts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-5 py-3 pr-12 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-gray-700"
                            />
                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Tabs */}
            <section className="py-8 px-4 bg-white border-b border-gray-100 sticky top-20 z-40">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-3">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${activeCategory === 'all'
                                    ? 'bg-navy text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All Acts ({getAllActs().length})
                        </button>
                        {categoryList.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${activeCategory === category.id
                                        ? 'bg-navy text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <span>{category.icon}</span>
                                {category.title} ({BAREACTS[category.id]?.length || 0})
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Acts Grid */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* Category Description */}
                    {activeCategory !== 'all' && CATEGORIES[activeCategory] && (
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-1 bg-gold/10 rounded-full mb-4">
                                <span className="text-2xl">{CATEGORIES[activeCategory].icon}</span>
                                <span className="text-sm font-semibold text-gold uppercase tracking-wider">{CATEGORIES[activeCategory].title}</span>
                            </div>
                            <p className="text-gray-500 max-w-xl mx-auto">{CATEGORIES[activeCategory].description}</p>
                        </div>
                    )}

                    {/* Results Count */}
                    <p className="text-gray-500 mb-8 text-center">
                        Showing {filteredActs.length} {filteredActs.length === 1 ? 'act' : 'acts'}
                        {searchQuery && ` for "${searchQuery}"`}
                    </p>

                    {/* Acts Grid */}
                    {filteredActs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredActs.map((act, index) => (
                                <div
                                    key={act.id}
                                    className="card-elevated group hover:border-gold/30 transition-all duration-300"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 bg-navy/5 rounded-xl flex items-center justify-center group-hover:bg-navy/10 transition-colors">
                                            <span className="text-2xl">{CATEGORIES[act.category]?.icon || '📜'}</span>
                                        </div>
                                        <span className="px-3 py-1 text-xs font-semibold text-gold bg-gold/10 rounded-full">
                                            {act.year}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-serif font-bold text-navy mb-3 group-hover:text-gold transition-colors line-clamp-2">
                                        {act.title}
                                    </h3>

                                    {/* Category Badge */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-2 py-0.5 text-xs font-medium text-navy bg-navy/5 rounded">
                                            {CATEGORIES[act.category]?.title || act.category}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-500 mb-6 leading-relaxed line-clamp-3">
                                        {act.description}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3">
                                        <a
                                            href={act.pdfPath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-primary flex-1 text-center text-sm py-2.5"
                                        >
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                View PDF
                                            </span>
                                        </a>
                                        <a
                                            href={act.pdfPath}
                                            download
                                            className="btn-secondary text-sm py-2.5 px-4"
                                            title="Download PDF"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-4xl">🔍</span>
                            </div>
                            <h3 className="text-xl font-serif font-bold text-gray-700 mb-2">No Acts Found</h3>
                            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                            <button
                                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                                className="btn-secondary"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categoryList.map((category) => (
                            <div key={category.id} className="card-elevated text-center">
                                <span className="text-4xl block mb-3">{category.icon}</span>
                                <div className="text-3xl font-bold text-navy mb-1">
                                    {BAREACTS[category.id]?.length || 0}
                                </div>
                                <div className="text-sm text-gray-500">{category.title}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 bg-navy text-white">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                        Need More Legal Resources?
                    </h2>
                    <div className="w-24 h-1 bg-gold mx-auto my-6 rounded-full"></div>
                    <p className="text-gray-300 mb-8 text-lg">
                        Explore our legal insights and stay updated with the latest in Indian law
                    </p>
                    <Link to="/blogs" className="btn-gold inline-flex items-center text-lg px-8 py-4">
                        Browse Legal Insights
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
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
