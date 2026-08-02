# Kuber Bassi — Personal Engineering Portfolio

The official digital space and portfolio of **Kuber Bassi**, an independent engineer based in New Delhi, India.

Built with **React 19**, **TypeScript**, **Vite**, **Three.js**, **GSAP**, and **Lenis**, featuring a dark topographic canvas theme, kinetic micro-interactions, custom Web Audio synthesis, and dynamic GitHub repository integration.

---

## 🚀 Key Highlights & Features

- **Topographic Canvas Base:** Interactive WebGL/Canvas topographic relief mesh that responds smoothly to scroll position and pointer dynamics.
- **Dynamic Skill Observatory & Tech Wall:** Endless kinetic marquee displaying languages, tools, and platforms with official documentation links.
- **Live Repository Gallery:** Integrated with GitHub API to pull live statistics, languages, star counts, and direct repository links.
- **Skeuomorphic Audio Player:** Web Audio API sound engine providing interactive audio previews and ambient audio controls.
- **Custom Dot-Matrix 404 Page:** Bespoke dot-matrix animated error page styled with gold accent lighting, scanlines, and site-matching specular buttons.
- **Optimized Favicon & PWA:** Squircle-framed logo favicon (iOS/ChatGPT style) cropped tightly for max visibility in browser tabs, along with complete PWA webmanifest support.
- **High-Performance OG Image:** Ultra-optimized 1200×630 Open Graph preview image (95 KB JPEG) with rich social meta coverage across iMessage, Discord, LinkedIn, Slack, and X/Twitter.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Vanilla CSS design tokens (`variables.css`, `globals.css`, `portfolio.css`)
- **3D & Canvas:** Three.js / Custom HTML5 Canvas rendering
- **Animation:** GSAP (ScrollTrigger) & Framer Motion
- **Audio:** Web Audio API
- **Deployment:** Vercel

---

## 📁 Project Structure

```
kuberbassi.com/
├── public/                # Static assets, favicons, OG image, manifest & 404
│   ├── assets/            # Main topographic mesh & logo SVG
│   ├── brands/wall/       # Tech wall brand icons
│   ├── 404.html           # Custom dot-matrix error page
│   ├── favicon.svg        # Optimized squircle SVG favicon
│   ├── og-image.jpg       # 1200×630 optimized Open Graph social preview
│   └── manifest.webmanifest
├── src/
│   ├── app/               # Root App component
│   ├── components/        # Layout, canvas, sections, cards, and UI components
│   ├── data/              # Music catalog and profile data
│   ├── hooks/             # Motion, sound, and responsive hooks
│   ├── layouts/           # Page and root layouts
│   ├── pages/             # Home page view
│   ├── services/          # GitHub API integration service
│   └── styles/            # CSS tokens, animations, and global styles
├── scripts/               # Icon generation & image optimization tools
├── vercel.json            # Deployment routing & immutable header rules
└── vite.config.js         # Vite bundler & proxy configuration
```

---

## 📦 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

© 2025-2026 Kuber Bassi. All Rights Reserved.
