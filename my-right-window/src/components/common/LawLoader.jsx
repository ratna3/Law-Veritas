import React from 'react';

const LawLoader = () => {
    return (
        <div className="fixed inset-0 bg-cream z-50 flex flex-col items-center justify-center overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-96 h-96 bg-navy/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Main Animation Container */}
            <div className="relative z-10 p-10">
                {/* Scales of Justice Icon */}
                <div className="w-48 h-48 relative animate-float">
                    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(191,149,63,0.3)]">
                        <defs>
                            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#bf953f" />
                                <stop offset="50%" stopColor="#fcf6ba" />
                                <stop offset="100%" stopColor="#bf953f" />
                            </linearGradient>
                        </defs>

                        {/* 1. Base Stand (Static) */}
                        <g id="base-structure">
                            {/* Bottom horizontal base */}
                            <line x1="70" y1="180" x2="130" y2="180" stroke="url(#gold-gradient)" strokeWidth="4" strokeLinecap="round" />
                            {/* Central vertical pillar - connected to base */}
                            <line x1="100" y1="20" x2="100" y2="180" stroke="url(#gold-gradient)" strokeWidth="4" strokeLinecap="round" />
                            {/* Top Finial (Decorative tip) */}
                            <circle cx="100" cy="20" r="4" fill="url(#gold-gradient)" />
                            {/* Pivot Point (Where beam rotates) */}
                            <circle cx="100" cy="40" r="3" fill="#faf9f6" stroke="url(#gold-gradient)" strokeWidth="2" />
                        </g>

                        {/* 2. Balancing Mechanism (Animated) */}
                        <g className="origin-[100px_40px] animate-balance">
                            {/* The Horizontal Beam */}
                            <line x1="40" y1="40" x2="160" y2="40" stroke="url(#gold-gradient)" strokeWidth="4" strokeLinecap="round" />

                            {/* Left Scale Assembly */}
                            <g className="origin-[40px_40px] animate-scale-counter-left">
                                {/* Chains */}
                                <line x1="40" y1="40" x2="20" y2="100" stroke="url(#gold-gradient)" strokeWidth="1" strokeDasharray="3 2" />
                                <line x1="40" y1="40" x2="60" y2="100" stroke="url(#gold-gradient)" strokeWidth="1" strokeDasharray="3 2" />
                                {/* Bowl */}
                                <path d="M20 100 Q40 130 60 100 Z" fill="rgba(191,149,63,0.1)" stroke="url(#gold-gradient)" strokeWidth="2" />
                            </g>

                            {/* Right Scale Assembly */}
                            <g className="origin-[160px_40px] animate-scale-counter-right">
                                {/* Chains */}
                                <line x1="160" y1="40" x2="140" y2="100" stroke="url(#gold-gradient)" strokeWidth="1" strokeDasharray="3 2" />
                                <line x1="160" y1="40" x2="180" y2="100" stroke="url(#gold-gradient)" strokeWidth="1" strokeDasharray="3 2" />
                                {/* Bowl */}
                                <path d="M140 100 Q160 130 180 100 Z" fill="rgba(191,149,63,0.1)" stroke="url(#gold-gradient)" strokeWidth="2" />
                            </g>
                        </g>
                    </svg>
                </div>
            </div>

            <div className="text-center relative z-10 mt-4">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#bf953f] via-[#8b6914] to-[#bf953f] mb-4 animate-shine tracking-wider">
                    Law-gically Loading...
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto rounded-full"></div>
                <p className="text-gray-500 mt-4 text-sm tracking-widest uppercase animate-pulse">Preparing Legal Resources</p>
            </div>

            <style>{`
                @keyframes balance {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(5deg); }
                    75% { transform: rotate(-5deg); }
                }
                @keyframes scale-counter {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-5deg); }
                    75% { transform: rotate(5deg); }
                }
                @keyframes shine {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-balance {
                    animation: balance 4s ease-in-out infinite;
                }
                .animate-scale-counter-left {
                    animation: scale-counter 4s ease-in-out infinite;
                }
                .animate-scale-counter-right {
                    animation: scale-counter 4s ease-in-out infinite;
                }
                .animate-shine {
                    background-size: 200% auto;
                    animation: shine 3s linear infinite;
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    );
};

export default LawLoader;
