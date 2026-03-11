const LawLoader = () => {
    return (
        <div className="fixed inset-0 bg-cream z-50 flex flex-col items-center justify-center overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-navy/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl"></div>
            </div>

            {/* Main loader */}
            <div className="relative z-10 flex flex-col items-center gap-10">
                {/* Animated gavel icon */}
                <div className="loader-gavel-wrap">
                    <svg viewBox="0 0 120 120" className="w-28 h-28 md:w-36 md:h-36">
                        <defs>
                            <linearGradient id="ld-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#bf953f" />
                                <stop offset="50%" stopColor="#fcf6ba" />
                                <stop offset="100%" stopColor="#b8860b" />
                            </linearGradient>
                            <linearGradient id="ld-navy" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#2c5282" />
                                <stop offset="100%" stopColor="#1a365d" />
                            </linearGradient>
                        </defs>

                        {/* Sound block */}
                        <rect x="25" y="95" width="70" height="10" rx="3" fill="url(#ld-navy)" opacity="0.9" />
                        <rect x="30" y="88" width="60" height="10" rx="2" fill="url(#ld-navy)" opacity="0.7" />

                        {/* Gavel - animated strike */}
                        <g className="loader-gavel-head">
                            {/* Handle */}
                            <line x1="60" y1="50" x2="60" y2="82" stroke="url(#ld-gold)" strokeWidth="5" strokeLinecap="round" />
                            {/* Head */}
                            <rect x="38" y="38" width="44" height="16" rx="4" fill="url(#ld-gold)" />
                            {/* Head bands */}
                            <line x1="42" y1="38" x2="42" y2="54" stroke="#8b6914" strokeWidth="1.5" opacity="0.5" />
                            <line x1="78" y1="38" x2="78" y2="54" stroke="#8b6914" strokeWidth="1.5" opacity="0.5" />
                        </g>

                        {/* Impact lines (appear on strike) */}
                        <g className="loader-impact-lines">
                            <line x1="30" y1="85" x2="20" y2="78" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                            <line x1="90" y1="85" x2="100" y2="78" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                            <line x1="60" y1="85" x2="60" y2="75" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                        </g>
                    </svg>
                </div>

                {/* Title */}
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy tracking-tight mb-3">
                        Law-gically Yours
                    </h2>
                    <div className="loader-bar-container mx-auto mb-4">
                        <div className="loader-bar"></div>
                    </div>
                    <p className="text-sm text-warm-gray tracking-widest uppercase">
                        Preparing your experience
                    </p>
                </div>
            </div>

            <style>{`
                .loader-gavel-head {
                    transform-origin: 60px 82px;
                    animation: gavelStrike 1.4s ease-in-out infinite;
                }
                .loader-impact-lines {
                    opacity: 0;
                    animation: impactFlash 1.4s ease-in-out infinite;
                }
                .loader-bar-container {
                    width: 160px;
                    height: 3px;
                    background: rgba(26, 54, 93, 0.1);
                    border-radius: 3px;
                    overflow: hidden;
                }
                .loader-bar {
                    width: 40%;
                    height: 100%;
                    background: linear-gradient(90deg, #b8860b, #d4a843, #b8860b);
                    border-radius: 3px;
                    animation: barSlide 1.6s ease-in-out infinite;
                }
                @keyframes gavelStrike {
                    0%, 100% { transform: rotate(-25deg); }
                    40% { transform: rotate(-25deg); }
                    55% { transform: rotate(3deg); }
                    60% { transform: rotate(0deg); }
                    75% { transform: rotate(-8deg); }
                    90% { transform: rotate(-25deg); }
                }
                @keyframes impactFlash {
                    0%, 50% { opacity: 0; }
                    55% { opacity: 1; }
                    60% { opacity: 0.8; }
                    75% { opacity: 0; }
                    100% { opacity: 0; }
                }
                @keyframes barSlide {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(250%); }
                    100% { transform: translateX(-100%); }
                }
            `}</style>
        </div>
    );
};

export default LawLoader;
