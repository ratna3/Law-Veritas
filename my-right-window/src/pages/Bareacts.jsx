import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, BAREACTS } from '../data/bareactsData';
import { ScaleIcon, GavelIcon, FileTextIcon, UsersIcon, SearchXIcon } from '../components/Icons';

const categoryIcons = {
    constitutional: ScaleIcon,
    criminal: GavelIcon,
    civil: FileTextIcon,
    family: UsersIcon
};

const CategoryIcon = ({ id, className }) => {
    const Icon = categoryIcons[id];
    return Icon ? <Icon className={className} /> : null;
};


const Bareacts = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAct, setSelectedAct] = useState(null);
    const [contentSearchQuery, setContentSearchQuery] = useState('');
    const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

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

    const formatContent = (content) => {
        if (!content) return <p className="text-gray-500 italic">Content not available</p>;

        // Pattern for detecting Article/Section headings
        const headingPatterns = [
            /^(PART [IVXLCDM]+)/i,
            /^(CHAPTER [IVXLCDM0-9]+)/i,
            /^(Article \d+)/i,
            /^(Section \d+)/i,
            /^(\d+\.\s)/,
            /^(SCHEDULE|PREAMBLE|APPENDIX)/i,
        ];

        // Slugify helper
        const slugify = (text) => {
            return text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')     // Replace spaces with -
                .replace(/[^\w\-]+/g, '') // Remove all non-word chars
                .replace(/\-\-+/g, '-');  // Replace multiple - with single -
        };

        // Split content into lines for better formatting

        const lines = content.split(/\n/);
        const elements = [];
        let currentParagraph = [];

        const flushParagraph = () => {
            if (currentParagraph.length > 0) {
                const text = currentParagraph.join(' ').trim();
                if (text) {
                    elements.push(
                        <p key={elements.length} className="mb-4 leading-relaxed text-gray-700 text-justify">
                            {text}
                        </p>
                    );
                }
                currentParagraph = [];
            }
        };

        lines.forEach((line) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) {
                flushParagraph();
                return;
            }

            // Check if this is a heading
            const isHeading = headingPatterns.some(pattern => pattern.test(trimmedLine));
            const isAllCaps = trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 3 && trimmedLine.length < 100;

            if (isHeading || isAllCaps) {
                flushParagraph();
                const id = slugify(trimmedLine);
                elements.push(
                    <h3 id={id} key={elements.length} className="text-lg font-bold text-navy mt-8 mb-4 border-b border-gray-200 pb-2 scroll-mt-24">
                        {trimmedLine}
                    </h3>
                );
            } else {
                currentParagraph.push(trimmedLine);
            }
        });

        flushParagraph();
        return elements;
    };

    const getHighlightedContent = (content, query) => {
        if (!query.trim() || !content) return formatContent(content);

        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = content.split(regex);

        return (
            <div className="leading-relaxed text-gray-700 text-justify">
                {parts.map((part, idx) =>
                    regex.test(part) ? (
                        <mark key={idx} className="bg-yellow-300 px-1 py-0.5 rounded font-medium">{part}</mark>
                    ) : (
                        <span key={idx}>{part}</span>
                    )
                )}
            </div>
        );
    };

    const renderTocItems = () => {
        const headings = [];
        const lines = selectedAct?.content ? selectedAct.content.split(/\n/) : [];
        const headingPatterns = [
            /^(PART [IVXLCDM]+)/i,
            /^(CHAPTER [IVXLCDM0-9]+)/i,
            /^(Article \d+)/i,
            /^(Section \d+)/i,
            /^(\d+\.\s)/,
            /^(SCHEDULE|PREAMBLE|APPENDIX)/i,
        ];

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed) return;

            const isHeading = headingPatterns.some(pattern => pattern.test(trimmed));
            const isAllCaps = trimmed === trimmed.toUpperCase() && trimmed.length > 3 && trimmed.length < 100;

            if (isHeading || isAllCaps) {
                const id = trimmed.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
                headings.push({ text: trimmed, id });
            }
        });

        if (headings.length === 0) return <p className="text-sm text-gray-500 italic">No sections found</p>;

        return headings.map((heading, idx) => (
            <a
                key={idx}
                href={`#${heading.id}`}
                className="block text-xs text-gray-600 hover:text-navy hover:bg-gray-200 px-2 py-1.5 rounded transition-colors truncate"
                title={heading.text}
                onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileTocOpen(false);
                }}
            >
                {heading.text}
            </a>
        ));
    };

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
                        {' '}{getAllActs().length} Bare Acts containing over 730,000+ words of legal content.
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
            <section className="py-4 md:py-8 px-4 bg-white border-b border-gray-100 sticky top-16 md:top-20 z-40 shadow-sm md:shadow-none">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible justify-start md:justify-center gap-3 pb-2 md:pb-0 scrollbar-hide">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`px-6 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 ${activeCategory === 'all'
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
                                className={`px-6 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${activeCategory === category.id
                                    ? 'bg-navy text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <span className={`w-5 h-5 ${activeCategory === category.id ? 'text-white' : 'text-gray-500'}`}>
                                    <CategoryIcon id={category.id} className="w-5 h-5" />
                                </span>
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
                                <span className="text-gold">
                                    <CategoryIcon id={activeCategory} className="w-8 h-8" />
                                </span>
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
                                        <div className="w-14 h-14 bg-navy/5 rounded-xl flex items-center justify-center group-hover:bg-navy/10 transition-colors text-navy">
                                            {categoryIcons[act.category] ? (
                                                <CategoryIcon id={act.category} className="w-8 h-8" />
                                            ) : (
                                                <ScaleIcon className="w-8 h-8" />
                                            )}
                                        </div>
                                        <span className="px-3 py-1 text-xs font-semibold text-gold bg-gold/10 rounded-full">
                                            {act.year}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-serif font-bold text-navy mb-3 group-hover:text-gold transition-colors line-clamp-2">
                                        {act.title}
                                    </h3>

                                    {/* Category & Word Count */}
                                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                                        <span className="px-2 py-0.5 text-xs font-medium text-navy bg-navy/5 rounded">
                                            {CATEGORIES[act.category]?.title || act.category}
                                        </span>
                                        <span className="px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded">
                                            {act.wordCount?.toLocaleString()} words
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-500 mb-4 leading-relaxed line-clamp-2 text-sm">
                                        {act.description}
                                    </p>

                                    {/* Preview */}
                                    {act.preview && (
                                        <p className="text-gray-400 text-xs mb-6 line-clamp-3 italic">
                                            "{act.preview.substring(0, 150)}..."
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <button
                                        onClick={() => setSelectedAct(act)}
                                        className="btn-primary w-full text-center text-sm py-3"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            Read Online
                                        </span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                                <SearchXIcon className="w-12 h-12" />
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
                            <div key={category.id} className="card-elevated text-center flex flex-col items-center">
                                <span className="block mb-3 text-navy">
                                    <CategoryIcon id={category.id} className="w-10 h-10" />
                                </span>
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

            {/* Content Reader Modal */}
            {selectedAct && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => { setSelectedAct(null); setContentSearchQuery(''); }}
                    ></div>

                    {/* Modal */}
                    <div className="absolute inset-4 md:inset-8 lg:inset-12 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-navy to-navy-dark text-white p-6 flex-shrink-0">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-white/90">
                                        {categoryIcons[selectedAct.category] ? (
                                            <CategoryIcon id={selectedAct.category} className="w-8 h-8" />
                                        ) : (
                                            <ScaleIcon className="w-8 h-8" />
                                        )}
                                    </span>
                                    <div>
                                        <span className="px-2 py-0.5 text-xs font-medium bg-white/20 rounded mr-2">
                                            {selectedAct.year}
                                        </span>
                                        <span className="px-2 py-0.5 text-xs font-medium bg-gold/30 rounded">
                                            {selectedAct.wordCount?.toLocaleString()} words
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setSelectedAct(null); setContentSearchQuery(''); }}
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">{selectedAct.title}</h2>
                            <p className="text-gray-300 text-sm">{selectedAct.description}</p>

                            {/* Search in content */}
                            <div className="mt-4 relative">
                                <input
                                    type="text"
                                    placeholder="Search within this act..."
                                    value={contentSearchQuery}
                                    onChange={(e) => setContentSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2.5 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50"
                                />
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            {/* Mobile TOC Toggle */}
                            <button
                                onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                                className="md:hidden w-full mt-4 flex items-center justify-between px-4 py-2 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                            >
                                <span>Table of Contents</span>
                                <svg
                                    className={`w-5 h-5 transition-transform ${isMobileTocOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        {/* Mobile TOC Drawer */}
                        {isMobileTocOpen && (
                            <div className="md:hidden bg-gray-50 border-b border-gray-200 max-h-60 overflow-y-auto p-4 shadow-inner">
                                <h3 className="font-bold text-navy mb-2 text-xs uppercase tracking-wide">Jump to Section</h3>
                                <div className="space-y-1">
                                    {renderTocItems()}
                                </div>
                            </div>
                        )}

                        {/* Content & TOC Container */}
                        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                            {/* Table of Contents (Desktop) */}
                            <div className="hidden md:block w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto p-4 flex-shrink-0">
                                <h3 className="font-bold text-navy mb-4 text-sm uppercase tracking-wide">Table of Contents</h3>
                                <div className="space-y-1">
                                    {renderTocItems()}
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                                <div className="max-w-4xl mx-auto prose prose-lg">
                                    {contentSearchQuery.trim()
                                        ? getHighlightedContent(selectedAct.content, contentSearchQuery)
                                        : formatContent(selectedAct.content)
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="bg-gray-50 border-t border-gray-200 p-4 flex-shrink-0">
                            <div className="flex items-center justify-center max-w-4xl mx-auto">
                                <div className="text-sm text-gray-500">
                                    📚 {CATEGORIES[selectedAct.category]?.title} • {selectedAct.wordCount?.toLocaleString()} words
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bareacts;
