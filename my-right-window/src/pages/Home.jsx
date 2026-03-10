import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModelScene from '../components/3d/ModelScene';
import BlogCard from '../components/blog/BlogCard';
import { ScaleIcon, GavelIcon, FileTextIcon, UsersIcon } from '../components/Icons';
import { useBlogStore } from '../store';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const services = [
  { Icon: ScaleIcon, title: 'Corporate Law', desc: 'Expert guidance for businesses navigating complex regulatory landscapes' },
  { Icon: GavelIcon, title: 'Litigation', desc: 'Vigorous representation and advocacy in court proceedings' },
  { Icon: FileTextIcon, title: 'Legal Consulting', desc: 'Strategic advice for informed decision-making on legal matters' },
  { Icon: UsersIcon, title: 'Contract Law', desc: 'Meticulous drafting, review, and negotiation of legal agreements' },
];

const Home = () => {
  const { featuredBlogs, fetchFeaturedBlogs } = useBlogStore();
  const [servicesRef, servicesVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [bareActsRef, bareActsVisible] = useIntersectionObserver({ threshold: 0.15 });
  const [blogsRef, blogsVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [aboutRef, aboutVisible] = useIntersectionObserver({ threshold: 0.15 });

  useEffect(() => {
    fetchFeaturedBlogs();
  }, [fetchFeaturedBlogs]);

  return (
    <div className="bg-white">
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION — Angel of Justice (left) + Brand (right)
          ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-b from-white via-cream to-white overflow-hidden pt-24 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Angel of Justice 3D Model */}
            <div className="h-[350px] md:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50/50 to-cream order-2 lg:order-1 animate-fadeIn">
              <ModelScene
                modelPath="/models/angel_of_justice.glb"
                scale={2}
                cameraPosition={[0, 0, 5]}
                rotationSpeed={0.2}
              />
            </div>

            {/* Right: Brand + Headline */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-navy/5 to-gold/5 border border-navy/10 rounded-full mb-8 animate-slideUp">
                <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-navy tracking-wide">Trusted Legal Excellence</span>
              </div>

              <h1 className="mb-6 animate-slideUp" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                <span className="block text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-navy tracking-tight">
                  Law-gically
                </span>
                <span className="block text-4xl md:text-5xl lg:text-6xl font-serif italic font-medium text-gold mt-2">
                  Yours
                </span>
              </h1>

              <div className="w-20 h-1 bg-gold rounded-full mb-6 mx-auto lg:mx-0 animate-slideUp" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}></div>

              <p className="text-xl md:text-2xl text-gray-600 mb-4 font-light leading-relaxed max-w-lg mx-auto lg:mx-0 animate-slideUp" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
                Your Partner in Legal Excellence
              </p>
              <p className="text-lg text-gray-500 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed animate-slideUp" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                Providing expert legal counsel with integrity, strategy, and unwavering commitment to justice.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slideUp" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                <Link to="/blogs" className="btn-primary group inline-flex items-center justify-center">
                  Explore Our Insights
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a href="#about" className="btn-secondary inline-flex items-center justify-center">
                  About Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gold Separator */}
      <div className="max-w-7xl mx-auto px-4">
        <hr className="border-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </div>

      {/* ═══════════════════════════════════════════
          PRACTICE AREAS — 4-col with SVG Icons
          ═══════════════════════════════════════════ */}
      <section
        ref={servicesRef}
        className={`py-16 md:py-24 px-4 bg-white transition-all duration-700 ease-out ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
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
                style={{
                  transitionDelay: servicesVisible ? `${index * 100}ms` : '0ms',
                  opacity: servicesVisible ? 1 : 0,
                  transform: servicesVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                }}
              >
                <div className="w-16 h-16 bg-navy/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-navy/10 transition-colors">
                  <service.Icon className="w-8 h-8 text-navy" />
                </div>
                <h3 className="text-xl font-serif font-bold text-navy mb-3">{service.title}</h3>
                <p className="text-gray-500 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gold Separator */}
      <div className="max-w-7xl mx-auto px-4">
        <hr className="border-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </div>

      {/* ═══════════════════════════════════════════════════════
          BARE ACTS LIBRARY — Content (left) + Gavel 3D (right)
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={bareActsRef}
        className={`py-16 md:py-24 px-4 bg-cream transition-all duration-700 ease-out ${bareActsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 rounded-full mb-6">
                <span className="text-sm font-semibold text-gold uppercase tracking-wider">Legal Reference</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-6">
                Indian Bare Acts Library
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Explore our comprehensive collection of Indian Bare Acts — from Constitutional and Civil Laws to
                Criminal Statutes and Commercial Legislation. Access the full text, search within documents, and
                navigate with ease.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {['Constitution', 'BNS', 'BNSS', 'CPC', 'Evidence Act', 'Contract Act'].map((tag, idx) => (
                  <span key={idx} className="px-4 py-2 text-sm font-medium text-navy bg-navy/5 rounded-full border border-navy/10 hover:bg-navy/10 transition-colors cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
              <Link to="/bareacts" className="btn-primary group inline-flex items-center">
                Explore Bare Acts
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Right: Gavel 3D Model (lazy-loaded) */}
            <div className="h-[300px] md:h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-navy/5 to-gold/5 border border-navy/10">
              {bareActsVisible ? (
                <ModelScene
                  modelPath="/models/gavel.glb"
                  scale={1.8}
                  cameraPosition={[0, 0, 5]}
                  rotationSpeed={0.25}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-10 h-10 border-3 border-navy/20 border-t-navy rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURED INSIGHTS — Blog cards (3-col grid)
          ═══════════════════════════════════════════════════ */}
      <section
        ref={blogsRef}
        className={`py-16 md:py-24 px-4 bg-white transition-all duration-700 ease-out ${blogsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Latest Insights</h2>
            <div className="divider-gold"></div>
            <p className="section-subtitle">
              Stay informed with our latest legal perspectives and analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBlogs.length > 0 ? (
              featuredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))
            ) : (
              [1, 2, 3].map((item) => (
                <div key={item} className="card group hover:border-gold/30 transition-all duration-300">
                  <div className="h-52 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl mb-6 flex items-center justify-center">
                    <ScaleIcon className="w-16 h-16 text-navy/15" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">Coming Soon</h3>
                  <p className="text-gray-500 mb-6 leading-relaxed">
                    Featured articles will appear here. Check back soon for legal insights and analysis.
                  </p>
                  <Link to="/blogs" className="inline-flex items-center text-navy font-semibold hover:text-gold transition-colors">
                    View All Articles
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link to="/blogs" className="btn-secondary inline-flex items-center group">
              View All Articles
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Gold Separator */}
      <div className="max-w-7xl mx-auto px-4">
        <hr className="border-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          ABOUT SECTION — Text + values (left) + Chess Queen (right)
          ═══════════════════════════════════════════════════════════ */}
      <section
        id="about"
        ref={aboutRef}
        className={`py-16 md:py-24 px-4 bg-cream transition-all duration-700 ease-out ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: About Text */}
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-6">
                About Law-gically Yours
              </h2>
              <div className="w-20 h-1 bg-gold rounded-full mb-6"></div>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Your trusted legal partner, committed to delivering exceptional counsel with integrity and expertise.
                We navigate complex legal challenges with strategic precision and unwavering dedication to our clients.
              </p>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                Through our commitment to justice and ethical practice, we ensure every client receives the representation
                they deserve. Our approach combines deep legal knowledge with compassionate understanding of each unique situation.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Integrity', icon: '⚖️' },
                  { label: 'Knowledge', icon: '📚' },
                  { label: 'Service', icon: '🤝' },
                ].map((value) => (
                  <div key={value.label} className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-2xl mb-2">{value.icon}</div>
                    <h4 className="font-semibold text-navy text-sm">{value.label}</h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Chess Queen 3D Model (lazy-loaded) */}
            <div className="h-[300px] md:h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-cream border border-gray-200">
              {aboutVisible ? (
                <ModelScene
                  modelPath="/models/queen_chess.glb"
                  scale={1.5}
                  cameraPosition={[0, 0, 5]}
                  rotationSpeed={0.3}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-10 h-10 border-3 border-navy/20 border-t-navy rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          CTA SECTION
          ═══════════════════════════ */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-4">
            Stay Updated with Our Insights
          </h2>
          <div className="divider-gold"></div>
          <p className="text-gray-500 mb-10 text-lg leading-relaxed">
            Explore our collection of legal articles, perspectives, and analysis
          </p>
          <Link to="/blogs" className="btn-gold inline-flex items-center text-lg px-8 py-4">
            View All Articles
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════
          FOOTER
          ═══════════════════════════ */}
      <footer className="py-12 px-4 bg-navy-dark text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Law-gically Yours" className="w-8 h-8 rounded-full" />
              <span className="text-2xl font-serif font-bold">Law-gically Yours</span>
              <span className="text-gray-400 text-sm hidden sm:inline">| Legal Excellence</span>
            </div>
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/blogs" className="hover:text-white transition-colors">Insights</Link>
              <Link to="/bareacts" className="hover:text-white transition-colors">Bare Acts</Link>
              <Link to="/admin/login" className="hover:text-white transition-colors">Admin</Link>
            </div>
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Law-gically Yours
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
