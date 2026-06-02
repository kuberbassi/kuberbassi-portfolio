import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function makeRibbon(seed, color) {
  const points = [];
  for (let i = 0; i < 72; i += 1) {
    const p = i / 71;
    const x = (p - 0.5) * 7.8;
    const y = Math.sin(p * Math.PI * 2 + seed) * 0.22;
    const z = Math.cos(p * Math.PI * 2 + seed) * 0.34;
    points.push(new THREE.Vector3(x, y, z));
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, 160, 0.012, 8, false);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.34,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = { seed };
  return mesh;
}

function KuberGravityField() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 8.4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.55));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const ribbons = [makeRibbon(0.2, 0x3b82f6), makeRibbon(2.6, 0xf0b45a)];

    ribbons.forEach((ribbon, index) => {
      ribbon.rotation.z = -0.08 + index * 0.12;
      ribbon.position.y = -0.26 + index * 0.52;
      ribbon.position.z = -0.3 - index * 0.16;
      root.add(ribbon);
    });

    const particleCount = 44;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const palette = [new THREE.Color(0xf0b45a), new THREE.Color(0x3b82f6), new THREE.Color(0xe85d75), new THREE.Color(0x54d6a7)];

    for (let i = 0; i < particleCount; i += 1) {
      const band = i % 4;
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 1.8 + (i % 11) * 0.1;
      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 1.6;
      positions[i * 3 + 1] = Math.sin(angle * 0.8) * 0.8 + (Math.random() - 0.5) * 1.1;
      positions[i * 3 + 2] = -1.2 + Math.sin(angle) * 0.8;
      colors[i * 3] = palette[band].r;
      colors[i * 3 + 1] = palette[band].g;
      colors[i * 3 + 2] = palette[band].b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        size: 0.028,
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      })
    );
    root.add(particles);

    const core = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.58, 0.095, 130, 14, 2, 3),
      new THREE.MeshStandardMaterial({
        color: 0x0b0b0d,
        emissive: 0x16100a,
        metalness: 0.78,
        roughness: 0.22,
      })
    );
    core.position.set(1.82, -0.16, -0.35);
    root.add(core);

    const coreWire = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.64, 0.0035, 130, 8, 2, 3),
      new THREE.MeshBasicMaterial({ color: 0xf0b45a, transparent: true, opacity: 0.36 })
    );
    coreWire.position.copy(core.position);
    root.add(coreWire);

    const light = new THREE.PointLight(0xffddaa, 20, 14);
    light.position.set(2.5, 1.4, 4.5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.78));

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    function resize() {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(320, rect.width);
      const height = Math.max(320, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function animate(time = 0) {
      const t = time * 0.001;
      root.rotation.y = pointer.x * 0.08 + Math.sin(t * 0.18) * 0.05;
      root.rotation.x = -pointer.y * 0.05 + Math.sin(t * 0.22) * 0.035;

      ribbons.forEach((ribbon, index) => {
        ribbon.rotation.x = Math.sin(t * 0.3 + index) * 0.08;
        ribbon.rotation.y = t * (0.035 + index * 0.008);
      ribbon.material.opacity = 0.22 + Math.sin(t * 0.9 + index) * 0.08;
      });

      particles.rotation.y = -t * 0.045;
      particles.rotation.z = Math.sin(t * 0.2) * 0.04;
      core.rotation.x = t * 0.42;
      core.rotation.y = t * 0.28;
      coreWire.rotation.copy(core.rotation);

      renderer.render(scene, camera);
      if (!reducedMotion) requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      ribbons.forEach((ribbon) => {
        ribbon.geometry.dispose();
        ribbon.material.dispose();
      });
      particleGeometry.dispose();
      particles.material.dispose();
      core.geometry.dispose();
      core.material.dispose();
      coreWire.geometry.dispose();
      coreWire.material.dispose();
    };
  }, []);

  return <div ref={mountRef} className="mp-gravityField" aria-hidden="true" />;
}

export default KuberGravityField;
