import { useState } from "react";
import { 
  Waves, 
  Droplets, 
  Tornado, 
  Orbit, 
  Sparkles, 
  Cpu, 
  Code, 
  Settings, 
  ChevronRight, 
  Play, 
  Activity, 
  ShieldCheck,
  MousePointer2
} from "lucide-react";
import OceanScene from "./components/OceanScene";
import ScenePresets from "./components/ScenePresets";
import ControlPanel from "./components/ControlPanel";
import PerformancePanel from "./components/PerformancePanel";
import { useOceanStore, OceanPreset } from "./store/oceanStore";

const TRANSLATIONS = {
  EN: {
    brandSub: "FLUID SOLVER",
    navVisualizer: "Visualizer",
    navFeatures: "Features",
    navSandbox: "Live Controls",
    navDocs: "API & Docs",
    liveEngine: "WEBGL2 LIVE ENGINE",
    heroKicker: "WebGL Simulation / v1.4",
    heroTitle: <>LIQUID<br /><em>DYNAMIC FORM</em></>,
    heroDesc: "An advanced real-time mathematical solver simulating high-density particle river flow, wave cohesion, and vortex turbulence directly on the GPU.",
    heroBtn: "CUSTOMIZE VARIABLES",
    interactionHint: "CLICK & DRAG TO ROTATE SCENE",
    presetsKicker: "SELECT MATHEMATICAL PRESETS",
    scrollDown: "SCROLL DOWN",
    
    // Features Section
    featuresKicker: "Simulations",
    featuresTitle: <>Mathematical <span className="liquid-gradient-text">Fluid Behaviors</span></>,
    featuresDesc: "Observe how different physics equations dictate the velocity vectors and cohesive properties of the 240,000 active particles.",
    
    presets: {
      calm: {
        title: "Laminar Flow (Calm Sea)",
        desc: <>A peaceful water flow running a gentle laminar wave equation. Governed by high cohesion and minimum entropy.</>,
        bullets: [
          <>Laminar wave equation: <code className="math-equation">y += sin(x * 0.9 - t * 2 + lane) * 0.16 * core</code></>,
          <>132,000 active particles with high light transparency</>,
          <>Stable surface tension (0.82) mapped to <code className="math-variable">uCohesion</code></>
        ],
        stat1: "SPEED",
        stat2: "COHESION"
      },
      storm: {
        title: "Turbulence (Savage Storm)",
        desc: <>Slate-grey swells utilizing a violent breaker wave crest solver with intensive wind spray and lightning aesthetics.</>,
        bullets: [
          <>Extreme wind-spray equation: <code className="math-equation">y += max(0, breaker) * 1.35 * core</code></>,
          <>168,000 active particles with ballistic droplet shedding</>,
          <>Entropy factor (1.35) mapped to <code className="math-variable">uEntropy</code></>,
          <>Cohesion factor (0.16) mapped to <code className="math-variable">uCohesion</code></>
        ],
        stat1: "SPEED",
        stat2: "ENTROPY"
      },
      abyss: {
        title: "Vortex Field (Midnight Abyss)",
        desc: <>Slow looming dark swells running a 3D rotation helix attraction field with particles orbiting the central gravity ray.</>,
        bullets: [
          <>3D helix equation: <code className="math-equation">yz = rot(vortex * 0.38 + side * 1.4) * yz</code></>,
          <>126,000 active particles orbiting in near-black depth</>,
          <>Magnetic alignment (1.45) mapped to <code className="math-variable">uMagnetism</code></>
        ],
        stat1: "MAGNETISM",
        stat2: "COHESION"
      },
      biolum: {
        title: "Particle Burst (Bioluminescence)",
        desc: <>Electric neon-cyan foam implementing quadratic surge wave formulas mapping glowing active particles that propagate pulse waves.</>,
        bullets: [
          <>Quadratic surge: <code className="math-equation">y += wave * wave * 1.15 * core</code></>,
          <>156,000 glowing active particles with additive blending</>,
          <>Active force impulses (1.5) mapped to <code className="math-variable">uPulse</code></>
        ],
        stat1: "SPEED",
        stat2: "PULSE"
      }
    },

    // Sandbox Section
    sandboxKicker: "Real-time Parameters",
    sandboxTitle: <><span className="liquid-gradient-text">Active Solver Telemetry</span></>,
    sandboxDesc: "The fluid simulator evaluates custom vector displacements on the GPU using three-dimensional Simplex noise algorithms. Modifying parameters instantly updates the shader uniforms.",
    telemetryActiveParticles: "Active Particles",
    telemetryWaveSpeed: "Wave Speed",
    telemetryCohesion: "Field Cohesion",
    telemetryEntropy: "Active Entropy",
    
    controlsTitle: "Control Center",
    controlsDesc: "Use the floating dashboard controls in the visualizer above to shape the particle structures. Watch the cohesion and magnetism warp particles into spiral strings.",
    controlSpeed: "Wave Speed Multiplier",
    controlMagnetism: "Magnetic Attraction Factor",
    controlCohesion: "Cohesion / Surface Tension",
    controlPulse: "Active Pulse Wave Amplitude",
    controlBack: "Back to Visualizer",

    // Docs Section
    docsKicker: "Developers",
    docsTitle: <><span className="liquid-gradient-text">Quick Integration API</span></>,
    docsDesc1: "Integrating Aquatica Fluid Engine into your codebase is straightforward. The simulation runs on a dedicated WebGL 2 context using custom vertex shaders supporting up to 240,000 active particles.",
    docsDesc2: "Configure your uniforms (waveSpeed, cohesion, entropy, magnetism, pulse) to dynamically transition between laminar flow, turbulence, vortex, and surge wave equations.",
    docsCompatible: "React / R3F Compatible",

    // Footer
    footerSub: "FLUID SYSTEM",
    footerLinks: {
      viz: "Visualizer",
      feat: "Features",
      ctrl: "Controls",
      api: "API"
    },
    footerCopy: "© 2026 Aquatica Labs. All equations solved on client-side GPU.",
    footerSec: "Security audited for client runtime"
  },
  PT: {
    brandSub: "SOLUCIONADOR DE FLUIDO",
    navVisualizer: "Visualizador",
    navFeatures: "Recursos",
    navSandbox: "Controles",
    navDocs: "API e Docs",
    liveEngine: "MOTOR EM TEMPO REAL WEBGL2",
    heroKicker: "Simulação WebGL / v1.4",
    heroTitle: <>FORMA<br /><em>DINÂMICA FLUIDA</em></>,
    heroDesc: "Um solucionador matemático avançado em tempo real que simula fluxo de partículas de alta densidade, coesão de ondas e turbulência de vórtice diretamente na GPU.",
    heroBtn: "CUSTOMIZAR VARIÁVEIS",
    interactionHint: "CLIQUE E ARRASTE PARA ROTACIONAR A CENA",
    presetsKicker: "SELECIONE PRESETS MATEMÁTICOS",
    scrollDown: "ROLA PARA BAIXO",

    // Features Section
    featuresKicker: "Simulações",
    featuresTitle: <><span className="liquid-gradient-text">Comportamentos de Fluidos Matemáticos</span></>,
    featuresDesc: "Observe como diferentes equações físicas ditam os vetores de velocidade e as propriedades de coesão das 240.000 partículas ativas.",

    presets: {
      calm: {
        title: "Fluxo Laminar (Mar Calmo)",
        desc: <>Um fluxo de água pacífico em hora dourada. Controlado por alta coesão e entropia mínima.</>,
        bullets: [
          <>Equação de onda laminar: <code className="math-equation">y += sin(x * 0.9 - t * 2 + lane) * 0.16 * core</code></>,
          <>132.000 partículas ativas com alta transparência e refração</>,
          <>Tensão superficial estável (0.82) mapeada para <code className="math-variable">uCohesion</code></>
        ],
        stat1: "VELOCIDADE",
        stat2: "COESÃO"
      },
      storm: {
        title: "Turbulência (Tempestade Selvagem)",
        desc: <>Ondulações cinza-ardósia com spray de vento intenso e estética de relâmpagos.</>,
        bullets: [
          <>Equação de crista violenta: <code className="math-equation">y += max(0, breaker) * 1.35 * core</code></>,
          <>168.000 partículas ativas sob dispersão balística de gotas</>,
          <>Fator de entropia (1.35) mapeado para <code className="math-variable">uEntropy</code></>,
          <>Coesão de campo (0.16) mapeada para <code className="math-variable">uCohesion</code></>
        ],
        stat1: "VELOCIDADE",
        stat2: "ENTROPIA"
      },
      abyss: {
        title: "Campo Vórtice (Abismo da Meia-Noite)",
        desc: <>Ondulações lentas e escuras rodando uma atração de hélice 3D com partículas orbitando o raio de gravidade central.</>,
        bullets: [
          <>Equação de hélice 3D: <code className="math-equation">yz = rot(vortex * 0.38 + side * 1.4) * yz</code></>,
          <>126.000 partículas ativas orbitando sob iluminação cônica</>,
          <>Mapeamento magnético (1.45) guiado por <code className="math-variable">uMagnetism</code></>
        ],
        stat1: "MAGNETISMO",
        stat2: "COESÃO"
      },
      biolum: {
        title: "Explosão de Partículas (Bioluminescência)",
        desc: <>Espuma ciano-neon elétrica implementando fórmulas quadráticas de onda de surto mapeando partículas ativas brilhantes.</>,
        bullets: [
          <>Onda de surto: <code className="math-equation">y += wave * wave * 1.15 * core</code></>,
          <>156.000 partículas ativas brilhantes sob mistura aditiva</>,
          <>Impulsos de energia (1.5) mapeados para <code className="math-variable">uPulse</code></>
        ],
        stat1: "VELOCIDADE",
        stat2: "PULSO"
      }
    },

    // Sandbox Section
    sandboxKicker: "Parâmetros em Tempo Real",
    sandboxTitle: <><span className="liquid-gradient-text">Telemetria Ativa do Solucionador</span></>,
    sandboxDesc: "O simulador de fluidos avalia deslocamentos vetoriais personalizados na GPU usando algoritmos de ruído Simplex tridimensional. A modificação dos parâmetros atualiza instantaneamente as constantes do shader.",
    telemetryActiveParticles: "Partículas Ativas",
    telemetryWaveSpeed: "Velocidade da Onda",
    telemetryCohesion: "Coesão do Campo",
    telemetryEntropy: "Entropia Ativa",

    controlsTitle: "Painel de Controle",
    controlsDesc: "Use os controles flutuantes do painel no visualizador acima para moldar as estruturas de partículas. Observe a coesão e o magnetismo transformarem as partículas em espirais.",
    controlSpeed: "Multiplicador de Velocidade",
    controlMagnetism: "Fator de Atração Magnética",
    controlCohesion: "Coesão / Tensão Superficial",
    controlPulse: "Amplitude de Pulso Ativa",
    controlBack: "Voltar ao Visualizador",

    // Docs Section
    docsKicker: "Desenvolvedores",
    docsTitle: <><span className="liquid-gradient-text">API de Integração Rápida</span></>,
    docsDesc1: "Integrar o motor de fluidos Aquatica em sua base de código criativa é simples. A simulação roda em um contexto de renderização WebGL 2 dedicado usando shaders de vértice personalizados que suportam até 240.000 partículas ativas.",
    docsDesc2: "Configure suas variáveis uniformes (waveSpeed, cohesion, entropy, magnetism, pulse) para alternar dinamicamente entre equações de fluxo laminar, turbulência, vórtice e ondas de surto.",
    docsCompatible: "Compatível com React / R3F",

    // Footer
    footerSub: "SISTEMA DE FLUIDOS",
    footerLinks: {
      viz: "Visualizador",
      feat: "Recursos",
      ctrl: "Controles",
      api: "API"
    },
    footerCopy: "© 2026 Aquatica Labs. Todas as equações resolvidas na GPU do cliente.",
    footerSec: "Segurança auditada para execução do cliente"
  }
};

