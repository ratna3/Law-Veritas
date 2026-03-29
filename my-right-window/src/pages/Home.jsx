import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/blog/BlogCard';
import { ScaleIcon, GavelIcon, FileTextIcon, UsersIcon } from '../components/Icons';
import { useBlogStore } from '../store';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import NewsTicker from '../components/common/NewsTicker';
import { FaBalanceScale, FaGavel, FaBookOpen, FaShieldAlt, FaHandshake, FaLandmark, FaArrowRight, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

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
          HERO SECTION — Elegant split layout
          ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-24 md:pt-20">
        {/* Rich gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-light"></div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Decorative gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Brand + Headline */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8 animate-slideUp">
                <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-gold-light tracking-wide">Trusted Legal Excellence</span>
              </div>

              <h1 className="mb-6 animate-slideUp" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                <span className="block text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight">
                  Law-gically
                </span>
                <span className="block text-4xl md:text-5xl lg:text-6xl font-serif italic font-medium text-gold mt-2">
                  Yours
                </span>
              </h1>

              <div className="w-20 h-1 bg-gold rounded-full mb-6 mx-auto lg:mx-0 animate-slideUp" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}></div>

              <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light leading-relaxed max-w-lg mx-auto lg:mx-0 animate-slideUp" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
                Your Partner in Legal Excellence
              </p>
              <p className="text-lg text-gray-400 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed animate-slideUp" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                Providing expert legal counsel with integrity, strategy, and unwavering commitment to justice.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slideUp" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                <Link to="/blogs" className="bg-gold text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-gold-dark transition-all duration-300 shadow-lg hover:shadow-xl group inline-flex items-center justify-center">
                  Explore Our Blogs
                  <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#about" className="border-2 border-white/30 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center">
                  About Us
                </a>
              </div>
            </div>

            {/* Right: Visual showcase */}
            <div className="flex flex-col items-center justify-center animate-fadeIn">
              <div className="relative w-full max-w-md">
                {/* Main visual card */}
                <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10">
                  {/* Central icon */}
                  <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center">
                      <FaBalanceScale className="w-12 h-12 md:w-16 md:h-16 text-gold animate-float" />
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-2xl md:text-3xl font-bold text-white">730K+</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Words of Law</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-2xl md:text-3xl font-bold text-gold">20+</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Bare Acts</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-2xl md:text-3xl font-bold text-white">4</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Categories</div>
                    </div>
                  </div>

                  {/* Feature badges */}
                  <div className="space-y-3">
                    {[
                      { icon: FaGavel, label: 'Comprehensive Legal Research', color: 'text-gold' },
                      { icon: FaBookOpen, label: 'Expert Analysis & Insights', color: 'text-white' },
                      { icon: FaShieldAlt, label: 'Trusted & Verified Sources', color: 'text-gold' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                        <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0`} />
                        <span className="text-sm text-gray-300 font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating accent cards */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gold/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-gold/30 animate-float" style={{ animationDelay: '0.5s' }}>
                  <FaGavel className="w-7 h-7 text-gold" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 animate-float" style={{ animationDelay: '1s' }}>
                  <FaLandmark className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          BREAKING NEWS TICKER
          ═══════════════════════════════════════════════════════ */}
      <NewsTicker />

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
                <div className="w-16 h-16 bg-gradient-to-br from-navy/10 to-navy/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-navy/20 group-hover:to-gold/10 transition-all duration-300">
                  <service.Icon className="w-8 h-8 text-navy group-hover:text-gold transition-colors duration-300" />
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
          BARE ACTS LIBRARY — Content (left) + Feature display (right)
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
                <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right: Category showcase */}
            <div className="rounded-2xl bg-gradient-to-br from-navy/5 to-gold/5 border border-navy/10 p-8 md:p-10">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { Icon: ScaleIcon, title: 'Constitutional', subtitle: 'Fundamental Laws', iconBg: 'bg-navy/10', iconColor: 'text-navy' },
                  { Icon: GavelIcon, title: 'Criminal', subtitle: 'Penal Statutes', iconBg: 'bg-gold/10', iconColor: 'text-gold' },
                  { Icon: FileTextIcon, title: 'Civil', subtitle: 'Procedural Laws', iconBg: 'bg-navy/10', iconColor: 'text-navy' },
                  { Icon: UsersIcon, title: 'Family', subtitle: 'Personal Laws', iconBg: 'bg-gold/10', iconColor: 'text-gold' },
                ].map((item, idx) => (
                  <div key={idx} className="text-center p-5 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                    <div className={`w-14 h-14 ${item.iconBg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                      <item.Icon className={`w-7 h-7 ${item.iconColor}`} />
                    </div>
                    <h4 className="font-semibold text-navy text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
                  </div>
                ))}
              </div>
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
            <h2 className="section-title">Our Latest Blogs</h2>
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
                    <FaArrowRight className="w-3 h-3 ml-2" />
                  </Link>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link to="/blogs" className="btn-secondary inline-flex items-center group">
              View All Articles
              <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Gold Separator */}
      <div className="max-w-7xl mx-auto px-4">
        <hr className="border-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          ABOUT SECTION — Text + values (left) + Pillars of justice (right)
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
                  { label: 'Integrity', Icon: FaBalanceScale },
                  { label: 'Knowledge', Icon: FaBookOpen },
                  { label: 'Service', Icon: FaHandshake },
                ].map((value) => (
                  <div key={value.label} className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-navy/10 to-gold/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <value.Icon className="w-5 h-5 text-navy" />
                    </div>
                    <h4 className="font-semibold text-navy text-sm">{value.label}</h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Progress & pillars display */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-navy to-navy-dark border border-navy-light/30 p-8 md:p-10 text-white">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  <FaLandmark className="w-10 h-10 text-gold" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">
                  Built on Strong Foundations
                </h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Our practice stands on the pillars of legal excellence, ethical conduct, and client-first advocacy.
                </p>
                <div className="w-full space-y-5">
                  {[
                    { label: 'Legal Research & Analysis', progress: 95 },
                    { label: 'Client Satisfaction', progress: 98 },
                    { label: 'Case Preparation', progress: 92 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-200">{item.label}</span>
                        <span className="text-gold font-semibold">{item.progress}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-1000 ease-out"
                          style={{ width: aboutVisible ? `${item.progress}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          CTA SECTION
          ═══════════════════════════ */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-white via-cream to-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-navy/5 rounded-full mb-6">
            <FaBookOpen className="w-3 h-3 text-navy" />
            <span className="text-sm font-medium text-navy">Legal Resources</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-4">
            Stay Updated with Our Blogs
          </h2>
          <div className="divider-gold"></div>
          <p className="text-gray-500 mb-10 text-lg leading-relaxed">
            Explore our collection of legal articles, perspectives, and analysis
          </p>
          <Link to="/blogs" className="btn-gold inline-flex items-center text-lg px-8 py-4 group">
            View All Articles
            <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════
          FOOTER
          ═══════════════════════════ */}
      <footer className="relative py-12 px-4 bg-navy-dark text-white">
        {/* Top gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                <FaBalanceScale className="w-5 h-5 text-gold" />
              </div>
              <div>
                <span className="text-2xl font-serif font-bold">Law-gically Yours</span>
                <span className="text-gray-400 text-sm hidden sm:block">Legal Excellence</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <Link to="/" className="hover:text-gold transition-colors">Home</Link>
              <Link to="/blogs" className="hover:text-gold transition-colors">My Blogs</Link>
              <Link to="/bareacts" className="hover:text-gold transition-colors">Bare Acts</Link>
              <Link to="/admin/login" className="hover:text-gold transition-colors">Admin</Link>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/law-gically-yours-5595653a8?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-gold/20 hover:text-gold transition-all duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/law_gicallyyours?utm_source=qr&igsh=bTBkZnJ4ZzZrdTVm"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-gold/20 hover:text-gold transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
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
