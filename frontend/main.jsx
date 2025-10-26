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


const TechStack = () => {
  const techRef = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, { threshold: 0.2 });

    if (techRef.current) io.observe(techRef.current);
    return () => io.disconnect();
  }, []);

  const technologies = [
    { name: 'React', icon: '⚛️', color: 'from-blue-400 to-blue-600' },
    { name: 'Node.js', icon: '🟢', color: 'from-green-400 to-green-600' },
    { name: 'Python', icon: '🐍', color: 'from-yellow-400 to-yellow-600' },
    { name: 'Gemini', icon: '💎', color: 'from-purple-400 to-purple-600' },
    { name: 'GCP Cloud', icon: '☁️', color: 'from-blue-500 to-blue-700' },
    { name: 'Docker', icon: '🐳', color: 'from-cyan-400 to-cyan-600' },
    { name: 'GitHub', icon: '🐙', color: 'from-gray-500 to-gray-700' },
    { name: 'Perplexity', icon: '🤔', color: 'from-indigo-400 to-indigo-600' },
    { name: 'SerpAPI', icon: '🔍', color: 'from-green-500 to-green-700' },
    { name: 'Vertex AI', icon: '🧠', color: 'from-orange-400 to-orange-600' }
  ];

  return (
    <section id="tech-stack" className="py-20 bg-black/10">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={techRef} className="text-center reveal" style={{ '--ty': '30px' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Built with Modern Technology</h2>
          <p className="text-secondary mb-12 max-w-3xl mx-auto">
            Leveraging the latest technologies and frameworks to deliver a powerful, scalable, and secure platform.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4 md:gap-6">
            {technologies.map((tech, index) => (
              <div 
                key={index}
                className="tech-item liquid-glass-card p-3 md:p-4 rounded-xl text-center group hover:scale-110 transition-all duration-300"
                style={{ '--delay': `${index * 0.1}s` }}
              >
                <div className="text-2xl md:text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">
                  {tech.icon}
                </div>
                <div className="text-xs md:text-sm font-medium text-white/90">{tech.name}</div>
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const HackathonInfo = () => {
  const hackathonRef = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, { threshold: 0.2 });

    if (hackathonRef.current) io.observe(hackathonRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section id="hackathon" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={hackathonRef} className="text-center reveal" style={{ '--ty': '30px' }}>
          <div className="liquid-glass-card p-8 rounded-3xl max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Hack2Skill - Google Hackathon</h2>
            </div>
            
            <p className="text-secondary text-lg mb-8 max-w-3xl mx-auto">
              PitchLense was developed as part of the prestigious Hack2Skill - Google Hackathon, 
              showcasing innovation in AI-powered startup evaluation and investment management.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl mb-2">🚀</div>
                <h3 className="font-semibold mb-2">Innovation</h3>
                <p className="text-sm text-secondary">Cutting-edge AI technology for startup analysis</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🤝</div>
                <h3 className="font-semibold mb-2">Collaboration</h3>
                <p className="text-sm text-secondary">Built by passionate developers and entrepreneurs</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💡</div>
                <h3 className="font-semibold mb-2">Impact</h3>
                <p className="text-sm text-secondary">Revolutionizing the investment landscape</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <a 
                href="https://vision.hack2skill.com/event/genaiexchangehackathon/?utm_source=hack2skill&utm_medium=homepage#overview" 
                target="_blank" 
                rel="noopener noreferrer"
                className="glass-button px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300"
              >
                View Hackathon Details
              </a>
              <a 
                href="https://github.com/connectaman/PitchLense" 
                target="_blank" 
                rel="noopener noreferrer"
                className="glass-button px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300"
              >
                View on GitHub
              </a>
            </div>
            
            {/* Project Links and Badges */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center mb-4">Project Links & Resources</h3>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a 
                  href="https://youtu.be/XUuLeXaEIdI" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
                >
                  <span className="text-lg">📺</span>
                  <span className="text-sm font-medium">YouTube Tutorial</span>
                </a>
                
                <a 
                  href="https://www.pitchlense.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300"
                >
                  <span className="text-lg">🌐</span>
                  <span className="text-sm font-medium">Website</span>
                </a>
                
                <a 
                  href="https://github.com/connectaman/PitchLense" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300"
                >
                  <span className="text-lg">💻</span>
                  <span className="text-sm font-medium">GitHub Repository</span>
                </a>
                
                <a 
                  href="https://github.com/connectaman/Pitchlense-mcp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300"
                >
                  <span className="text-lg">🔧</span>
                  <span className="text-sm font-medium">MCP Repository</span>
                </a>
                
                <a 
                  href="https://pypi.org/project/pitchlense-mcp/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
                >
                  <span className="text-lg">🐍</span>
                  <span className="text-sm font-medium">PyPI Package</span>
                </a>
                
                <a 
                  href="https://pitchlense-mcp.readthedocs.io/en/latest/api.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors duration-300"
                >
                  <span className="text-lg">📚</span>
                  <span className="text-sm font-medium">Documentation</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TeamSection = () => {
  const teamRef = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, { threshold: 0.2 });

    if (teamRef.current) io.observe(teamRef.current);
    return () => io.disconnect();
  }, []);

  const teamMembers = [
    {
      name: "Aman Ulla",
      role: "Full Stack AI Engineer, Architect",
      image: "/static/team/aman.png",
      social: {
        github: "https://github.com/connectaman",
        linkedin: "https://www.linkedin.com/in/connectaman/",
        website: "https://connectaman.hashnode.dev/",
        email: "connectamanulla@gmail.com"
      }
    },
    {
      name: "Srinivas Alva",
      role: "Backend Developer & Data Scientist",
      image: "/static/team/alva.png",
      social: {
        github: "https://github.com/srinivas02",
        linkedin: "https://www.linkedin.com/in/srinivasalva/",
        email: "alva.srinu@gmail.com"
      }
    }
  ];

  return (
    <section id="team" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={teamRef} className="text-center reveal" style={{ '--ty': '30px' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
          <p className="text-secondary mb-12 max-w-3xl mx-auto">
            Meet the passionate developers and entrepreneurs behind PitchLense, 
            bringing together expertise in AI, full-stack development, and Architecting the Product.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="team-card liquid-glass-card p-4 md:p-6 rounded-3xl text-center group hover:scale-105 transition-all duration-300"
                style={{ '--delay': `${index * 0.2}s` }}
              >
                <div className="image-wrapper mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto object-cover object-center border-4 border-accent/20 group-hover:border-accent/40 transition-all duration-300"
                    style={{ objectPosition: 'center top' }}
                  />
                </div>
                <div className="box-desc">
                  <h3 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-accent transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-secondary text-xs md:text-sm mb-4">{member.role}</p>
                </div>
                <div className="flex justify-center gap-2 md:gap-3">
                  <a 
                    href={member.social.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/20 hover:bg-accent/40 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    title="GitHub"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a 
                    href={member.social.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/20 hover:bg-accent/40 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    title="LinkedIn"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  {member.social.website && (
                    <a 
                      href={member.social.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/20 hover:bg-accent/40 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      title="Blog"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                      </svg>
                    </a>
                  )}
                  {member.social.email && (
                    <div className="relative group">
                      <a 
                        href={`mailto:${member.social.email}`} 
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/20 hover:bg-accent/40 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        title={member.social.email}
                        onClick={(e) => {
                          e.preventDefault();
                          navigator.clipboard.writeText(member.social.email);
                          // Show tooltip
                          const tooltip = e.target.closest('.relative').querySelector('.email-tooltip');
                          if (tooltip) {
                            tooltip.classList.remove('hidden');
                            setTimeout(() => {
                              tooltip.classList.add('hidden');
                            }, 2000);
                          }
                        }}
                      >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                      </a>
                      <div className="email-tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded-lg whitespace-nowrap hidden z-50">
                        {member.social.email}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
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
          
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-center gap-8">
            {/* Left Vertical Slideshow */}
            <div className="movie-reel-container">
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
            <div className="movie-reel-container">
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

          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Mobile Movie Reels - Horizontal */}
            <div className="flex flex-col items-center gap-6 mb-8">
              {/* Top Horizontal Movie Reel */}
              <div className="movie-reel-container-horizontal w-full max-w-lg h-32">
                <div className="movie-reel-track-horizontal">
                  <div className="movie-reel-strip-horizontal">
                    {[1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6].map((num, index) => (
                      <div key={index} className="movie-reel-frame-horizontal">
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

              {/* Mobile Grid Layout for Dock Items */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                {dockItems.map((item, index) => (
                  <div
                    key={index}
                    className="dock-item-glass p-4 rounded-xl text-center group hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div className="text-xs font-medium text-white/90 group-hover:text-accent transition-colors duration-300 leading-tight">
                      {item.title}
                    </div>
                    {/* Gradient overlay for mobile */}
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                  </div>
                ))}
              </div>

              {/* Bottom Horizontal Movie Reel */}
              <div className="movie-reel-container-horizontal w-full max-w-lg h-32">
                <div className="movie-reel-track-horizontal">
                  <div className="movie-reel-strip-horizontal movie-reel-reverse">
                    {[6, 5, 4, 3, 2, 1, 6, 5, 4, 3, 2, 1].map((num, index) => (
                      <div key={index} className="movie-reel-frame-horizontal">
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
      <TechStack />
      <YouTubeVideo />
      <RadialDock />
      <HackathonInfo />
      <TeamSection />
      {/* <CTA /> */}
    </main>
    <Footer />
  </>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);


