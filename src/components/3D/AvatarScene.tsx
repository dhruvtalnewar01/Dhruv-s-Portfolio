import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VoxelAvatar = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating breathing animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Look at mouse (limited angle)
      const targetX = (state.pointer.x * Math.PI) / 4;
      const targetY = (state.pointer.y * Math.PI) / 4;
      
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.1);
    }
  });

  return (
    <group ref={groupRef} scale={1.5}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color="#FFB899" roughness={0.8} />
      </mesh>
      
      {/* Sunglasses */}
      <mesh position={[0, 1.6, 0.65]}>
        <boxGeometry args={[1.3, 0.3, 0.1]} />
        <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 1.8, 0.8]} />
        <meshStandardMaterial color="#A2485E" roughness={0.9} />
      </mesh>

      {/* Arms (Crossed) */}
      <mesh position={[0, 0.2, 0.5]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[1.8, 0.4, 0.4]} />
        <meshStandardMaterial color="#A2485E" roughness={0.9} />
      </mesh>
    </group>
  );
};

export const AvatarScene = () => {
  return (
    <div className="absolute bottom-0 right-12 w-64 h-96 z-40">
      <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
        <ambientLight intensity={1} color="#F8C08A" />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#FFF1DA" />
        {/* Rim light from the sunset */}
        <directionalLight position={[-5, 0, -5]} intensity={2} color="#E7887B" />
        
        <VoxelAvatar />
      </Canvas>
    </div>
  );
};
