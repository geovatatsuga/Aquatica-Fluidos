import { useEffect, useState } from "react";
import { Cpu, Maximize2, Activity, ShieldCheck, HardDrive } from "lucide-react";
import { useOceanStore } from "../store/oceanStore";

export default function PerformancePanel() {
  const { particleDensity, waveHeight, showStats, preset } = useOceanStore();
  const [fps, setFps] = useState(60);
  const [ping, setPing] = useState(1);

  // Dynamic frame-rate counter directly listening to standard browser draw ticks
  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    let animId: number;

    const tick = () => {
      frameCount++;
      const now = performance.now();
      if (now >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Update light ping simulated delay matching simulated GPU lag
  useEffect(() => {
    const interval = setInterval(() => {
      const baseJitter = preset === "storm" ? 2.1 : 0.8;
      const calculatedPing = baseJitter + Math.random() * 0.7;
      setPing(parseFloat(calculatedPing.toFixed(1)));
    }, 1500);
    return () => clearInterval(interval);
  }, [preset]);

  const isPT = useOceanStore().language === "PT";

  if (!showStats) return null;

  return (
    <div
      className="absolute top-4 left-4 glass-panel p-4 rounded-xl shadow-2xl flex flex-col gap-3 min-w-[240px] text-slate-200 z-50 pointer-events-auto border border-white/10"
      id="diagnostics-floating-panel"
    >
      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
        <Activity className="w-4 h-4 text-sky-400 rotate-12" />
        <span className="font-mono font-semibold text-[10px] tracking-wider uppercase text-sky-200">
          {isPT ? "Telemetria GPU" : "GPU Telemetry"}
        </span>
      </div>

      <div className="flex flex-col gap-2 font-mono text-[11px]">
        {/* Frame Rate */}
        <div className="flex justify-between items-center py-0.5">
          <span className="text-slate-400 text-[10px]">{isPT ? "Taxa de Quadros:" : "Refresh Rate:"}</span>
          <span
            className={`font-semibold ${
              fps >= 55 ? "text-sky-450" : fps >= 30 ? "text-amber-400" : "text-rose-400"
            }`}
          >
            {fps} FPS
          </span>
         </div>

        {/* Latency / Frame interval */}
        <div className="flex justify-between items-center py-0.5">
          <span className="text-slate-400 text-[10px]">{isPT ? "Tempo de Quadro:" : "Frame Cost:"}</span>
          <span className="text-slate-200 font-medium">{ping} ms</span>
        </div>

        {/* Surface Grid vertices */}
        <div className="flex justify-between items-center py-0.5">
          <span className="text-slate-400 text-[10px]">{isPT ? "Grade de Superfície:" : "Surface Grid:"}</span>
          <span className="text-slate-200 font-medium">160 x 160 GL</span>
        </div>

        {/* Polygon / Face count */}
        <div className="flex justify-between items-center py-0.5">
          <span className="text-slate-400 text-[10px]">{isPT ? "Faces de Triângulo:" : "Triangle Faces:"}</span>
          <span className="text-slate-200 font-medium">51,200 tris</span>
        </div>

        {/* Instanced spray points */}
        <div className="flex justify-between items-center py-0.5">
          <span className="text-slate-400 text-[10px]">{isPT ? "Partículas de Spray GPU:" : "GPU Spray Particles:"}</span>
          <span className="text-sky-400 font-medium">{particleDensity} points</span>
        </div>

        {/* Displacement source */}
        <div className="flex justify-between items-center py-0.5">
          <span className="text-slate-400 text-[10px]">{isPT ? "Solucionador:" : "Wave Solver:"}</span>
          <span className="text-sky-350 font-medium">{isPT ? "Simplex 3D (GPU)" : "Simplex 3D (GPU)"}</span>
        </div>
      </div>

      {/* Mini status indicator */}
      <div className="flex items-center gap-1.5 mt-1 pt-2 border-t border-white/5 text-[10px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
        <span>{isPT ? "Contexto: WebGL 2 / Shaders GPU" : "Context: WebGL 2 / GPU shaders"}</span>
      </div>
    </div>
  );
}
