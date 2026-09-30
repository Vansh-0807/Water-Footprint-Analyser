import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function WaterDrop() {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Base rotation
      meshRef.current.rotation.y += delta * 0.2;
      
      // Interactive mouse follow (parallax) - listens to global pointer implicitly in R3F
      targetRotation.current.x = (state.pointer.y * Math.PI) / 4;
      targetRotation.current.y = (state.pointer.x * Math.PI) / 4;
      
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotation.current.x, 0.1);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -targetRotation.current.x * 0.5, 0.1);
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.5} floatIntensity={2.5}>
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[1.8, 64, 64]} />
        <MeshDistortMaterial 
          color="#10b981" 
          envMapIntensity={1.5} 
          clearcoat={1} 
          clearcoatRoughness={0.1} 
          metalness={0.2}
          roughness={0.1}
          distort={0.4} 
          speed={2.5} 
        />
      </mesh>
    </Float>
  );
}

function FarmScene() {
  return (
    <div className="absolute inset-0 z-0 opacity-90 dark:opacity-60 transition-opacity duration-1000 pointer-events-none">
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#059669" />
        <Environment preset="city" />
        <WaterDrop />
      </Canvas>
    </div>
  );
}

export default FarmScene;
