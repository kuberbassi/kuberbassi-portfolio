import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import SEO from '../components/SEO';
import CustomCursor from '../components/CustomCursor';
import SpellText from '../components/SpellText';
import { projects, enrichProjects, getInitialProjects } from '../data/projects';
import { identity } from '../data/identity';
import { musicChannels } from '../data/music';
import { fetchFeaturedRepos, fetchGitHubProfile } from '../utils/githubProfile';
import audioSynth from '../utils/audioSynth';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import '../styles/ModernPortfolio.css';

gsap.registerPlugin(ScrollTrigger);

const _musicArtifacts = [
  '/music-portfolio/assets/images/album-art/ILLUMINATE.webp',
  '/music-portfolio/assets/images/album-art/RODEO.webp',
  '/music-portfolio/assets/images/album-art/HighwayBlues.webp',
  '/music-portfolio/assets/images/album-art/Reaper.webp',
];

const navItems = [
  ['01', 'GATE', '#gate'],
  ['02', 'RESONANCE', '#worlds'],
  ['03', 'ARSENAL', '#dev-stack-section'],
  ['04', 'PROJECTS', '#archive'],
  ['05', 'MUSIC', '#music-terminal'],
  ['06', 'SIGNAL', '#signal'],
];



const arcaneGlyphs = ['✦', '✧', '✶', '✵', '✷', '✸'];

function handlePointerGlow(event) {
  if (window.innerWidth <= 768) return; // Skip on mobile/tablets to prevent getBoundingClientRect layout thrashing during scrolls/touches
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
  event.currentTarget.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
}

function TelemetryMaterial({ color, speed, amplitude, wavelength }) {
  const materialRef = useRef(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColor: { value: new THREE.Color(color) },
    uAmplitude: { value: amplitude },
    uWavelength: { value: wavelength }
  }), [color, amplitude, wavelength]);

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * speed;
    
    const mx = (state.pointer.x * state.viewport.width) / 2;
    const my = (state.pointer.y * state.viewport.height) / 2;
    materialRef.current.uniforms.uMouse.value.set(mx, my);
  });

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uColor.value.set(color);
      materialRef.current.uniforms.uAmplitude.value = amplitude;
      materialRef.current.uniforms.uWavelength.value = wavelength;
    }
  }, [color, amplitude, wavelength]);

  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={uniforms}
      transparent
      blending={THREE.AdditiveBlending}
      vertexShader={`
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uAmplitude;
        uniform float uWavelength;
        varying vec3 vPosition;
        
        void main() {
          vPosition = position;
          
          float distFromCenter = length(position.xy);
          float z = sin(distFromCenter * uWavelength - uTime) * uAmplitude;
          
          float distToMouse = length(position.xy - uMouse);
          if (distToMouse < 2.0) {
            float force = (2.0 - distToMouse) / 2.0;
            z -= force * 0.4;
          }
          
          vec3 newPosition = vec3(position.x, position.y, z);
          vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          gl_PointSize = 15.0 / -mvPosition.z;
        }
      `}
      fragmentShader={`
        uniform vec3 uColor;
        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          if (length(coord) > 0.5) discard;
          gl_FragColor = vec4(uColor, 0.6);
        }
      `}
    />
  );
}

function TelemetryWavefield({ viewMode }) {
  const cols = 50;
  const rows = 35;
  const numPoints = cols * rows;
  
  const { positions } = useMemo(() => {
    const pos = new Float32Array(numPoints * 3);
    const spacingX = 0.22;
    const spacingY = 0.22;
    const startX = -((cols - 1) * spacingX) / 2;
    const startY = -((rows - 1) * spacingY) / 2;
    
    for (let i = 0; i < numPoints; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      pos[i * 3] = startX + col * spacingX;
      pos[i * 3 + 1] = startY + row * spacingY;
      pos[i * 3 + 2] = 0;
    }
    return { positions: pos };
  }, [cols, rows, numPoints]);

  const speed = viewMode === 'dev' ? 1.0 : viewMode === 'music' ? 2.2 : 1.6;
  const amplitude = viewMode === 'dev' ? 0.15 : viewMode === 'music' ? 0.38 : 0.25;
  const wavelength = viewMode === 'dev' ? 1.4 : viewMode === 'music' ? 0.8 : 1.1;

  const pColor = useMemo(() => {
    if (viewMode === 'dev') return '#00ffaa';
    if (viewMode === 'music') return '#ff3333';
    return '#9a84ff';
  }, [viewMode]);

  return (
    <points rotation={[-0.45, 0.15, 0.05]} position={[0, -0.4, -0.8]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={numPoints}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <TelemetryMaterial 
        color={pColor}
        speed={speed}
        amplitude={amplitude}
        wavelength={wavelength}
      />
    </points>
  );
}

function SynthesisCore({ viewMode }) {
  const innerRef = useRef(null);
  const outerRef = useRef(null);

  useFrame((state, _delta) => {
    const t = state.clock.elapsedTime;
    if (innerRef.current) {
      innerRef.current.rotation.x = t * 0.12;
      innerRef.current.rotation.y = t * 0.18;
      innerRef.current.position.y = Math.sin(t * 0.8) * 0.12;
    }
    if (outerRef.current) {
      outerRef.current.rotation.x = -t * 0.09;
      outerRef.current.rotation.y = -t * 0.14;
      outerRef.current.rotation.z = t * 0.05;
      outerRef.current.position.y = Math.sin(t * 0.8) * 0.12;
    }
  });

  const coreColor = useMemo(() => {
    if (viewMode === 'dev') return '#00ffaa';
    if (viewMode === 'music') return '#ff5533';
    return '#f2cf85';
  }, [viewMode]);

  const innerColor = useMemo(() => {
    if (viewMode === 'dev') return '#e6fff5';
    if (viewMode === 'music') return '#fff0eb';
    return '#fcf9f2';
  }, [viewMode]);

  return (
    <group position={[0, 0.1, -0.6]}>
      <pointLight intensity={12} distance={6} color={coreColor} />
      
      <Float floatIntensity={1.5} speed={1.2} rotationIntensity={0.5}>
        <mesh ref={innerRef} scale={1.1}>
          <dodecahedronGeometry args={[0.75, 0]} />
          <meshPhysicalMaterial
            transparent
            transmission={0.88}
            roughness={0.12}
            ior={1.45}
            thickness={1.1}
            clearcoat={1.0}
            clearcoatRoughness={0.08}
            color={innerColor}
            attenuationDistance={1.8}
            attenuationColor={coreColor}
          />
        </mesh>

        <mesh ref={outerRef} scale={1.24}>
          <dodecahedronGeometry args={[0.75, 0]} />
          <meshBasicMaterial
            color={coreColor}
            wireframe
            transparent
            opacity={0.32}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        <group position={[0, 0, 0]}>
          <mesh position={[-1.7, 0, 0]} scale={[0.1, 0.1, 0.1]}>
            <ringGeometry args={[0.8, 1, 4]} />
            <meshBasicMaterial color={coreColor} transparent opacity={0.3} wireframe />
          </mesh>
          <mesh position={[1.7, 0, 0]} scale={[0.1, 0.1, 0.1]}>
            <ringGeometry args={[0.8, 1, 4]} />
            <meshBasicMaterial color={coreColor} transparent opacity={0.3} wireframe />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

function PortalScene({ viewMode, active }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const p1Color = useMemo(() => {
    if (viewMode === 'dev') return '#00ffaa';
    if (viewMode === 'music') return '#ff3333';
    return '#9a84ff';
  }, [viewMode]);

  const p2Color = useMemo(() => {
    if (viewMode === 'dev') return '#00f2ff';
    if (viewMode === 'music') return '#e8bd72';
    return '#ffbf6e';
  }, [viewMode]);

  if (!active) {
    return <div className="mp-worldCanvas" style={{ background: '#050407' }} aria-hidden="true" />;
  }

  return (
    <div className="mp-worldCanvas" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 6.8], fov: 42 }} dpr={isMobile ? [1, 1] : [1, 1.25]} gl={{ antialias: false, powerPreference: "high-performance" }}>
        <color attach="background" args={['#050407']} />
        <fog attach="fog" args={['#050407', 7, 13]} />
        <ambientLight intensity={0.9} />
        <pointLight position={[-4, 3, 4]} intensity={18} color={p1Color} />
        <pointLight position={[4, -3, 4]} intensity={16} color={p2Color} />
        
        {!isMobile && <TelemetryWavefield viewMode={viewMode} />}
        
        <SynthesisCore viewMode={viewMode} />
        
        <Sparkles count={isMobile ? 10 : 30} scale={[8, 4, 3]} size={1.0} speed={0.15} opacity={0.3} color={p2Color} />
        <Sparkles count={isMobile ? 5 : 15} scale={[7, 3.5, 2.5]} size={0.6} speed={0.2} opacity={0.2} color={p1Color} />
      </Canvas>
    </div>
  );
}


