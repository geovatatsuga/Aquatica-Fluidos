/**
 * WebGL Ocean and Particle Shaders
 * Built with Simplex 3D Noise for organic wave displacement and foam generation on the GPU.
 */

export const SIMPLEX_NOISE_GLSL = `
// Description : Array and textureless GLSL 2D/3D/4D simplex noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - D.yyy;      // -1.0 + 3.0 * C.xxx = -0.5

  // Permutations
  i = mod(i, 289.0 );
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients
  // ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  // Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}
`;

export const oceanVertexShader = `
uniform float uTime;
uniform float uWaveHeight;
uniform float uWaveSpeed;
uniform float uWaveFrequency;

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewDir;
varying float vHeight;
varying float vSteepness;

${SIMPLEX_NOISE_GLSL}

// Calculates dynamic wave heights at specific locations
float calculateWaveHeight(vec3 pos) {
  float time = uTime * uWaveSpeed;
  vec3 p = pos * uWaveFrequency;
  
  // Wave Harmonics (Gerstner-like sine waves for sharp ridges, run in orthogonal directions)
  float s1 = sin(p.x * 0.6 + time) * cos(p.z * 0.4 + time * 0.8);
  float s2 = cos(p.x * 1.3 - time * 1.1) * sin(p.z * 1.5 + time * 1.4);
  
  // Combine with multi-octave fractional Brownian Motion simplex noise
  float n1 = snoise(vec3(p.xz * 1.1, time * 0.3));
  float n2 = snoise(vec3(p.xz * 2.8, time * 0.6)) * 0.35;
  float n3 = snoise(vec3(p.xz * 6.2, time * 1.1)) * 0.12;
  
  // Total blended wave amplitude
  float totalHeight = (s1 * 0.5 + s2 * 0.3 + n1 * 0.45 + n2 + n3);
  return totalHeight * uWaveHeight;
}

void main() {
  // Translate local position to world coordinates
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  
  // Calculate heights of central, DX and DZ offsets to dynamically compute perfect normals
  float eps = 0.05;
  float h = calculateWaveHeight(worldPos.xyz);
  float h_dx = calculateWaveHeight(worldPos.xyz + vec3(eps, 0.0, 0.0));
  float h_dz = calculateWaveHeight(worldPos.xyz + vec3(0.0, 0.0, eps));
  
  // Displace positions
  worldPos.y += h;
  vec3 displaced_dx = worldPos.xyz + vec3(eps, h_dx - h, 0.0);
  vec3 displaced_dz = worldPos.xyz + vec3(0.0, h_dz - h, eps);
  
  // Derive tangent vectors on displaced grid
  vec3 T = displaced_dx - worldPos.xyz;
  vec3 B = displaced_dz - worldPos.xyz;
  
  // Take the cross product of the bitangent and tangent to get the correct normal pointing upwards
  vec3 calcNormal = normalize(cross(B, T));
  
  // Pass variables to fragment shader
  vWorldPosition = worldPos.xyz;
  vNormal = normalize(normalMatrix * calcNormal);
  vHeight = h;
  vSteepness = 1.0 - calcNormal.y; // steepness indicator based on world normal slant
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const oceanFragmentShader = `
uniform float uTime;
uniform float uWaveHeight;
uniform float uWaveSpeed;
uniform float uFoamIntensity;
uniform vec3 uWaterDeepColor;
uniform vec3 uWaterShallowColor;
uniform vec3 uFoamColor;
uniform vec3 uSkyColor;
uniform float uExposure;
uniform float uLightingIntensity;
uniform float uIsBiolum;

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewDir;
varying float vHeight;
varying float vSteepness;

${SIMPLEX_NOISE_GLSL}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewDir);
  
  // Sun/Lightning simulated direction
  vec3 lightDir = normalize(vec3(5.0, 8.0, 3.0));
  
  // High-performance Fresnel Effect (grazing rendering vs straight down transparency)
  float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 5.0);
  
  // Water transparency mixture based on wave height and view depth
  float depthFactor = smoothstep(-uWaveHeight, uWaveHeight, vHeight);
  vec3 baseWaterColor = mix(uWaterDeepColor, uWaterShallowColor, depthFactor);
  
  // Ambient lighting / horizon color
  vec3 skyReflection = uSkyColor;
  
  // Specular Highlight (The shimmering ocean rays)
  vec3 halfDir = normalize(lightDir + viewDir);
  float specPower = uIsBiolum > 0.5 ? 64.0 : 128.0;
  float specular = pow(max(dot(normal, halfDir), 0.0), specPower) * uLightingIntensity;
  
  // Bioluminescence glow highlights
  float biolumGlow = 0.0;
  if (uIsBiolum > 0.5) {
    // Glow intensifies at foam nodes and wave crests
    float wavesPeak = smoothstep(uWaveHeight * 0.1, uWaveHeight * 0.8, vHeight);
    biolumGlow = wavesPeak * (snoise(vec3(vWorldPosition.xz * 2.5, uTime * uWaveSpeed * 0.8)) * 0.5 + 0.5);
    baseWaterColor += vec3(0.0, 0.45, 0.8) * biolumGlow * 1.5;
  }
  
  // Foam simulation (calculated based on crest height, steepness, and noise)
  float noiseCoordScale = uIsBiolum > 0.5 ? 9.0 : 15.0;
  float fNoise = snoise(vec3(vWorldPosition.xz * noiseCoordScale, uTime * uWaveSpeed * 1.2)) * 0.5 + 0.5;
  
  // Foam triggers heavily at structural waves crests & steep slopes
  float slopeFactor = smoothstep(0.08, 0.7, vSteepness);
  float crestFactor = smoothstep(uWaveHeight * 0.0, uWaveHeight * 1.2, vHeight);
  float totalFoam = crestFactor * (slopeFactor * 1.3 + fNoise * 0.6) * uFoamIntensity;
  totalFoam = clamp(totalFoam, 0.0, 1.0);
  
  // Integrate reflection, water body, foam & specular lighting
  vec3 shadedColor = mix(baseWaterColor, skyReflection, fresnel * 0.6);
  shadedColor = mix(shadedColor, uFoamColor, totalFoam * 0.85);
  shadedColor += vec3(specular);
  
  // If bioluminescent, add electric green/blue foam edge glow
  if (uIsBiolum > 0.5) {
    vec3 glowColor = vec3(0.0, 1.0, 0.7) * totalFoam * fNoise * 2.2;
    shadedColor += glowColor;
  }
  
  // Atmosphere fog based on distance
  float distanceToCamera = length(vWorldPosition - cameraPosition);
  float fogFactor = smoothstep(10.0, 100.0, distanceToCamera);
  shadedColor = mix(shadedColor, uSkyColor, fogFactor * 0.85);
  
  // Color correction and exposure adjustment
  shadedColor *= uExposure;
  
  // Tone Map HDR (Ace Film Tone Mapping approximation)
  shadedColor = (shadedColor * (2.51 * shadedColor + 0.03)) / (shadedColor * (2.43 * shadedColor + 0.59) + 0.14);
  
  gl_FragColor = vec4(clamp(shadedColor, 0.0, 1.0), 1.0);
}
`;

export const particleVertexShader = `
uniform float uTime;
uniform float uWaveHeight;
uniform float uWaveSpeed;
uniform float uWaveFrequency;
uniform float uSize;

