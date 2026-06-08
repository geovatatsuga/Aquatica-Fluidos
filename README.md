# Aquatica Fluidos

An advanced real-time mathematical fluid simulator that visualizes high-density particle river flows, wave cohesion, and vortex turbulence directly on the GPU using WebGL 2 and React Three Fiber.

Designed with a premium dark-mode developer landing page that features smooth glassmorphism containers, animated floating background sparkles, and responsive telemetry controls.

## 🌊 Physics Presets

The simulation features four highly differentiated mathematical presets:

1. **Laminar Flow (Calm Sea)**: A peaceful golden-hour wave stream executing a gentle laminar wave equation:
   $$\text{Equation: } y += \sin(x \times 0.9 - t \times 2 + \text{lane}) \times 0.16 \times \text{core}$$
   Simulates 132,000 active particles with high transparency and stable surface tension.

2. **Turbulence (Savage Storm)**: Slate-grey violent swells utilizing a wave crest breaker solver:
   $$\text{Equation: } y += \max(0, \text{breaker}) \times 1.35 \times \text{core}$$
   Simulates 168,000 active particles with high entropy wind spray and ballistic droplet shedding.

3. **Vortex Field (Midnight Abyss)**: A near-black deep-sea funnel running a 3D helix attraction field equation:
   $$\text{Equation: } yz = \text{rot}(\text{vortex} \times 0.38 + \text{side} \times 1.4) \times yz$$
   Simulates 126,000 active particles orbiting a gravity spotlight with extreme magnetic overrides.

4. **Particle Burst (Bioluminescence)**: Concentric shockwave pulses running a quadratic surge wave formula:
   $$\text{Equation: } y += \text{wave} \times \text{wave} \times 1.15 \times \text{core}$$
   Simulates 156,000 neon-cyan active particles that propagate pulse waves under additive color blending.

---

## 🚀 Key Features

* **GPU Particle Solver**: Simulates up to 240,000 active particles in real-time using custom vertex and fragment shaders.
* **On-Demand Performance Optimization**: Utilizes an `IntersectionObserver` to freeze the WebGL canvas loop when scrolled out of view, reducing CPU/GPU overhead to 0%.
* **Live Sandbox Dashboard**: Interactively customize uniform values (Wave Speed, Attraction Factor, Surface Cohesion, Pulse Amplitude) in real-time.
* **Full Translation Matrix**: Integrated language pill for switching between English (EN) and Portuguese (PT) across UI text, descriptions, comments, and instructions.
* **Responsive Layout & Visual Polish**: Built with frosted glassmorphism cards, corner brackets, glowing text effects, and drifting background stars.

---

## 🛠️ Local Development

### Prerequisites

* [Node.js](https://nodejs.org/) (v16+)
* npm

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the local development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## 🌐 Deployment

This project is configured to run out-of-the-box on **Vercel** with a pre-configured routing file `vercel.json` to handle client-side routing.

---

*Formulas and equations computed using GLSL ES 3.0 shaders on client-side GPU.*
