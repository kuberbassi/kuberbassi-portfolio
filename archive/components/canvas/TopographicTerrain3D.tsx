import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface TopographicTerrain3DProps {
  onTelemetryUpdate?: (coords: { x: number; y: number; z: number }) => void;
  className?: string;
}

const vertexShader = `
uniform float uTime;
uniform vec2 uPointer;
uniform float uHoverStrength;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying float vElevation;

// Simplex 3D noise helpers
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vUv = uv;
  vec3 pos = position;
  
  float t = uTime * 0.15;
  float n1 = snoise(vec3(pos.xy * 0.45, t));
  float n2 = snoise(vec3(pos.xy * 1.1 + vec2(10.0), t * 1.3)) * 0.35;
  float n3 = snoise(vec3(pos.xy * 2.5, t * 1.8)) * 0.12;
  
  float elevation = (n1 + n2 + n3);
  
  // Pointer interactive ripple displacement
  float dist = distance(uv, uPointer);
  float ripple = exp(-dist * 4.5) * cos(dist * 20.0 - uTime * 3.0) * uHoverStrength * 0.4;
  elevation += ripple;
  
  pos.z += elevation * 0.65;
  vElevation = pos.z;
  vPosition = pos;
  vNormal = normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
uniform vec3 uBaseColor;
uniform vec3 uContourColor;
uniform vec3 uGlowColor;
uniform float uTime;
uniform vec2 uResolution;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying float vElevation;

void main() {
  // Compute topographic contour lines (iso-lines)
  float contourSpacing = 0.12;
  float contourVal = abs(fract(vElevation / contourSpacing - 0.5) - 0.5);
  float contourWidth = fwidth(vElevation / contourSpacing) * 1.4;
  float linePattern = smoothstep(0.0, contourWidth, contourVal);
  float contourLine = 1.0 - linePattern;

  // Secondary fine grid contours
  float fineSpacing = 0.03;
  float fineVal = abs(fract(vElevation / fineSpacing - 0.5) - 0.5);
  float fineWidth = fwidth(vElevation / fineSpacing) * 1.1;
  float fineLine = 1.0 - smoothstep(0.0, fineWidth, fineVal);

  // Depth shading & subtle vignette gradient
  float depth = smoothstep(-1.2, 1.2, vElevation);
  vec3 bgColor = mix(uBaseColor, uBaseColor * 1.4, depth * 0.3);
  
  // Contour color blending
  vec3 lineCol = mix(uContourColor, uGlowColor, depth * 0.7);
  vec3 finalColor = mix(bgColor, lineCol, contourLine * 0.85 + fineLine * 0.25);
  
  // Radial edge fade for seamless blending into viewport
  float edgeDist = length((vUv - 0.5) * 2.0);
  float alpha = smoothstep(1.1, 0.4, edgeDist);

  gl_FragColor = vec4(finalColor, alpha * 0.94);
}
`;

export function TopographicTerrain3D({ onTelemetryUpdate, className = '' }: TopographicTerrain3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, -3.2, 3.6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Geometry: Dense grid plane for smooth 3D topography
    const geometry = new THREE.PlaneGeometry(6.5, 6.5, 140, 140);

    const uniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(-2, -2) },
      uHoverStrength: { value: 0 },
      uBaseColor: { value: new THREE.Color('#080807') },
      uContourColor: { value: new THREE.Color('#d5b27e') },
      uGlowColor: { value: new THREE.Color('#e8d5b5') },
      uResolution: { value: new THREE.Vector2(width, height) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: true,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI * 0.28;
    scene.add(mesh);

    // Pointer event tracking & telemetry update
    const targetPointer = new THREE.Vector2(-2, -2);
    let targetHover = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;

      targetPointer.set(x, y);
      targetHover = 1.0;

      if (onTelemetryUpdate) {
        onTelemetryUpdate({
          x: parseFloat((e.clientX * 1.48).toFixed(2)),
          y: parseFloat((e.clientY * 1.12).toFixed(2)),
          z: parseFloat(((x * y * 50) + 12.4).toFixed(2)),
        });
      }
    };

    const handlePointerLeave = () => {
      targetHover = 0;
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener('resize', handleResize);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      uniforms.uTime.value = elapsedTime;

      // Smooth pointer lerping
      uniforms.uPointer.value.lerp(targetPointer, 0.08);
      uniforms.uHoverStrength.value += (targetHover - uniforms.uHoverStrength.value) * 0.05;

      // Subtle 3D mesh tilt
      mesh.rotation.z = Math.sin(elapsedTime * 0.2) * 0.08 + (uniforms.uPointer.value.x - 0.5) * 0.25;
      mesh.rotation.x = -Math.PI * 0.28 + (uniforms.uPointer.value.y - 0.5) * 0.15;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      cancelAnimationFrame(animId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onTelemetryUpdate]);

  return (
    <div
      ref={containerRef}
      className={`topographic-terrain-3d relative w-full h-full min-h-[380px] overflow-hidden ${className}`}
      aria-label="3D Interactive Topographic Terrain"
    />
  );
}
