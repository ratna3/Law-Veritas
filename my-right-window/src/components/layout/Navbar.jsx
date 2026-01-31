import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserAuthButton from '../common/UserAuthButton';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/blogs', label: 'Insights' },
    { path: '/bareacts', label: 'Bare Acts' },
    { path: '/admin/login', label: 'Admin' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-elegant border-b border-gray-100'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-navy" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M20 8L20 32M12 20H28M14 14L26 26M26 14L14 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div className="ml-3">
                <span className="text-xl md:text-2xl font-serif font-bold text-navy">Law-gically Yours</span>
                <span className={`hidden sm:block text-xs tracking-wider ${isScrolled ? 'text-gray-500' : 'text-gray-600'}`}>
                  LEGAL EXCELLENCE
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wide transition-colors relative group ${location.pathname === link.path
                  ? 'text-gold'
                  : `${isScrolled ? 'text-gray-700' : 'text-gray-700'} hover:text-navy`
                  }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gold transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
              </Link>
            ))}
            <UserAuthButton />
            <Link to="/blogs" className="btn-primary text-sm px-5 py-2.5">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden ${isScrolled ? 'text-gray-700' : 'text-gray-700'} hover:text-navy focus:outline-none p-2`}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-md border-t border-gray-100 shadow-elegant-lg">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${location.pathname === link.path
                  ? 'text-gold bg-gray-50'
                  : 'text-gray-700 hover:text-navy hover:bg-gray-50'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-3">
              <UserAuthButton />
              <Link
                to="/blogs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-primary block text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
