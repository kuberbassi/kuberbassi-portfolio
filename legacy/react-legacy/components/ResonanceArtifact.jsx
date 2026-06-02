import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function ResonanceArtifact() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const coreGeometry = new THREE.IcosahedronGeometry(1.24, 3);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x151515,
      roughness: 0.28,
      metalness: 0.52,
      transmission: 0.18,
      thickness: 0.8,
      clearcoat: 0.7,
      clearcoatRoughness: 0.22,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    root.add(core);

    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.34, 2),
      new THREE.MeshBasicMaterial({
        color: 0xf1d9a8,
        wireframe: true,
        transparent: true,
        opacity: 0.24,
      })
    );
    root.add(wire);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x2457ff,
      transparent: true,
      opacity: 0.38,
      side: THREE.DoubleSide,
    });

    const rings = [0, 1, 2].map((index) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.08 + index * 0.34, 0.008, 12, 140), ringMaterial.clone());
      ring.rotation.x = Math.PI / 2.5 + index * 0.28;
      ring.rotation.y = index * 0.7;
      root.add(ring);
      return ring;
    });

    const noteGeometry = new THREE.SphereGeometry(0.045, 16, 16);
    const nodeMaterials = [0x2457ff, 0x17a773, 0xc54a63, 0xf1d9a8].map(
      (color) => new THREE.MeshBasicMaterial({ color })
    );
    const nodes = [];

    for (let i = 0; i < 42; i += 1) {
      const node = new THREE.Mesh(noteGeometry, nodeMaterials[i % nodeMaterials.length]);
      const angle = (i / 42) * Math.PI * 2;
      const lane = i % 3;
      const radius = 2.08 + lane * 0.34;
      node.userData = {
        angle,
        lane,
        radius,
        speed: 0.22 + lane * 0.035,
        lift: Math.sin(i * 1.7) * 0.18,
      };
      root.add(node);
      nodes.push(node);
    }

    const wavePoints = [];
    const waveMaterial = new THREE.LineBasicMaterial({
      color: 0x17a773,
      transparent: true,
      opacity: 0.56,
    });
    const waveGeometry = new THREE.BufferGeometry();
    const wave = new THREE.Line(waveGeometry, waveMaterial);
    root.add(wave);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));

    function resize() {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(280, rect.width);
      const height = Math.max(280, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function renderFrame(time = 0) {
      const t = time * 0.001;
      root.rotation.y = t * 0.18;
      root.rotation.x = Math.sin(t * 0.45) * 0.08;
      core.rotation.y = t * 0.42;
      core.rotation.x = t * 0.24;
      wire.rotation.y = -t * 0.22;

      rings.forEach((ring, index) => {
        ring.rotation.z = t * (0.16 + index * 0.08);
        ring.material.opacity = 0.22 + Math.sin(t * 1.2 + index) * 0.08;
      });

      nodes.forEach((node) => {
        const { angle, lane, radius, speed, lift } = node.userData;
        const a = angle + t * speed;
        node.position.set(
          Math.cos(a) * radius,
          Math.sin(a * 2 + lane) * 0.18 + lift,
          Math.sin(a) * radius
        );
        node.scale.setScalar(0.72 + Math.sin(t * 2.3 + angle) * 0.18);
      });

      wavePoints.length = 0;
      for (let i = 0; i < 90; i += 1) {
        const x = -2.65 + (i / 89) * 5.3;
        const y = Math.sin(i * 0.34 + t * 2.4) * 0.12 + Math.sin(i * 0.12 - t) * 0.08;
        wavePoints.push(new THREE.Vector3(x, y - 1.92, 0.18));
      }
      waveGeometry.setFromPoints(wavePoints);

      renderer.render(scene, camera);
      if (!prefersReducedMotion) requestAnimationFrame(renderFrame);
    }

    resize();
    window.addEventListener('resize', resize);
    renderFrame();

    return () => {
      window.removeEventListener('resize', resize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      wire.geometry.dispose();
      wire.material.dispose();
      rings.forEach((ring) => {
        ring.geometry.dispose();
        ring.material.dispose();
      });
      noteGeometry.dispose();
      nodeMaterials.forEach((material) => material.dispose());
      waveGeometry.dispose();
      waveMaterial.dispose();
    };
  }, []);

  return (
    <div className="mp-artifact" aria-hidden="true">
      <div ref={mountRef} className="mp-artifactCanvas" />
      <div className="mp-artifactCaption">
        <span>KB resonance artifact</span>
        <strong>Systems orbiting sound</strong>
      </div>
    </div>
  );
}

export default ResonanceArtifact;

