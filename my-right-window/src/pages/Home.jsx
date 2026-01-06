import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ModelScene from '../components/3d/ModelScene';
import { useBlogStore } from '../store';

const Home = () => {
  const heroRef = useRef(null);
  const { featuredBlogs, fetchFeaturedBlogs } = useBlogStore();

  useEffect(() => {
    fetchFeaturedBlogs();
  }, [fetchFeaturedBlogs]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (heroRef.current) {
        heroRef.current.style.opacity = Math.max(1 - scrolled / 700, 0);
        heroRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const models = [
    {
      path: '/models/angel_of_justice.glb',
      tagline: 'Justice is blind, but our vision is clear. Laws for everyone.',
      title: 'Justice',
      scale: 2,
    },
    {
      path: '/models/queen_chess.glb',
      tagline: 'Strategic counsel in every move. Mastering the complexities of law.',
      title: 'Strategy',
      scale: 1.5,
    },
    {
      path: '/models/gavel.glb',
      tagline: 'Power and influence, used with uncompromising integrity.',
      title: 'Authority',
      scale: 1.8,
    },
  ];

  const services = [
    { icon: '⚖️', title: 'Corporate Law', desc: 'Expert guidance for businesses of all sizes' },
    { icon: '📋', title: 'Legal Consulting', desc: 'Strategic advice for complex legal matters' },
    { icon: '🏛️', title: 'Litigation', desc: 'Vigorous representation in court proceedings' },
    { icon: '📜', title: 'Contract Law', desc: 'Drafting and reviewing legal documents' },
  ];

  return (
    <div className="relative min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a365d' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div ref={heroRef} className="relative z-10 text-center max-w-5xl mx-auto px-4 pt-28">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-navy/5 to-gold/5 border border-navy/10 rounded-full mb-10 animate-slideUp shadow-sm">
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-navy tracking-wide">Trusted Legal Excellence Since 2025</span>
          </div>

          {/* Creative Brand Name Display */}
          <h1 className="mb-6 animate-slideUp overflow-visible">
            <div className="flex flex-col items-center gap-2 overflow-visible">
              {/* Main Title with Creative Split */}
              <div className="flex items-baseline justify-center flex-wrap gap-x-2 overflow-visible pb-2">
                <span className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-navy tracking-tight">
                  Law
                </span>
                <span className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-gold/80">
                  -
                </span>
                <span className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold bg-gradient-to-r from-gold via-amber-500 to-gold bg-clip-text text-transparent pb-2 inline-block">
                  gically
                </span>
              </div>
              {/* Yours - Elegant Accent */}
              <div className="flex items-center gap-4">
                <span className="hidden sm:block w-12 h-0.5 bg-gradient-to-r from-transparent to-navy/30 rounded-full"></span>
                <span className="text-3xl md:text-4xl lg:text-5xl font-serif italic font-medium text-navy/80 tracking-widest">
                  Yours
                </span>
                <span className="hidden sm:block w-12 h-0.5 bg-gradient-to-l from-transparent to-gold/50 rounded-full"></span>
              </div>
            </div>
          </h1>

          <div className="divider-gold animate-slideUp" style={{ animationDelay: '0.1s' }}></div>

          <p className="text-xl md:text-2xl text-gray-600 mb-4 animate-slideUp font-light" style={{ animationDelay: '0.2s' }}>
            Your Partner in Legal Excellence
          </p>

          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto animate-slideUp leading-relaxed" style={{ animationDelay: '0.3s' }}>
            Providing expert legal counsel with integrity, strategy, and unwavering commitment to justice.
            We navigate complex legal challenges with precision and care.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <Link to="/blogs" className="btn-primary group inline-flex items-center justify-center">
              Explore Our Insights
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a href="#principles" className="btn-secondary inline-flex items-center justify-center">
              Our Principles
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-8 h-12 border-2 border-navy/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-navy/40 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Expertise</h2>
            <div className="divider-gold"></div>
            <p className="section-subtitle">
              Comprehensive legal services tailored to meet your unique needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="card-elevated text-center group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-navy/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-navy/10 transition-colors">
                  <span className="text-3xl">{service.icon}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-navy mb-3">{service.title}</h3>
                <p className="text-gray-500">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Models Section */}
      <section id="principles" className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Core Values</h2>
            <div className="divider-gold"></div>
            <p className="section-subtitle">
              The pillars that guide our practice and define our commitment to you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {models.map((model, index) => (
              <div key={index} className="flex flex-col items-center group">
                {/* 3D Model Container */}
                <div className="w-full h-80 md:h-96 mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-white border border-gray-200 shadow-elegant group-hover:shadow-elegant-lg transition-all duration-500">
                  <ModelScene
                    modelPath={model.path}
                    scale={model.scale}
                    cameraPosition={[0, 0, 5]}
                  />
                </div>

                {/* Title Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1 bg-gold/10 rounded-full mb-4">
                  <span className="text-sm font-semibold text-gold uppercase tracking-wider">{model.title}</span>
                </div>

                {/* Tagline */}
                <p className="text-center text-lg text-gray-600 leading-relaxed max-w-sm px-4">
                  {model.tagline}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Insights Section */}
      <section id="featured" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Featured Insights</h2>
            <div className="divider-gold"></div>
            <p className="section-subtitle">
              Stay informed with our latest legal perspectives and analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBlogs.length > 0 ? (
              featuredBlogs.map((blog) => (
                <div key={blog.id} className="card group hover:border-gold/30 transition-all duration-300">
                  <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
                    {blog.images && blog.images.length > 0 ? (
                      <img
                        src={blog.images[0]}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-6xl text-navy/20 group-hover:scale-110 transition-transform duration-500">⚖️</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {blog.tags && blog.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 text-xs font-semibold text-gold bg-gold/10 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-navy transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-500 mb-6 leading-relaxed line-clamp-3">
                    {blog.content.substring(0, 150).replace(/[#*`]/g, '')}...
                  </p>
                  <Link to={`/blog/${blog.slug}`} className="inline-flex items-center text-navy font-semibold hover:text-gold transition-colors group/link">
                    Read Article
                    <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              ))
            ) : (
              // Fallback placeholder cards when no featured blogs
              [1, 2, 3].map((item) => (
                <div key={item} className="card group hover:border-gold/30 transition-all duration-300">
                  <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
                    <div className="text-6xl text-navy/20 group-hover:scale-110 transition-transform duration-500">⚖️</div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 text-xs font-semibold text-gold bg-gold/10 rounded-full">Legal Insight</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-navy transition-colors">
                    Coming Soon
                  </h3>
                  <p className="text-gray-500 mb-6 leading-relaxed">
                    Featured articles will appear here. Check back soon for legal insights and analysis.
                  </p>
                  <Link to="/blogs" className="inline-flex items-center text-navy font-semibold hover:text-gold transition-colors group/link">
                    View All Articles
                    <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4 bg-navy text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            About Law-gically Yours
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto my-8 rounded-full"></div>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            Your trusted legal partner, committed to delivering exceptional counsel with integrity and expertise.
            We navigate complex legal challenges with strategic precision and unwavering dedication.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed">
            Through our commitment to justice and ethical practice, we ensure every client receives the representation
            they deserve. Our approach combines deep legal knowledge with compassionate understanding.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Stay Updated with Our Insights
          </h2>
          <div className="divider-gold"></div>
          <p className="text-gray-500 mb-10 text-lg">
            Join our community and never miss important legal updates and analysis
          </p>
          <Link to="/blogs" className="btn-gold inline-flex items-center text-lg px-8 py-4">
            View All Articles
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

export default Home;


