/**
 * LogoThreeScene — Organic Varying-Thickness Vertical Line Engraving ASCII Logo.
 * 
 * Features:
 *  - Thicker vertical lines with organic, non-uniform thickness variation across the logo
 *  - Zero idle animation — static, crisp, elegant in normal state
 *  - Interactive Hover Reaction: Nearby vertical lines shift dynamically UP and DOWN in opposing directions
 *  - Warm gold (#d5b27e), bronze (#a88d5e), and champagne (#f0eee9) theme
 *  - 100% transparent WebGL canvas with auto-fit camera
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ASCII_POINTS, AsciiPoint } from '../../data/asciiLogoData';

// ── Configuration Constants ───────────────────────────────────────────────────
const HOVER_RADIUS = 12.0;   // Mouse influence radius
const HOVER_Y_SHIFT = 3.2;   // Max vertical up/down displacement distance on hover

/** Canvas texture generator for organic vertical lines */
function createOrganicLineTexture(glowColor: string, lineColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 64, 256);

  // Soft ambient radial glow
  const grad = ctx.createRadialGradient(32, 128, 0, 32, 128, 75);
  grad.addColorStop(0, glowColor);
  grad.addColorStop(0.55, 'rgba(213, 178, 126, 0.12)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 256);

  // Draw solid vertical line capsule with thicker width (lineWidth = 26px)
  ctx.fillStyle = lineColor;
  ctx.shadowColor = '#d5b27e';
  ctx.shadowBlur = 3;

  const lineWidth = 26;
  const lineX = (64 - lineWidth) / 2;
  const lineY = 12;
  const lineH = 232;
  const radius = lineWidth / 2;

  ctx.beginPath();
  ctx.moveTo(lineX + radius, lineY);
  ctx.lineTo(lineX + lineWidth - radius, lineY);
  ctx.quadraticCurveTo(lineX + lineWidth, lineY, lineX + lineWidth, lineY + radius);
  ctx.lineTo(lineX + lineWidth, lineY + lineH - radius);
  ctx.quadraticCurveTo(lineX + lineWidth, lineY + lineH, lineX + lineWidth - radius, lineY + lineH);
  ctx.lineTo(lineX + radius, lineY + lineH);
  ctx.quadraticCurveTo(lineX, lineY + lineH, lineX, lineY + lineH - radius);
  ctx.lineTo(lineX, lineY + radius);
  ctx.quadraticCurveTo(lineX, lineY, lineX + radius, lineY);
  ctx.closePath();
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

export function LogoThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ── 1. Setup Scene & Renderer ─────────────────────────────────────────────
    const scene = new THREE.Scene();

    let w = container.clientWidth || 600;
    let h = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'low-power',
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.setClearColor(0x000000, 0); // 100% transparent canvas
    container.appendChild(renderer.domElement);

    // ── 2. All 816 Points & Bounding Box Calculation ─────────────────────────
    const points: AsciiPoint[] = ASCII_POINTS;

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    points.forEach((p) => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const logoW = maxX - minX; // ~33.6 units
    const logoH = maxY - minY; // ~44.0 units

    const updateCameraFit = () => {
      const aspect = w / h;
      camera.aspect = aspect;

      const fovRad = (camera.fov * Math.PI) / 180;
      const fitZHeight = (logoH / 2) / Math.tan(fovRad / 2);
      const fitZWidth  = (logoW / 2) / Math.tan(fovRad / 2) / aspect;

      // Fit camera Z with tight 1.04 margin for hero impact
      const targetZ = Math.max(fitZHeight, fitZWidth) * 1.04;
      camera.position.set(0, 0, Math.max(65, targetZ));
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };

    updateCameraFit();

    // ── 3. Thicker & Organic Line Palette ────────────────────────────────────
    const lineGroupMap: Record<number, { glow: string; color: string; scaleY: number; scaleX: number }> = {
      0: { glow: 'rgba(213, 178, 126, 0.10)', color: '#666054', scaleY: 0.70, scaleX: 0.65 }, // Muted edges
      1: { glow: 'rgba(232, 193, 140, 0.25)', color: '#a6967d', scaleY: 1.15, scaleX: 0.85 }, // Midtones
      2: { glow: 'rgba(213, 178, 126, 0.50)', color: '#d5b27e', scaleY: 1.75, scaleX: 1.05 }, // Signature gold
      3: { glow: 'rgba(255, 245, 230, 0.80)', color: '#f0eee9', scaleY: 2.25, scaleX: 1.25 }, // Highlights
    };

    const groupTextures: Record<number, THREE.CanvasTexture> = {
      0: createOrganicLineTexture(lineGroupMap[0].glow, lineGroupMap[0].color),
      1: createOrganicLineTexture(lineGroupMap[1].glow, lineGroupMap[1].color),
      2: createOrganicLineTexture(lineGroupMap[2].glow, lineGroupMap[2].color),
      3: createOrganicLineTexture(lineGroupMap[3].glow, lineGroupMap[3].color),
    };

    // ── 4. Group & Instanced Line Meshes with Organic Thickness ──────────────
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // Quad geometry with thicker width (0.54)
    const lineQuadGeo = new THREE.PlaneGeometry(0.54, 1.45);

    const groupedPoints: Record<number, { point: AsciiPoint; idx: number }[]> = {
      0: [], 1: [], 2: [], 3: [],
    };

    points.forEach((p, idx) => {
      const g = p.group in groupedPoints ? p.group : 2;
      groupedPoints[g].push({ point: p, idx });
    });

    const instancedMeshes: {
      mesh: THREE.InstancedMesh;
      items: {
        point: AsciiPoint;
        origX: number;
        origY: number;
        baseScaleX: number;
        baseScaleY: number;
        currentShiftY: number;
        currentScaleX: number;
        currentScaleY: number;
        upDownDirection: number; // 1 for UP, -1 for DOWN
      }[];
    }[] = [];

    const dummy = new THREE.Object3D();

    [0, 1, 2, 3].forEach((gKey) => {
      const items = groupedPoints[gKey];
      if (!items || items.length === 0) return;

      const groupConfig = lineGroupMap[gKey];

      const mat = new THREE.MeshBasicMaterial({
        map: groupTextures[gKey],
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.NormalBlending,
      });

      const mesh = new THREE.InstancedMesh(lineQuadGeo, mat, items.length);

      const meshItems = items.map(({ point }, i) => {
        const ox = point.x - centerX;
        const oy = point.y - centerY;

        dummy.position.set(ox, oy, 0);
        dummy.rotation.set(0, 0, 0);

        // Organic non-uniform thickness variation per line column
        const noise = Math.sin(point.x * 14.2 + point.y * 8.7);
        const organicWidthMult = 0.80 + (noise * 0.5 + 0.5) * 0.45; // 0.80x to 1.25x thickness variation

        const sx = groupConfig.scaleX * organicWidthMult;
        const sy = groupConfig.scaleY * (0.85 + (point.z / 3) * 0.35);

        dummy.scale.set(sx, sy, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);

        // Direction for up/down shift on hover (alternating & varied based on index)
        const upDownDirection = (i % 2 === 0 ? 1 : -1) * (0.8 + ((i * 7) % 5) * 0.2);

        return {
          point,
          origX: ox,
          origY: oy,
          baseScaleX: sx,
          baseScaleY: sy,
          currentShiftY: 0,
          currentScaleX: sx,
          currentScaleY: sy,
          upDownDirection,
        };
      });

      mesh.instanceMatrix.needsUpdate = true;
      logoGroup.add(mesh);
      instancedMeshes.push({ mesh, items: meshItems });
    });

    // ── 5. Mouse Interaction ──────────────────────────────────────────────────
    const mouse2D = new THREE.Vector3(9999, 9999, 0);
    const raycaster = new THREE.Raycaster();
    const mouseNdc = new THREE.Vector2(9999, 9999);
    const planeZ0 = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    let lastInteraction = 0;
    let animId = 0;

    const startAnimation = () => {
      lastInteraction = performance.now();
      if (!animId && !document.hidden) {
        animId = requestAnimationFrame(animate);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseNdc.x = (x / rect.width) * 2 - 1;
      mouseNdc.y = -(y / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseNdc, camera);
      const intersect = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(planeZ0, intersect)) {
        mouse2D.copy(intersect);
      }
      startAnimation();
    };

    const handleMouseLeave = () => {
      mouse2D.set(9999, 9999, 0);
      startAnimation();
      window.dispatchEvent(new CustomEvent('kb:logohover', { detail: false }));
    };

    const handleMouseEnter = () => {
      window.dispatchEvent(new CustomEvent('kb:logohover', { detail: true }));
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // ── 6. Resize Listener ───────────────────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      w = container.clientWidth;
      h = container.clientHeight;
      renderer.setSize(w, h);
      updateCameraFit();
      renderer.render(scene, camera);
    };

    window.addEventListener('resize', handleResize);

    // ── 7. Render Loop: Still in Normal State, Up/Down Displacement ONLY on Hover ─
    function animate() {
      animId = 0;
      if (document.hidden) return;

      // Normal state is completely still; lines ONLY react when hovered by mouse
      instancedMeshes.forEach(({ mesh, items }) => {
        let needsUpdate = false;

        items.forEach((item, i) => {
          const dx = item.origX - mouse2D.x;
          const dy = item.origY - mouse2D.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let targetShiftY = 0;
          let targetScaleX = item.baseScaleX;
          let targetScaleY = item.baseScaleY;

          if (dist < HOVER_RADIUS) {
            const factor = Math.pow(1 - dist / HOVER_RADIUS, 2);

            // Shift lines physically UP or DOWN depending on direction
            targetShiftY = item.upDownDirection * factor * HOVER_Y_SHIFT;

            // Increase line thickness & height on hover for bold reaction
            targetScaleX = item.baseScaleX + factor * 0.35;
            targetScaleY = item.baseScaleY + factor * 0.50;
          }

          // Smooth spring lerp for vertical up/down movement
          item.currentShiftY += (targetShiftY - item.currentShiftY) * 0.14;
          item.currentScaleX += (targetScaleX - item.currentScaleX) * 0.14;
          item.currentScaleY += (targetScaleY - item.currentScaleY) * 0.14;

          dummy.position.set(item.origX, item.origY + item.currentShiftY, 0);
          dummy.rotation.set(0, 0, 0);
          dummy.scale.set(item.currentScaleX, item.currentScaleY, 1);
          dummy.updateMatrix();

          mesh.setMatrixAt(i, dummy.matrix);
          needsUpdate = true;
        });

        if (needsUpdate) {
          mesh.instanceMatrix.needsUpdate = true;
        }
      });

      renderer.render(scene, camera);
      if (performance.now() - lastInteraction <= 900) {
        animId = requestAnimationFrame(animate);
      }
    }

    renderer.render(scene, camera);

    // ── 8. Cleanup ───────────────────────────────────────────────────────────
    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.dispatchEvent(new CustomEvent('kb:logohover', { detail: false }));
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);

      lineQuadGeo.dispose();
      Object.values(groupTextures).forEach((t) => t.dispose());
      instancedMeshes.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      });
      renderer.dispose();
      renderer.forceContextLoss();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative cursor-crosshair overflow-hidden"
      style={{
        background: 'transparent',
        touchAction: 'none',
      }}
    />
  );
}
