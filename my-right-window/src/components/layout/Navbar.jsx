import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserAuthButton from '../common/UserAuthButton';
import { FaBalanceScale, FaBars, FaTimes } from 'react-icons/fa';

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
    { path: '/blogs', label: 'My Blogs' },
    { path: '/news', label: 'News' },
    { path: '/judgements', label: 'Judgements' },
    { path: '/bareacts', label: 'Bare Acts' },
    { path: '/admin/login', label: 'Admin' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b-2 border-gold/30 ${isScrolled ? 'shadow-elegant' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-navy flex items-center justify-center">
                <FaBalanceScale className="w-4 h-4 md:w-5 md:h-5 text-gold" />
              </div>
              <div className="ml-3">
                <span className="text-xl md:text-2xl font-serif font-bold text-navy">Law-gically Yours</span>
                <span className="hidden sm:block text-xs tracking-wider text-gray-500">
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
                  : 'text-gray-700 hover:text-navy'
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
            className="md:hidden text-gray-700 hover:text-navy focus:outline-none p-2"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-elegant-lg">
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
