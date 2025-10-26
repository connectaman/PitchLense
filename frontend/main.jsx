/* global gsap */
const { useEffect, useRef } = React;

const Logo = () => (
  <div className="w-9 h-9 grid place-items-center">
    <img src="/static/logo.svg" alt="PitchLense" className="w-9 h-9" onError={(e)=>{
      e.currentTarget.outerHTML = '<div class=\"w-9 h-9 rounded-full bg-accent grid place-items-center shadow-card\"><span class=\"font-extrabold text-black\">W</span></div>';
    }} />
  </div>
);

const NavBar = () => (
  <header className="fixed top-0 left-0 right-0 z-40 bg-[#2E3137] border-b border-white/5">
    <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Logo />
        <span className="text-secondary">PitchLense</span>
      </div>
      <div className="flex items-center gap-3">
        <a href="/auth.html" className="px-4 py-2 rounded-full border border-white/10 bg-surface text-white font-semibold hover:bg-white/10 transition">Login</a>
      </div>
    </div>
  </header>
);

const Glow = () => (
  <>
    <div className="pointer-events-none fixed -top-24 -left-24 w-[40rem] h-[40rem] rounded-full opacity-20 blur-3xl floaty" style={{background:"radial-gradient(50% 50% at 50% 50%, #f1d85b 0%, rgba(241,216,91,0) 70%)"}} />
    <div className="pointer-events-none fixed -bottom-24 -right-24 w-[40rem] h-[40rem] rounded-full opacity-20 blur-3xl floaty-slow" style={{background:"radial-gradient(50% 50% at 50% 50%, #78e6d0 0%, rgba(120,230,208,0) 70%)"}} />
  </>
);

const Hero = () => {
  const headlineRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(headlineRef.current, {y: 20, opacity: 0}, {y: 0, opacity: 1, duration: 0.9, ease: 'power3.out'});
    gsap.fromTo(cardsRef.current?.querySelectorAll('[data-card]'), {y: 30, opacity: 0}, {y: 0, opacity: 1, stagger: 0.12, delay: 0.2, duration: 0.8, ease: 'power3.out'});
  }, []);

  return (
    <section className="relative pt-28 md:pt-32 overflow-hidden">
      <Glow />
      <div className="max-w-7xl mx-auto px-6">
        <div ref={headlineRef} className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface px-3 py-1 text-secondary">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>AI Analyst for Startup Evaluation</span>
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight">
            Pitch<span className="text-accent">Lense</span>
          </h1>
          <p className="mt-4 md:text-lg text-secondary max-w-3xl mx-auto">
            PitchLense synthesizes pitch decks, founder calls and public signals to produce concise, investor‑ready deal notes with benchmarks and risk assessments.
          </p>
      
        </div>

      </div>
    </section>
  );
};

