# Kuber Bassi — Unified Resonance Portfolio

A high-performance, multi-dimensional digital space for **Kuber Bassi**, representing the convergence of **Software Engineering** and **Music Production** (Systems and Resonance). 

This website has been modernized and unified into a single, state-of-the-art interactive experience. Legacy features and old codebase directories have been neatly archived in the `legacy/` directory.

---

## 🌌 Core Features

### 1. Unified Resonance Experience (`ModernPortfolio.jsx`)
Instead of separate interfaces, the entire portfolio is presented as a single, coherent narrative that adapts dynamically to the selected filter focus (Synthesis, Systems, or Music).

### 2. Dynamic 3D Arcane Ledger (The Project Book)
- **Automatic Index Pagination:** Automatically chunks large GitHub repository lists into batches of 10, generating dynamic index pages ("The Inventory") on parchment paper before showing individual project cards.
- **3D Page Flipping:** Seamless, interactive 3D leaf animations that respond dynamically to user navigation.
- **GitHub Integration:** Fetches and enriches repository cards with live language statistics and project details.

### 3. Skeuomorphic Resonance Terminal (Audio Control)
- **Interactive Vinyl Player:** A custom rotating vinyl graphic that speeds up/slows down depending on the playback state.
- **Vacuum Tube VU Meter:** Analog vacuum tubes that glow in response to playback, complete with a responsive mechanical VU indicator needle.
- **Direct Streaming Integration:** Skeuomorphic frequency bands for tuning directly into release channels (Spotify, Apple Music, YouTube, Amazon Music).

### 4. Custom Ambient Synth Engine (`audioSynth.js`)
- **Centralized Singleton Engine:** Leverages the Web Audio API to handle the ambient soundtrack (`Codex Over Observatory.mp3`) and interactive chimes.
- **Dynamic Interaction Chimes:** Triggers pentatonic chime notes (synthesized sine waves with bandpass guitar-like formants) during scroll, page flips, and hover states.
- **Robust Lifecycle Control:** Automatically halts stray elements, handles Chrome autoplay restrictions, and clears duplicates.

---

## ⚡ Performance & Mobile Optimizations
- **Layout-Thrashing Prevention:** Layout-measuring calculations (`getBoundingClientRect`) are disabled on touch screen devices to prevent scroll stuttering.
- **Responsive Custom Cursor:** Uses a canvas-based particle trail system that is automatically disabled on mobile/tablet devices to prevent DOM clutter and CPU overhead.
- **Reduced Animation Overhead:** Heavy SVG background layouts are automatically hidden on smaller screens.
- **Mobile View Rendering Fix:** Corrected typography CSS styling on the mobile portal page to resolve blurry text rendering on the name heading.
- **Vite Chunk Splitting:** Added manual chunk allocation for major dependencies (`three.js`, `gsap`, `framer-motion`), improving caching efficiency.
- **Vercel Asset Caching:** Configured `vercel.json` with `Cache-Control` immutable headers to speed up repeat loads of static assets.

---

## 🛠️ Technology Stack

- **Core:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Animation & Transitions:** [GSAP](https://greensock.com/) (ScrollTrigger) & [Framer Motion](https://www.framer.com/motion/)
- **Smooth Scroll:** [Lenis](https://lenis.darkroom.engineering/)
- **3D Graphics:** [Three.js](https://threejs.org/) / React Three Fiber
- **Analytics:** Vercel Speed Insights
- **Hosting:** Vercel

---

## 📂 Repository Structure & Archive
- `/src/pages/ModernPortfolio.jsx` — The unified codebase file.
- `/src/utils/audioSynth.js` — The custom audio and synthesizer controller.
- `/legacy/` — Contains all old components, styles, static HTML directories, and unused code files, safely archived.

---
© 2025-2026 Kuber Bassi. All Rights Reserved.
