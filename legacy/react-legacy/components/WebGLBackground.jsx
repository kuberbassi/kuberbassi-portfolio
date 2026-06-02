import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Float, Sparkles, Lightformer, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Monolith() {
  const mesh = useRef();
  
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.1;
      mesh.current.rotation.y += delta * 0.15;
      // Gentle floating up and down
      mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group position={[3, 0, -2]}>
      <Float floatIntensity={2} speed={2} rotationIntensity={0.5}>
        <mesh ref={mesh} scale={2.5}>
          <octahedronGeometry args={[1, 1]} />
          <MeshTransmissionMaterial 
            backside
            backsideThickness={1}
            thickness={1.5}
            chromaticAberration={1.5}
            anisotropy={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={3}
            resolution={1024}
            distortion={0.5}
            distortionScale={0.5}
            temporalDistortion={0.1}
            color="#ffffff"
            attenuationColor="#f7f3ec"
            attenuationDistance={2}
          />
        </mesh>
      </Float>
      <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#000000" />
    </group>
  );
}

function CursorFollower() {
  const { viewport } = useThree();
  const lightRef = useRef();

  useFrame((state) => {
    if (lightRef.current) {
      // Map mouse to viewport coordinates
      const x = (state.pointer.x * viewport.width) / 2;
      const y = (state.pointer.y * viewport.height) / 2;
      lightRef.current.position.lerp(new THREE.Vector3(x, y, 2), 0.1);
    }
  });

  return <pointLight ref={lightRef} intensity={5} distance={10} color="#3a6ff8" />;
}

export default function WebGLBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
        {/* We keep the canvas transparent to let the CSS background show through, or attach a background color */}
        <color attach="background" args={['#f7f3ec']} />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        
        <CursorFollower />

        <Environment resolution={256}>
          <group rotation={[-Math.PI / 4, -0.3, 0]}>
            <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[5, -1, -1]} scale={[10, 2, 1]} />
            <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
            <Lightformer intensity={5} rotation-y={Math.PI / 4} position={[-5, -1, 5]} scale={[5, 5, 1]} color="#c76f32" />
            <Lightformer intensity={5} rotation-y={-Math.PI / 4} position={[5, -1, 5]} scale={[5, 5, 1]} color="#17a773" />
          </group>
        </Environment>

        <Monolith />
        
        <Sparkles count={150} scale={15} size={2} speed={0.4} opacity={0.3} color="#c76f32" />
        <Sparkles count={150} scale={15} size={1} speed={0.6} opacity={0.2} color="#3a6ff8" />
      </Canvas>
    </div>
  );
}
