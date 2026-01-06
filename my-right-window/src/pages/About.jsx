const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-navy">
            About Law-gically Yours
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-8 md:p-12">
          <p className="text-lg mb-8 text-gray-600 leading-relaxed">
            Welcome to <span className="text-navy font-semibold">Law-gically Yours</span>, where truth meets justice.
            We are dedicated to providing exceptional legal insights and expertise that guide you through
            complex legal landscapes with clarity and confidence.
          </p>

          <h2 className="text-2xl font-serif font-bold mt-8 mb-4 text-navy">Our Mission</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            At Law-gically Yours, we believe in making legal knowledge accessible and understandable.
            Through comprehensive analysis and clear communication, we empower individuals and businesses
            to make informed decisions in legal matters that affect their lives.
          </p>

          <h2 className="text-2xl font-serif font-bold mt-8 mb-4 text-navy">What We Offer</h2>
          <ul className="space-y-3 text-gray-600 mb-8">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></span>
              <span>In-depth legal articles and analysis</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></span>
              <span>Expert perspectives on current legal trends</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></span>
              <span>Guidance on corporate and personal legal matters</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></span>
              <span>Clear explanations of complex legal concepts</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></span>
              <span>Professional insights from experienced legal minds</span>
            </li>
          </ul>

          <h2 className="text-2xl font-serif font-bold mt-8 mb-4 text-navy">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-slate-50 rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Integrity</h3>
              <p className="text-sm text-gray-500">Upholding the highest ethical standards</p>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Knowledge</h3>
              <p className="text-sm text-gray-500">Deep expertise in legal matters</p>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Service</h3>
              <p className="text-sm text-gray-500">Committed to client success</p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gradient-to-r from-navy/5 to-gold/5 rounded-xl border border-navy/10">
            <p className="text-gray-600 text-center italic">
              "Justice that speaks truth — your trusted partner in navigating the legal landscape
              with clarity, integrity, and unwavering commitment to excellence."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