export default function App() {
  const { 
    preset, 
    setPreset, 
    waveSpeed, 
    setWaveSpeed,
    cohesion, 
    setCohesion,
    entropy, 
    setEntropy,
    magnetism, 
    setMagnetism,
    pulse, 
    setPulse,
    particleDensity, 
    language, 
    setLanguage 
  } = useOceanStore();

  const t = TRANSLATIONS[language] || TRANSLATIONS.EN;

  const handlePresetSelect = (key: OceanPreset) => {
    setPreset(key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const codeText = `import { createFluidSolver } from "@aquatica/core";

// ${language === "PT" ? "Instancia o solucionador de simulação de partículas" : "Instantiate the particle simulation solver"}
const solver = createFluidSolver({
  particles: 240000,
  device: "webgl2",
  antialias: true
});

// ${language === "PT" ? "Configura os vetores de uniformes" : "Configure uniform vectors"}
solver.setUniforms({
  waveSpeed: ${waveSpeed},
  cohesion: ${cohesion},
  entropy: ${entropy},
  magnetism: ${magnetism}
});

// ${language === "PT" ? "Loop de renderização de quadros" : "Render frames loop"}
solver.onTick((time) => {
  solver.update(time);
});`;

    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className={`lab-shell theme-${preset}`}>
      {/* Immersive Navigation Bar */}
      <header className="lab-header">
        <a className="lab-brand" href="#hero">
          <Waves size={20} />
          <span>AQUATICA<small>{t.brandSub}</small></span>
        </a>
        <nav>
          <a href="#hero" className="active">{t.navVisualizer}</a>
          <a href="#features">{t.navFeatures}</a>
          <a href="#sandbox">{t.navSandbox}</a>
          <a href="#documentation">{t.navDocs}</a>
        </nav>
        
        <div className="header-right">
          {/* PT/EN Sleek Pill Toggle */}
          <div className="lang-toggle-pill">
            <button 
              className={language === "PT" ? "active" : ""} 
              onClick={() => setLanguage("PT")}
            >
              PT
            </button>
            <button 
              className={language === "EN" ? "active" : ""} 
              onClick={() => setLanguage("EN")}
            >
              EN
            </button>
          </div>

          <span className="realtime">
            <i /> {t.liveEngine}
          </span>
        </div>
      </header>

      {/* 3D Canvas Background (Layer 1) - Kept out of flex flow */}
      <div className="scene-wrap">
        <OceanScene />
        <PerformancePanel />
      </div>

      {/* Hero Interactive UI Layer (Layer 2) */}
      <section id="hero" className="simulation-screen">
        {/* Hero Title & Description overlays */}
        <div className="hero-copy">
          <span className="kicker">{t.heroKicker}</span>
          <h1>
            {t.heroTitle}
          </h1>
          <p>
            {t.heroDesc}
          </p>
          <a href="#sandbox" style={{ textDecoration: "none" }}>
            <button>
              <Settings size={18} />
              <span>{t.heroBtn}</span>
            </button>
          </a>
        </div>

        {/* Floating control panel on the right */}
        <ControlPanel />

        {/* Center interaction helper */}
        <div className="interaction-hint">
          <MousePointer2 size={12} className="animate-bounce text-cyan-400" /> 
          <span>{t.interactionHint}</span>
        </div>

        {/* Presets Selection Dock */}
        <div className="preset-zone">
          <span className="kicker">{t.presetsKicker}</span>
          <ScenePresets />
        </div>

        {/* Scroll down indicator */}
        <div className="scroll-indicator">
          <span>{t.scrollDown}</span>
        </div>
      </section>

      {/* Content wrapper for scrolling pages */}
      <div className="page-content-wrapper">
        
        {/* Showcase / Preset Grid Section */}
        <section id="features" className="content-section">
          <div className="grid-overlay-decor" />
          <div className="sparkles-bg-decor">
            <span className="sparkle-dot dot-1" />
            <span className="sparkle-dot dot-2" />
            <span className="sparkle-dot dot-3" />
            <span className="sparkle-dot dot-4" />
            <span className="sparkle-dot dot-1" style={{ top: "15%", left: "85%" }} />
            <span className="sparkle-dot dot-2" style={{ top: "45%", left: "75%" }} />
            <span className="sparkle-dot dot-3" style={{ top: "65%", left: "10%" }} />
            <span className="sparkle-dot dot-4" style={{ top: "85%", left: "90%" }} />
          </div>
          
          <div className="section-title">
            <span className="kicker-badge">{t.featuresKicker}</span>
            <h2 className="glow-heading">{t.featuresTitle}</h2>
            <p className="section-intro">
              {t.featuresDesc}
            </p>
          </div>

          <div className="showcase-grid">
            {/* Card 1: Calm */}
            <div 
              className={`showcase-card group cursor-pointer ${preset === "calm" ? "active-preset" : ""}`}
              onClick={() => handlePresetSelect("calm")}
            >
              <div className="tech-corners">
                <span className="corner-tl"></span>
                <span className="corner-tr"></span>
                <span className="corner-bl"></span>
                <span className="corner-br"></span>
              </div>
              <div className="card-top-accent" />
              <span className="tech-id">[ 01 // CALM ]</span>
              
              <div className="card-icon">
                <Droplets size={20} className="transition-transform group-hover:scale-110 duration-300" />
              </div>
              <h3>{t.presets.calm.title}</h3>
              <p>
                {t.presets.calm.desc}
              </p>
              
              <ul className="card-bullets">
                {t.presets.calm.bullets.map((bullet: string, idx: number) => (
                  <li key={idx}><span>•</span>{bullet}</li>
                ))}
              </ul>

              <div className="card-stats">
                <div>{t.presets.calm.stat1} <strong>{Math.round(0.6 * 25)}%</strong></div>
                <div className="divider-dot" />
                <div>{t.presets.calm.stat2} <strong>82%</strong></div>
              </div>
            </div>

            {/* Card 2: Storm */}
            <div 
              className={`showcase-card group cursor-pointer ${preset === "storm" ? "active-preset" : ""}`}
              onClick={() => handlePresetSelect("storm")}
            >
              <div className="tech-corners">
                <span className="corner-tl"></span>
                <span className="corner-tr"></span>
                <span className="corner-bl"></span>
                <span className="corner-br"></span>
              </div>
              <div className="card-top-accent" />
              <span className="tech-id">[ 02 // FORCE ]</span>

              <div className="card-icon">
                <Tornado size={20} className="transition-transform group-hover:scale-110 duration-300" />
              </div>
              <h3>{t.presets.storm.title}</h3>
              <p>
                {t.presets.storm.desc}
              </p>

              <ul className="card-bullets">
                {t.presets.storm.bullets.map((bullet: string, idx: number) => (
                  <li key={idx}><span>•</span>{bullet}</li>
                ))}
              </ul>

              <div className="card-stats">
                <div>{t.presets.storm.stat1} <strong>{Math.round(2.2 * 25)}%</strong></div>
                <div className="divider-dot" />
                <div>{t.presets.storm.stat2} <strong>68%</strong></div>
              </div>
            </div>

            {/* Card 3: Abyss */}
            <div 
              className={`showcase-card group cursor-pointer ${preset === "abyss" ? "active-preset" : ""}`}
              onClick={() => handlePresetSelect("abyss")}
            >
              <div className="tech-corners">
                <span className="corner-tl"></span>
                <span className="corner-tr"></span>
                <span className="corner-bl"></span>
                <span className="corner-br"></span>
              </div>
              <div className="card-top-accent" />
              <span className="tech-id">[ 03 // VORTEX ]</span>

              <div className="card-icon">
                <Orbit size={20} className="transition-transform group-hover:scale-110 duration-300" />
              </div>
              <h3>{t.presets.abyss.title}</h3>
              <p>
                {t.presets.abyss.desc}
              </p>

              <ul className="card-bullets">
                {t.presets.abyss.bullets.map((bullet: string, idx: number) => (
                  <li key={idx}><span>•</span>{bullet}</li>
                ))}
              </ul>

              <div className="card-stats">
                <div>{t.presets.abyss.stat1} <strong>73%</strong></div>
                <div className="divider-dot" />
                <div>{t.presets.abyss.stat2} <strong>72%</strong></div>
              </div>
            </div>

            {/* Card 4: Biolum */}
            <div 
              className={`showcase-card group cursor-pointer ${preset === "biolum" ? "active-preset" : ""}`}
              onClick={() => handlePresetSelect("biolum")}
            >
              <div className="tech-corners">
                <span className="corner-tl"></span>
                <span className="corner-tr"></span>
                <span className="corner-bl"></span>
                <span className="corner-br"></span>
              </div>
              <div className="card-top-accent" />
              <span className="tech-id">[ 04 // ENERGY ]</span>

              <div className="card-icon">
                <Sparkles size={20} className="transition-transform group-hover:scale-110 duration-300" />
              </div>
              <h3>{t.presets.biolum.title}</h3>
              <p>
                {t.presets.biolum.desc}
              </p>

              <ul className="card-bullets">
                {t.presets.biolum.bullets.map((bullet: string, idx: number) => (
                  <li key={idx}><span>•</span>{bullet}</li>
                ))}
              </ul>

              <div className="card-stats">
                <div>{t.presets.biolum.stat1} <strong>44%</strong></div>
                <div className="divider-dot" />
                <div>{t.presets.biolum.stat2} <strong>75%</strong></div>
              </div>
            </div>
          </div>
        </section>

        {/* Sandbox details section */}
        <section id="sandbox" className="content-section">
          <div className="grid-overlay-decor type-radial" />
          <div className="sparkles-bg-decor">
            <span className="sparkle-dot dot-1" style={{ top: "15%", left: "10%" }} />
            <span className="sparkle-dot dot-2" style={{ top: "70%", left: "20%" }} />
            <span className="sparkle-dot dot-3" style={{ top: "30%", left: "80%" }} />
            <span className="sparkle-dot dot-4" style={{ top: "75%", left: "85%" }} />
            <span className="sparkle-dot dot-1" style={{ top: "50%", left: "45%" }} />
            <span className="sparkle-dot dot-2" style={{ top: "25%", left: "60%" }} />
            <span className="sparkle-dot dot-3" style={{ top: "85%", left: "40%" }} />
            <span className="sparkle-dot dot-4" style={{ top: "10%", left: "90%" }} />
            <span className="sparkle-dot dot-1" style={{ top: "60%", left: "75%" }} />
            <span className="sparkle-dot dot-2" style={{ top: "40%", left: "30%" }} />
          </div>
          
          <div className="playground-dashboard">
            <div className="telemetry-left-side">
              <div className="section-title" style={{ marginBottom: "30px" }}>
                <span className="kicker-badge">{t.sandboxKicker}</span>
                <h2 className="glow-heading">{t.sandboxTitle}</h2>
                <p className="section-intro">
                  {t.sandboxDesc}
                </p>
              </div>

              <div className="telemetry-grid">
                <div className="telemetry-card premium-glass relative group overflow-hidden">
                  <div className="card-top-accent" />
                  <div className="card-glow-pulse" />
                  <div className="sparkles-bg-decor">
                    <span className="sparkle-dot dot-1" />
                    <span className="sparkle-dot dot-2" />
                    <span className="sparkle-dot dot-3" />
                  </div>
                  <div className="tech-corners">
                    <span className="corner-tl"></span>
                    <span className="corner-tr"></span>
                    <span className="corner-bl"></span>
                    <span className="corner-br"></span>
                  </div>
                  <small>{t.telemetryActiveParticles}</small>
                  <strong>{(120000 + particleDensity * 60).toLocaleString()}</strong>
                  <div className="telemetry-meter mt-4 w-full bg-[#030d0f] rounded-full h-[6px] relative overflow-hidden border border-white/5">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(25,225,210,0.5)]"
                      style={{ width: `${Math.max(10, Math.min(100, ((120000 + particleDensity * 60) / 168000) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="telemetry-card premium-glass relative group overflow-hidden">
                  <div className="card-top-accent" />
                  <div className="card-glow-pulse" />
                  <div className="sparkles-bg-decor">
                    <span className="sparkle-dot dot-2" />
                    <span className="sparkle-dot dot-3" />
                    <span className="sparkle-dot dot-4" />
                  </div>
                  <div className="tech-corners">
                    <span className="corner-tl"></span>
                    <span className="corner-tr"></span>
                    <span className="corner-bl"></span>
                    <span className="corner-br"></span>
                  </div>
                  <small>{t.telemetryWaveSpeed}</small>
                  <strong>{waveSpeed.toFixed(2)} unit/s</strong>
                  <div className="telemetry-meter mt-4 w-full bg-[#030d0f] rounded-full h-[6px] relative overflow-hidden border border-white/5">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(25,225,210,0.5)]"
                      style={{ width: `${Math.max(10, Math.min(100, (waveSpeed / 4.0) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="telemetry-card premium-glass relative group overflow-hidden">
                  <div className="card-top-accent" />
                  <div className="card-glow-pulse" />
                  <div className="sparkles-bg-decor">
                    <span className="sparkle-dot dot-3" />
                    <span className="sparkle-dot dot-4" />
                    <span className="sparkle-dot dot-1" />
                  </div>
                  <div className="tech-corners">
                    <span className="corner-tl"></span>
                    <span className="corner-tr"></span>
                    <span className="corner-bl"></span>
                    <span className="corner-br"></span>
                  </div>
                  <small>{t.telemetryCohesion}</small>
                  <strong>{(cohesion * 100).toFixed(0)}%</strong>
                  <div className="telemetry-meter mt-4 w-full bg-[#030d0f] rounded-full h-[6px] relative overflow-hidden border border-white/5">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(25,225,210,0.5)]"
                      style={{ width: `${Math.max(10, Math.min(100, cohesion * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="telemetry-card premium-glass relative group overflow-hidden">
                  <div className="card-top-accent" />
                  <div className="card-glow-pulse" />
                  <div className="sparkles-bg-decor">
                    <span className="sparkle-dot dot-4" />
                    <span className="sparkle-dot dot-1" />
                    <span className="sparkle-dot dot-2" />
                  </div>
                  <div className="tech-corners">
                    <span className="corner-tl"></span>
                    <span className="corner-tr"></span>
                    <span className="corner-bl"></span>
                    <span className="corner-br"></span>
                  </div>
                  <small>{t.telemetryEntropy}</small>
                  <strong>{entropy.toFixed(2)} Hz</strong>
                  <div className="telemetry-meter mt-4 w-full bg-[#030d0f] rounded-full h-[6px] relative overflow-hidden border border-white/5">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(25,225,210,0.5)]"
                      style={{ width: `${Math.max(10, Math.min(100, (entropy / 2.0) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="playground-controls-box premium-glass-high-blur relative group">
              <div className="card-top-accent" />
              <div className="card-glow-pulse" style={{ opacity: 0.5 }} />
              <div className="sparkles-bg-decor">
                <span className="sparkle-dot dot-1" style={{ top: "20%", left: "10%" }} />
                <span className="sparkle-dot dot-3" style={{ top: "80%", left: "85%" }} />
              </div>
              <div className="tech-corners">
                <span className="corner-tl"></span>
                <span className="corner-tr"></span>
                <span className="corner-bl"></span>
                <span className="corner-br"></span>
              </div>
              <div className="tech-dots-decor">
                <span />
                <span />
                <span />
              </div>
              <h3>{t.controlsTitle}</h3>
              <p className="controls-box-desc">
                {t.controlsDesc}
              </p>
              <div className="controls-box-list">
                <div className="control-box-row flex-col items-stretch gap-2 group transition-all duration-300">
                  <div className="flex justify-between items-center w-full">
                    <span>{t.controlSpeed}</span>
                    <span className="row-val font-mono text-cyan font-semibold text-sm">x{waveSpeed.toFixed(2)}</span>
                  </div>
                  <div className="relative w-full mt-1">
                    <input 
                      aria-label={t.controlSpeed}
                      type="range" 
                      min={0.1} 
                      max={4.0} 
                      step={0.1} 
                      value={waveSpeed}
                      onChange={(e) => setWaveSpeed(Number(e.target.value))}
                      className="sandbox-slider w-full cursor-pointer"
                      style={{
                        background: `linear-gradient(90deg, var(--cyan) ${((waveSpeed - 0.1) / 3.9) * 100}%, rgba(255, 255, 255, 0.08) ${((waveSpeed - 0.1) / 3.9) * 100}%)`,
                        height: "5px",
                        borderRadius: "3px",
                        appearance: "none",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                <div className="control-box-row flex-col items-stretch gap-2 group transition-all duration-300">
                  <div className="flex justify-between items-center w-full">
                    <span>{t.controlMagnetism}</span>
                    <span className="row-val font-mono text-cyan font-semibold text-sm">{magnetism.toFixed(2)} T</span>
                  </div>
                  <div className="relative w-full mt-1">
                    <input 
                      aria-label={t.controlMagnetism}
                      type="range" 
                      min={0.0} 
                      max={2.0} 
                      step={0.05} 
                      value={magnetism}
                      onChange={(e) => setMagnetism(Number(e.target.value))}
                      className="sandbox-slider w-full cursor-pointer"
                      style={{
                        background: `linear-gradient(90deg, var(--cyan) ${(magnetism / 2.0) * 100}%, rgba(255, 255, 255, 0.08) ${(magnetism / 2.0) * 100}%)`,
                        height: "5px",
                        borderRadius: "3px",
                        appearance: "none",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                <div className="control-box-row flex-col items-stretch gap-2 group transition-all duration-300">
                  <div className="flex justify-between items-center w-full">
                    <span>{t.controlCohesion}</span>
                    <span className="row-val font-mono text-cyan font-semibold text-sm">{cohesion.toFixed(2)} N/m</span>
                  </div>
                  <div className="relative w-full mt-1">
                    <input 
                      aria-label={t.controlCohesion}
                      type="range" 
                      min={0.0} 
                      max={1.0} 
                      step={0.01} 
                      value={cohesion}
                      onChange={(e) => setCohesion(Number(e.target.value))}
                      className="sandbox-slider w-full cursor-pointer"
                      style={{
                        background: `linear-gradient(90deg, var(--cyan) ${(cohesion / 1.0) * 100}%, rgba(255, 255, 255, 0.08) ${(cohesion / 1.0) * 100}%)`,
                        height: "5px",
                        borderRadius: "3px",
                        appearance: "none",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                <div className="control-box-row flex-col items-stretch gap-2 group transition-all duration-300">
                  <div className="flex justify-between items-center w-full">
                    <span>{t.controlPulse}</span>
                    <span className="row-val font-mono text-cyan font-semibold text-sm">{pulse.toFixed(2)} A</span>
                  </div>
                  <div className="relative w-full mt-1">
                    <input 
                      aria-label={t.controlPulse}
                      type="range" 
                      min={0.0} 
                      max={2.0} 
                      step={0.05} 
                      value={pulse}
                      onChange={(e) => setPulse(Number(e.target.value))}
                      className="sandbox-slider w-full cursor-pointer"
                      style={{
                        background: `linear-gradient(90deg, var(--cyan) ${(pulse / 2.0) * 100}%, rgba(255, 255, 255, 0.08) ${(pulse / 2.0) * 100}%)`,
                        height: "5px",
                        borderRadius: "3px",
                        appearance: "none",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <a href="#hero" className="back-visualizer-btn">
                <span>{t.controlBack}</span>
                <ChevronRight size={14} className="btn-arrow" />
              </a>
            </div>
          </div>
        </section>

        {/* Code & Developer Documentation Section */}
        <section id="documentation" className="content-section">
          <div className="grid-overlay-decor" />
          <div className="sparkles-bg-decor">
            <span className="sparkle-dot dot-1" />
            <span className="sparkle-dot dot-2" />
            <span className="sparkle-dot dot-3" />
            <span className="sparkle-dot dot-4" />
            <span className="sparkle-dot dot-1" style={{ top: "20%", left: "80%", animationDelay: "1s" }} />
            <span className="sparkle-dot dot-2" style={{ top: "65%", left: "90%", animationDelay: "2.5s" }} />
            <span className="sparkle-dot dot-3" style={{ top: "45%", left: "10%", animationDelay: "3.5s" }} />
            <span className="sparkle-dot dot-4" style={{ top: "85%", left: "25%", animationDelay: "5s" }} />
          </div>
          
          <div className="docs-layout">
            <div className="docs-text">
              <span className="kicker-badge">{t.docsKicker}</span>
              <h2 className="glow-heading">{t.docsTitle}</h2>
              <p className="section-intro">
                {t.docsDesc1}
              </p>
              <p className="section-intro">
                {t.docsDesc2}
              </p>
              <div className="tech-badges-list">
                <div className="tech-badge">
                  <Cpu size={14} />
                  <span>GLSL ES 3.0</span>
                </div>
                <div className="tech-badge">
                  <Code size={14} />
                  <span>{t.docsCompatible}</span>
                </div>
              </div>
            </div>

            <div className="docs-code-card premium-glass">
              <div className="tech-corners">
                <span className="corner-tl"></span>
                <span className="corner-tr"></span>
                <span className="corner-bl"></span>
                <span className="corner-br"></span>
              </div>
              <div className="code-header">
                <div className="code-dots">
                  <div className="code-dot" />
                  <div className="code-dot" />
                  <div className="code-dot" />
                </div>
                <div className="code-actions-container">
                  <span className="code-lang">FluidInit.ts</span>
                  <button className={`code-action-btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
                    {copied ? (
                      <>
                        <ShieldCheck size={12} />
                        <span>{language === "PT" ? "Copiado!" : "Copied!"}</span>
                      </>
                    ) : (
                      <>
                        <Code size={12} />
                        <span>{language === "PT" ? "Copiar" : "Copy"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <pre>
                <code>
                  <span className="keyword">import</span>{" { createFluidSolver } from "}<span className="string">"@aquatica/core"</span>{`;\n\n`}
                  <span className="comment">{language === "PT" ? "// Instancia o solucionador de simulação de partículas\n" : "// Instantiate the particle simulation solver\n"}</span>
                  <span className="keyword">const</span>{" solver = "}<span className="function">createFluidSolver</span>{"({\n"}
                  {"  particles: "}<span className="type">240000</span>{",\n"}
                  {"  device: "}<span className="string">"\"webgl2\""</span>{",\n"}
                  {"  antialias: "}<span className="keyword">true</span>{"\n});\n\n"}
                  <span className="comment">{language === "PT" ? "// Configura os vetores de uniformes\n" : "// Configure uniform vectors\n"}</span>
                  {"solver."}<span className="function">setUniforms</span>{"({\n"}
                  {"  waveSpeed: "}<span className="type">{waveSpeed}</span>{",\n"}
                  {"  cohesion: "}<span className="type">{cohesion}</span>{",\n"}
                  {"  entropy: "}<span className="type">{entropy}</span>{",\n"}
                  {"  magnetism: "}<span className="type">{magnetism}</span>{"\n});\n\n"}
                  <span className="comment">{language === "PT" ? "// Loop de renderização de quadros\n" : "// Render frames loop\n"}</span>
                  {"solver."}<span className="function">onTick</span>{"((time) => {\n"}
                  {"  solver."}<span className="function">update</span>{"(time);\n});"}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Immersive Footer */}
        <footer className="lab-footer">
          <div className="footer-top">
            <a className="lab-brand" href="#hero">
              <Waves size={18} />
              <span>AQUATICA<small>{t.footerSub}</small></span>
            </a>
            <div className="footer-links">
              <a href="#hero">{t.footerLinks.viz}</a>
              <a href="#features">{t.footerLinks.feat}</a>
              <a href="#sandbox">{t.footerLinks.ctrl}</a>
              <a href="#documentation">{t.footerLinks.api}</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>{t.footerCopy}</span>
            <div className="footer-security">
              <ShieldCheck size={14} className="text-cyan-400" />
              <span>{t.footerSec}</span>
            </div>
          </div>
          <div className="footer-developer-tag">
            Project developed by: Jeová Anderson
          </div>
        </footer>
      </div>
    </main>
  );
}
