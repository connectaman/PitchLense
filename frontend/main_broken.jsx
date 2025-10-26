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

// OLD RISK GRID - COMMENTED OUT
// const RiskGrid = () => {
//   const risks = [
//     ['Market','Small TAM, weak growth, crowded space, limited differentiation'],
//     ['Product','Early stage, unclear PMF, technical risk, weak IP'],
//     ['Team/Founder','Churn, single‑founder, skill gaps, credibility'],
//     ['Financial','Inconsistent metrics, burn, CAC/LTV, margins'],
//     ['Customer & Traction','Low traction, churn, retention, concentration'],
//     ['Operational','Supply chain, GTM, inefficiency, execution'],
//     ['Competitive','Incumbent strength, low barriers, defensibility'],
//     ['Legal & Regulatory','Grey areas, compliance gaps, disputes, IP risks'],
//     ['Exit','Limited pathways, low sector exits, late‑stage appeal']
//   ];
//   return (
//     <section id="risks" className="py-20 bg-black/20">
//       <div className="max-w-7xl mx-auto px-6">
//         <h2 className="text-2xl md:text-3xl font-bold">Risk categories we assess</h2>
//         <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {risks.map(([name, desc], i) => (
//             <div key={i} className="rounded-xl border border-white/10 bg-surface p-5 hover:translate-y-[-2px] transition">
//               <div className="flex items-center justify-between">
//                 <p className="font-semibold">{name}</p>
//                 <span className="text-xs text-black bg-accent px-2 py-0.5 rounded-full">v1</span>
//               </div>
//               <p className="mt-2 text-secondary text-sm">{desc}</p>
//             </div>
//           ))}
//         </div>
//         <div className="mt-10 flex justify-center">
//           <img src="/static/hero_trans.svg" alt="PitchLense overview" className="w-full max-w-4xl md:max-w-5xl rounded-lg opacity-90" />
//         </div>
//       </div>
//     </section>
//   );
// };

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
            this._bind();
            this._preloadImages();
            this._measure();
            this.goTo(0, false);
            this._startCycle();
            this._loop();
          }
          _preloadImages() {
            this.slides.forEach((sl) => {
              const card = sl.querySelector(".mzaCard");
              const bg = getComputedStyle(card).getPropertyValue("--mzaCard-bg");
              const m = /url\\((?:'|")?([^'")]+)(?:'|")?\\)/.exec(bg);
              if (m && m[1]) {
                const img = new Image();
                img.src = m[1];
              }
            });
          }
          _setupDots() {
            this.pagination.innerHTML = "";
            this.dots = this.slides.map((_, i) => {
              const b = document.createElement("button");
              b.type = "button";
              b.className = "mzaCarousel-dot";
              b.setAttribute("role", "tab");
              b.setAttribute("aria-label", \`Go to slide \${i + 1}\`);
              b.addEventListener("click", () => {
                this.goTo(i);
              });
              this.pagination.appendChild(b);
              return b;
            });
          }
          _bind() {
            this.prevBtn.addEventListener("click", () => {
              this.prev();
            });
            this.nextBtn.addEventListener("click", () => {
              this.next();
            });
            if (this.opts.keyboard) {
              this.root.addEventListener("keydown", (e) => {
                if (e.key === "ArrowLeft") this.prev();
                if (e.key === "ArrowRight") this.next();
              });
            }
            const pe = this.viewport;
            pe.addEventListener("pointerdown", (e) => this._onDragStart(e));
            pe.addEventListener("pointermove", (e) => this._onDragMove(e));
            pe.addEventListener("pointerup", (e) => this._onDragEnd(e));
            pe.addEventListener("pointercancel", (e) => this._onDragEnd(e));
            this.root.addEventListener("mouseenter", () => {
              this.state.hovering = true;
              this.state.pausedAt = performance.now();
            });
            this.root.addEventListener("mouseleave", () => {
              if (this.state.pausedAt) {
                this.state.startTime += performance.now() - this.state.pausedAt;
                this.state.pausedAt = 0;
              }
              this.state.hovering = false;
            });
            this.ro = new ResizeObserver(() => this._measure());
            this.ro.observe(this.viewport);
            this.opts.breakpoints.forEach((bp) => {
              const m = window.matchMedia(bp.mq);
              const apply = () => {
                Object.keys(bp).forEach((k) => {
                  if (k !== "mq") this.opts[k] = bp[k];
                });
                this._measure();
                this._render();
              };
              if (m.addEventListener) m.addEventListener("change", apply);
              else m.addListener(apply);
              if (m.matches) apply();
            });
            this.viewport.addEventListener("pointermove", (e) => this._onTilt(e));
            window.addEventListener("orientationchange", () =>
              setTimeout(() => this._measure(), 250)
            );
          }
          _measure() {
            const viewRect = this.viewport.getBoundingClientRect();
            const rootRect = this.root.getBoundingClientRect();
            const pagRect = this.pagination.getBoundingClientRect();
            const bottomGap = Math.max(
              12,
              Math.round(rootRect.bottom - pagRect.bottom)
            );
            const pagSpace = pagRect.height + bottomGap;
            const availH = viewRect.height - pagSpace;
            const cardH = Math.max(320, Math.min(640, Math.round(availH)));
            this.state.width = viewRect.width;
            this.state.height = viewRect.height;
            this.state.gap = this.opts.gap;
            this.slideW = Math.min(880, this.state.width * (1 - this.opts.peek * 2));
            this.root.style.setProperty("--mzaPagH", \`\${pagSpace}px\`);
            this.root.style.setProperty("--mzaCardH", \`\${cardH}px\`);
          }
          _onTilt(e) {
            const r = this.viewport.getBoundingClientRect();
            const mx = (e.clientX - r.left) / r.width - 0.5;
            const my = (e.clientY - r.top) / r.height - 0.5;
            this.root.style.setProperty("--mzaTiltX", (my * -6).toFixed(3));
            this.root.style.setProperty("--mzaTiltY", (mx * 6).toFixed(3));
          }
          _onDragStart(e) {
            if (e.pointerType === "mouse" && e.button !== 0) return;
            e.preventDefault();
            this.state.dragging = true;
            this.state.pointerId = e.pointerId;
            this.viewport.setPointerCapture(e.pointerId);
            this.state.x0 = e.clientX;
            this.state.t0 = performance.now();
            this.state.v = 0;
            this.state.pausedAt = performance.now();
          }
          _onDragMove(e) {
            if (!this.state.dragging || e.pointerId !== this.state.pointerId) return;
            const dx = e.clientX - this.state.x0;
            const dt = Math.max(16, performance.now() - this.state.t0);
            this.state.v = dx / dt;
            const slideSpan = this.slideW + this.state.gap;
            this.state.pos = this._mod(this.state.index - dx / slideSpan, this.n);
            this._render();
          }
          _onDragEnd(e) {
            if (!this.state.dragging || (e && e.pointerId !== this.state.pointerId))
              return;
            this.state.dragging = false;
            try {
              if (this.state.pointerId != null)
                this.viewport.releasePointerCapture(this.state.pointerId);
            } catch {}
            this.state.pointerId = null;
            if (this.state.pausedAt) {
              this.state.startTime += performance.now() - this.state.pausedAt;
              this.state.pausedAt = 0;
            }
            const v = this.state.v;
            const threshold = 0.18;
            let target = Math.round(
              this.state.pos - Math.sign(v) * (Math.abs(v) > threshold ? 0.5 : 0)
            );
            this.goTo(this._mod(target, this.n));
          }
          _startCycle() {
            this.state.startTime = performance.now();
            this._renderProgress(0);
          }
          _loop() {
            const step = (t) => {
              if (
                !this.state.dragging &&
                !this.state.hovering &&
                !this.state.animating
              ) {
                const elapsed = t - this.state.startTime;
                const p = Math.min(1, elapsed / this.opts.interval);
                this._renderProgress(p);
                if (elapsed >= this.opts.interval) this.next();
              }
              this.state.rafId = requestAnimationFrame(step);
            };
            this.state.rafId = requestAnimationFrame(step);
          }
          _renderProgress(p) {
            this.progressBar.style.transform = \`scaleX(\${p})\`;
          }
          prev() {
            this.goTo(this._mod(this.state.index - 1, this.n));
          }
          next() {
            this.goTo(this._mod(this.state.index + 1, this.n));
          }
          goTo(i, animate = true) {
            const start = this.state.pos || this.state.index;
            const end = this._nearest(start, i);
            const dur = animate ? this.opts.transitionMs : 0;
            const t0 = performance.now();
            const ease = (x) => 1 - Math.pow(1 - x, 4);
            this.state.animating = true;
            const step = (now) => {
              const t = Math.min(1, (now - t0) / dur);
              const p = dur ? ease(t) : 1;
              this.state.pos = start + (end - start) * p;
              this._render();
              if (t < 1) requestAnimationFrame(step);
              else this._afterSnap(i);
            };
            requestAnimationFrame(step);
          }
          _afterSnap(i) {
            this.state.index = this._mod(Math.round(this.state.pos), this.n);
            this.state.pos = this.state.index;
            this.state.animating = false;
            this._render(true);
            this._startCycle();
          }
          _nearest(from, target) {
            let d = target - Math.round(from);
            if (d > this.n / 2) d -= this.n;
            if (d < -this.n / 2) d += this.n;
            return Math.round(from) + d;
          }
          _mod(i, n) {
            return ((i % n) + n) % n;
          }
          _render(markActive = false) {
            const span = this.slideW + this.state.gap;
            const tiltX = parseFloat(
              this.root.style.getPropertyValue("--mzaTiltX") || 0
            );
            const tiltY = parseFloat(
              this.root.style.getPropertyValue("--mzaTiltY") || 0
            );
            for (let i = 0; i < this.n; i++) {
              let d = i - this.state.pos;
              if (d > this.n / 2) d -= this.n;
              if (d < -this.n / 2) d += this.n;
              const weight = Math.max(0, 1 - Math.abs(d) * 2);
              const biasActive = -this.slideW * this.opts.activeLeftBias * weight;
              const tx = d * span + biasActive;
              const depth = -Math.abs(d) * this.opts.zDepth;
              const rot = -d * this.opts.rotateY;
              const scale = 1 - Math.min(Math.abs(d) * this.opts.scaleDrop, 0.42);
              const blur = Math.min(Math.abs(d) * this.opts.blurMax, this.opts.blurMax);
              const z = Math.round(1000 - Math.abs(d) * 10);
              const s = this.slides[i];
              if (this.isFF) {
                s.style.transform = \`translate(\${tx}px,-50%) scale(\${scale})\`;
                s.style.filter = "none";
              } else {
                s.style.transform = \`translate3d(\${tx}px,-50%,\${depth}px) rotateY(\${rot}deg) scale(\${scale})\`;
                s.style.filter = \`blur(\${blur}px)\`;
              }
              s.style.zIndex = z;
              if (markActive)
                s.dataset.state =
                  Math.round(this.state.index) === i ? "active" : "rest";
              const card = s.querySelector(".mzaCard");
              const parBase = Math.max(-1, Math.min(1, -d));
              const parX = parBase * 48 + tiltY * 2.0;
              const parY = tiltX * -1.5;
              const bgX = parBase * -64 + tiltY * -2.4;
              card.style.setProperty("--mzaParX", \`\${parX.toFixed(2)}px\`);
              card.style.setProperty("--mzaParY", \`\${parY.toFixed(2)}px\`);
              card.style.setProperty("--mzaParBgX", \`\${bgX.toFixed(2)}px\`);
              card.style.setProperty("--mzaParBgY", \`\${(parY * 0.35).toFixed(2)}px\`);
            }
            const active = this._mod(Math.round(this.state.pos), this.n);
            this.dots.forEach((d, i) =>
              d.setAttribute("aria-selected", i === active ? "true" : "false")
            );
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

          // Animate center logo (fade in from center with scale)
          gsap.to(centerRef.current, {
            opacity: 1,
            scale: 1,
            duration: 1,
            delay: 0.3,
            ease: 'elastic.out(1, 0.3)'
          });

          // Animate right column items (coming from right)
          gsap.to(rightItemsRef.current?.querySelectorAll('.dock-item'), {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            delay: 0.6,
            ease: 'power3.out'
          });

          // Animate connecting lines with delay
          gsap.to(dockRef.current?.querySelectorAll('.connecting-line'), {
            opacity: 0.6,
            duration: 0.5,
            delay: 1.2,
            stagger: 0.1,
            ease: 'power2.out'
          });

          // Animate central connecting lines
          gsap.to(dockRef.current?.querySelectorAll('.central-connecting-lines .line'), {
            opacity: 0.4,
            duration: 0.5,
            delay: 1.4,
            stagger: 0.1,
            ease: 'power2.out'
          });

          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    });

    if (dockRef.current) {
      observer.observe(dockRef.current);
    }

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  const features = [
    { title: 'Startup Analysis', icon: '📊', color: 'from-blue-500/20 to-cyan-500/20' },
    { title: 'Investment Management', icon: '💰', color: 'from-green-500/20 to-emerald-500/20' },
    { title: 'Global Market Performance & News', icon: '🌍', color: 'from-purple-500/20 to-violet-500/20' },
    { title: 'Networking with other VC, Investors', icon: '🤝', color: 'from-orange-500/20 to-amber-500/20' },
    { title: 'AI Meeting Assistance', icon: '🤖', color: 'from-pink-500/20 to-rose-500/20' },
    { title: 'Connect your email client with Pitchlense', icon: '📧', color: 'from-indigo-500/20 to-blue-500/20' },
    { title: 'Company Profiles', icon: '🏢', color: 'from-teal-500/20 to-cyan-500/20' },
    { title: 'See PitchLense in Action', icon: '▶️', color: 'from-red-500/20 to-pink-500/20', isVideo: true }
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
            {/* Close button */}
            <button
              onClick={closeVideoPopup}
              className="video-popup-close absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Video container */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-xl shadow-2xl border border-white/20"
                src="https://www.youtube.com/embed/XUuLeXaEIdI?si=c_BmRh3jfv2Hc2Ie&vq=hd720&autoplay=1"
                title="PitchLense Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <section id="liquid-dock" className="py-20 bg-gradient-to-br from-background via-background to-black/40 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent2/5" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-pulse" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-accent to-accent2 bg-clip-text text-transparent">
            PitchLense Platform
          </h2>
          <p className="mt-4 text-secondary text-lg max-w-2xl mx-auto">
            Navigate through our comprehensive suite of AI-powered tools for startup evaluation and investment management
          </p>
        </div>

        {/* Liquid Glass Dock */}
        <div ref={dockRef} className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {/* Left Column - 4 items */}
          <div ref={leftItemsRef} className="flex flex-col gap-6">
            {features.slice(0, 4).map((feature, index) => (
              <div 
                key={index}
                className="dock-item group relative"
              >
                {/* Connecting line to center */}
                <div className="connecting-line absolute left-full top-1/2 w-8 h-0.5 bg-gradient-to-r from-accent/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 z-10" 
                     style={{ transform: 'translateY(-50%)' }} />
                
                <div className={`
                  liquid-glass-dock w-80 h-20 rounded-2xl border border-white/20 
                  bg-gradient-to-r ${feature.color} backdrop-blur-xl
                  hover:scale-105 hover:shadow-2xl hover:shadow-accent/20
                  transition-all duration-500 ease-out cursor-pointer
                  hover:border-accent/50
                `}>
                  <div className="flex items-center gap-4 p-6 h-full">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white group-hover:text-accent transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            ))}
          </div>

          {/* Center Logo */}
          <div ref={centerRef} className="flex-shrink-0 relative z-20">
            {/* Central connecting lines */}
            <div className="central-connecting-lines absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Left side connections */}
              <div className="line absolute -left-8 top-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent to-accent/40 opacity-40" 
                   style={{ transform: 'translateY(-50%)' }} />
              <div className="line absolute -left-8 top-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent to-accent/40 opacity-40" 
                   style={{ transform: 'translateY(-50%) translateY(-24px)' }} />
              <div className="line absolute -left-8 top-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent to-accent/40 opacity-40" 
                   style={{ transform: 'translateY(-50%) translateY(24px)' }} />
              <div className="line absolute -left-8 top-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent to-accent/40 opacity-40" 
                   style={{ transform: 'translateY(-50%) translateY(48px)' }} />
              
              {/* Right side connections */}
              <div className="line absolute -right-8 top-1/2 w-8 h-0.5 bg-gradient-to-l from-transparent to-accent/40 opacity-40" 
                   style={{ transform: 'translateY(-50%)' }} />
              <div className="line absolute -right-8 top-1/2 w-8 h-0.5 bg-gradient-to-l from-transparent to-accent/40 opacity-40" 
                   style={{ transform: 'translateY(-50%) translateY(-24px)' }} />
              <div className="line absolute -right-8 top-1/2 w-8 h-0.5 bg-gradient-to-l from-transparent to-accent/40 opacity-40" 
                   style={{ transform: 'translateY(-50%) translateY(24px)' }} />
              <div className="line absolute -right-8 top-1/2 w-8 h-0.5 bg-gradient-to-l from-transparent to-accent/40 opacity-40" 
                   style={{ transform: 'translateY(-50%) translateY(48px)' }} />
            </div>
            
            <div className="liquid-glass-center w-32 h-32 rounded-full border-2 border-accent/30 bg-gradient-to-br from-accent/20 to-accent2/20 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-accent/30 hover:scale-110 transition-all duration-500">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center shadow-inner">
                <img src="/static/logo.svg" alt="PitchLense" className="w-12 h-12" onError={(e) => {
                  e.currentTarget.outerHTML = '<div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"><span class="text-2xl font-bold text-white">P</span></div>';
                }} />
              </div>
              
              {/* Rotating ring */}
              <div className="absolute inset-0 rounded-full border border-accent/20 animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute inset-2 rounded-full border border-accent2/20 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            </div>
          </div>

          {/* Right Column - 4 items */}
          <div ref={rightItemsRef} className="flex flex-col gap-6">
            {features.slice(4, 8).map((feature, index) => (
              <div 
                key={index + 4}
                className="dock-item group relative"
              >
                {/* Connecting line to center */}
                <div className="connecting-line absolute right-full top-1/2 w-8 h-0.5 bg-gradient-to-l from-accent/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 z-10" 
                     style={{ transform: 'translateY(-50%)' }} />
                
                <div 
                  className={`
                    liquid-glass-dock w-80 h-20 rounded-2xl border border-white/20 
                    bg-gradient-to-r ${feature.color} backdrop-blur-xl
                    hover:scale-105 hover:shadow-2xl hover:shadow-accent/20
                    transition-all duration-500 ease-out cursor-pointer
                    hover:border-accent/50
                    ${feature.isVideo ? 'hover:bg-gradient-to-r hover:from-red-500/30 hover:to-pink-500/30' : ''}
                  `}
                  onClick={feature.isVideo ? handleVideoClick : undefined}
                >
                  <div className="flex items-center gap-4 p-6 h-full">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white group-hover:text-accent transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
            </div>
          ))}
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
      <LiquidGlassDock />
      <PitchLenseSlideshow />
      {/* <CTA /> */}
    </main>
    <Footer />
  </>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);


