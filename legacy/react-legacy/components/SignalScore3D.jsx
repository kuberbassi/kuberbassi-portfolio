import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

function Waveform() {
  const lineRef = useRef();
  const maxPoints = 100;
  
  const positions = useMemo(() => {
    return new Float32Array(maxPoints * 3);
  }, [maxPoints]);

  useFrame((state) => {
    if (lineRef.current) {
      const time = state.clock.elapsedTime;
      const positions = lineRef.current.geometry.attributes.position.array;
      for (let i = 0; i < maxPoints; i++) {
        const x = (i - maxPoints / 2) * 0.1;
        const y = Math.sin(i * 0.2 + time * 3) * Math.cos(time * 0.5) * 1.5;
        const z = Math.sin(i * 0.1 + time) * 1;
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      }
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={maxPoints} array={positions} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color="#3a6ff8" linewidth={2} transparent opacity={0.6} />
    </line>
  );
}

function GlassCube() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float floatIntensity={3} speed={2}>
      <mesh ref={meshRef}>
        <boxGeometry args={[3, 3, 3]} />
        <MeshTransmissionMaterial 
          thickness={1.5}
          roughness={0.2}
          transmission={1}
          ior={1.2}
          chromaticAberration={0.6}
          backside
          color="#121211"
        />
      </mesh>
    </Float>
  );
}

export default function SignalScore3D({ profile, projectCount, liveState }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;
    cardRef.current.style.setProperty('--mx', `${pctX}%`);
    cardRef.current.style.setProperty('--my', `${pctY}%`);

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      scale: 1.05,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 1000,
      transformOrigin: 'center center',
      boxShadow: '0 40px 100px rgba(59, 48, 34, 0.3)'
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
      boxShadow: '0 34px 90px rgba(59, 48, 34, 0.18)'
    });
  };

  return (
    <aside 
      ref={cardRef} 
      className="mp-score mp-hardware-tilt" 
      aria-label="Kuber Bassi signal score"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ overflow: 'hidden', position: 'relative' }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 0.8 }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 40 }} dpr={[1, 2]}>
          <ambientLight intensity={1} />
          <spotLight position={[10, 10, 10]} intensity={2} angle={0.2} penumbra={1} />
          <Environment preset="city" />
          <GlassCube />
          <Waveform />
        </Canvas>
      </div>

      <div style={{ position: 'relative', zIndex: 2, pointerEvents: 'none', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div className="mp-scoreHeader">
          <span>KB SIGNAL SCORE (WEBGL)</span>
          <span>{liveState === 'live' ? 'LIVE' : liveState === 'fallback' ? 'FALLBACK' : 'SYNCING'}</span>
        </div>

        <div className="mp-scoreStats" style={{ background: 'rgba(23, 23, 21, 0.6)', backdropFilter: 'blur(10px)' }}>
          <div style={{ background: 'transparent' }}>
            <strong>{profile?.public_repos || 'Auto'}</strong>
            <span>repos</span>
          </div>
          <div style={{ background: 'transparent', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <strong>{projectCount}</strong>
            <span>builds</span>
          </div>
          <div style={{ background: 'transparent' }}>
            <strong>3D</strong>
            <span>engine</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
