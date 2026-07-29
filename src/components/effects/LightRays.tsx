import { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';

export type RaysOrigin =
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'right'
  | 'left'
  | 'bottom-center'
  | 'bottom-right'
  | 'bottom-left';

interface LightRaysProps {
  raysOrigin?: RaysOrigin;
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  fadeDistance?: number;
  saturation?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  className?: string;
}

type Vec2 = [number, number];
type Vec3 = [number, number, number];

const hexToRgb = (hex: string): Vec3 => {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match
    ? [parseInt(match[1], 16) / 255, parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255]
    : [1, 1, 1];
};

const getAnchorAndDirection = (origin: RaysOrigin, width: number, height: number) => {
  const outside = 0.2;
  switch (origin) {
    case 'top-left': return { anchor: [0, -outside * height] as Vec2, direction: [0, 1] as Vec2 };
    case 'top-right': return { anchor: [width, -outside * height] as Vec2, direction: [0, 1] as Vec2 };
    case 'left': return { anchor: [-outside * width, height * 0.5] as Vec2, direction: [1, 0] as Vec2 };
    case 'right': return { anchor: [(1 + outside) * width, height * 0.5] as Vec2, direction: [-1, 0] as Vec2 };
    case 'bottom-left': return { anchor: [0, (1 + outside) * height] as Vec2, direction: [0, -1] as Vec2 };
    case 'bottom-center': return { anchor: [width * 0.5, (1 + outside) * height] as Vec2, direction: [0, -1] as Vec2 };
    case 'bottom-right': return { anchor: [width, (1 + outside) * height] as Vec2, direction: [0, -1] as Vec2 };
    default: return { anchor: [width * 0.5, -outside * height] as Vec2, direction: [0, 1] as Vec2 };
  }
};

const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentShader = `precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 rayPos;
uniform vec2 rayDir;
uniform vec3 raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float fadeDistance;
uniform float saturation;
uniform vec2 mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;

float noise(vec2 st) {
  return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
}

float rayStrength(vec2 source, vec2 referenceDirection, vec2 coordinate, float seedA, float seedB, float speed) {
  vec2 sourceToCoordinate = coordinate - source;
  vec2 direction = normalize(sourceToCoordinate);
  float angle = dot(direction, referenceDirection);
  float distortedAngle = angle + distortion * sin(iTime * 2.0 + length(sourceToCoordinate) * 0.01) * 0.2;
  float spread = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));
  float distance = length(sourceToCoordinate);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float variation = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0,
    1.0
  );
  return variation * lengthFalloff * fadeFalloff * spread;
}

void main() {
  vec2 coordinate = vec2(gl_FragCoord.x, iResolution.y - gl_FragCoord.y);
  vec2 direction = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseDirection = normalize(mousePos * iResolution - rayPos);
    direction = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  float rays = rayStrength(rayPos, direction, coordinate, 36.2214, 21.11349, 1.5 * raysSpeed) * 0.5;
  rays += rayStrength(rayPos, direction, coordinate, 22.3991, 18.0234, 1.1 * raysSpeed) * 0.4;
  if (noiseAmount > 0.0) {
    rays *= 1.0 - noiseAmount + noiseAmount * noise(coordinate * 0.01 + iTime * 0.1);
  }

  float brightness = 1.0 - coordinate.y / iResolution.y;
  vec3 color = raysColor * rays * (0.28 + brightness * 0.72);
  float gray = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(gray), color, saturation);
  gl_FragColor = vec4(color, min(rays * 0.88, 0.82));
}`;

export function LightRays({
  raysOrigin = 'top-center',
  raysColor = '#d5b27e',
  raysSpeed = 0.25,
  lightSpread = 0.68,
  rayLength = 1.05,
  fadeDistance = 1.1,
  saturation = 0.62,
  followMouse = true,
  mouseInfluence = 0.035,
  noiseAmount = 0.015,
  distortion = 0.012,
  className = '',
}: LightRaysProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 767px)');
    let frame = 0;
    let isVisible = false;
    let renderer: Renderer | null = null;
    let destroyed = false;
    const mouse = { x: 0.5, y: 0.5 };
    const smoothMouse = { x: 0.5, y: 0.5 };

    const initialise = () => {
      if (destroyed || renderer || mobile.matches || reducedMotion.matches) return;

      renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 1.5), alpha: true });
      const gl = renderer.gl;
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      gl.canvas.style.display = 'block';
      container.replaceChildren(gl.canvas);

      const uniforms = {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] as Vec2 },
        rayPos: { value: [0, 0] as Vec2 },
        rayDir: { value: [0, 1] as Vec2 },
        raysColor: { value: hexToRgb(raysColor) },
        raysSpeed: { value: raysSpeed },
        lightSpread: { value: lightSpread },
        rayLength: { value: rayLength },
        fadeDistance: { value: fadeDistance },
        saturation: { value: saturation },
        mousePos: { value: [0.5, 0.5] as Vec2 },
        mouseInfluence: { value: followMouse ? mouseInfluence : 0 },
        noiseAmount: { value: noiseAmount },
        distortion: { value: distortion },
      };
      const mesh = new Mesh(gl, {
        geometry: new Triangle(gl),
        program: new Program(gl, { vertex: vertexShader, fragment: fragmentShader, uniforms }),
      });

      const resize = () => {
        if (!renderer) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        const dpr = renderer.dpr;
        const { anchor, direction } = getAnchorAndDirection(raysOrigin, width * dpr, height * dpr);
        uniforms.iResolution.value = [width * dpr, height * dpr];
        uniforms.rayPos.value = anchor;
        uniforms.rayDir.value = direction;
      };

      const render = (time: number) => {
        if (!renderer || destroyed || !isVisible || document.hidden) return;
        uniforms.iTime.value = time * 0.001;
        smoothMouse.x += (mouse.x - smoothMouse.x) * 0.075;
        smoothMouse.y += (mouse.y - smoothMouse.y) * 0.075;
        uniforms.mousePos.value = [smoothMouse.x, smoothMouse.y];
        renderer.render({ scene: mesh });
        frame = window.requestAnimationFrame(render);
      };

      const resume = () => {
        if (!frame && isVisible && !document.hidden) frame = window.requestAnimationFrame(render);
      };
      const pause = () => {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
      };
      const visibilityObserver = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) resume(); else pause();
      }, { threshold: 0.01 });

      const pointerMove = (event: PointerEvent) => {
        if (!followMouse) return;
        const bounds = container.getBoundingClientRect();
        mouse.x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
        mouse.y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
      };
      const visibilityChange = () => { if (document.hidden) pause(); else resume(); };

      resize();
      visibilityObserver.observe(container);
      window.addEventListener('resize', resize, { passive: true });
      window.addEventListener('pointermove', pointerMove, { passive: true });
      document.addEventListener('visibilitychange', visibilityChange);

      (container as HTMLDivElement & { cleanup?: () => void }).cleanup = () => {
        pause();
        visibilityObserver.disconnect();
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointermove', pointerMove);
        document.removeEventListener('visibilitychange', visibilityChange);
      };
    };

    initialise();
    return () => {
      destroyed = true;
      (container as HTMLDivElement & { cleanup?: () => void }).cleanup?.();
      if (renderer) renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();
      container.replaceChildren();
    };
  }, [distortion, fadeDistance, followMouse, lightSpread, mouseInfluence, noiseAmount, rayLength, raysColor, raysOrigin, raysSpeed, saturation]);

  return <div ref={containerRef} aria-hidden="true" className={`light-rays ${className}`.trim()} />;
}
