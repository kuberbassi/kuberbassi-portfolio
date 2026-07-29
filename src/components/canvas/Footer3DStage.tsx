import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Footer3DStage() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 240;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060606, 0.25);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 50);
    camera.position.set(0, 1.8, 3.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Geometry: Dense landscape wireframe plane
    const geometry = new THREE.PlaneGeometry(10, 5, 80, 40);
    
    // Deform plane vertices to form natural topographic mountain ridges
    const posAttr = geometry.attributes.position;
    const initialZ: number[] = [];

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      
      const z = Math.sin(x * 1.2) * Math.cos(y * 1.5) * 0.45 +
                Math.sin(x * 2.8 + y * 2.0) * 0.18 +
                Math.cos(x * 0.5) * 0.3;
                
      posAttr.setZ(i, z);
      initialZ.push(z);
    }
    geometry.computeVertexNormals();

    // Wireframe material with champagne gold glow
    const material = new THREE.MeshStandardMaterial({
      color: 0xd5b27e,
      wireframe: true,
      emissive: 0x221a0f,
      roughness: 0.3,
      metalness: 0.8,
      transparent: true,
      opacity: 0.75,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI * 0.42;
    mesh.position.y = -0.5;
    scene.add(mesh);

    // Horizon line glow ring
    const ringGeo = new THREE.TorusGeometry(3.5, 0.015, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd5b27e, transparent: true, opacity: 0.35 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI * 0.5;
    ringMesh.position.set(0, -0.6, -1);
    scene.add(ringMesh);

    // Warm champagne horizon light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const horizonLight = new THREE.PointLight(0xd5b27e, 4.0, 10);
    horizonLight.position.set(0, 2, -1);
    scene.add(horizonLight);

    // Floating particles
    const particleCount = 45;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      pPositions[i] = (Math.random() - 0.5) * 8;
      pPositions[i + 1] = Math.random() * 2 - 0.5;
      pPositions[i + 2] = (Math.random() - 0.5) * 4;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0xd5b27e,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
    });
    const particleSystem = new THREE.Points(pGeo, pMat);
    scene.add(particleSystem);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    container.addEventListener('pointermove', handlePointerMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 240;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();

      // Animate terrain mesh vertices smoothly over time
      const positions = geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const origZ = initialZ[i];
        
        const wave = Math.sin(x * 2.0 + t * 1.2) * 0.08 + Math.cos(y * 2.0 + t * 0.8) * 0.08;
        positions.setZ(i, origZ + wave);
      }
      positions.needsUpdate = true;

      // Mouse tilt reaction
      mesh.rotation.z = Math.sin(t * 0.3) * 0.04 + mouseX * 0.12;
      mesh.rotation.x = -Math.PI * 0.42 + mouseY * 0.08;
      particleSystem.rotation.y = t * 0.05;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animId);
      geometry.dispose();
      material.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="footer-3d-stage relative w-full h-[220px] overflow-hidden pointer-events-auto cursor-pointer"
      aria-label="3D Interactive Topographic Horizon Stage"
    />
  );
}
