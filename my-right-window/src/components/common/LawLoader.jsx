import { useState, useEffect } from 'react';

const LawLoader = () => {
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Show loader for 6 seconds, then fade out over 0.6s
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 6000);

        const hideTimer = setTimeout(() => {
            setVisible(false);
        }, 6600);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
            style={{
                background: 'linear-gradient(135deg, #faf8f5 0%, #f5f0e8 50%, #faf8f5 100%)',
                opacity: fadeOut ? 0 : 1,
                transition: 'opacity 0.6s ease-out',
                pointerEvents: fadeOut ? 'none' : 'auto',
            }}
        >
            <div className="flex flex-col items-center gap-10">
                {/* Brand name */}
                <h2 style={{
                    fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontWeight: 700,
                    color: '#1a365d',
                    letterSpacing: '-0.02em',
                    margin: 0,
                }}>
                    Law-gically Yours
                </h2>

                {/* CSS Loader animation */}
                <div className="law-loader"></div>

                {/* Tagline */}
                <p style={{
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    marginTop: '16px',
                }}>
                    Preparing your experience
                </p>
            </div>

            <style>{`
                .law-loader {
                    width: fit-content;
                    font-size: 17px;
                    font-family: monospace;
                    line-height: 1.4;
                    font-weight: bold;
                    color: #1a365d;
                    background:
                        linear-gradient(#1a365d 0 0) left,
                        linear-gradient(#1a365d 0 0) right;
                    background-repeat: no-repeat;
                    border-right: 5px solid #0000;
                    border-left: 5px solid #0000;
                    background-origin: border-box;
                    position: relative;
                    animation: l9-0 2s infinite;
                    margin-bottom: 50px;
                }
                .law-loader::before {
                    content: "Law-gically Loading";
                    letter-spacing: 2px;
                }
                .law-loader::after {
                    content: "";
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 22px;
                    height: 60px;
                    background:
                        linear-gradient(90deg, #1a365d 4px, #0000 0 calc(100% - 4px), #1a365d 0) bottom / 22px 20px,
                        linear-gradient(90deg, #b8860b 4px, #0000 0 calc(100% - 4px), #b8860b 0) bottom 10px left 0 / 22px 6px,
                        linear-gradient(#1a365d 0 0) bottom 3px left 0 / 22px 8px,
                        linear-gradient(#1a365d 0 0) bottom 0 left 50% / 8px 16px;
                    background-repeat: no-repeat;
                    animation: l9-1 2s infinite;
                }
                @keyframes l9-0 {
                    0%, 25%     { background-size: 50% 100% }
                    25.1%, 75%  { background-size: 0 0, 50% 100% }
                    75.1%, 100% { background-size: 0 0, 0 0 }
                }
                @keyframes l9-1 {
                    25%   { background-position: bottom, bottom 54px left 0, bottom 3px left 0, bottom 0 left 50%; left: 0 }
                    25.1% { background-position: bottom, bottom 10px left 0, bottom 3px left 0, bottom 0 left 50%; left: 0 }
                    50%   { background-position: bottom, bottom 10px left 0, bottom 3px left 0, bottom 0 left 50%; left: calc(100% - 22px) }
                    75%   { background-position: bottom, bottom 54px left 0, bottom 3px left 0, bottom 0 left 50%; left: calc(100% - 22px) }
                    75.1% { background-position: bottom, bottom 10px left 0, bottom 3px left 0, bottom 0 left 50%; left: calc(100% - 22px) }
                }
            `}</style>
        </div>
    );
};

export default LawLoader;
