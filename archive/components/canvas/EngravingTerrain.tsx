import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }`;
const fragmentShader = `
uniform sampler2D inputImage; uniform vec2 resolution; uniform vec2 pointer; uniform float time;
uniform float spacing; uniform float minThickness; uniform float maxThickness; uniform float contrast; uniform float sharpness; uniform float wave; uniform float waveFrequency;
uniform vec3 inkColor; uniform vec3 paperColor; varying vec2 vUv;
float luminance(vec3 color){ return dot(color, vec3(.299,.587,.114)); }
void main(){ vec2 uv=vUv; float light=luminance(texture2D(inputImage,uv).rgb); light=clamp((light-.5)*contrast+.5,0.,1.); float dark=1.-light;
float pulse=max(0.,1.-distance(uv,pointer)*2.4); float curve=sin(uv.x*waveFrequency*6.283+time*.16)*wave*.025+pulse*sin(uv.x*28.+time)*.012;
float y=(uv.y+curve)*resolution.y; float line=abs(fract(y/spacing)-.5)*spacing*2.; float thickness=mix(minThickness,maxThickness,pow(dark,.9))+pulse*1.15;
float edge=smoothstep(thickness,thickness*(1.+(1.-sharpness)),line); float coverage=(1.-edge)*smoothstep(.055,.17,dark); gl_FragColor=vec4(mix(paperColor,inkColor,coverage),1.); }
`;

export function EngravingTerrain() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current; if (!element) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); renderer.setClearColor(0x000000, 0); element.appendChild(renderer.domElement);
    const scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const texture = new THREE.TextureLoader().load('/assets/mountain.jpg'); texture.colorSpace = THREE.SRGBColorSpace;
    const uniforms = { 
      inputImage: { value: texture }, 
      resolution: { value: new THREE.Vector2(1, 1) }, 
      pointer: { value: new THREE.Vector2(-2, -2) }, 
      time: { value: 0 }, 
      spacing: { value: 7.5 }, 
      minThickness: { value: 0.9 }, 
      maxThickness: { value: 5.5 }, 
      contrast: { value: 1.35 }, 
      sharpness: { value: 0.65 }, 
      wave: { value: 0.22 }, 
      waveFrequency: { value: 2.8 }, 
      inkColor: { value: new THREE.Color('#d5b27e') }, 
      paperColor: { value: new THREE.Color('#080807') } 
    };
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader })); scene.add(mesh);
    const resize = () => { const {width,height}=element.getBoundingClientRect(); renderer.setSize(width,height); uniforms.resolution.value.set(width*renderer.getPixelRatio(),height*renderer.getPixelRatio()); };
    const move = (event:PointerEvent) => { const r=element.getBoundingClientRect(); uniforms.pointer.value.set((event.clientX-r.left)/r.width,1-(event.clientY-r.top)/r.height); };
    const leave = () => uniforms.pointer.value.set(-2,-2); let frame=0; const render=()=>{ uniforms.time.value=performance.now()*.001; renderer.render(scene,camera); frame=requestAnimationFrame(render); };
    resize(); render(); element.addEventListener('pointermove',move); element.addEventListener('pointerleave',leave); window.addEventListener('resize',resize);
    return()=>{ cancelAnimationFrame(frame); element.removeEventListener('pointermove',move); element.removeEventListener('pointerleave',leave); window.removeEventListener('resize',resize); mesh.geometry.dispose(); mesh.material.dispose(); texture.dispose(); renderer.dispose(); renderer.domElement.remove(); };
  }, []);
  return <div className="engraving-terrain" ref={host} aria-label="Interactive engraved mountain terrain" />;
}
