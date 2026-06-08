import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

const haloVertex = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const haloFragment = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vec2 p = vUv - 0.5;
    float radial = length(p * vec2(0.6, 1.0));
    float glow = pow(max(0.0, 1.0 - radial * 1.9), 4.6);
    float inner = pow(max(0.0, 1.0 - radial * 3.6), 3.2);
    vec3 color = mix(vec3(0.001, 0.008, 0.012), vec3(0.005, 0.08, 0.1), inner);
    gl_FragColor = vec4(color, glow * 0.45);
  }
`;

export default function LabEnvironment() {
  const halo = useRef<THREE.Mesh>(null);
  const haloMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: haloVertex,
        fragmentShader: haloFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    if (halo.current) {
      const breath = 1 + Math.sin(time * 0.2) * 0.005;
      halo.current.scale.set(20 * breath, 12 * breath, 1);
    }
  });

  return (
    <group>
      {/* Immersive background soft radial halo */}
      <mesh ref={halo} position={[0, 0.5, -9]} scale={[20, 12, 1]} material={haloMaterial}>
        <planeGeometry args={[1, 1]} />
      </mesh>
    </group>
  );
}
