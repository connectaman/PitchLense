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
  const slideshowRef = useRef(null);

  useEffect(() => {
    // Initialize the slideshow after component mounts
    if (slideshowRef.current) {
      // The slideshow will be initialized by the external script
      const script = document.createElement('script');
      script.textContent = `
        class MzaCarousel {
          constructor(root, opts = {}) {
            this.root = root;
            this.viewport = root.querySelector(".mzaCarousel-viewport");
            this.track = root.querySelector(".mzaCarousel-track");
            this.slides = Array.from(root.querySelectorAll(".mzaCarousel-slide"));
            this.prevBtn = root.querySelector(".mzaCarousel-prev");
            this.nextBtn = root.querySelector(".mzaCarousel-next");
            this.pagination = root.querySelector(".mzaCarousel-pagination");
            this.progressBar = root.querySelector(".mzaCarousel-progressBar");
            this.isFF = typeof InstallTrigger !== "undefined";
            this.n = this.slides.length;
            this.state = {
              index: 0,
              pos: 0,
              width: 0,
              height: 0,
              gap: 28,
              dragging: false,
              pointerId: null,
              x0: 0,
              v: 0,
              t0: 0,
              animating: false,
              hovering: false,
              startTime: 0,
              pausedAt: 0,
              rafId: 0
            };
            this.opts = Object.assign(
              {
                gap: 28,
                peek: 0.15,
                rotateY: 34,
                zDepth: 150,
                scaleDrop: 0.09,
                blurMax: 2.0,
                activeLeftBias: 0.12,
                interval: 4500,
                transitionMs: 900,
                keyboard: true,
                breakpoints: [
                  {
                    mq: "(max-width: 1200px)",
                    gap: 24,
                    peek: 0.12,
                    rotateY: 28,
                    zDepth: 120,
                    scaleDrop: 0.08,
                    activeLeftBias: 0.1
                  },
                  {
                    mq: "(max-width: 1000px)",
                    gap: 18,
                    peek: 0.09,
                    rotateY: 22,
                    zDepth: 90,
                    scaleDrop: 0.07,
                    activeLeftBias: 0.09
                  },
                  {
                    mq: "(max-width: 768px)",
                    gap: 14,
                    peek: 0.06,
                    rotateY: 16,
                    zDepth: 70,
                    scaleDrop: 0.06,
                    activeLeftBias: 0.08
                  },
                  {
                    mq: "(max-width: 560px)",
                    gap: 12,
                    peek: 0.05,
                    rotateY: 12,
                    zDepth: 60,
                    scaleDrop: 0.05,
                    activeLeftBias: 0.07
                  }
                ]
              },
              opts
            );
            if (this.isFF) {
              this.opts.rotateY = 10;
              this.opts.zDepth = 0;
              this.opts.blurMax = 0;
            }
            this._init();
          }
          _init() {
            this._setupDots();
            this._setupEvents();
            this._setupResize();
            this._setupBreakpoints();
            this._render();
            this._startAutoPlay();
          }
          _setupDots() {
            this.pagination.innerHTML = "";
            for (let i = 0; i < this.n; i++) {
              const dot = document.createElement("button");
              dot.className = "mzaCarousel-dot";
              dot.setAttribute("aria-label", \`Go to slide \${i + 1}\`);
              dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
              dot.addEventListener("click", () => this.goTo(i));
              this.pagination.appendChild(dot);
            }
          }
          _setupEvents() {
            this.prevBtn.addEventListener("click", () => this.prev());
            this.nextBtn.addEventListener("click", () => this.next());
            this.viewport.addEventListener("pointerdown", (e) => this._onPointerDown(e));
            this.viewport.addEventListener("pointermove", (e) => this._onPointerMove(e));
            this.viewport.addEventListener("pointerup", (e) => this._onPointerUp(e));
            this.viewport.addEventListener("pointercancel", (e) => this._onPointerUp(e));
            this.viewport.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });
            this.viewport.addEventListener("wheel", (e) => this._onWheel(e), { passive: false });
            this.root.addEventListener("mouseenter", () => this._onMouseEnter());
            this.root.addEventListener("mouseleave", () => this._onMouseLeave());
            this.root.addEventListener("mousemove", (e) => this._onMouseMove(e));
            if (this.opts.keyboard) {
              this.root.addEventListener("keydown", (e) => this._onKeyDown(e));
            }
          }
          _setupResize() {
            const ro = new ResizeObserver(() => this._onResize());
            ro.observe(this.root);
          }
          _setupBreakpoints() {
            this.breakpoint = this.opts.breakpoints.find((bp) => window.matchMedia(bp.mq).matches) || {};
            Object.assign(this.opts, this.breakpoint);
          }
          _onResize() {
            this._setupBreakpoints();
            this._render();
          }
          _onPointerDown(e) {
            if (this.state.animating) return;
            this.state.dragging = true;
            this.state.pointerId = e.pointerId;
            this.state.x0 = e.clientX;
            this.state.t0 = Date.now();
            this.state.v = 0;
            this.viewport.setPointerCapture(e.pointerId);
            this._pauseAutoPlay();
          }
          _onPointerMove(e) {
            if (!this.state.dragging || e.pointerId !== this.state.pointerId) return;
            e.preventDefault();
            const dx = e.clientX - this.state.x0;
            const dt = Date.now() - this.state.t0;
            this.state.v = dx / dt;
            this._render(this.state.pos + dx);
          }
          _onPointerUp(e) {
            if (!this.state.dragging || e.pointerId !== this.state.pointerId) return;
            this.state.dragging = false;
            this.viewport.releasePointerCapture(e.pointerId);
            const dx = e.clientX - this.state.x0;
            const threshold = this.slideW * 0.1;
            if (Math.abs(dx) > threshold || Math.abs(this.state.v) > 0.5) {
              if (dx > 0) {
                this.prev();
              } else {
                this.next();
              }
            } else {
              this._render();
            }
            this._resumeAutoPlay();
          }
          _onWheel(e) {
            e.preventDefault();
            if (e.deltaY > 0) {
              this.next();
            } else {
              this.prev();
            }
          }
          _onMouseEnter() {
            this.state.hovering = true;
            this._pauseAutoPlay();
          }
          _onMouseLeave() {
            this.state.hovering = false;
            this._resumeAutoPlay();
          }
          _onMouseMove(e) {
            const rect = this.root.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const tiltX = ((y / rect.height) - 0.5) * 20;
            const tiltY = ((x / rect.width) - 0.5) * -20;
            this.root.style.setProperty("--mzaTiltX", tiltX);
            this.root.style.setProperty("--mzaTiltY", tiltY);
          }
          _onKeyDown(e) {
            switch (e.key) {
              case "ArrowLeft":
                e.preventDefault();
                this.prev();
                break;
              case "ArrowRight":
                e.preventDefault();
                this.next();
                break;
            }
          }
          _startAutoPlay() {
            this.state.startTime = Date.now();
            this._tick();
          }
          _pauseAutoPlay() {
            this.state.pausedAt = Date.now();
            cancelAnimationFrame(this.state.rafId);
          }
          _resumeAutoPlay() {
            this.state.startTime += Date.now() - this.state.pausedAt;
            this._tick();
          }
          _tick() {
            if (this.state.hovering) {
              this.state.rafId = requestAnimationFrame(() => this._tick());
              return;
            }
            const elapsed = Date.now() - this.state.startTime;
            if (elapsed >= this.opts.interval) {
              this.next();
              this.state.startTime = Date.now();
            }
            this.state.rafId = requestAnimationFrame(() => this._tick());
          }
          _render(overridePos) {
            const pos = overridePos !== undefined ? overridePos : this.state.pos;
            const span = this.slideW + this.state.gap;
            const tiltX = parseFloat(this.root.style.getPropertyValue("--mzaTiltX") || 0);
            const tiltY = parseFloat(this.root.style.getPropertyValue("--mzaTiltY") || 0);
            this.track.style.transform = \`translateX(\${-pos}px) rotateX(\${tiltX}deg) rotateY(\${tiltY}deg)\`;
            this.slides.forEach((slide, i) => {
              const slidePos = i * span - pos;
              const center = this.state.width / 2;
              const distance = Math.abs(slidePos - center);
              const maxDistance = this.state.width * 0.6;
              const normalizedDistance = Math.min(distance / maxDistance, 1);
              const scale = 1 - this.opts.scaleDrop * normalizedDistance;
              const rotateY = this.opts.rotateY * (slidePos < center ? 1 : -1) * normalizedDistance;
              const z = this.opts.zDepth * normalizedDistance;
              const blur = this.opts.blurMax * normalizedDistance;
              const opacity = 1 - normalizedDistance * 0.3;
              slide.style.transform = \`translateZ(\${z}px) rotateY(\${rotateY}deg) scale(\${scale})\`;
              slide.style.filter = \`blur(\${blur}px)\`;
              slide.style.opacity = opacity;
              const isActive = Math.abs(slidePos - center) < this.slideW * 0.3;
              slide.setAttribute("data-state", isActive ? "active" : "inactive");
              if (isActive) {
                this.state.index = i;
                this._updateDots();
              }
            });
            this._updateProgress();
          }
          _updateDots() {
            this.pagination.querySelectorAll(".mzaCarousel-dot").forEach((dot, i) => {
              dot.setAttribute("aria-selected", i === this.state.index ? "true" : "false");
            });
          }
          _updateProgress() {
            const progress = (this.state.index + 1) / this.n * 100;
            this.progressBar.style.width = \`\${progress}%\`;
          }
          goTo(index) {
            if (this.state.animating) return;
            this.state.animating = true;
            this.state.index = this._mod(index, this.n);
            this.state.pos = this.state.index * (this.slideW + this.state.gap);
            this._render();
            setTimeout(() => {
              this.state.animating = false;
            }, this.opts.transitionMs);
          }
          next() {
            this.goTo(this.state.index + 1);
          }
          prev() {
            this.goTo(this.state.index - 1);
          }
          _mod(i, n) {
            return ((i % n) + n) % n;
          }
        }
        
        // Initialize the carousel
        const mza = new MzaCarousel(document.getElementById("mzaCarousel"), {
          transitionMs: 900
        });
      `;
      document.head.appendChild(script);
    }
  }, []);

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

        <div className="mzaCarousel" id="mzaCarousel" aria-roledescription="carousel" aria-label="Featured cards">
          <div className="mzaCarousel-viewport" tabIndex="0">
            <div className="mzaCarousel-track">
              <article className="mzaCarousel-slide" role="group" aria-roledescription="slide" aria-label="1 of 5">
                <div className="mzaCard" style={{'--mzaCard-bg':"url('/static/screenshot/1.png')"}}>
                  <header className="mzaCard-head mzaPar-1">
                    <h2 className="mzaCard-title">Startup Analysis Dashboard</h2>
                    <p className="mzaCard-kicker">AI-Powered Insights</p>
                  </header>
                  <p className="mzaCard-text mzaPar-2">Comprehensive startup evaluation with AI-driven risk assessment, market analysis, and investment recommendations.</p>
                  <footer className="mzaCard-actions mzaPar-3"><button className="mzaBtn">Explore Dashboard</button></footer>
                </div>
              </article>

              <article className="mzaCarousel-slide" role="group" aria-roledescription="slide" aria-label="2 of 5">
                <div className="mzaCard" style={{'--mzaCard-bg':"url('/static/screenshot/2.png')"}}>
                  <header className="mzaCard-head mzaPar-1">
                    <h2 className="mzaCard-title">Investment Management</h2>
                    <p className="mzaCard-kicker">Portfolio Optimization</p>
                  </header>
                  <p className="mzaCard-text mzaPar-2">Track and manage your investment portfolio with real-time analytics and performance metrics.</p>
                  <footer className="mzaCard-actions mzaPar-3"><button className="mzaBtn">View Portfolio</button></footer>
                </div>
              </article>

              <article className="mzaCarousel-slide" role="group" aria-roledescription="slide" aria-label="3 of 5">
                <div className="mzaCard" style={{'--mzaCard-bg':"url('/static/screenshot/3.png')"}}>
                  <header className="mzaCard-head mzaPar-1">
                    <h2 className="mzaCard-title">Market Intelligence</h2>
                    <p className="mzaCard-kicker">Real-time Data</p>
                  </header>
                  <p className="mzaCard-text mzaPar-2">Stay ahead with global market performance tracking, news analysis, and trend identification.</p>
                  <footer className="mzaCard-actions mzaPar-3"><button className="mzaBtn">See Market Data</button></footer>
                </div>
              </article>

              <article className="mzaCarousel-slide" role="group" aria-roledescription="slide" aria-label="4 of 5">
                <div className="mzaCard" style={{'--mzaCard-bg':"url('/static/screenshot/4.png')"}}>
                  <header className="mzaCard-head mzaPar-1">
                    <h2 className="mzaCard-title">AI Meeting Assistant</h2>
                    <p className="mzaCard-kicker">Smart Collaboration</p>
                  </header>
                  <p className="mzaCard-text mzaPar-2">Enhance your meetings with AI-powered meeting assistance, transcription, and insights.</p>
                  <footer className="mzaCard-actions mzaPar-3"><button className="mzaBtn">Try Assistant</button></footer>
                </div>
              </article>

              <article className="mzaCarousel-slide" role="group" aria-roledescription="slide" aria-label="5 of 5">
                <div className="mzaCard" style={{'--mzaCard-bg':"url('/static/screenshot/5.png')"}}>
                  <header className="mzaCard-head mzaPar-1">
                    <h2 className="mzaCard-title">Networking Hub</h2>
                    <p className="mzaCard-kicker">Connect & Collaborate</p>
                  </header>
                  <p className="mzaCard-text mzaPar-2">Network with other VCs and investors, share insights, and discover new investment opportunities.</p>
                  <footer className="mzaCard-actions mzaPar-3"><button className="mzaBtn">Join Network</button></footer>
                </div>
              </article>
            </div>
          </div>

          <div className="mzaCarousel-controls" aria-label="Controls">
            <button className="mzaCarousel-prev" aria-label="Previous slide" type="button">‹</button>
            <button className="mzaCarousel-next" aria-label="Next slide" type="button">›</button>
          </div>

          <div className="mzaCarousel-pagination" role="tablist" aria-label="Slide navigation"></div>
          <div className="mzaCarousel-progress" aria-hidden="true"><span className="mzaCarousel-progressBar"></span></div>
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