function ChapterHeader({ number, eyebrow, title, copy, triggerSound }) {
  return (
    <div className="mp-chapterHeader">
      <span>{number}</span>
      <div>
        <p className="mp-eyebrow">{eyebrow}</p>
        <h2><SpellText text={title} triggerSound={triggerSound} /></h2>
        {copy && <p>{copy}</p>}
      </div>
    </div>
  );
}

function ArcaneField({ y, rotate }) {
  return (
    <motion.div className="mp-arcaneField" style={{ y, rotate }} aria-hidden="true">
      {arcaneGlyphs.map((glyph, index) => (
        <motion.span
          key={`${glyph}-${index}`}
          className={`mp-glyph mp-glyph--${index + 1}`}
          animate={{
            opacity: [0.18, 0.42, 0.18],
            scale: [0.92, 1.08, 0.92],
          }}
          transition={{
            duration: 3.8 + index * 0.55,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.28,
          }}
        >
          {glyph}
        </motion.span>
      ))}
    </motion.div>
  );
}

function MagicCircuitBackground() {
  return (
    <div className="mp-magicCircuit" aria-hidden="true">
      <svg viewBox="0 0 800 800" className="circuit-svg">
        <defs>
          <radialGradient id="magmaCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4500" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#ff1a00" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#2c0c00" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#050407" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="magmaGlowRing" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#ff3c00" stopOpacity="0.24" />
            <stop offset="85%" stopColor="#ff8c00" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#050407" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="magmaGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff3300" />
            <stop offset="50%" stopColor="#ff7700" />
            <stop offset="100%" stopColor="#ffd700" />
          </linearGradient>
        </defs>

        {/* Static Background Glow (Cached once, zero CPU overhead) */}
        <circle cx="400" cy="400" r="350" fill="url(#magmaGlowRing)" />

        {/* Central Magma Core Reservoir */}
        <circle cx="400" cy="400" r="180" fill="url(#magmaCore)" className="magma-core-pulse" />

        {/* Rotational Circuit Ring 1: Runic Ticks & Outer Guides */}
        <g className="rotate-clockwise-slow">
          <circle cx="400" cy="400" r="320" stroke="url(#magmaGlow)" strokeWidth="1" fill="none" opacity="0.35" strokeDasharray="5,15" />
          <circle cx="400" cy="400" r="300" stroke="url(#magmaGlow)" strokeWidth="1.2" fill="none" opacity="0.45" strokeDasharray="1,6" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 400 + 290 * Math.cos(angle);
            const y1 = 400 + 290 * Math.sin(angle);
            const x2 = 400 + 310 * Math.cos(angle);
            const y2 = 400 + 310 * Math.sin(angle);
            return (
              <line key={`tick1-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#magmaGlow)" strokeWidth="1.5" opacity="0.4" />
            );
          })}
        </g>

        {/* Rotational Circuit Ring 2: The Core Triangles */}
        <g className="rotate-counter-clockwise">
          <polygon points="400,160 608,520 192,520" stroke="url(#magmaGlow)" strokeWidth="1" fill="none" opacity="0.4" />
          <polygon points="400,640 192,280 608,280" stroke="url(#magmaGlow)" strokeWidth="1" fill="none" opacity="0.4" />
          <circle cx="400" cy="400" r="240" stroke="url(#magmaGlow)" strokeWidth="1.8" fill="none" opacity="0.55" strokeDasharray="40,20,10,20" />
        </g>

        {/* Rotational Circuit Ring 3: Fine Inner Circles & Tech Rails */}
        <g className="rotate-clockwise-fast">
          <circle cx="400" cy="400" r="140" stroke="url(#magmaGlow)" strokeWidth="0.8" fill="none" opacity="0.4" strokeDasharray="20,10" />
          <circle cx="400" cy="400" r="130" stroke="url(#magmaGlow)" strokeWidth="0.6" fill="none" opacity="0.25" />
          <circle cx="400" cy="400" r="90" stroke="url(#magmaGlow)" strokeWidth="1.2" fill="none" opacity="0.6" strokeDasharray="4,4" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const x1 = 400 + 90 * Math.cos(angle);
            const y1 = 400 + 90 * Math.sin(angle);
            const x2 = 400 + 130 * Math.cos(angle);
            const y2 = 400 + 130 * Math.sin(angle);
            return (
              <line key={`spike-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#magmaGlow)" strokeWidth="0.8" opacity="0.5" />
            );
          })}
        </g>

        {/* Rotational Circuit Ring 4: Outer Ring with detailed brackets */}
        <g className="rotate-clockwise-slow">
          <circle cx="400" cy="400" r="360" stroke="url(#magmaGlow)" strokeWidth="0.5" fill="none" opacity="0.2" />
          {Array.from({ length: 4 }).map((_, i) => {
            const angle = (i * 90 * Math.PI) / 180;
            const x1 = 400 + 355 * Math.cos(angle - 0.05);
            const y1 = 400 + 355 * Math.sin(angle - 0.05);
            const x2 = 400 + 365 * Math.cos(angle - 0.05);
            const y2 = 400 + 365 * Math.sin(angle - 0.05);
            const mx1 = 400 + 365 * Math.cos(angle - 0.05);
            const my1 = 400 + 365 * Math.sin(angle - 0.05);
            const mx2 = 400 + 365 * Math.cos(angle + 0.05);
            const my2 = 400 + 365 * Math.sin(angle + 0.05);
            const bx1 = 400 + 365 * Math.cos(angle + 0.05);
            const by1 = 400 + 365 * Math.sin(angle + 0.05);
            const bx2 = 400 + 355 * Math.cos(angle + 0.05);
            const by2 = 400 + 355 * Math.sin(angle + 0.05);
            return (
              <g key={`bracket-${i}`}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#magmaGlow)" strokeWidth="1.2" opacity="0.5" />
                <path d={`M ${mx1} ${my1} A 365 365 0 0 1 ${mx2} ${my2}`} fill="none" stroke="url(#magmaGlow)" strokeWidth="1.2" opacity="0.5" />
                <line x1={bx1} y1={by1} x2={bx2} y2={by2} stroke="url(#magmaGlow)" strokeWidth="1.2" opacity="0.5" />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

function ScrollTelemetry({ activeSection }) {
  const chapters = {
    'GATE': '01 GATE',
    'RESONANCE': '02 RESONANCE',
    'ARSENAL': '03 ARSENAL',
    'PROJECTS': '04 PROJECTS',
    'MUSIC': '05 MUSIC',
    'SIGNAL': '06 SIGNAL'
  };
  const currentChapter = chapters[activeSection] || '01 GATE';

  return (
    <div className="mp-navSig">
      <span className="telemetry-label">CURRENT NODE</span>
      <span className="telemetry-value pulse-glow">{currentChapter}</span>
    </div>
  );
}

function SignalThreadNav({ activeSection }) {
  const sectionOffsets = {
    'GATE': 8,
    'RESONANCE': 52.8,
    'ARSENAL': 97.6,
    'PROJECTS': 142.4,
    'MUSIC': 187.2,
    'SIGNAL': 232
  };
  const targetY = sectionOffsets[activeSection] || 8;

  const sections = [
    { label: 'GATE', href: '#gate' },
    { label: 'RESONANCE', href: '#worlds' },
    { label: 'ARSENAL', href: '#dev-stack-section' },
    { label: 'PROJECTS', href: '#archive' },
    { label: 'MUSIC', href: '#music-terminal' },
    { label: 'SIGNAL', href: '#signal' },
  ];

  return (
    <nav className="signal-thread-nav" aria-label="Side navigation thread">
      <div className="thread-line">
        <motion.div 
          className="thread-progress-bead" 
          animate={{ y: targetY }}
          transition={{ type: 'spring', stiffness: 140, damping: 22, mass: 0.8 }}
        />
      </div>
      <div className="thread-nodes">
        {sections.map((sect) => (
          <a
            key={sect.label}
            href={sect.href}
            className={`thread-node ${activeSection === sect.label ? 'is-active' : ''}`}
            aria-label={`Scroll to ${sect.label}`}
          >
            <span className="node-dot" />
            <span className="node-tooltip">{sect.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function HeroTechHUD() {
  return (
    <div className="mp-heroTechHUD" aria-hidden="true">
      <div className="hud-corner hud-tl" />
      <div className="hud-corner hud-tr" />
      <div className="hud-corner hud-bl" />
      <div className="hud-corner hud-br" />
      <div className="hud-axes" />
      <span className="hud-label-left">SYS BOOT • STATUS OK</span>
      <span className="hud-label-right">RESONANCE SCAN • v4.0.0</span>
    </div>
  );
}


function PortalCard({ mode, title, text, onClick, image, meta, triggerSound }) {
  return (
    <motion.article
      className={`mp-portalCard mp-portalCard--${mode}`}
      onPointerMove={handlePointerGlow}
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 190, damping: 20 }}
      style={{ cursor: 'pointer' }}
    >
      <div className="mp-portalImage" style={{ backgroundImage: `url("${image}")` }} aria-hidden="true" />
      <div className="mp-portalScrim" />
      <div className="mp-portalMeta">
        {meta.map((item) => <span key={item}>{item}</span>)}
      </div>
      <div className="mp-portalCopy">
        <p>{mode === 'dev' ? '01 / SYSTEMS' : '02 / MUSIC'}</p>
        <h3><SpellText text={title} triggerSound={triggerSound} /></h3>
        <span>{text}</span>
      </div>
    </motion.article>
  );
}

function VinylPlayer({ soundOn }) {
  const recordRef = useRef(null);
  const rotationRef = useRef(0);
  const speedRef = useRef(0);
  const armAngle = soundOn ? 85 : 22;

  useEffect(() => {
    let frameId;

    const animate = () => {
      if (soundOn) {
        // Accelerate to target speed of 3.0 deg/frame (about 3.2s per rotation at 60fps)
        speedRef.current += (3.0 - speedRef.current) * 0.05;
      } else {
        // Decelerate smoothly using friction
        speedRef.current *= 0.97;
        if (speedRef.current < 0.01) speedRef.current = 0;
      }

      if (speedRef.current > 0) {
        rotationRef.current = (rotationRef.current + speedRef.current) % 360;
        if (recordRef.current) {
          recordRef.current.style.transform = `rotate(${rotationRef.current.toFixed(2)}deg)`;
        }
        frameId = requestAnimationFrame(animate);
      } else {
        frameId = null;
      }
    };

    if (soundOn || speedRef.current > 0) {
      frameId = requestAnimationFrame(animate);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [soundOn]);

  return (
    <div className="mp-vinylDeck">
      <div className="mp-vinylBase">
        <div ref={recordRef} className="mp-vinylRecord">
          <div className="mp-vinylLabel">
            <div className="mp-vinylLabelInner">
              <span>KB-RESONANCE</span>
              <span>LP v4.0</span>
            </div>
          </div>
          <div className="mp-vinylSpindle" />
          <div className="mp-vinylRing ring-1" />
          <div className="mp-vinylRing ring-2" />
          <div className="mp-vinylRing ring-3" />
        </div>
      </div>
      
      <div className="mp-vinylTonearmPivot">
        <motion.div 
          className="mp-vinylTonearm"
          animate={{ rotate: armAngle }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
          style={{ transformOrigin: '0px 0px', top: '11px', left: '11px' }}
        >
          <div className="mp-tonearmBar" />
          <div className="mp-tonearmWeight" />
          <div className="mp-tonearmNeedle" />
        </motion.div>
      </div>
    </div>
  );
}

function ResonanceTerminal({ soundOn }) {
  const [hoveredPlatform, setHoveredPlatform] = useState(null);
  const [tuningPercent, setTuningPercent] = useState(50);
  const [needleJitter, setNeedleJitter] = useState(0);

  useEffect(() => {
    let active = true;
    const updateJitter = () => {
      if (!active) return;
      setNeedleJitter((Math.random() - 0.5) * 1.5);
      setTimeout(updateJitter, 80 + Math.random() * 60);
    };
    updateJitter();
    return () => { active = false; };
  }, []);

  const targetRotation = ((tuningPercent - 50) / 50) * 22;
  const needleRotation = (hoveredPlatform ? targetRotation : -22) + (soundOn ? needleJitter * 2.0 : needleJitter * 0.4);

  const platforms = musicChannels;

  const handleLinkClick = (url) => {
    if (soundOn) {
      audioSynth.triggerChime(587.33);
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mp-resonanceTerminal">
      {/* Vacuum Tubes */}
      <div className="mp-vacuumTubes">
        <div className={`mp-vacuumTube ${soundOn ? 'glow-on' : ''}`}>
          <div className="tube-glass" />
          <div className="tube-filament" />
        </div>
        <div className={`mp-vacuumTube ${soundOn ? 'glow-on' : ''}`}>
          <div className="tube-glass" />
          <div className="tube-filament" />
        </div>
      </div>

      {/* Left: Mechanical Wood & Gold Radio Panel */}
      <div className="mp-antiqueRadio">
        {/* Skeuomorphic corner brass rivets/screws */}
        <div className="radio-screw top-left" />
        <div className="radio-screw top-right" />
        <div className="radio-screw bottom-left" />
        <div className="radio-screw bottom-right" />

        <div className="mp-radioGrid" />
        
        {/* Tuning Dial */}
        <div className="mp-radioTuningBand">
          <div className="mp-radioTicks">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i}>{88 + i * 2.5}</span>
            ))}
          </div>
          <motion.div 
            className="mp-radioNeedle"
            animate={{ left: `${tuningPercent}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          />
        </div>

        {/* Dynamic Waveform Visualizer Monitor */}
        <div className="mp-resonanceMonitor crt-screen">
          <div className="crt-glow" />
          <div className="crt-scanlines" />
          
          <div className="mp-monitorHeader">
            <div className="receiver-label">
              <span>RECEIVER • KB-96.3 MHz</span>
              <span className="receiver-status">STATUS: {soundOn ? 'RESONATING' : 'MUTE'}</span>
            </div>

            {/* LED Status array */}
            <div className="radio-leds">
              <div className="radio-led-group">
                <span className="led-label">PWR</span>
                <span className={`led-dot led-green ${soundOn ? 'is-active' : ''}`} />
              </div>
              <div className="radio-led-group">
                <span className="led-label">SIG</span>
                <span className={`led-dot led-amber ${hoveredPlatform ? 'is-active blink' : ''}`} />
              </div>
              <div className="radio-led-group">
                <span className="led-label">STEREO</span>
                <span className={`led-dot led-blue ${soundOn ? 'is-active' : ''}`} />
              </div>
              <div className="radio-led-group">
                <span className="led-label">TEMP</span>
                <span className={`led-dot led-orange ${soundOn ? 'is-active pulse' : ''}`} />
              </div>
            </div>
          </div>
          
          {/* Backlit Analogue VU Meter */}
          <div className="mp-vuMeter">
            <svg viewBox="0 0 100 48" className="vu-gauge">
              {/* Backlit glow path */}
              <path d="M 19.9,33.1 A 32,32 0 0,1 80.1,33.1" fill="none" stroke="rgba(242, 207, 133, 0.15)" strokeWidth="3" />
              <path d="M 19.9,33.1 A 32,32 0 0,1 80.1,33.1" fill="none" stroke="#f2cf85" strokeWidth="1.2" strokeDasharray="2,2" opacity="0.6" />
              
              {/* Warning zone (Red line on the right) */}
              <path d="M 50,12 A 32,32 0 0,1 80.1,33.1" fill="none" stroke="#ff3300" strokeWidth="1.5" strokeDasharray="1,1" opacity="0.8" />

              {/* Ticks: Spaced precisely at 200, 235, 270, 305, 340 deg */}
              <line x1="19.9" y1="33.1" x2="23.7" y2="34.4" stroke="#f2cf85" strokeWidth="1.2" opacity="0.8" />
              <line x1="31.6" y1="17.8" x2="33.9" y2="21.1" stroke="#f2cf85" strokeWidth="1" opacity="0.6" />
              <line x1="50.0" y1="12.0" x2="50.0" y2="16.0" stroke="#ffaa00" strokeWidth="1.5" opacity="0.9" />
              <line x1="68.4" y1="17.8" x2="66.1" y2="21.1" stroke="#f2cf85" strokeWidth="1" opacity="0.6" />
              <line x1="80.1" y1="33.1" x2="76.3" y2="34.4" stroke="#ff3300" strokeWidth="1.2" opacity="0.9" />

              {/* Monospace Labels */}
              <text x="50" y="36" className="vu-label" textAnchor="middle">SIGNAL STRENGTH</text>
              <text x="14.3" y="31.0" className="vu-label-sub" textAnchor="middle">-20</text>
              <text x="28.2" y="12.9" className="vu-label-sub" textAnchor="middle">-10</text>
              <text x="50.0" y="6.0" className="vu-label-sub label-gold" textAnchor="middle">0 dB</text>
              <text x="71.8" y="12.9" className="vu-label-sub" textAnchor="middle">+2</text>
              <text x="85.7" y="31.0" className="vu-label-sub label-red" textAnchor="middle">+4</text>
              
              {/* Needle rotating from bottom pivot (50, 44) to (50, 10) */}
              <motion.line 
                x1="50" y1="44" 
                x2="50" y2="10" 
                stroke="#ff3300" 
                strokeWidth="1.2"
                className="vu-needle"
                animate={{ rotate: needleRotation }}
                transition={{ type: 'spring', stiffness: 70, damping: 14 }}
              />
              <circle cx="50" cy="44" r="3.5" fill="#150f0c" stroke="#f2cf85" strokeWidth="1" />
              <circle cx="50" cy="44" r="1.5" fill="#f2cf85" />
            </svg>
            <div className="vu-glass-sheen" />
          </div>

          <div className="mp-monitorWaveform" aria-hidden="true">
            {Array.from({ length: 22 }).map((_, i) => {
              const delay = (i * 0.04).toFixed(2);
              const pseudoRandom = ((i * 9301 + 49297) % 233280) / 233280;
              const duration = (0.5 + pseudoRandom * 0.6).toFixed(2);
              return (
                <div 
                  key={i} 
                  className="mp-waveBar" 
                  style={{
                    height: '52%',
                    transformOrigin: 'bottom',
                    animation: `floatBar ${duration}s ease-in-out ${delay}s infinite alternate`
                  }}
                />
              );
            })}
          </div>

          <div className="mp-monitorFooter">
            <span>FREQ: {hoveredPlatform ? 'TUNED' : 'SCANNING'}</span>
            <span>DB: {hoveredPlatform ? '-9.0 dB' : '-14.2 dB'}</span>
            <span>MODE: RESONANCE_RITE</span>
          </div>
        </div>

        {/* Physical Rotary Knobs Controls */}
        <div className="radio-controls">
          <div className="radio-knob-container">
            <span className="knob-label">VOLUME</span>
            <div className={`radio-knob ${soundOn ? 'turned-on' : ''}`}>
              <div className="knob-marker" />
            </div>
            <span className="knob-value">{soundOn ? '7.5' : '0.0'}</span>
          </div>
          
          <div className="radio-knob-container">
            <span className="knob-label">TUNING</span>
            <div 
              className="radio-knob" 
              style={{ 
                transform: `rotate(${(tuningPercent - 50) * 3.6}deg)`,
                transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)' 
              }}
            >
              <div className="knob-marker" />
            </div>
            <span className="knob-value">{(88 + (tuningPercent / 100) * 20).toFixed(1)} MHz</span>
          </div>
        </div>
      </div>

      {/* Right: Vinyl Player & Streaming Platforms list */}
      <div className="mp-vinylAndLinks">
        <VinylPlayer soundOn={soundOn} />

        <div className="mp-resonanceGrid">
          {platforms.map((platform, idx) => (
            <button
              key={platform.name}
              onClick={() => handleLinkClick(platform.url)}
              className="mp-resonanceLink"
              onMouseEnter={() => {
                setHoveredPlatform(platform.name.toUpperCase());
                setTuningPercent(platform.tuning);
              }}
              onMouseLeave={() => {
                setHoveredPlatform(null);
                setTuningPercent(50);
              }}
              style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', width: '100%', fontInherit: 'inherit' }}
            >
              <div className="mp-resonanceLinkLeft">
                <span className="mp-resonanceLinkIndex">0{idx + 1}</span>
                <div>
                  <span className="mp-resonanceLinkLabel">{platform.name}</span>
                  <div style={{ fontSize: '0.62rem', opacity: 0.6, marginTop: '2px', fontWeight: 'normal', fontFamily: "'JetBrains Mono', monospace" }}>
                    {platform.desc}
                  </div>
                </div>
              </div>
              <div className="mp-resonanceLinkRight" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
                <span className="mp-resonanceLinkStatus">
                  [{platform.status}]
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArcaneBookCodex({ projectData, soundOn }) {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const bookContainerRef = useRef(null);
  
  // Dynamic sheet refs array using useRef
  const sheetRefs = useRef([]);
  sheetRefs.current = [];

  const coverRef = useRef(null);
  const outsideSpineRef = useRef(null);
  const insideSpineRef = useRef(null);

  const displayProjects = projectData && projectData.length > 0 ? projectData : projects;
  const bookProjects = displayProjects;

  const INDEX_ITEMS_PER_PAGE = 10;
  const indexChunks = [];
  for (let i = 0; i < bookProjects.length; i += INDEX_ITEMS_PER_PAGE) {
    indexChunks.push({
      chunk: bookProjects.slice(i, i + INDEX_ITEMS_PER_PAGE),
      startIndex: i
    });
  }

  const pagesList = [];
  let currentPageNumber = 1;

  if (indexChunks.length > 1) {
    for (let i = 1; i < indexChunks.length; i++) {
      pagesList.push({
        type: 'index',
        projects: indexChunks[i].chunk,
        startIndex: indexChunks[i].startIndex,
        pageNumber: currentPageNumber++
      });
    }
  }

  // Group projects into Chapters of 2
  const projectChapters = [];
  for (let i = 0; i < bookProjects.length; i += 2) {
    projectChapters.push(bookProjects.slice(i, i + 2));
  }

  // Add project pages
  projectChapters.forEach((chapter, index) => {
    pagesList.push({
      type: 'projects',
      projects: chapter,
      pageNumber: currentPageNumber++,
      chapterNumber: index + 1
    });
  });

  // Add Dynamic sealing page "The Pact"
  pagesList.push({
    type: 'end',
    pageNumber: currentPageNumber++
  });

  // Group pages into sheets (front & back)
  const bookSheets = [];
  for (let i = 0; i < pagesList.length; i += 2) {
    bookSheets.push({
      front: pagesList[i],
      back: pagesList[i + 1] || null
    });
  }

  const handleLinkClick = (url) => {
    if (soundOn) audioSynth.triggerChime(440.0);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const soundOnRef = useRef(soundOn);
  const allowSoundRef = useRef(false);
  const flippedRef = useRef([]);

  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  useEffect(() => {
    const timer = setTimeout(() => {
      allowSoundRef.current = true;
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const playTurnSound = (index) => {
    if (soundOnRef.current && allowSoundRef.current) {
      const notes = [220.00, 329.63, 440.00, 493.88];
      audioSynth.triggerChime(notes[index % 4]);
    }
  };

  const renderProjectSpread = (chapterProjects, pageNumber, chapterNumber) => (
    <div className="mp-parchmentPage project-ledger-page">
      <span className="page-number">{String(pageNumber).padStart(2, '0')}</span>
      <span className="page-project-kicker">PROJECT LEDGER {String(chapterNumber).padStart(2, '0')}</span>
      <div className="book-project-ledger">
        {chapterProjects.length > 0 ? chapterProjects.map((project, index) => (
          <article className="book-project-entry" key={project.projectId || `${project.title}-${index}`}>
            <span className="book-entry-number">
              {String(pageNumber).padStart(2, '0')}.{index + 1}
            </span>
            <h2>{project.title}</h2>
            <p>{project.desc || 'GitHub repository details are syncing.'}</p>
            <div className="book-project-actions">
              {project.link && (
                <button onClick={() => handleLinkClick(project.link)} className="book-text-btn">
                  LIVE
                </button>
              )}
              <button onClick={() => handleLinkClick(project.github || '#')} className="book-text-btn">
                SOURCE
              </button>
              <div className="page-tech-tags" style={{ marginLeft: 'auto' }}>
                {(project.tech || []).slice(0, 2).map(t => <span key={t}>{t}</span>)}
              </div>
            </div>
          </article>
        )) : (
          <article className="book-project-entry is-empty">
            <span className="book-entry-number">{String(pageNumber).padStart(2, '0')}.0</span>
            <h2>Awaiting Signal</h2>
            <p>More public repositories will appear here automatically when GitHub syncs.</p>
          </article>
        )}
      </div>
    </div>
  );

  const renderPage = (page) => {
    if (!page) {
      return (
        <div className="mp-parchmentPage book-empty-page">
          <div className="book-runes" style={{ margin: 'auto', fontSize: '1.2rem', color: 'rgba(139, 107, 61, 0.25)', letterSpacing: '4px' }}>
            ✦ ✧ ✦
          </div>
        </div>
      );
    }
    if (page.type === 'index') {
      return (
        <div className="mp-parchmentPage book-index project-ledger-page">
          <span className="page-number">{String(page.pageNumber).padStart(2, '0')}</span>
          <span className="page-project-kicker">THE INVENTORY (CONT.)</span>
          <ul className="book-index-list" style={{ maxHeight: 'none', marginTop: '24px' }}>
            {page.projects.map((project, idx) => {
              const actualIdx = page.startIndex + idx;
              return (
                <li key={project.projectId || `${project.title}-${actualIdx}`}>
                  {String(actualIdx + 1).padStart(2, '0')}. {project.title}
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
    if (page.type === 'projects') {
      return renderProjectSpread(page.projects, page.pageNumber, page.chapterNumber);
    }
    if (page.type === 'end') {
      return (
        <div className="mp-parchmentPage book-end">
          <h3>THE PACT</h3>
          <p>An ongoing record of systems, experiments, music, and creative exploration.</p>
          <div className="book-runes" style={{ margin: '30px 0', fontSize: '1.2rem', color: 'var(--mp-gold)', letterSpacing: '4px' }}>
            ✦ ✧ ✶ ✵ ✧ ✦
          </div>
          <div style={{ fontSize: '0.62rem', opacity: 0.5, fontFamily: "'JetBrains Mono', monospace" }}>
            ARCHIVE COMPILER • ACTIVE
          </div>
        </div>
      );
    }
    return null;
  };

  useGSAP(() => {
    if (!containerRef.current || !stickyRef.current || !bookContainerRef.current) return;

    const sheetsCount = bookSheets.length;
    flippedRef.current = new Array(sheetsCount + 1).fill(false);

    // Reset initial positions, transforms & Z-coordinates (no zIndex modifications to keep a single 3D context)
    gsap.set(bookContainerRef.current, { xPercent: -25 });
    
    const coverMaxZ = (sheetsCount + 1) * 2.5;
    gsap.set(coverRef.current, { rotateY: 0, z: coverMaxZ });
    
    sheetRefs.current.forEach((sheetEl, index) => {
      if (!sheetEl) return;
      const initialZ = (sheetsCount - index) * 2.5;
      gsap.set(sheetEl, { rotateY: 0, z: initialZ });
    });

    const outsideSpineEl = outsideSpineRef.current;
    const insideSpineEl = insideSpineRef.current;

    if (outsideSpineEl) gsap.set(outsideSpineEl, { opacity: 1 });
    if (insideSpineEl) gsap.set(insideSpineEl, { opacity: 0 });

    // Master ScrollTrigger timeline with pinning and snap
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        start: "top 80px",
        end: `+=${800 * (sheetsCount + 1)}`,
        scrub: 1.2, // Silkier scrub transition
        pinSpacing: true,
        invalidateOnRefresh: true,
        snap: {
          snapTo: "labels",
          duration: { min: 0.2, max: 0.8 },
          delay: 0.1,
          ease: "power2.inOut"
        }
      }
    });

    // Setup sequence with distinct snap labels
    tl.addLabel("closed", 0);

    // 1. Cover opens: Book centers and spine crossfades.
    tl.to(bookContainerRef.current, { xPercent: 0, ease: "power2.inOut", duration: 1.0 }, 0);

    if (outsideSpineEl) {
      tl.to(outsideSpineEl, { opacity: 0, ease: "power2.inOut", duration: 0.5 }, 0);
    }
    if (insideSpineEl) {
      tl.to(insideSpineEl, { opacity: 1, ease: "power2.inOut", duration: 0.5 }, 0);
    }

    // Cover page turns from 0 to -180 degrees using a single continuous ease, while z animates to the back of left stack
    tl.to(coverRef.current, { 
      rotateY: -180, 
      z: -coverMaxZ,
      ease: "power2.inOut", 
      duration: 1.0,
      onStart: () => {
        if (!flippedRef.current[0]) {
          flippedRef.current[0] = true;
          playTurnSound(0);
        }
      },
      onReverseComplete: () => {
        if (flippedRef.current[0]) {
          flippedRef.current[0] = false;
          playTurnSound(0);
        }
      }
    }, 0)
    .addLabel("page1", 1.0);

    // 2. Dynamic sheet flips
    sheetRefs.current.forEach((sheetEl, index) => {
      if (!sheetEl) return;
      const label = `page${index + 2}`;
      const startTime = 1.0 + index * 1.0;
      const zVal = (sheetsCount - index) * 2.5;
      
      tl.to(sheetEl, { 
        rotateY: -180, 
        z: -zVal,
        ease: "power2.inOut", 
        duration: 1.0,
        onStart: () => {
          if (!flippedRef.current[index + 1]) {
            flippedRef.current[index + 1] = true;
            playTurnSound((index + 1) % 4);
          }
        },
        onReverseComplete: () => {
          if (flippedRef.current[index + 1]) {
            flippedRef.current[index + 1] = false;
            playTurnSound((index + 1) % 4);
          }
        }
      }, startTime)
      .addLabel(label, startTime + 1.0);
    });

  }, { scope: containerRef, dependencies: [bookSheets.length] });

  const reversedSheets = [...bookSheets].reverse();

  return (
    <div ref={containerRef} className="mp-bookSection">
      <div ref={stickyRef} className="mp-bookSticky">
        <div ref={bookContainerRef} className="mp-bookContainer">
          <div ref={outsideSpineRef} className="mp-bookSpine" />
          <div ref={insideSpineRef} className="mp-bookSpine-inside" />
          
          <div className="mp-bookBackCover" style={{ transformStyle: 'preserve-3d' }}>
            <div className="mp-pageSide page-front" style={{ transform: 'translateZ(-1px)' }}>
              <div className="mp-parchmentPage book-end-cover">
                <div className="book-runes" style={{ margin: 'auto', fontSize: '1.2rem', color: 'rgba(139, 107, 61, 0.25)', letterSpacing: '4px' }}>
                  ✦ ✧ ✶ ✵ ✧ ✦
                </div>
              </div>
            </div>
          </div>

          {/* Render dynamic sheets (in reverse order for correct initial 3D layering) */}
          {reversedSheets.map((sheet, index) => {
            const originalIndex = bookSheets.length - 1 - index;
            return (
              <div 
                key={originalIndex}
                ref={el => { sheetRefs.current[originalIndex] = el; }}
                className="mp-bookSheet" 
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="mp-pageSide page-front" style={{ transform: 'translateZ(1px)' }}>
                  {renderPage(sheet.front)}
                </div>
                <div className="mp-pageSide page-back" style={{ transform: 'rotateY(180deg) translateZ(1px)' }}>
                  {renderPage(sheet.back)}
                </div>
              </div>
            );
          })}

          {/* Cover Sheet (always on top) */}
          <div 
            ref={coverRef}
            className="mp-bookSheet book-cover-sheet" 
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="mp-pageSide cover-front" style={{ transform: 'translateZ(1px)' }}>
              <div className="mp-bookCoverDesign">
                <div className="cover-filigree-border" />
                <div className="cover-corner top-left" />
                <div className="cover-corner top-right" />
                <div className="cover-corner bottom-left" />
                <div className="cover-corner bottom-right" />
                
                <div className="cover-magical-symbol">
                  <div className="symbol-outer-ring">
                    <svg viewBox="0 0 100 100" className="runic-text-path">
                      <path id="circlePath" d="M 50, 50 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" fill="none" />
                      <text>
                        <textPath href="#circlePath" startOffset="0%">
                          ✦ ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ✦ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ✦ ᛈ ᛉ ᛋ ᛏ ᛒ ✦ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ ✦
                        </textPath>
                      </text>
                    </svg>
                  </div>
                  <div className="symbol-inner-pentagram">
                    <svg viewBox="0 0 100 100">
                      <polygon points="50,12 19,87 91,40 9,40 81,87" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" />
                      <circle cx="50" cy="53" r="38" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mp-pageSide cover-back" style={{ transform: 'rotateY(180deg) translateZ(1px)' }}>
              <div className="mp-parchmentPage book-index">
                <h3>THE INVENTORY</h3>
                <p>An evolving archive of systems, tools, experiments, and creative builds.</p>
                <ul className="book-index-list" style={{ maxHeight: 'none' }}>
                  {(indexChunks[0]?.chunk || []).map((project, idx) => (
                    <li key={project.projectId || `${project.title}-${idx}`}>
                      {String(idx + 1).padStart(2, '0')}. {project.title}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: '40px', fontSize: '0.62rem', opacity: 0.5, fontFamily: "'JetBrains Mono', monospace" }}>
                  COMPILER: NODE_PROCESS • READY
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


export default function ModernPortfolio({ initialMode = 'synthesis', isMobileOverridden = false, onResetMobile }) {
  const viewMode = initialMode;
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [soundOn, setSoundOn] = useState(false);

  const scrollToSection = (selector) => {
    const target = document.querySelector(selector);
    if (target) {
      if (window.lenis) {
        window.lenis.scrollTo(target, { offset: -90, duration: 1.5 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  const [projectData, setProjectData] = useState(() => {
    try {
      const cached = localStorage.getItem('v6_github_cache');
      if (cached) {
        const { data } = JSON.parse(cached);
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // ignore
    }
    return getInitialProjects();
  });

  const [activeSection, setActiveSection] = useState('GATE');
  const [isHeroInView, setIsHeroInView] = useState(true);

  useEffect(() => {
    const gateEl = document.getElementById('gate');
    const gateObserver = new IntersectionObserver(([entry]) => {
      setIsHeroInView(entry.isIntersecting);
    }, { rootMargin: '100px 0px 100px 0px' });
    if (gateEl) gateObserver.observe(gateEl);
    return () => gateObserver.disconnect();
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    };

    const sectionsToObserve = [
      'gate',
      'worlds',
      'manifesto',
      'dev-stack-section',
      'archive',
      'music-terminal',
      'signal',
      'contact'
    ];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id === 'gate') {
            setActiveSection('GATE');
          } else if (id === 'worlds' || id === 'manifesto') {
            setActiveSection('RESONANCE');
          } else if (id === 'dev-stack-section') {
            setActiveSection('ARSENAL');
          } else if (id === 'archive') {
            setActiveSection('PROJECTS');
          } else if (id === 'music-terminal') {
            setActiveSection('MUSIC');
          } else if (id === 'signal' || id === 'contact') {
            setActiveSection('SIGNAL');
          }
        }
      });
    }, observerOptions);

    sectionsToObserve.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const shellRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.35 });
  const gateLift = useTransform(scrollYProgress, [0, 0.32], [0, -120]);
  const gateFade = useTransform(scrollYProgress, [0, 0.3], [1, 0.36]);
  const glyphY = useTransform(scrollYProgress, [0, 1], [-90, 260]);
  const glyphRotate = useTransform(scrollYProgress, [0, 1], [-8, 24]);
  const _sigilRotate = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const _sigilScale = useTransform(scrollYProgress, [0, 0.28], [1, 1.18]);
  const _sigilY = useTransform(scrollYProgress, [0, 0.28], [0, -54]);

  const glowRef = useRef(null);

  const toggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    if (nextState) {
      audioSynth.startDrone();
    } else {
      audioSynth.stopDrone();
    }
  };

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetchGitHubProfile(identity.githubUser).catch(() => null),
      fetchFeaturedRepos(identity.githubUser).catch(() => []),
    ]).then(([profileData, repoData]) => {
      if (!mounted) return;
      setProfile(profileData);
      setRepos(repoData);
    });

    const fetchGitHubData = async () => {
      const cacheKey = 'v6_github_cache';
      const cached = localStorage.getItem(cacheKey);
      const now = Date.now();

      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (now - timestamp < 3600000) {
            setProjectData(data);
            return;
          }
        } catch {
          // ignore
        }
      }

      try {
        const enriched = await enrichProjects();
        setProjectData(enriched);
        localStorage.setItem(cacheKey, JSON.stringify({ data: enriched, timestamp: now }));
      } catch {
        // ignore
      }
    };

    fetchGitHubData();

    return () => {
      mounted = false;
      audioSynth.stopDrone();
    };
  }, []);

  useEffect(() => {
    // Refresh ScrollTrigger at start and end of layout transitions
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 100);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 750);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [viewMode]);


  return (
    <main
      ref={shellRef}
      className="mp-shell"
      onPointerMove={(event) => {
        if (glowRef.current) {
          glowRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
        }
      }}
    >
      <div className="mp-cursorGlow" ref={glowRef} />
      <SEO
        title="Kuber Bassi | Software Architect & Music Producer"
        description="Portfolio of Kuber Bassi, a Software Architect & Music Producer crafting high-performance full-stack applications, automation systems, and original instrumentals."
        keywords="Kuber Bassi, Software Architect, Software Engineer, Music Producer, Full-Stack Developer, Systems Engineering, UI/UX Designer, React, Node, Web Development"
        ogType="website"
        url="https://kuberbassi.com/"
      />
      <CustomCursor />
      {isMobileOverridden && (
        <button 
          onClick={onResetMobile}
          className="mp-back-to-mobile-fab"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            background: 'rgba(5, 4, 7, 0.85)',
            border: '1px solid var(--color-accent-dev, #00ff88)',
            color: 'var(--color-light, #fefefe)',
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            fontSize: '11px',
            padding: '10px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 15px rgba(0, 255, 136, 0.25)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease',
          }}
        >
          <i className="fa-solid fa-mobile-screen-button"></i>
          <span>MOBILE PORTAL</span>
        </button>
      )}
      <motion.div className="mp-scrollProgress" style={{ scaleX: progress }} aria-hidden="true" />
      <ArcaneField y={glyphY} rotate={glyphRotate} />
      <SignalThreadNav activeSection={activeSection} />

      <nav className="mp-nav" aria-label="Primary navigation">
        <a className="mp-mark" href="#gate">
          <span className="mp-mark-sigil">✦</span>
          <span className="mp-mark-name">Kuber Bassi</span>
        </a>

        {/* Real-time scroll progress & active section telemetry */}
        <ScrollTelemetry activeSection={activeSection} />

        <div className="mp-navLinks">
          {navItems.map(([num, label, href]) => (
            <a 
              key={label} 
              href={href} 
              className={`nav-link-pill ${activeSection === label ? 'is-active' : ''}`}
            >
              <span className="nav-link-num">{num}</span>
              <span className="nav-link-text">{label}</span>
            </a>
          ))}
          
          {/* Sound Toggle Switch */}
          <button 
            onClick={toggleSound} 
            className={`nav-sound-btn ${soundOn ? 'is-active' : ''}`}
            aria-label="Toggle Drone Sound"
          >
            <em>SOUND {soundOn ? 'ON' : 'OFF'}</em>
            <span className={`led-dot led-green ${soundOn ? 'is-active' : ''}`} />
          </button>
        </div>
      </nav>

      <section className="mp-gate" id="gate">
        <PortalScene viewMode={viewMode} active={isHeroInView} />
        <MagicCircuitBackground />
        <HeroTechHUD />
        <div className="mp-gateShade" aria-hidden="true" />
        <motion.div className="mp-gateCopy" style={{ y: gateLift, opacity: gateFade }}>
          <p className="mp-kicker">A unified resonance portfolio • {identity.location}</p>
          <h1><SpellText text="Kuber Bassi" triggerSound={soundOn} /></h1>
          <p className="mp-gateLead">
            Systems and music folded into one resonance: code, sound, automation, and interface as disciplined sorcery.
          </p>
        </motion.div>
        
        <div className="mp-gateFooter">
          <div className="gate-scroll-hint">
            <span className="scroll-arrow">↓</span>
            <span>SCROLL TO UNVEIL</span>
          </div>
          <div className="gate-public-signals">
            <span className="signal-dot">●</span>
            <span>{profile?.public_repos || repos.length || 'Live'} PUBLIC SIGNALS</span>
            <span className="signal-rune">✧</span>
          </div>
        </div>
      </section>

      {/* Chapter 1: Portals Grid (Only visible in Synthesis mode) */}
      <section className="realm-section realm-visible mp-section" id="worlds">
        <ChapterHeader
          number="02A"
          eyebrow="Resonance"
          title="Current Domains."
          triggerSound={soundOn}
        />
        <div className="mp-portalGrid">
          <PortalCard
            mode="dev"
            title="Systems."
            text="Product engineering, AI-assisted tooling, and full-stack builds."
            onClick={() => { scrollToSection('#archive'); audioSynth.triggerChime(329.63); }}
            image="/assets/systems_card_bg.png"
            meta={['Engineering', 'Automation', 'AI']}
            triggerSound={soundOn}
          />
          <PortalCard
            mode="music"
            title="Music."
            text="Guitar, releases, cinematic atmosphere, and catalogue."
            onClick={() => { scrollToSection('#music-terminal'); audioSynth.triggerChime(493.88); }}
            image="/assets/music_card_bg.png"
            meta={['Guitar', 'Releases', 'Streaming']}
            triggerSound={soundOn}
          />
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="realm-section realm-visible mp-section" id="manifesto">
        <ChapterHeader
          number="02B"
          eyebrow="Inner Law"
          title="Structure, timing, precision, aura."
          triggerSound={soundOn}
        />
        <div className="mp-manifestoGrid">
          {identity.identityBridge.map((item, index) => (
            <motion.article
              key={item.label}
              onPointerMove={handlePointerGlow}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{item.label}</p>
              <h3>{item.title}</h3>
              <strong>{item.text}</strong>
            </motion.article>
          ))}
        </div>
      </section>

      {/* DEV MODE ONLY SECTIONS: Stack & 3D Project Carousel */}
      <section className="realm-section realm-visible" id="dev-stack-section" style={{ padding: '8rem 0 4rem' }}>
        <div className="v4-stackInner">
          <ChapterHeader
            number="03"
            eyebrow="Arsenal"
            title="The engineering arsenal."
            copy="Full-stack systems, AI-assisted workflows, automation, and interface-driven product design."
            triggerSound={soundOn}
          />
          
          <div className="v4-stackRow">
            <span className="v4-stackRowLabel">Languages</span>
            <div className="v4-stackPills">
              {[
                { name: "JavaScript", icon: "javascript/javascript-original.svg" },
                { name: "TypeScript", icon: "typescript/typescript-original.svg" },
                { name: "Python", icon: "python/python-original.svg" },
                { name: "C", icon: "c/c-original.svg" },
                { name: "HTML5", icon: "html5/html5-original.svg" },
                { name: "CSS3", icon: "css3/css3-original.svg" },
                { name: "SQL", icon: "postgresql/postgresql-original.svg" }
              ].map(tech => (
                <div className="v4-stackPill" key={tech.name}>
                  {tech.customIcon ? tech.customIcon : <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.icon}`} alt={tech.name} style={tech.style} loading="lazy" decoding="async" />}
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="v4-stackRow">
            <span className="v4-stackRowLabel">Frameworks &amp; Data</span>
            <div className="v4-stackPills">
              {[
                { name: "React", icon: "react/react-original.svg" },
                { name: "Node.js", icon: "nodejs/nodejs-original.svg" },
                { name: "Express", icon: "express/express-original.svg", style: { filter: "invert(1)" } },
                { name: "Flask", icon: "flask/flask-original.svg", style: { filter: "invert(1)" } },
                { name: "Supabase", icon: "supabase/supabase-original.svg" },
                { name: "MongoDB", icon: "mongodb/mongodb-original.svg" },
                { name: "PostgreSQL", icon: "postgresql/postgresql-original.svg" },
                { name: "Firebase", icon: "firebase/firebase-plain.svg" }
              ].map(tech => (
                <div className="v4-stackPill" key={tech.name}>
                  {tech.customIcon ? tech.customIcon : <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.icon}`} alt={tech.name} style={tech.style} loading="lazy" decoding="async" />}
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="v4-stackRow">
            <span className="v4-stackRowLabel">AI &amp; Automation</span>
            <div className="v4-stackPills">
              {[
                { 
                  name: "AI Agents", 
                  customIcon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="10" rx="2" />
                      <circle cx="12" cy="5" r="2" />
                      <path d="M12 7v4M8 15h.01M16 15h.01" />
                    </svg>
                  ) 
                },
                { 
                  name: "Prompt Engineering", 
                  customIcon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  ) 
                },
                { 
                  name: "Agentic Development", 
                  customIcon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  ) 
                },
                { 
                  name: "Automation Workflows", 
                  customIcon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M21 12H3M12 3v18" />
                    </svg>
                  ) 
                },
                { 
                  name: "n8n", 
                  customIcon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="6" r="3" />
                      <circle cx="18" cy="18" r="3" />
                      <line x1="9" y1="12" x2="15" y2="7.5" />
                      <line x1="9" y1="12" x2="15" y2="16.5" />
                    </svg>
                  ) 
                }
              ].map(tech => (
                <div className="v4-stackPill" key={tech.name}>
                  {tech.customIcon ? tech.customIcon : <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.icon}`} alt={tech.name} style={tech.style} loading="lazy" decoding="async" />}
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="v4-stackRow">
            <span className="v4-stackRowLabel">Infrastructure</span>
            <div className="v4-stackPills">
              {[
                { name: "Docker", icon: "docker/docker-original.svg" },
                { name: "Vercel", icon: "vercel/vercel-original.svg", style: { filter: "invert(1)" } },
                { name: "Git", icon: "git/git-original.svg" },
                { name: "GitHub", icon: "github/github-original.svg", style: { filter: "invert(1)" } },
                { name: "Cloudflare", icon: "cloudflare/cloudflare-original.svg" }
              ].map(tech => (
                <div className="v4-stackPill" key={tech.name}>
                  {tech.customIcon ? tech.customIcon : <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.icon}`} alt={tech.name} style={tech.style} loading="lazy" decoding="async" />}
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Synthesis & Dev Mode Project Codex: 3D Sorcery Book */}
      <section 
        className="realm-section realm-visible" 
        id="archive"
        style={{ padding: '4rem 0' }}
      >
        <div className="v4-stackInner">
          <ChapterHeader
            number="04"
            eyebrow="Projects"
            title="Auto-synced systems, sealed with proof."
            copy="An evolving archive of systems, tools, experiments, and creative builds. Every project is connected to its source, documented openly, and continuously updated through live repositories."
            triggerSound={soundOn}
          />
        </div>
        <ArcaneBookCodex projectData={projectData} soundOn={soundOn} />
      </section>

      {/* Synthesis & Music Mode: Resonance Terminal */}
      <section className="realm-section realm-visible" id="music-terminal" style={{ padding: '4rem 0' }}>
        <div className="v4-stackInner">
          <ChapterHeader
            number="05"
            eyebrow="Music"
            title="Broadcasts, frequencies, and sonic artifacts."
            copy="Every channel carries a different part of the signal: practice, performance, and expression."
            triggerSound={soundOn}
          />
        </div>
        <ResonanceTerminal soundOn={soundOn} />
      </section>

      {/* ── FOOTER — 06 SIGNAL ─────────────────────────── */}
      <footer className="mp-footer" id="signal">
        <ChapterHeader
          number="06"
          eyebrow="Signal"
          title="Build the next system. Shape the next resonance."
          copy="Software, music, automation, and design."
          triggerSound={soundOn}
        />

        <div className="mp-footerContent">
          {/* Contact — Codex index */}
          <nav className="mp-contactIndex" aria-label="Contact and social links">
            <a href={`mailto:${identity.email}`} className="mp-contactRow" id="contact-email">
              <span className="mp-contactNum">00</span>
              <span className="mp-contactCode">DIRECT</span>
              <span className="mp-contactIcon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="contact-svg-icon">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 6l-10 7L2 6" />
                  <circle cx="12" cy="13" r="3" strokeDasharray="3 3" />
                </svg>
              </span>
              <span className="mp-contactDest">{identity.email}</span>
              <span className="mp-contactRunes">᚛ ᚠ ᚢ ᚦ ᚜</span>
            </a>

            {[
              { 
                num: '01', 
                code: 'ARCHIVE',   
                label: 'GitHub',    
                href: 'https://github.com/kuberbassi', 
                runes: '᚛ ᚠ ᚢ ᚦ ᚜',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="contact-svg-icon">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    <circle cx="12" cy="12" r="10" strokeDasharray="2 4" opacity="0.5" />
                  </svg>
                )
              },
              { 
                num: '02', 
                code: 'NETWORK',   
                label: 'LinkedIn',  
                href: 'https://www.linkedin.com/in/kuberbassi/', 
                runes: '᚛ ᚹ ᚺ ᚾ ᚜',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="contact-svg-icon">
                    <circle cx="12" cy="5" r="3" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="18" r="3" />
                    <line x1="12" y1="8" x2="6" y2="15" />
                    <line x1="12" y1="8" x2="18" y2="15" />
                    <line x1="9" y1="18" x2="15" y2="18" strokeDasharray="2 2" />
                    <path d="M12 2a10 10 0 0 1 10 10" strokeDasharray="3 3" opacity="0.4" />
                    <path d="M12 22a10 10 0 0 1 -10 -10" strokeDasharray="3 3" opacity="0.4" />
                  </svg>
                )
              },
              { 
                num: '03', 
                code: 'SIGNAL',    
                label: 'Instagram', 
                href: 'https://www.instagram.com/kuber.bassi/', 
                runes: '᚛  ᛇ ᛈ ᚜',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="contact-svg-icon">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" />
                    <path d="M2 12a10 10 0 0 1 6-9" strokeDasharray="2 2" opacity="0.4" />
                    <path d="M22 12a10 10 0 0 1 -6 9" strokeDasharray="2 2" opacity="0.4" />
                  </svg>
                )
              },
              { 
                num: '04', 
                code: 'BROADCAST', 
                label: 'YouTube',   
                href: 'https://www.youtube.com/channel/UCcw12FyihnsK7TEHFBVHApw', 
                runes: '᚛ ᛖ ᛗ ᛚ ᚜',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="contact-svg-icon">
                    <polygon points="12,2 2,22 22,22" strokeDasharray="3 3" opacity="0.5" />
                    <polygon points="12,6 5,20 19,20" />
                    <polygon points="10,11 10,17 15,14" fill="currentColor" />
                  </svg>
                )
              },
            ].map(({ num, code, label, href, runes, icon }) => (
              <a key={code} href={href} target="_blank" rel="noreferrer" className="mp-contactRow" id={`contact-${code.toLowerCase()}`}>
                <span className="mp-contactNum">{num}</span>
                <span className="mp-contactCode">{code}</span>
                <span className="mp-contactIcon">{icon}</span>
                <span className="mp-contactDest">{label}</span>
                <span className="mp-contactRunes">{runes}</span>
              </a>
            ))}
          </nav>

          <div className="mp-footerRight">
            <div className="mp-astrolabeContainer">
              <svg viewBox="0 0 100 100" className="large-astrolabe-svg">
                <defs>
                  {/* Pulsing magical mana core gradient */}
                  <radialGradient id="manaGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffd875" stopOpacity="0.85" />
                    <stop offset="35%" stopColor="#d4af37" stopOpacity="0.5" />
                    <stop offset="70%" stopColor="#5c1818" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#120202" stopOpacity="0.9" />
                  </radialGradient>
                  
                  {/* Crystal outline sheen */}
                  <linearGradient id="crystalBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffe699" />
                    <stop offset="40%" stopColor="#8a6f27" />
                    <stop offset="70%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#5c1818" />
                  </linearGradient>
                </defs>

                {/* The Crystal Stone base body */}
                <circle cx="50" cy="50" r="43" fill="url(#manaGlow)" stroke="url(#crystalBorder)" strokeWidth="0.75" className="crystal-body" />
                
                {/* 3D Glass/Crystal convex light reflections */}
                <path d="M 15 50 A 35 35 0 0 1 85 50" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="1.2" fill="none" strokeLinecap="round" className="crystal-reflection" />
                <path d="M 20 50 A 30 30 0 0 1 80 50" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.6" fill="none" strokeLinecap="round" className="crystal-reflection" />

                {/* Outer orbital ring */}
                <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" className="ring-outer" />
                {/* Middle ring with ticks/markers */}
                <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.75" className="ring-middle" />
                {/* Inner ring */}
                <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2" className="ring-inner" />
                {/* Core ring */}
                <circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
                
                {/* Core axes */}
                <line x1="50" y1="2" x2="50" y2="98" stroke="currentColor" strokeWidth="0.25" opacity="0.3" />
                <line x1="2" y1="50" x2="98" y2="50" stroke="currentColor" strokeWidth="0.25" opacity="0.3" />
                
                {/* Intersecting diagonal vectors */}
                <line x1="16" y1="16" x2="84" y2="84" stroke="currentColor" strokeWidth="0.2" opacity="0.15" strokeDasharray="1 3" />
                <line x1="16" y1="84" x2="84" y2="16" stroke="currentColor" strokeWidth="0.2" opacity="0.15" strokeDasharray="1 3" />
                
                {/* Orbiting satellites */}
                <circle cx="50" cy="12" r="1.5" fill="currentColor" className="orbit-dot-1" />
                <circle cx="12" cy="50" r="1.2" fill="currentColor" className="orbit-dot-2" />
                <circle cx="50" cy="88" r="1" fill="currentColor" className="orbit-dot-3" />
                
                {/* Star Core under-glow */}
                <circle cx="50" cy="50" r="7" fill="#ffe29a" opacity="0.6" className="star-core-glow" />

                {/* Faceted 3D Crystal Star Core */}
                <g className="astrolabe-star">
                  {/* Top-Right Facet (Light Gold) */}
                  <polygon points="50,50 50,32 68,50" fill="#fff1c5" opacity="0.95" />
                  {/* Bottom-Right Facet (Dark Gold) */}
                  <polygon points="50,50 68,50 50,68" fill="#b8862e" opacity="0.95" />
                  {/* Bottom-Left Facet (Mid Gold) */}
                  <polygon points="50,50 50,68 32,50" fill="#9b7123" opacity="0.95" />
                  {/* Top-Left Facet (Extra Light Gold) */}
                  <polygon points="50,50 32,50 50,32" fill="#ffe29a" opacity="0.95" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </footer>

      {/* ── END SCREEN — Final seal ──────────────────── */}
      <div className="mp-endScreen" aria-hidden="true">
        <span className="mp-endLabel">Signal remains active.</span>
        <div className="mp-endName">
          <span className="mp-endLine">KUBER BASSI</span>
          <span className="mp-endLine">ARCHIVE CLOSED.</span>
        </div>
      </div>

    </main>
  );
}
