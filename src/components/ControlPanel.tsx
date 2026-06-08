import { Aperture, ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { useOceanStore, PRESETS } from "../store/oceanStore";

type SliderProps = {
  label: string; hint: string; value: number; min: number; max: number; step: number;
  onChange: (value: number) => void;
};

function Slider({ label, hint, value, min, max, step, onChange }: SliderProps) {
  const intensity = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <label className="lab-slider" style={{ "--value": `${intensity}%` } as CSSProperties}>
      <span><span>{label}<small>{hint}</small></span><b>{Math.round(intensity)}<i>%</i></b></span>
      <input aria-label={label} type="range" value={value} min={min} max={max} step={step}
        onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

export default function ControlPanel() {
  const simulation = useOceanStore();
  const [open, setOpen] = useState(true);
  const isPT = simulation.language === "PT";

  const labels = {
    header: isPT ? "FLUIDO" : "FLUID CONSOLE",
    activeField: isPT ? "CAMPO ATIVO" : "ACTIVE FIELD",
    flow: isPT ? "FLUXO" : "FLOW SPEED",
    flowHint: isPT ? "velocidade" : "speed",
    cohesion: isPT ? "COESÃO" : "COHESION",
    cohesionHint: isPT ? "ligação" : "surface",
    entropy: isPT ? "ENTROPIA" : "ENTROPY",
    entropyHint: isPT ? "caos" : "chaos",
    magnetism: isPT ? "MAGNETISMO" : "MAGNETISM",
    magnetismHint: isPT ? "campo" : "gravity",
    pulse: isPT ? "PULSO" : "PULSE WAVE",
    pulseHint: isPT ? "ondulação" : "frequency",
    cameraOrbit: isPT ? "ÓRBITA" : "ORBIT",
    cameraCinematic: isPT ? "CINEMA" : "CINEMATIC",
    reset: "RESET",
    ariaClose: isPT ? "Recolher controles" : "Collapse controls",
    ariaOpen: isPT ? "Abrir controles" : "Open controls",
  };

  return (
    <aside className={`lab-controls${open ? "" : " is-collapsed"}`}>
      <header>
        <span><SlidersHorizontal size={14} /> {labels.header}</span>
        <button aria-label={open ? labels.ariaClose : labels.ariaOpen} onClick={() => setOpen(!open)}><ChevronDown size={14} /></button>
      </header>
      <div className="control-body">
        <section className="field-status"><span><i /> {labels.activeField}</span><b>{PRESETS[simulation.preset].name.toUpperCase()}</b></section>
        <section className="living-controls">
          <Slider label={labels.flow} hint={labels.flowHint} value={simulation.waveSpeed} min={.1} max={4} step={.1} onChange={simulation.setWaveSpeed} />
          <Slider label={labels.cohesion} hint={labels.cohesionHint} value={simulation.cohesion} min={0} max={1} step={.01} onChange={simulation.setCohesion} />
          <Slider label={labels.entropy} hint={labels.entropyHint} value={simulation.entropy} min={0} max={2} step={.05} onChange={simulation.setEntropy} />
          <Slider label={labels.magnetism} hint={labels.magnetismHint} value={simulation.magnetism} min={0} max={2} step={.05} onChange={simulation.setMagnetism} />
          <Slider label={labels.pulse} hint={labels.pulseHint} value={simulation.pulse} min={0} max={2} step={.05} onChange={simulation.setPulse} />
        </section>
        <section className="control-actions">
          <button onClick={() => simulation.setCameraMode(simulation.cameraMode === "orbit" ? "cinematic" : "orbit")}><Aperture size={11} /> {simulation.cameraMode === "orbit" ? labels.cameraOrbit : labels.cameraCinematic}</button>
          <button aria-label="Restaurar preset" onClick={() => simulation.resetToPreset(simulation.preset)}><RotateCcw size={11} /> {labels.reset}</button>
        </section>
      </div>
    </aside>
  );
}