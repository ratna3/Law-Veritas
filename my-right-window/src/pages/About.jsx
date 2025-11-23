const About = () => {
  return (
    <div className="min-h-screen bg-deep-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-linear-to-r from-neon-green to-neon-cyan">
          About My Right Window
        </h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-lg mb-6 text-gray-300">
            Welcome to <span className="text-neon-green font-semibold">My Right Window</span>, a futuristic blog platform 
            where technology meets creativity in a stunning 3D environment.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-neon-cyan">Our Mission</h2>
          <p className="text-gray-300 mb-6">
            We believe in creating immersive digital experiences that push the boundaries of traditional blogging. 
            Through cutting-edge 3D graphics powered by Three.js and modern web technologies, we provide a platform 
            that's not just informative, but visually captivating.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-neon-cyan">What We Offer</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-300 mb-6">
            <li>Engaging blog content with rich media support</li>
            <li>Immersive 3D visual experience</li>
            <li>Modern, responsive design</li>
            <li>Fast and optimized performance</li>
            <li>Interactive user interface</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-neon-cyan">Technology Stack</h2>
          <p className="text-gray-300 mb-4">
            Built with the latest web technologies:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li><strong className="text-neon-green">React 18</strong> - Modern UI framework</li>
            <li><strong className="text-neon-green">Three.js & React Three Fiber</strong> - 3D graphics</li>
            <li><strong className="text-neon-green">Tailwind CSS</strong> - Beautiful styling</li>
            <li><strong className="text-neon-green">Vite</strong> - Lightning-fast build tool</li>
            <li><strong className="text-neon-green">Supabase</strong> - Backend and database</li>
          </ul>

          <div className="mt-12 p-6 bg-linear-to-r from-neon-green/10 to-neon-cyan/10 rounded-lg border border-neon-green/30">
            <p className="text-gray-300">
              Join us on this journey through the digital landscape, where every post is a window to new perspectives 
              and possibilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
