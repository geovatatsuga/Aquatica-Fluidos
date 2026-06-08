import { create } from "zustand";

export type OceanPreset = "calm" | "storm" | "abyss" | "biolum";
export type CameraMode = "orbit" | "cinematic";

export interface OceanState {
  preset: OceanPreset;
  waveHeight: number;
  waveSpeed: number;
  waveFrequency: number;
  foamIntensity: number;
  particleDensity: number;
  waterDeepColor: string;
  waterShallowColor: string;
  foamColor: string;
  skyColor: string;
  exposure: number;
  showStats: boolean;
  cameraMode: CameraMode;
  autoRotate: boolean;
  lightingIntensity: number;
  entropy: number;
  magnetism: number;
  cohesion: number;
  pulse: number;
  interactionIntensity: number;

  language: "EN" | "PT";
  inView: boolean;
  setLanguage: (lang: "EN" | "PT") => void;
  setInView: (val: boolean) => void;
  setPreset: (preset: OceanPreset) => void;
  setWaveHeight: (val: number) => void;
  setWaveSpeed: (val: number) => void;
  setWaveFrequency: (val: number) => void;
  setFoamIntensity: (val: number) => void;
  setParticleDensity: (val: number) => void;
  setWaterColors: (deep: string, shallow: string) => void;
  setFoamColor: (color: string) => void;
  setSkyColor: (color: string) => void;
  setExposure: (val: number) => void;
  setShowStats: (show: boolean) => void;
  setCameraMode: (mode: CameraMode) => void;
  setAutoRotate: (rotate: boolean) => void;
  setLightingIntensity: (val: number) => void;
  setEntropy: (val: number) => void;
  setMagnetism: (val: number) => void;
  setCohesion: (val: number) => void;
  setPulse: (val: number) => void;
  setInteractionIntensity: (val: number) => void;
  resetToPreset: (preset: OceanPreset) => void;
}

export const PRESETS: Record<
  OceanPreset,
  {
    name: string;
    description: string;
    waveHeight: number;
    waveSpeed: number;
    waveFrequency: number;
    foamIntensity: number;
    particleDensity: number;
    waterDeepColor: string;
    waterShallowColor: string;
    foamColor: string;
    skyColor: string;
    exposure: number;
    lightingIntensity: number;
    entropy: number;
    magnetism: number;
    cohesion: number;
    pulse: number;
  }
> = {
  calm: {
    name: "Calm Sea",
    description: "A peaceful, golden hour lagoon with gentle ripples, high transparency, and reflective turquoise water.",
    waveHeight: 0.18,
    waveSpeed: 0.6,
    waveFrequency: 1.2,
    foamIntensity: 0.3,
    particleDensity: 200,
    waterDeepColor: "#054c5a",
    waterShallowColor: "#34eed6",
    foamColor: "#ffffff",
    skyColor: "#fe9c5e", // Warm, warm golden hour sky
    exposure: 1.1,
    lightingIntensity: 1.2,
    entropy: 0.12,
    magnetism: 0.35,
    cohesion: 0.82,
    pulse: 0.28,
  },
  storm: {
    name: "Savage Storm",
    description: "Towering slate-grey waves, violent crests, dense ocean wind-spray particles, and sudden flashes of lightning.",
    waveHeight: 0.75,
    waveSpeed: 2.2,
    waveFrequency: 0.7,
    foamIntensity: 1.2,
    particleDensity: 800,
    waterDeepColor: "#10161d",
    waterShallowColor: "#394652",
    foamColor: "#e2e8f0",
    skyColor: "#0b0c10", // Dark storm sky
    exposure: 0.8,
    lightingIntensity: 0.7,
    entropy: 1.35,
    magnetism: 0.2,
    cohesion: 0.16,
    pulse: 0.72,
  },
  abyss: {
    name: "Midnight Vortex",
    description: "A dark, powerful oceanic whirlpool pulling everything into a glowing deep-sea helix spiral.",
    waveHeight: 0.12,
    waveSpeed: 1.2,
    waveFrequency: 0.9,
    foamIntensity: 0.05,
    particleDensity: 100,
    waterDeepColor: "#020409",
    waterShallowColor: "#0a1420",
    foamColor: "#596f8c",
    skyColor: "#010204", // Total darkness
    exposure: 0.9,
    lightingIntensity: 0.4,
    entropy: 0.16,
    magnetism: 1.45,
    cohesion: 0.72,
    pulse: 0.12,
  },
  biolum: {
    name: "Bioluminescent Night",
    description: "An electric midnight ocean where waves of glowing neon-cyan foam ignite with bright magical particles under the stars.",
    waveHeight: 0.32,
    waveSpeed: 1.1,
    waveFrequency: 1.1,
    foamIntensity: 1.4,
    particleDensity: 600,
    waterDeepColor: "#02071a",
    waterShallowColor: "#00f0ff", // Glowing cyan
    foamColor: "#00ffa2", // Glowing green-cyan
    skyColor: "#0a031e", // Dark magenta-purple night sky
    exposure: 1.3,
    lightingIntensity: 1.0,
    entropy: 0.48,
    magnetism: 0.85,
    cohesion: 0.38,
    pulse: 1.5,
  },
};

export const useOceanStore = create<OceanState>((set, get) => ({
  preset: "calm",
  ...PRESETS.calm,
  showStats: false,
  cameraMode: "orbit",
  autoRotate: true,
  interactionIntensity: 0,
  language: "EN",
  inView: true,
  setLanguage: (language) => set({ language }),
  setInView: (inView) => set({ inView }),

  setPreset: (preset) => {
    const config = PRESETS[preset];
    set({
      preset,
      ...config,
    });
  },

  setWaveHeight: (waveHeight) => set({ waveHeight }),
  setWaveSpeed: (waveSpeed) => set({ waveSpeed }),
  setWaveFrequency: (waveFrequency) => set({ waveFrequency }),
  setFoamIntensity: (foamIntensity) => set({ foamIntensity }),
  setParticleDensity: (particleDensity) => set({ particleDensity }),
  setWaterColors: (waterDeepColor, waterShallowColor) =>
    set({ waterDeepColor, waterShallowColor }),
  setFoamColor: (foamColor) => set({ foamColor }),
  setSkyColor: (skyColor) => set({ skyColor }),
  setExposure: (exposure) => set({ exposure }),
  setShowStats: (showStats) => set({ showStats }),
  setCameraMode: (cameraMode) => set({ cameraMode }),
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  setLightingIntensity: (lightingIntensity) => set({ lightingIntensity }),
  setEntropy: (entropy) => set({ entropy }),
  setMagnetism: (magnetism) => set({ magnetism }),
  setCohesion: (cohesion) => set({ cohesion }),
  setPulse: (pulse) => set({ pulse }),
  setInteractionIntensity: (interactionIntensity) => set({ interactionIntensity }),

  resetToPreset: (preset) => {
    const config = PRESETS[preset];
    set({
      preset,
      ...config,
    });
  },
}));
