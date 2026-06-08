import { Droplets, Orbit, Sparkles, Tornado } from "lucide-react";
import { useOceanStore, OceanPreset } from "../store/oceanStore";

const experiments = {
  EN: [
    { key: "calm" as OceanPreset, name: "SPLASH IMPACT", type: "LIQUID", icon: Droplets },
    { key: "storm" as OceanPreset, name: "TURBULENCE", type: "FORCE", icon: Tornado },
    { key: "abyss" as OceanPreset, name: "VORTEX FIELD", type: "VORTEX", icon: Orbit },
    { key: "biolum" as OceanPreset, name: "PARTICLE BURST", type: "ENERGY", icon: Sparkles },
  ],
  PT: [
    { key: "calm" as OceanPreset, name: "IMPACTO SUAVE", type: "LÍQUIDO", icon: Droplets },
    { key: "storm" as OceanPreset, name: "TURBULÊNCIA", type: "FORÇA", icon: Tornado },
    { key: "abyss" as OceanPreset, name: "CAMPO VÓRTICE", type: "VÓRTICE", icon: Orbit },
    { key: "biolum" as OceanPreset, name: "EXPLOSÃO DE PARTÍCULAS", type: "ENERGIA", icon: Sparkles },
  ]
};

export default function ScenePresets() {
  const { preset, setPreset, language } = useOceanStore();
  const list = experiments[language] || experiments.EN;
  return (
    <div className="experiment-dock">
      {list.map(({ key, name, type, icon: Icon }) => (
        <button key={key} onClick={() => setPreset(key)} className={preset === key ? "selected" : ""}>
          <span className="experiment-art"><Icon size={24}/><i/><i/><i/></span>
          <small>{type}</small><strong>{name}</strong>
        </button>
      ))}
    </div>
  );
}
