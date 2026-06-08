import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOceanStore, OceanPreset } from "../store/oceanStore";

const COUNT = 240000;

const PRESET_COLORS: Record<OceanPreset, [string, string]> = {
  calm: ["#34eed6", "#054c5a"],    // Turquoise surface, deep teal base
  storm: ["#829eb8", "#111b24"],   // Slate grey-blue surface, dark navy-black base
  abyss: ["#a855f7", "#05020c"],   // Glowing purple, pitch-black/violet base for vortex
  biolum: ["#00ffa2", "#00f0ff"],  // Glowing green surface, glowing electric cyan base
};

const vertexShader = `
uniform float uTime;
uniform float uEnergy;
uniform float uMode;
uniform float uLayer;
uniform float uEntropy;
uniform float uMagnetism;
uniform float uCohesion;
uniform float uPulse;
attribute vec3 aSeed;
attribute float aSize;
varying float vAlpha;
varying float vHot;
varying vec3 vColor;

#define PI 3.14159265
float hash(float n){ return fract(sin(n)*43758.5453); }
float noise3(vec3 p){
  return sin(p.x)*sin(p.y*1.37)*sin(p.z*.73) +
         .5*sin(p.x*2.17+p.z)*cos(p.y*1.81);
}
mat2 rot(float a){ float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }

uniform vec3 uColor;

void main(){
  float id = aSeed.x*191. + aSeed.y*521. + aSeed.z*997.;
  float speed = .35 + uEnergy*.12;
  float t = uTime*speed;
  float lane = floor(aSeed.z*34.);
  float laneRnd = hash(lane*7.13);
  
  if (uMode < 0.5) {
    // EXACT ORIGINAL CALM SEA FLOW & PHYSICS
    float flow = fract(aSeed.x + t*(.055 + laneRnd*.055));
    float x = (flow*2.-1.)*8.5;
    float side = (aSeed.y-.5)*2.;
    float core = 1.-abs(side);
    float streamWidth = mix(2.7,.35,clamp(uCohesion*.62,0.,.9));

    // A moving river centerline with multiple coherent currents.
    float bend = sin(x*.48 + t*1.2)*1.15 + sin(x*.19-t*.7)*.72;
    float bed = sin(x*.72-t*1.4)*.28 + sin(x*1.8+t)*.1;
    vec3 p = vec3(x, bed, bend);
    p.z += side*streamWidth*(.45 + .55*laneRnd);
    p.y += (hash(id)-.5)*(.12 + (1.-uCohesion*.35)*.3);

    p.y += sin(x*.9-t*2.+lane)*.16*core;

    // 8% spray clusters and 2% large ballistic droplets.
    float spray = step(.90,aSeed.z);
    float drop = step(.98,aSeed.z);
    float arc = sin(flow*PI);
    p.y += spray*arc*arc*(1.2 + hash(lane+4.)*3. + uEntropy*1.5 + uPulse*1.2);
    p.z += spray*sin(flow*PI*2.+lane)*(.4 + uEntropy*.7);
    p.y += drop*arc*(1.8 + hash(id)*2.5);

    // Entropy visibly shreds the river into noisy airborne strands.
    vec3 chaos = vec3(
      noise3(vec3(x*.7,id*.013,t*3.)),
      noise3(vec3(id*.019,t*4.,x*.9)),
      noise3(vec3(t*2.7,x*.65,id*.011))
    );
    float shred = smoothstep(.15,1.7,uEntropy);
    p += chaos*uEntropy*(.35 + shred*1.35)*(1.-core*.35);
    p.y += shred*max(0.,sin(id*.13+t*5.))*1.8;

    // Magnetism turns the current into dramatic double-helix field lines.
    float magnetic = uMagnetism;
    float angle = magnetic*(x*.7 + t*2.5 + lane*.19);
    vec2 around = vec2(p.y-bed,p.z-bend);
    around = rot(angle)*around;
    float helixRadius = magnetic*(.18 + .75*abs(side));
    around += vec2(sin(angle+lane),cos(angle+lane))*helixRadius;
    p.yz = vec2(bed,bend)+around;

    // Cohesion collapses loose streams into dense liquid ropes and droplets.
    p.y = mix(p.y,bed + sin(id+t)*.035,clamp(uCohesion*.42,0.,.82)*core);
    p.z = mix(p.z,bend + side*.28,clamp(uCohesion*.52,0.,.9));

    // Pulse sends huge traveling pressure waves through the whole river.
    float pressure = sin(x*1.15-t*(4.+uPulse*2.5));
    float pulseAmp = uPulse*(.25 + .8*pressure*pressure);
    p.y += pulseAmp*core;
    p.z += sin(x*.55-t*3.)*pulseAmp*.7;

    p.y += uLayer*.08 + sin(id+t*3.)*.018;
    vec4 mv = modelViewMatrix*vec4(p,1.);
    float depthScale = 28./max(2.,-mv.z);
    gl_PointSize = min(4.8,aSize*depthScale*mix(1.,.58,uLayer));
    gl_Position = projectionMatrix*mv;
    
    vColor = uColor;
    vAlpha = mix(.82,.28,uLayer)*(.55+.45*core);
    vHot = clamp(spray*.4 + drop*.85 + pulseAmp*.25,0.,1.);
  } else {
    // NEW REDESIGNED STORM, VORTEX, AND BIOLUM SCENES
    vec3 p = vec3(0.0);
    float core = 1.0;
    float spray = 0.0;
    float drop = 0.0;
    vHot = 0.0;
    
    if (uMode < 1.5) {
      // 1: STORM - Extremely chaotic, high-entropy waves, spraying drops, lightning flashes
      float flow = fract(aSeed.x + t * 0.25);
      float x = (flow * 2.0 - 1.0) * 9.5;
      float side = (aSeed.y - 0.5) * 2.0;
      core = 1.0 - abs(side);
      
      float bend = sin(x * 0.9 + t * 4.0) * 1.8 + cos(x * 1.8 - t * 5.0) * 0.8;
      float bed = sin(x * 1.5 + t * 4.5) * 1.3 + cos(x * 3.0 - t * 6.0) * 0.5;
      p = vec3(x, bed, bend + side * 2.3);
      
      spray = step(0.75, aSeed.z); 
      drop = step(0.93, aSeed.z);
      float arc = sin(flow * PI);
      p.y += spray * arc * arc * (1.6 + hash(lane + 4.0) * 4.5 + uEntropy * 2.2);
      p.z += spray * sin(flow * PI * 2.0 + lane) * (0.9 + uEntropy * 1.4);
      p.y += drop * arc * (2.8 + hash(id) * 3.8);
      
      vec3 chaos = vec3(
        noise3(vec3(x * 1.1, id * 0.016, t * 4.5)),
        noise3(vec3(id * 0.024, t * 5.5, x * 1.3)),
        noise3(vec3(t * 3.6, x * 0.9, id * 0.015))
      );
      p += chaos * (uEntropy + 0.6) * 1.6 * (1.0 - core * 0.3);
      
      vHot = clamp(spray * 0.6 + drop * 0.95, 0.0, 1.0);
      vColor = mix(uColor, vec3(1.1, 1.2, 1.4), vHot);
      vAlpha = mix(0.9, 0.35, uLayer) * (0.55 + 0.45 * core);
      
    } else if (uMode < 2.5) {
      // 2: VORTEX - True spiral whirlpool pulling particles into a dense helix orbiting a central axis
      float radiusSeed = aSeed.x;
      float angleSeed = aSeed.y * 2.0 * PI;
      
      float r = fract(radiusSeed - t * 0.09);
      float radius = r * 7.5 + 0.15;
      float angle = angleSeed + t * 1.8 + (1.0 - r) * 11.0;
      
      float vx = cos(angle) * radius;
      float vz = sin(angle) * radius;
      
      float vy = -3.2 / (radius + 0.25) + sin(radius * 4.0 - t * 7.0) * 0.2;
      vy += (aSeed.z - 0.5) * 2.0 * radius;
      
      p = vec3(vx, vy, vz);
      p.xz = mix(p.xz, vec2(vx, vz) * 0.4, clamp(uCohesion * 0.6 + uMagnetism * 0.6, 0.0, 0.9));
      
      float distNorm = clamp(radius / 7.5, 0.0, 1.0);
      vec3 innerColor = vec3(0.1, 0.8, 1.0) * 2.2;
      vec3 outerColor = uColor;
      vColor = mix(innerColor, outerColor, distNorm);
      
      vAlpha = mix(1.0, 0.15, distNorm) * mix(0.85, 0.3, uLayer);
      
    } else {
      // 3: BIOLUM - Exploding concentric pulse ripples, bright neon particles, pulsing color mix
      float spawnTime = aSeed.x;
      float age = fract(spawnTime + t * 0.2);
      
      float radius = age * 8.5;
      float angle = aSeed.y * 2.0 * PI;
      
      float currentAngle = angle + age * 4.0;
      float bx = cos(currentAngle) * radius;
      float bz = sin(currentAngle) * radius;
      
      float ripple = sin(radius * 6.0 - t * 12.0) * exp(-radius * 0.2) * 0.6;
      float burst = sin(age * PI) * 2.2 * (0.3 + aSeed.z);
      
      float by = ripple + burst - 0.5;
      p = vec3(bx, by, bz);
      
      float colorPulse = sin(t * 3.5 + radius * 2.5 + id) * 0.5 + 0.5;
      vec3 cyanBiolum = vec3(0.0, 0.95, 1.0);
      vec3 greenBiolum = vec3(0.0, 1.0, 0.55);
      vec3 baseBiolum = mix(cyanBiolum, greenBiolum, colorPulse);
      
      vColor = baseBiolum * (1.3 + 1.7 * (1.0 - age));
      vAlpha = (1.0 - age) * mix(0.9, 0.4, uLayer);
    }
    
    p.y += uLayer * 0.08 + sin(id + t * 3.0) * 0.015;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float depthScale = 28.0 / max(2.0, -mv.z);
    gl_PointSize = min(5.5, aSize * depthScale * mix(1.0, 0.6, uLayer));
    gl_Position = projectionMatrix * mv;
  }
}
`;

