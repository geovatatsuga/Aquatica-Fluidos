import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOceanStore } from "../store/oceanStore";
import { oceanVertexShader, oceanFragmentShader } from "../shaders/oceanShaders";

export default function OceanSurface() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Read current configuration parameters from the store
  const {
    waveHeight,
    waveSpeed,
    waveFrequency,
    foamIntensity,
    waterDeepColor,
    waterShallowColor,
    foamColor,
    skyColor,
    exposure,
    lightingIntensity,
    preset,
  } = useOceanStore();

  // Create initial uniforms with Three.js object types
  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uWaveHeight: { value: waveHeight },
      uWaveSpeed: { value: waveSpeed },
      uWaveFrequency: { value: waveFrequency },
      uFoamIntensity: { value: foamIntensity },
      uWaterDeepColor: { value: new THREE.Color(waterDeepColor) },
      uWaterShallowColor: { value: new THREE.Color(waterShallowColor) },
      uFoamColor: { value: new THREE.Color(foamColor) },
      uSkyColor: { value: new THREE.Color(skyColor) },
      uExposure: { value: exposure },
      uLightingIntensity: { value: lightingIntensity },
      uIsBiolum: { value: preset === "biolum" ? 1.0 : 0.0 },
    };
  }, []);

  // Update uniforms when store parameters change
  useEffect(() => {
    if (materialRef.current) {
      const u = materialRef.current.uniforms;
      u.uWaveHeight.value = waveHeight;
      u.uWaveSpeed.value = waveSpeed;
      u.uWaveFrequency.value = waveFrequency;
      u.uFoamIntensity.value = foamIntensity;
      u.uWaterDeepColor.value.set(waterDeepColor);
      u.uWaterShallowColor.value.set(waterShallowColor);
      u.uFoamColor.value.set(foamColor);
      u.uSkyColor.value.set(skyColor);
      u.uExposure.value = exposure;
      u.uLightingIntensity.value = lightingIntensity;
      u.uIsBiolum.value = preset === "biolum" ? 1.0 : 0.0;
    }
  }, [
    waveHeight,
    waveSpeed,
    waveFrequency,
    foamIntensity,
    waterDeepColor,
    waterShallowColor,
    foamColor,
    skyColor,
    exposure,
    lightingIntensity,
    preset,
  ]);

  // Update time uniform in render loop (avoid react render triggers)
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} frustumCulled={false}>
      {/* 
        A grid of 160x160 offers beautiful wave resolution, crisp ridges under lighting, 
        and spectacular performance across all desktop and mobile devices.
      */}
      <planeGeometry args={[70, 70, 160, 160]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={oceanVertexShader}
        fragmentShader={oceanFragmentShader}
        uniforms={uniforms}
        transparent={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}
