// src/components/BackgroundWithStars.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

const BackgroundWithStars = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} fade saturation={0} />
    </Canvas>
  );
};

export default BackgroundWithStars;