const fragmentShader = `
uniform vec3 uColor;
uniform float uTime;
uniform float uMode;
varying float vAlpha;
varying float vHot;
varying vec3 vColor;

void main(){
  vec2 q=gl_PointCoord-.5;
  float d=length(q);
  if(d>.5) discard;
  float dot=smoothstep(.5,.06,d);
  
  vec3 color = vColor;
  
  // Lightning flashes if uMode is Storm (1.0)
  if (uMode > 0.5 && uMode < 1.5) {
    float flashTime = uTime * 2.5;
    float flashVal = sin(flashTime) * cos(flashTime * 0.58 + 1.2) * sin(flashTime * 0.22);
    float lightning = step(0.65, flashVal);
    float strike = lightning * (0.8 + 0.2 * sin(uTime * 30.0));
    color = mix(color, vec3(2.5, 2.7, 3.2), strike);
  }
  
  float coreGlow = smoothstep(0.18, 0.0, d) * 1.8;
  vec3 finalColor = color + vec3(coreGlow);
  
  gl_FragColor=vec4(finalColor, dot*vAlpha);
}`;


export default function FluidParticles(){
  const materials=useRef<Array<THREE.ShaderMaterial|null>>([]);
  const {preset,waveSpeed,particleDensity,entropy,magnetism,cohesion,pulse,inView}=useOceanStore();
  const mode={calm:0,storm:1,abyss:2,biolum:3}[preset];
  
  // Size allocation: 80% micro-sparks (0.05 to 0.16) for fine mist, 15% medium drops, 5% large
  const [positions,seeds,sizes]=useMemo(()=>{
    const pos=new Float32Array(COUNT*3);
    const seed=new Float32Array(COUNT*3);
    const size=new Float32Array(COUNT);
    for(let i=0;i<COUNT;i++){
      seed[i*3]=Math.random();
      seed[i*3+1]=Math.random();
      seed[i*3+2]=Math.random();
      const kind=Math.random();
      size[i]=kind < 0.8 
        ? 0.08 + Math.random() * 0.14 
        : kind < 0.96 
          ? 0.28 + Math.random() * 0.28 
          : 1.1 + Math.random() * 1.3;
    }
    return [pos,seed,size];
  },[]);

  const initialColors = PRESET_COLORS[preset];

  const uniforms=useMemo(()=>[0,1].map(layer=>({
    uTime:{value:0},uEnergy:{value:waveSpeed},uMode:{value:mode},uLayer:{value:layer},
    uEntropy:{value:entropy},uMagnetism:{value:magnetism},uCohesion:{value:cohesion},uPulse:{value:pulse},
    uColor:{value:new THREE.Color(initialColors[layer])}
  })),[]);

  useFrame(({clock})=>{
    if (!inView) return;
    const colors = PRESET_COLORS[preset];
    materials.current.forEach((material, layer)=>{
      if(!material)return;
      material.uniforms.uTime.value=clock.elapsedTime;
      material.uniforms.uEnergy.value=waveSpeed;
      material.uniforms.uMode.value=mode;
      material.uniforms.uEntropy.value=entropy;
      material.uniforms.uMagnetism.value=magnetism;
      material.uniforms.uCohesion.value=cohesion;
      material.uniforms.uPulse.value=pulse;
      
      // Dynamically update uniforms colors to match the selected preset
      material.uniforms.uColor.value.setStyle(colors[layer]);
    });
  });

  const count=Math.min(COUNT,120000+particleDensity*60);
  return <group rotation={[-.12,-.1,-.04]} position={[0,-.25,0]}>
    {[0,1].map(layer=><points key={layer} frustumCulled={false}>
      <bufferGeometry drawRange={{start:layer?Math.floor(count*.14):0,count:layer?Math.floor(count*.38):count}}>
        <bufferAttribute attach="attributes-position" args={[positions,3]}/>
        <bufferAttribute attach="attributes-aSeed" args={[seeds,3]}/>
        <bufferAttribute attach="attributes-aSize" args={[sizes,1]}/>
      </bufferGeometry>
      <shaderMaterial ref={node=>{materials.current[layer]=node}} vertexShader={vertexShader} fragmentShader={fragmentShader}
        uniforms={uniforms[layer]} transparent depthWrite={false}
        blending={layer?THREE.AdditiveBlending:THREE.NormalBlending}/>
    </points>)}
  </group>;
}
