import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Instances, Instance, Environment } from '@react-three/drei';
import * as THREE from 'three';

const CloudLayer = ({ zOffset, speed, opacity, scale }: any) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate random box positions for a pixelated cloud cluster
  const boxes = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 5
        ],
        scale: Math.random() * 2 + 1
      });
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x += speed * delta;
      if (groupRef.current.position.x > 30) {
        groupRef.current.position.x = -30;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, zOffset]} scale={scale}>
      <Instances limit={boxes.length}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color="#FFE5D9"
          emissive="#E7887B"
          emissiveIntensity={0.2}
          transparent
          opacity={opacity}
          roughness={1}
        />
        {boxes.map((box, i) => (
          <Instance 
            key={i} 
            position={box.position as any} 
            scale={box.scale} 
          />
        ))}
      </Instances>
    </group>
  );
};

export const CloudScene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 45 }} className="pointer-events-none">
      <ambientLight intensity={1.5} color="#F8C08A" />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#FFF1DA" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#A2485E" />
      
      {/* Background clouds (slow, small, transparent) */}
      <CloudLayer zOffset={-15} speed={0.5} opacity={0.4} scale={1.5} />
      
      {/* Midground clouds */}
      <CloudLayer zOffset={-5} speed={1.2} opacity={0.6} scale={2} />
      
      {/* Foreground clouds (fast, large, opaque) */}
      <CloudLayer zOffset={5} speed={2} opacity={0.8} scale={3} />
    </Canvas>
  );
};
