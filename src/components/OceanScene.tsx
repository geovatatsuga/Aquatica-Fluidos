import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useOceanStore } from "../store/oceanStore";
import FluidParticles from "./FluidParticles";
import LabEnvironment from "./LabEnvironment";

// Active Cinematic view controller script
function CinematicCameraController() {
  const { cameraMode } = useOceanStore();

  useFrame((state) => {
    if (cameraMode === "cinematic") {
      const time = state.clock.getElapsedTime() * 0.08;
      // Elliptic orbit winding slowly around the water surface
      const radius = 14 + Math.sin(time * 0.5) * 1.5;
      state.camera.position.x = Math.sin(time) * radius;
      state.camera.position.z = Math.cos(time) * radius;
      // Hover at varying altitude
      state.camera.position.y = 2.2 + Math.sin(time * 1.3) * 0.8;
      state.camera.lookAt(0, 0.3, 0);
    }
  });

  return null;
}

function RendererConfiguration() {
  const { gl } = useThree();

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1;
  }, [gl]);

  return null;
}

export default function OceanScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { 
    skyColor, 
    cameraMode, 
    autoRotate, 
    preset, 
    lightingIntensity, 
    waveSpeed, 
    entropy, 
    magnetism, 
    cohesion, 
    pulse,
    inView,
    setInView 
  } = useOceanStore();
  const [isInteracting, setIsInteracting] = useState(false);
  const [interactionIntensity, setInteractionIntensity] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.02 } // Trigger immediately when even a tiny bit is visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [setInView]);

  // Handle pointer interactions to disturb the fluid
  const handlePointerDown = () => {
    setIsInteracting(true);
    setInteractionIntensity(0.8);
  };

  const handlePointerUp = () => {
    setIsInteracting(false);
    setInteractionIntensity(0);
  };

  const handlePointerLeave = () => {
    setIsInteracting(false);
    setInteractionIntensity(0);
  };

  return (
    <div ref={containerRef} className="w-full h-full relative" id="ocean3DCanvas">
      <Canvas
        frameloop={inView ? "always" : "demand"}
        camera={{ position: [0, 1.8, 14], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: false,
          depth: true,
          stencil: false,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        style={{ touchAction: "none" }} // Prevent browser touch handling
      >
        <RendererConfiguration />
        {/* Dynamic Horizon and Atmosphere Fog */}
        <color attach="background" args={["#01080b"]} />
        <fog attach="fog" args={["#01080b", 12, 30]} />

        {/* Ambient base lighting, reflects sky tone */}
        <ambientLight intensity={0.08} color="#8ffbf2" />

        {/* Major Sun directional light making crest sparkles possible */}
        <directionalLight
          position={[10, 15, 6]}
          intensity={lightingIntensity * 0.7}
          color="#a9fff7"
        />

        {/* Sub spotlight centered to emphasize the abyss depths */}
        {preset === "abyss" && (
          <spotLight
            position={[0, 18, 0]}
            angle={0.4}
            penumbra={0.8}
            intensity={1.5}
            color="#3b82f6"
          />
        )}

        {/* Custom procedural Ocean Surface with height displacement */}
        <FluidParticles />
        <LabEnvironment />

        {/* Render magical stars in bioluminescent and abyss mode */}
        {(preset === "biolum" || preset === "abyss") && (
          <Stars
            radius={90}
            depth={50}
            count={preset === "biolum" ? 3000 : 1000}
            factor={3}
            saturation={0.8}
            fade
            speed={1.2}
          />
        )}

        {/* Camera viewpoint movement helpers */}
        <CinematicCameraController />

        {/* Orbit controls with pitch boundaries to prevent clipping below the water plane */}
        <OrbitControls
          enabled={cameraMode === "orbit"}
          autoRotate={autoRotate && cameraMode === "orbit"}
          autoRotateSpeed={0.5}
          minDistance={8}
          maxDistance={22}
          maxPolarAngle={Math.PI / 2 - 0.05} // Stops camera from going under the sea
          enableDamping
          dampingFactor={0.05}
          enableZoom={false}
        />
      </Canvas>
    </div>
  );
}
