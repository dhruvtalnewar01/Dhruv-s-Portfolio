import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    // Complex subtle rippling data effect
    float noise = sin(uv.y * 20.0 + uTime) * cos(uv.x * 20.0 + uTime * 0.5) * 0.005;
    uv.x += noise;
    uv.y += noise;
    
    // Simulate holographic scanlines
    float scanline = sin(uv.y * 800.0 - uTime * 5.0) * 0.04;
    
    vec4 color = texture2D(uTexture, uv);
    color.rgb += vec3(scanline) * color.r * 0.5; // Add subtle glow to reds

    gl_FragColor = color;
  }
`;

const ImagePlane = ({ imageSrc }: { imageSrc: string }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const texture = useTexture(imageSrc);
  const { viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uTime: { value: 0 }
  }), [texture]);

  useFrame((state) => {
    if (mesh.current) {
      (mesh.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.elapsedTime;
      // Subtle parallax based on mouse
      mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, (state.pointer.x * viewport.width) * 0.015, 0.05);
      mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, (state.pointer.y * viewport.height) * 0.015, 0.05);
    }
  });

  // Calculate scaling to "cover" the viewport like object-fit: cover
  const img = texture.image as HTMLImageElement | undefined;
  const imageAspect = img && img.width && img.height ? img.width / img.height : 1;
  const viewportAspect = viewport.width / viewport.height;
  
  let scaleX = viewport.width;
  let scaleY = viewport.height;
  
  if (imageAspect > viewportAspect) {
    scaleX = viewport.height * imageAspect;
  } else {
    scaleY = viewport.width / imageAspect;
  }

  return (
    <mesh ref={mesh} scale={[scaleX * 1.05, scaleY * 1.05, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial 
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

const DustParticles = () => {
  const points = useRef<THREE.Points>(null);
  const count = 1500;
  
  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8; // z
      sc[i] = Math.random();
    }
    return [pos, sc];
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.01;
      points.current.rotation.x = state.clock.elapsedTime * 0.005;
    }
  });

  return (
    <points ref={points} position={[0, 0, 2]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-scale" args={[scales, 1]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.3} sizeAttenuation={true} blending={THREE.AdditiveBlending} />
    </points>
  );
};

export const ThreeHeroBackground = ({ imageSrc }: { imageSrc: string }) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <React.Suspense fallback={null}>
          <ImagePlane imageSrc={imageSrc} />
        </React.Suspense>
        <DustParticles />
      </Canvas>
    </div>
  );
};
