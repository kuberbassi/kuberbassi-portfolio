import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

export function CanvasHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvas2dRef = useRef<HTMLCanvasElement | null>(null);
  const chargeRef = useRef(0);
  const mouseRef = useRef({ x: -1000, y: -1000, normX: 0, normY: 0, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const [isCharging, setIsCharging] = useState(false);

  // Three.js 3D WebGL Monolith Scene with Chrome & Perspective Grid Floor
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030303, 0.08);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    container.appendChild(renderer.domElement);

    // ── 3D WebGL Horizon Grid Floor (Spatial Perspective Depth) ────────────
    const gridHelper = new THREE.GridHelper(30, 30, 0x10b981, 0x0f2d22);
    gridHelper.position.set(0, -2.2, -2);
    gridHelper.rotation.x = 0.15;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.35;
    scene.add(gridHelper);

    // ── Main Monolith: Luminous Metallic Chrome Torus Knot ──────────────────
    const geometry = new THREE.TorusKnotGeometry(0.9, 0.3, 128, 32);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x14281e,
      emissive: 0x02160d,
      metalness: 0.95,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 1.0,
    });

    const mesh = new THREE.Mesh(geometry, material);
    const posX = width > 768 ? 1.7 : 0;
    const posY = width > 768 ? 0 : 0.3;
    mesh.position.set(posX, posY, 0);
    scene.add(mesh);

    // ── Dual Glowing Orbit Rings for Depth ──────────────────────────────────
    const ringGeo1 = new THREE.TorusGeometry(1.65, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.5 });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.position.set(posX, posY, -0.2);
    scene.add(ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(1.9, 0.015, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.25 });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.position.set(posX, posY, -0.4);
    ringMesh2.rotation.x = Math.PI / 4;
    scene.add(ringMesh2);

    // ── Floating 3D Shards for Perspective Depth ───────────────────────────
    const shardGroup = new THREE.Group();
    const shardGeo = new THREE.OctahedronGeometry(0.12, 0);
    const shardMat = new THREE.MeshPhysicalMaterial({
      color: 0x34d399,
      emissive: 0x0a3826,
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 0.8,
    });

    const shardCount = 12;
    for (let i = 0; i < shardCount; i++) {
      const shard = new THREE.Mesh(shardGeo, shardMat);
      const radius = 2.2 + Math.random() * 1.5;
      const angle = (i / shardCount) * Math.PI * 2;
      shard.position.set(
        posX + Math.cos(angle) * radius,
        posY + (Math.random() - 0.5) * 2.5,
        (Math.random() - 0.5) * 3
      );
      shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      shardGroup.add(shard);
    }
    scene.add(shardGroup);

    // ── Luminous Lighting System ───────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Key Specular Spotlight
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(-4, 6, 6);
    scene.add(keyLight);

    // Emerald Core Light
    const emeraldLight = new THREE.PointLight(0x10b981, 7.0, 15);
    emeraldLight.position.set(posX, posY, 1.2);
    scene.add(emeraldLight);

    // Cyan Rim Light
    const cyanLight = new THREE.PointLight(0x06b6d4, 5.0, 14);
    cyanLight.position.set(posX + 2, posY - 2, 2);
    scene.add(cyanLight);

    // Back Light
    const backLight = new THREE.PointLight(0x34d399, 4.0, 10);
    backLight.position.set(posX - 2, posY + 2, -2);
    scene.add(backLight);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      const newX = w > 768 ? 1.7 : 0;
      const newY = w > 768 ? 0 : 0.3;

      mesh.position.set(newX, newY, 0);
      ringMesh1.position.set(newX, newY, -0.2);
      ringMesh2.position.set(newX, newY, -0.4);
      emeraldLight.position.set(newX, newY, 1.2);
      cyanLight.position.set(newX + 2, newY - 2, 2);
      backLight.position.set(newX - 2, newY + 2, -2);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let targetRotX = 0;
    let targetRotY = 0;

    const animate = () => {
      const scrollY = window.scrollY || 0;
      const scrollRatio = scrollY / (document.body.scrollHeight || 1);

      // Smooth mesh rotation & scroll-linked camera zoom
      mesh.rotation.x += 0.007 + scrollRatio * 0.02;
      mesh.rotation.y += 0.01 + scrollRatio * 0.03;

      ringMesh1.rotation.z -= 0.005;
      ringMesh2.rotation.z += 0.003;
      shardGroup.rotation.y += 0.004;

      // Scroll zoom shift
      camera.position.z = 6.5 - Math.min(scrollRatio * 3, 2.5);

      // Mouse tilt reaction
      targetRotX = mouseRef.current.normY * 0.45;
      targetRotY = mouseRef.current.normX * 0.45;

      mesh.rotation.x += (targetRotX - mesh.rotation.x) * 0.06;
      mesh.rotation.y += (targetRotY - mesh.rotation.y) * 0.06;

      // Pulse lighting when charged
      emeraldLight.intensity = 7.0 + chargeRef.current * 10.0;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      shardGeo.dispose();
      shardMat.dispose();
      gridHelper.dispose();
      renderer.dispose();
    };
  }, []);

  // 2D Canvas Lightning & Particle Overlay
  useEffect(() => {
    const canvas = canvas2dRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const count = Math.min(Math.floor(canvas.width / 16), 75);
      const particles: Particle[] = [];
      const colors = ['#10b981', '#34d399', '#ffffff', '#06b6d4'];

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.5 + 0.25,
        });
      }
      particlesRef.current = particles;
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const mouse = mouseRef.current;

      if (chargeRef.current > 0) {
        chargeRef.current = Math.min(chargeRef.current + 0.04, 1);
      }

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + (chargeRef.current * (Math.random() - 0.5) * 4);
        p.y += p.vy + (chargeRef.current * (Math.random() - 0.5) * 4);

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (1 + chargeRef.current), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Connect particles near mouse
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 180 + chargeRef.current * 100;

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            if (dist < 80) {
              const midX = (p.x + mouse.x) / 2 + (Math.random() - 0.5) * 12;
              const midY = (p.y + mouse.y) / 2 + (Math.random() - 0.5) * 12;
              ctx.lineTo(midX, midY);
            }
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = '#10b981';
            ctx.globalAlpha = (1 - dist / maxDist) * 0.4 + (chargeRef.current * 0.4);
            ctx.lineWidth = dist < 60 ? 1.5 : 0.6;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current = {
      x,
      y,
      normX: (x / rect.width) * 2 - 1,
      normY: -(y / rect.height) * 2 + 1,
      active: true,
    };
  };

  const handlePointerLeave = () => {
    mouseRef.current.active = false;
  };

  const handlePointerDown = () => {
    setIsCharging(true);
    chargeRef.current = 0.1;
  };

  const handlePointerUp = () => {
    if (isCharging) {
      setIsCharging(false);
      chargeRef.current = 1.0;
      setTimeout(() => {
        chargeRef.current = 0;
      }, 400);
    }
  };

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden select-none"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      data-cursor="TOUCH"
    >
      {/* Three.js 3D Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* 2D Lightning & Particles Overlay */}
      <canvas ref={canvas2dRef} className="absolute inset-0 z-1 pointer-events-none block" />
    </div>
  );
}