const Features = () => {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, { threshold: 0.2 });

    if (leftRef.current) io.observe(leftRef.current);
    if (rightRef.current) io.observe(rightRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section id="features" className="relative py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div ref={leftRef} className="rounded-xl bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.0)_100%)] border border-white/10 p-6 shadow-card reveal" style={{ '--tx': '-40px' }}>
            <img src="/static/tag_line.gif" alt="PitchLense Tagline" className="rounded-lg opacity-90" />
          </div>
          <ul ref={rightRef} className="space-y-5 reveal" style={{ '--tx': '40px' }}>
            {[{
              t:'Ingest everything', d:'Pitch decks, founder updates, call transcripts, emails and public news.'
            },{ t:'Structured deal notes', d:'Clear summaries, KPIs, risks and recommendations within minutes.' },{ t:'Custom weightages', d:'Tune sector and stage weightages to align with your thesis.' },{ t:'Source‑cited insights', d:'Integrated Web / News Search with links.' }].map((it, i) => (
              <li key={i} className="flex gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-accent/20 text-accent grid place-items-center">✓</div>
                <div>
                  <p className="font-semibold">{it.t}</p>
                  <p className="text-secondary text-sm">{it.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const YouTubeVideo = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, { threshold: 0.2 });

    if (videoRef.current) io.observe(videoRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section id="demo" className="py-20 bg-black/10">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={videoRef} className="text-center reveal" style={{ '--ty': '30px' }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">See PitchLense in Action</h2>
          <p className="text-secondary mb-8 max-w-2xl mx-auto">
            Watch our demo video to see how PitchLense transforms startup evaluation with AI-powered insights and comprehensive risk assessment.
          </p>
          <div className="relative max-w-4xl mx-auto">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-xl shadow-card border border-white/10"
                src="https://www.youtube.com/embed/XUuLeXaEIdI?si=c_BmRh3jfv2Hc2Ie&vq=hd720"
                title="PitchLense Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const RadialDock = () => {
  const dockRef = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, { threshold: 0.2 });

    if (dockRef.current) io.observe(dockRef.current);
    return () => io.disconnect();
  }, []);

  const dockItems = [
    { title: 'Startup Analysis', icon: '📊', color: 'from-blue-500/20 to-cyan-500/20' },
    { title: 'Investment Management', icon: '💰', color: 'from-green-500/20 to-emerald-500/20' },
    { title: 'Global Market Performance & News', icon: '🌍', color: 'from-purple-500/20 to-violet-500/20' },
    { title: 'Networking with other VC, Investors', icon: '🤝', color: 'from-orange-500/20 to-red-500/20' },
    { title: 'AI Meeting Assistance', icon: '🤖', color: 'from-pink-500/20 to-rose-500/20' },
    { title: 'Connect your email client with Pitchlense', icon: '📧', color: 'from-indigo-500/20 to-blue-500/20' },
    { title: 'Company Profiles', icon: '🏢', color: 'from-teal-500/20 to-cyan-500/20' },
    { title: 'Crowd funding & Insider trades', icon: '📈', color: 'from-yellow-500/20 to-orange-500/20' }
  ];

  return (
    <section id="radial-dock" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={dockRef} className="text-center reveal" style={{ '--ty': '30px' }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">PitchLense Capabilities</h2>
          <p className="text-secondary mb-12 max-w-2xl mx-auto">
            Explore our comprehensive suite of AI-powered tools designed to revolutionize startup evaluation and investment management.
          </p>
          
          {/* Main Container with Slideshows */}
          <div className="relative flex items-center justify-center gap-8">
            {/* Left Vertical Slideshow */}
            <div className="movie-reel-container hidden lg:block">
              <div className="movie-reel-track">
                <div className="movie-reel-strip">
                  {[1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6].map((num, index) => (
                    <div key={index} className="movie-reel-frame">
                      <img 
                        src={`/static/screenshots/${num}.png`} 
                        alt={`Screenshot ${num}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Radial Dock Container */}
            <div className="radial-dock-container relative w-[600px] h-[600px]">
            {/* SVG for connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 600">
              {dockItems.map((_, index) => {
                const angle = (index * 45) * (Math.PI / 180);
                const radius = 200;
                const centerX = 300;
                const centerY = 300;
                const x1 = centerX;
                const y1 = centerY;
                const x2 = centerX + radius * Math.cos(angle);
                const y2 = centerY + radius * Math.sin(angle);
                
                return (
                  <line
                    key={index}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(241, 216, 91, 0.3)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="connection-line"
                  />
                );
              })}
            </svg>

            {/* Central Logo */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-24 h-24 rounded-full dock-glass flex items-center justify-center cursor-pointer group">
              <img 
                src="/static/logo.svg" 
                alt="PitchLense" 
                className="w-16 h-16 transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.outerHTML = '<div class="w-16 h-16 rounded-full bg-accent grid place-items-center shadow-card"><span class="font-extrabold text-black text-2xl">P</span></div>';
                }}
              />
            </div>

            {/* Dock Items */}
            {dockItems.map((item, index) => {
              // Start from top (0 degrees) and go clockwise
              const angle = (index * 45) * (Math.PI / 180);
              const radius = 200;
              const centerX = 300;
              const centerY = 300;
              const x = centerX + radius * Math.cos(angle);
              const y = centerY + radius * Math.sin(angle);
              
              return (
                <div
                  key={index}
                  className="radial-dock-item absolute dock-item-glass cursor-pointer group"
                  style={{
                    left: `${x - 60}px`,
                    top: `${y - 60}px`,
                    width: '120px',
                    height: '120px'
                  }}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    <div className="dock-item-icon text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">
                      {item.icon}
                    </div>
                    <div className="dock-item-text text-xs font-medium text-white/90 leading-tight">
                      {item.title}
                    </div>
                  </div>
                  
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                </div>
              );
            })}
            </div>

            {/* Right Vertical Slideshow */}
            <div className="movie-reel-container hidden lg:block">
              <div className="movie-reel-track">
                <div className="movie-reel-strip movie-reel-reverse">
                  {[6, 5, 4, 3, 2, 1, 6, 5, 4, 3, 2, 1].map((num, index) => (
                    <div key={index} className="movie-reel-frame">
                      <img 
                        src={`/static/screenshots/${num}.png`} 
                        alt={`Screenshot ${num}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Capabilities = () => (
  <section id="capabilities" className="py-20">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-4">
        {[['Comprehensive Risk Scanner','Deep dive across all categories'],['Quick Risk Assessment','Fast pass for IC prep'],['Benchmarking','Compare metrics vs sector peers']].map(([t, s], i) => (
          <div key={i} className="rounded-2xl p-6 border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
            <p className="text-lg font-semibold">{t}</p>
            <p className="text-secondary text-sm">{s}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section id="cta" className="py-24">
    <div className="max-w-3xl mx-auto text-center px-6 rounded-3xl border border-white/10 bg-surface shadow-card">
      <h3 className="text-2xl md:text-3xl font-extrabold">Created with ❤️ by Aman Ulla, Srinivas Alva</h3>
      <p className="mt-2 text-secondary">Hack2Skill‑Google Hackathon</p>
      <div className="mt-6 flex items-center justify-center gap-4">
        <a href="https://amanulla.in/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-white transition-colors font-medium">Aman Ulla</a>
        <a href="#" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-white transition-colors font-medium">Srinivas Alva</a>
        <a href="https://vision.hack2skill.com/event/genaiexchangehackathon/?utm_source=hack2skill&utm_medium=homepage#overview" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-white transition-colors">Hackathon</a>
        <a href="https://github.com/connectaman/PitchLense" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-white transition-colors">GitHub</a>
        <a href="https://pypi.org/project/pitchlense-mcp/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-white transition-colors">PyPI</a>
        <a href="https://pitchlense-mcp.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-white transition-colors">Docs</a>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-10 text-center text-secondary border-t border-white/5">
    <p>© {new Date().getFullYear()} PitchLense. MIT License.</p>
  </footer>
);

const App = () => (
  <>
    <NavBar />
    <main>
      <Hero />
      <Features />
      <YouTubeVideo />
      <RadialDock />
      {/* <CTA /> */}
    </main>
    <Footer />
  </>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);


