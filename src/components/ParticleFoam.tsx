import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOceanStore } from "../store/oceanStore";
import { particleVertexShader, particleFragmentShader } from "../shaders/oceanShaders";

const MAX_PARTICLES = 2000;

export default function ParticleFoam() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const {
    waveHeight,
    waveSpeed,
    waveFrequency,
    particleDensity,
    foamColor,
    waterShallowColor,
    preset,
  } = useOceanStore();

  // Create stable buffers for particles (positions, offsets, and speed multipliers)
  const [offsets, randomSpeeds] = useMemo(() => {
    const off = new Float32Array(MAX_PARTICLES * 3); // x, z, time_offset_seed
    const speeds = new Float32Array(MAX_PARTICLES);

    for (let i = 0; i < MAX_PARTICLES; i++) {
      // Spawn particles randomly on a 45x45 horizontal plane centered at the origin
      const x = (Math.random() - 0.5) * 45;
      const z = (Math.random() - 0.5) * 45;
      const timeOffsetSeed = Math.random() * 10; // random offset seed
      
      off[i * 3 + 0] = x;
      off[i * 3 + 1] = z;
      off[i * 3 + 2] = timeOffsetSeed;

      speeds[i] = 0.4 + Math.random() * 1.5; // speed multiplier
    }

    return [off, speeds];
  }, []);

  // Create initial point coordinates (they will be overwritten/displaced by uTime in vertex shader)
  const initialPositions = useMemo(() => {
    const pos = new Float32Array(MAX_PARTICLES * 3);
    for (let i = 0; i < MAX_PARTICLES * 3; i++) {
      pos[i] = 0;
    }
    return pos;
  }, []);

  // Configure WebGL uniforms
  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uWaveHeight: { value: waveHeight },
      uWaveSpeed: { value: waveSpeed },
      uWaveFrequency: { value: waveFrequency },
      uSize: { value: 8.0 },
      uWaterShallowColor: { value: new THREE.Color(waterShallowColor) },
      uFoamColor: { value: new THREE.Color(foamColor) },
      uIsBiolum: { value: preset === "biolum" ? 1.0 : 0.0 },
    };
  }, []);

  // Update uniforms when store properties change
  useEffect(() => {
    if (materialRef.current) {
      const u = materialRef.current.uniforms;
      u.uWaveHeight.value = waveHeight;
      u.uWaveSpeed.value = waveSpeed;
      u.uWaveFrequency.value = waveFrequency;
      u.uWaterShallowColor.value.set(waterShallowColor);
      u.uFoamColor.value.set(foamColor);
      u.uIsBiolum.value = preset === "biolum" ? 1.0 : 0.0;
    }
  }, [waveHeight, waveSpeed, waveFrequency, waterShallowColor, foamColor, preset]);

  // Handle active particle density on the fly by adjusting the WebGL draw range
  useEffect(() => {
    if (pointsRef.current) {
      const geometry = pointsRef.current.geometry as THREE.BufferGeometry;
      const clampedDensity = Math.min(particleDensity, MAX_PARTICLES);
      geometry.setDrawRange(0, clampedDensity);
    }
  }, [particleDensity]);

  // Update elapsed uTime in core GPU loop
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <points ref={pointsRef} position={[0, -0.5, 0]} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initialPositions, 3]}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          args={[offsets, 3]}
        />
        <bufferAttribute
          attach="attributes-aRandomSpeed"
          args={[randomSpeeds, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
