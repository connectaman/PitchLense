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
            <img src="/static/banner.svg" alt="dashboard" className="rounded-lg opacity-90" />
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

const RiskGrid = () => {
  const risks = [
    ['Market','Small TAM, weak growth, crowded space, limited differentiation'],
    ['Product','Early stage, unclear PMF, technical risk, weak IP'],
    ['Team/Founder','Churn, single‑founder, skill gaps, credibility'],
    ['Financial','Inconsistent metrics, burn, CAC/LTV, margins'],
    ['Customer & Traction','Low traction, churn, retention, concentration'],
    ['Operational','Supply chain, GTM, inefficiency, execution'],
    ['Competitive','Incumbent strength, low barriers, defensibility'],
    ['Legal & Regulatory','Grey areas, compliance gaps, disputes, IP risks'],
    ['Exit','Limited pathways, low sector exits, late‑stage appeal']
  ];
  return (
    <section id="risks" className="py-20 bg-black/20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold">Risk categories we assess</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {risks.map(([name, desc], i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-surface p-5 hover:translate-y-[-2px] transition">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{name}</p>
                <span className="text-xs text-black bg-accent px-2 py-0.5 rounded-full">v1</span>
              </div>
              <p className="mt-2 text-secondary text-sm">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <img src="/static/hero_trans.svg" alt="PitchLense overview" className="w-full max-w-4xl md:max-w-5xl rounded-lg opacity-90" />
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
      <RiskGrid />
      {/* <CTA /> */}
    </main>
    <Footer />
  </>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);


