import { useEffect, useRef } from 'react';

export type RaysOrigin = 'top-center' | 'top-left' | 'top-right' | 'right' | 'left' | 'bottom-center' | 'bottom-right' | 'bottom-left';

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

const hexToRgb = (hex: string): [number, number, number] => {
  const cleanHex = hex.replace('#', '');
  const colorInt = parseInt(cleanHex, 16);
  return [
    ((colorInt >> 16) & 255) / 255,
    ((colorInt >> 8) & 255) / 255,
    (colorInt & 255) / 255,
  ];
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
  
  // On tall mobile screens (iResolution.y > iResolution.x), widen spread so rays fan across mobile layout
  float effectiveSpread = iResolution.y > iResolution.x ? max(lightSpread, 0.82) : lightSpread;
  float spread = pow(max(distortedAngle, 0.0), 1.0 / max(effectiveSpread, 0.001));
  
  float distance = length(sourceToCoordinate);
  
  // Use maximum screen dimension so reach is full-height on mobile portrait as well as landscape
  float maxDim = max(iResolution.x, iResolution.y);
  float maxDistance = maxDim * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
  float fadeFalloff = clamp((maxDim * fadeDistance - distance) / (maxDim * fadeDistance), 0.35, 1.0);
  
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

  float rays = rayStrength(rayPos, direction, coordinate, 36.2214, 21.11349, 1.5 * raysSpeed) * 0.52;
  rays += rayStrength(rayPos, direction, coordinate, 22.3991, 18.0234, 1.1 * raysSpeed) * 0.42;
  if (noiseAmount > 0.0) {
    rays *= 1.0 - noiseAmount + noiseAmount * noise(coordinate * 0.01 + iTime * 0.1);
  }

  float brightness = 1.0 - coordinate.y / iResolution.y;
  vec3 color = raysColor * rays * (0.32 + brightness * 0.68);
  float gray = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(gray), color, saturation);
  gl_FragColor = vec4(color, min(rays * 0.85, 0.78));
}`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export function LightRays({
  raysOrigin = 'top-center',
  raysColor = '#d5b27e',
  raysSpeed = 0.25,
  lightSpread = 0.72,
  rayLength = 1.25,
  fadeDistance = 1.3,
  saturation = 0.62,
  followMouse = true,
  mouseInfluence = 0.04,
  noiseAmount = 0.015,
  distortion = 0.012,
  className = '',
}: LightRaysProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let frame = 0;
    let isIntersecting = false;
    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let positionBuffer: WebGLBuffer | null = null;

    const mouse = { x: 0.5, y: 0.5 };
    const smoothMouse = { x: 0.5, y: 0.5 };

    let currentWidth = 0;
    let currentHeight = 0;
    let cachedAnchor: Vec2 = [0, 0];
    let cachedDirection: Vec2 = [0, 1];
    let cachedRgb: [number, number, number] = hexToRgb(raysColor);
    let boundsCache: DOMRect | null = null;

    // Uniform locations
    let posLoc = -1;
    let uTime: WebGLUniformLocation | null = null;
    let uRes: WebGLUniformLocation | null = null;
    let uRayPos: WebGLUniformLocation | null = null;
    let uRayDir: WebGLUniformLocation | null = null;
    let uRaysColor: WebGLUniformLocation | null = null;
    let uRaysSpeed: WebGLUniformLocation | null = null;
    let uLightSpread: WebGLUniformLocation | null = null;
    let uRayLength: WebGLUniformLocation | null = null;
    let uFadeDistance: WebGLUniformLocation | null = null;
    let uSaturation: WebGLUniformLocation | null = null;
    let uMousePos: WebGLUniformLocation | null = null;
    let uMouseInfluence: WebGLUniformLocation | null = null;
    let uNoiseAmount: WebGLUniformLocation | null = null;
    let uDistortion: WebGLUniformLocation | null = null;

    const destroyWebGL = () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      if (gl) {
        if (positionBuffer) gl.deleteBuffer(positionBuffer);
        if (program) gl.deleteProgram(program);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        gl = null;
        program = null;
        positionBuffer = null;
      }
      container.replaceChildren();
    };

    const updateGeometryCache = (width: number, height: number) => {
      currentWidth = width;
      currentHeight = height;
      const { anchor, direction } = getAnchorAndDirection(raysOrigin, width, height);
      cachedAnchor = anchor;
      cachedDirection = direction;
      cachedRgb = hexToRgb(raysColor);
    };

    const initWebGL = (): boolean => {
      if (gl) return true;

      const canvas = document.createElement('canvas');
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';

      const ctx = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'low-power' });
      if (!ctx) return false;
      gl = ctx;

      const prg = createProgram(gl, vertexShader, fragmentShader);
      if (!prg) {
        destroyWebGL();
        return false;
      }
      program = prg;

      positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

      posLoc = gl.getAttribLocation(program, 'position');
      uTime = gl.getUniformLocation(program, 'iTime');
      uRes = gl.getUniformLocation(program, 'iResolution');
      uRayPos = gl.getUniformLocation(program, 'rayPos');
      uRayDir = gl.getUniformLocation(program, 'rayDir');
      uRaysColor = gl.getUniformLocation(program, 'raysColor');
      uRaysSpeed = gl.getUniformLocation(program, 'raysSpeed');
      uLightSpread = gl.getUniformLocation(program, 'lightSpread');
      uRayLength = gl.getUniformLocation(program, 'rayLength');
      uFadeDistance = gl.getUniformLocation(program, 'fadeDistance');
      uSaturation = gl.getUniformLocation(program, 'saturation');
      uMousePos = gl.getUniformLocation(program, 'mousePos');
      uMouseInfluence = gl.getUniformLocation(program, 'mouseInfluence');
      uNoiseAmount = gl.getUniformLocation(program, 'noiseAmount');
      uDistortion = gl.getUniformLocation(program, 'distortion');

      container.replaceChildren(canvas);

      const width = Math.max(container.clientWidth, window.innerWidth || 320);
      const height = Math.max(container.clientHeight, window.innerHeight || 480);
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      updateGeometryCache(width, height);
      boundsCache = container.getBoundingClientRect();

      return true;
    };

    const resize = () => {
      if (!gl || !container) return;
      const width = Math.max(container.clientWidth, window.innerWidth || 320);
      const height = Math.max(container.clientHeight, window.innerHeight || 480);
      if (width === 0 || height === 0) return;
      const canvas = gl.canvas as HTMLCanvasElement;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      updateGeometryCache(width, height);
      boundsCache = container.getBoundingClientRect();
    };

    const render = (time: number) => {
      if (!isIntersecting || document.hidden || !gl || !program) return;

      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.06;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.06;

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(uTime, time * 0.001);
      gl.uniform2f(uRes, currentWidth, currentHeight);
      gl.uniform2f(uRayPos, cachedAnchor[0], cachedAnchor[1]);
      gl.uniform2f(uRayDir, cachedDirection[0], cachedDirection[1]);
      gl.uniform3f(uRaysColor, cachedRgb[0], cachedRgb[1], cachedRgb[2]);
      gl.uniform1f(uRaysSpeed, raysSpeed);
      gl.uniform1f(uLightSpread, lightSpread);
      gl.uniform1f(uRayLength, rayLength);
      gl.uniform1f(uFadeDistance, fadeDistance);
      gl.uniform1f(uSaturation, saturation);
      gl.uniform2f(uMousePos, smoothMouse.x, smoothMouse.y);
      gl.uniform1f(uMouseInfluence, followMouse ? mouseInfluence : 0.02);
      gl.uniform1f(uNoiseAmount, noiseAmount);
      gl.uniform1f(uDistortion, distortion);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reducedMotion.matches) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const startLoop = () => {
      if (frame || document.hidden || !isIntersecting) return;
      if (initWebGL()) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const stopLoop = () => {
      destroyWebGL();
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) {
        startLoop();
      } else {
        stopLoop();
      }
    }, { threshold: 0.01, rootMargin: '120px 0px' });

    const handlePointer = (clientX: number, clientY: number) => {
      if (!isIntersecting) return;
      if (!boundsCache) boundsCache = container.getBoundingClientRect();
      const width = boundsCache.width || 1;
      const height = boundsCache.height || 1;
      mouse.x = Math.max(0, Math.min(1, (clientX - boundsCache.left) / width));
      mouse.y = Math.max(0, Math.min(1, (clientY - boundsCache.top) / height));
    };

    const pointerMove = (event: PointerEvent) => {
      handlePointer(event.clientX, event.clientY);
    };

    const touchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        handlePointer(event.touches[0].clientX, event.touches[0].clientY);
      }
    };

    const visibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else if (isIntersecting) {
        startLoop();
      }
    };

    visibilityObserver.observe(container);
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('orientationchange', resize, { passive: true });
    window.addEventListener('pointermove', pointerMove, { passive: true });
    window.addEventListener('touchmove', touchMove, { passive: true });
    document.addEventListener('visibilitychange', visibilityChange);

    return () => {
      visibilityObserver.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('orientationchange', resize);
      window.removeEventListener('pointermove', pointerMove);
      window.removeEventListener('touchmove', touchMove);
      document.removeEventListener('visibilitychange', visibilityChange);
      stopLoop();
    };
  }, [distortion, fadeDistance, followMouse, lightSpread, mouseInfluence, noiseAmount, rayLength, raysColor, raysOrigin, raysSpeed, saturation]);

  return <div ref={containerRef} aria-hidden="true" className={`light-rays ${className}`.trim()} />;
}