attribute float aRandomSpeed;
attribute vec3 aOffset;

varying vec3 vColor;
varying float vAlpha;
varying float vIsBiolum;

uniform vec3 uWaterShallowColor;
uniform vec3 uFoamColor;
uniform float uIsBiolum;

${SIMPLEX_NOISE_GLSL}

// Matching the vertex shader wave heights exactly
float calculateWaveHeight(vec3 pos) {
  float time = uTime * uWaveSpeed;
  vec3 p = pos * uWaveFrequency;
  
  float s1 = sin(p.x * 0.6 + time) * cos(p.z * 0.4 + time * 0.8);
  float s2 = cos(p.x * 1.3 - time * 1.1) * sin(p.z * 1.5 + time * 1.4);
  
  float n1 = snoise(vec3(p.xz * 1.1, time * 0.3));
  float n2 = snoise(vec3(p.xz * 2.8, time * 0.6)) * 0.35;
  float n3 = snoise(vec3(p.xz * 6.2, time * 1.1)) * 0.12;
  
  float totalHeight = (s1 * 0.5 + s2 * 0.3 + n1 * 0.45 + n2 + n3);
  return totalHeight * uWaveHeight;
}

void main() {
  // Compute floating animation using life cycles
  // aOffset contains seed location [x, z, seedYOffset]
  vec3 pos = vec3(aOffset.x, 0.0, aOffset.y);
  
  // Compute actual ocean base height
  float waterY = calculateWaveHeight(pos);
  
  // Sprays get dynamic eject physics based on wave height
  // Simulate particles flying upwards on wave crests
  float cycleTime = fract((uTime * 0.3 + aOffset.z) * aRandomSpeed);
  
  // If the waves are intense, spray flies higher
  float sprayHeight = cycleTime * uWaveHeight * 2.8;
  
  // Drift with the wind coordinates
  float windStrength = uWaveSpeed * 0.8;
  pos.x += cycleTime * windStrength * 1.5;
  pos.y = waterY + sprayHeight - (cycleTime * cycleTime * 2.2); // Gravity pull down
  
  // Convert to View coordinate
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  // Set sizes based on distance
  gl_PointSize = uSize * (20.0 / -mvPosition.z) * (1.1 - cycleTime);
  
  // Color parameters depending on simulation mode
  if (uIsBiolum > 0.5) {
    // Bioluminescent sparks
    vColor = mix(uWaterShallowColor, vec3(0.0, 1.0, 0.65), cycleTime);
    vAlpha = (1.0 - cycleTime) * smoothstep(0.0, 0.3, cycleTime) * 1.8;
  } else {
    // White salt water foam sprays
    vColor = mix(uFoamColor, vec3(1.0, 1.0, 1.0), 0.5);
    vAlpha = (1.0 - cycleTime) * smoothstep(0.0, 0.2, cycleTime) * uWaveHeight * 1.2;
  }
  
  vIsBiolum = uIsBiolum;
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const particleFragmentShader = `
varying vec3 vColor;
varying float vAlpha;
varying float vIsBiolum;

void main() {
  // Make particles perfectly circular with soft edges
  vec2 coords = gl_PointCoord - vec2(0.5);
  float len = length(coords);
  
  if (len > 0.5) discard;
  
  float intensity = smoothstep(0.5, 0.0, len);
  
  // Bioluminescent sparks have glowing halos
  if (vIsBiolum > 0.5) {
    intensity = pow(intensity, 1.5) * 1.5;
    gl_FragColor = vec4(vColor, intensity * vAlpha);
  } else {
    // Standard water foam spray bubbles
    intensity = pow(intensity, 2.0);
    gl_FragColor = vec4(vColor, intensity * vAlpha * 0.7);
  }
}
`;
