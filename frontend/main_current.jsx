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
            Cut through noise. <span className="text-accent">Invest</span> with confidence.
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

const PitchLenseSlideshow = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);
  const slideshowRef = useRef(null);
  const intervalRef = useRef(null);

  const slides = [
    {
      id: 1,
      title: "Startup Analysis Dashboard",
      subtitle: "AI-Powered Insights",
      description: "Comprehensive startup evaluation with AI-driven risk assessment, market analysis, and investment recommendations.",
      buttonText: "Explore Dashboard",
      image: "/static/screenshot/1.png"
    },
    {
      id: 2,
      title: "Investment Management",
      subtitle: "Portfolio Optimization",
      description: "Track and manage your investment portfolio with real-time analytics and performance metrics.",
      buttonText: "View Portfolio",
      image: "/static/screenshot/2.png"
    },
    {
      id: 3,
      title: "Market Intelligence",
      subtitle: "Real-time Data",
      description: "Stay ahead with global market performance tracking, news analysis, and trend identification.",
      buttonText: "See Market Data",
      image: "/static/screenshot/3.png"
    },
    {
      id: 4,
      title: "AI Meeting Assistant",
      subtitle: "Smart Collaboration",
      description: "Enhance your meetings with AI-powered meeting assistance, transcription, and insights.",
      buttonText: "Try Assistant",
      image: "/static/screenshot/4.png"
    },
    {
      id: 5,
      title: "Networking Hub",
      subtitle: "Connect & Collaborate",
      description: "Network with other VCs and investors, share insights, and discover new investment opportunities.",
      buttonText: "Join Network",
      image: "/static/screenshot/5.png"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(nextSlide, 4500);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isAutoPlaying]);

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  return (
    <section id="slideshow" className="py-20 bg-gradient-to-br from-background via-background to-black/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-accent to-accent2 bg-clip-text text-transparent">
            PitchLense Features
          </h2>
          <p className="mt-4 text-secondary text-lg max-w-2xl mx-auto">
            Explore our comprehensive suite of AI-powered tools for startup evaluation and investment management
          </p>
        </div>

        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main Slideshow Container */}
          <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentSlide 
                    ? 'opacity-100 translate-x-0 scale-100' 
                    : 'opacity-0 translate-x-full scale-95'
                }`}
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
                <div className="relative z-10 h-full flex items-center">
                  <div className="max-w-2xl px-8 md:px-12">
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                        {slide.subtitle}
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      {slide.title}
                    </h3>
                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                      {slide.description}
                    </p>
                    <button className="px-6 py-3 bg-gradient-to-r from-accent to-accent2 text-black font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105">
                      {slide.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-20"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-20"
            aria-label="Next slide"
          >
            ›
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-accent scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-white/10 rounded-full h-1 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent to-accent2 transition-all duration-300 ease-out"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const LiquidGlassDock = () => {
  const dockRef = useRef(null);
  const centerRef = useRef(null);
  const leftItemsRef = useRef(null);
  const rightItemsRef = useRef(null);
  const [showVideoPopup, setShowVideoPopup] = React.useState(false);

  useEffect(() => {
    // Set initial states for scroll animation
    gsap.set(dockRef.current?.querySelectorAll('.dock-item'), { 
      opacity: 0, 
      x: (index) => index < 4 ? -100 : 100, // left items come from left, right from right
      scale: 0.8 
    });
    gsap.set(centerRef.current, { 
      opacity: 0, 
      scale: 0.5 
    });
    gsap.set(dockRef.current?.querySelectorAll('.connecting-line'), { 
      opacity: 0 
    });
    gsap.set(dockRef.current?.querySelectorAll('.central-connecting-lines .line'), { 
      opacity: 0 
    });

    // Fallback: if intersection observer doesn't work, show center logo after 2 seconds
    const fallbackTimer = setTimeout(() => {
      if (centerRef.current && centerRef.current.style.opacity === '0') {
        gsap.to(centerRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out'
        });
      }
    }, 2000);

    // Create intersection observer for scroll-triggered animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Animate left column items (coming from left)
          gsap.to(leftItemsRef.current?.querySelectorAll('.dock-item'), {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
          });

          // Animate right column items (coming from right)
          gsap.to(rightItemsRef.current?.querySelectorAll('.dock-item'), {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
          });

          // Animate center logo (fade in from center)
          gsap.to(centerRef.current, {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'elastic.out(1, 0.3)'
          });

          // Animate connecting lines
          gsap.to(dockRef.current?.querySelectorAll('.connecting-line'), {
            opacity: 1,
            duration: 1.5,
            stagger: 0.1,
            ease: 'power2.out'
          });

          // Animate central connecting lines
          gsap.to(dockRef.current?.querySelectorAll('.central-connecting-lines .line'), {
            opacity: 1,
            duration: 1.5,
            stagger: 0.05,
            ease: 'power2.out'
          });
        }
      });
    }, { threshold: 0.3 });

    if (dockRef.current) {
      observer.observe(dockRef.current);
    }

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  const features = [
    { title: "Startup Analysis", icon: "📊", gradient: "from-blue-500 to-purple-600" },
    { title: "Investment Management", icon: "💰", gradient: "from-green-500 to-teal-600" },
    { title: "Global Market Performance & News", icon: "📈", gradient: "from-orange-500 to-red-600" },
    { title: "Networking with other VC, Investors", icon: "🤝", gradient: "from-pink-500 to-rose-600" },
    { title: "AI Meeting Assistance", icon: "🤖", gradient: "from-indigo-500 to-blue-600" },
    { title: "Connect your email client with Pitchlense", icon: "📧", gradient: "from-cyan-500 to-blue-600" },
    { title: "Company Profiles", icon: "🏢", gradient: "from-emerald-500 to-green-600" },
    { title: "See PitchLense in Action", icon: "▶️", gradient: "from-yellow-500 to-orange-600", isVideo: true }
  ];

  const handleVideoClick = () => {
    setShowVideoPopup(true);
  };

  const closeVideoPopup = () => {
    setShowVideoPopup(false);
  };

  return (
    <>
      {/* Video Popup Modal */}
      {showVideoPopup && (
        <div className="video-popup-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="video-popup relative w-full max-w-4xl mx-4">
            <button
              onClick={closeVideoPopup}
              className="video-popup-close absolute -top-12 right-0 text-white text-2xl hover:text-accent transition-colors"
            >
              ✕
            </button>
            <div className="relative w-full h-0 pb-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="PitchLense Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <section id="platform" className="py-20 bg-gradient-to-br from-background via-background to-black/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-accent to-accent2 bg-clip-text text-transparent">
              PitchLense Platform
            </h2>
            <p className="mt-4 text-secondary text-lg max-w-2xl mx-auto">
              Discover the comprehensive suite of tools designed to revolutionize your investment process
            </p>
          </div>

          <div ref={dockRef} className="liquid-glass-dock relative max-w-6xl mx-auto">
            {/* Left Column */}
            <div ref={leftItemsRef} className="absolute left-0 top-1/2 -translate-y-1/2 space-y-4">
              {features.slice(0, 4).map((feature, index) => (
                <div key={index} className="dock-item liquid-glass-card group relative">
                  <div className="connecting-line"></div>
                  <div className="flex items-center gap-3 p-4">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white text-lg`}>
                      {feature.icon}
                    </div>
                    <span className="text-white font-medium">{feature.title}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div ref={rightItemsRef} className="absolute right-0 top-1/2 -translate-y-1/2 space-y-4">
              {features.slice(4, 8).map((feature, index) => (
                <div key={index} className="dock-item liquid-glass-card group relative">
                  <div className="connecting-line"></div>
                  <div 
                    className="flex items-center gap-3 p-4 cursor-pointer"
                    onClick={feature.isVideo ? handleVideoClick : undefined}
                  >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white text-lg`}>
                      {feature.icon}
                    </div>
                    <span className="text-white font-medium">{feature.title}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Center Logo */}
            <div ref={centerRef} className="liquid-glass-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="central-connecting-lines">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="line" style={{ '--rotation': `${i * 45}deg` }}></div>
                ))}
              </div>
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-accent to-accent2 flex items-center justify-center shadow-2xl">
                <img src="/static/logo.svg" alt="PitchLense" className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
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
            Watch how PitchLense transforms complex startup data into actionable investment insights
          </p>
          <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative w-full h-0 pb-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="PitchLense Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-8 border-t border-white/10 text-center text-secondary">
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
      <LiquidGlassDock />
      <PitchLenseSlideshow />
      {/* <CTA /> */}
    </main>
    <Footer />
  </>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
