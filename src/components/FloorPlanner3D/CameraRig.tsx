import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CameraMode, RoomConfig } from './types';

interface CameraRigProps {
  mode: CameraMode;
  roomConfig: RoomConfig;
  autoRotate?: boolean;
  enabled?: boolean;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  mode,
  roomConfig,
  autoRotate = false,
  enabled = true
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const targetPos = useRef(new THREE.Vector3(0, 0, 0));
  const targetCamPos = useRef(new THREE.Vector3(0, 20, 20));
  const isTransitioning = useRef(false);
  const prevMode = useRef<CameraMode>(mode);
  const isInitial = useRef(true);

  // Initial camera placement on mount without any automatic animation
  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      const { widthFt, lengthFt, ceilingHeightFt } = roomConfig;
      camera.position.set(widthFt * 0.95, ceilingHeightFt * 1.6 + 6, lengthFt * 1.35);
      camera.lookAt(0, ceilingHeightFt * 0.3, 0);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, ceilingHeightFt * 0.3, 0);
        controlsRef.current.update();
      }
      isTransitioning.current = false;
    }
  }, []);

  // ONLY transition camera if the user explicitly switches camera view mode (3D / 2D / Walk)
  useEffect(() => {
    if (prevMode.current === mode) return;
    prevMode.current = mode;

    const { widthFt, lengthFt, ceilingHeightFt } = roomConfig;
    const maxDim = Math.max(widthFt, lengthFt);

    if (mode === 'blueprint') {
      targetCamPos.current.set(0.001, maxDim * 1.85, 0.001);
      targetPos.current.set(0, 0, 0);
      if (controlsRef.current) {
        controlsRef.current.maxPolarAngle = Math.PI / 2 - 0.01;
        controlsRef.current.minPolarAngle = 0.01;
      }
    } else if (mode === 'eye-level') {
      const entryX = -widthFt * 0.35;
      const entryZ = lengthFt * 0.35;
      targetCamPos.current.set(entryX, 5.5, entryZ);
      targetPos.current.set(0, 3.5, -lengthFt * 0.1);
      if (controlsRef.current) {
        controlsRef.current.maxPolarAngle = Math.PI / 2 + 0.1;
        controlsRef.current.minPolarAngle = 0.1;
      }
    } else {
      targetCamPos.current.set(widthFt * 0.95, ceilingHeightFt * 1.6 + 6, lengthFt * 1.35);
      targetPos.current.set(0, ceilingHeightFt * 0.3, 0);
      if (controlsRef.current) {
        controlsRef.current.maxPolarAngle = Math.PI / 2 + 0.05;
        controlsRef.current.minPolarAngle = 0.01;
      }
    }

    isTransitioning.current = true;
  }, [mode, roomConfig]);

  // If user starts interacting with controls (mouse or touch drag), instantly cancel transition
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleUserStart = () => {
      isTransitioning.current = false;
    };

    controls.addEventListener('start', handleUserStart);
    return () => {
      controls.removeEventListener('start', handleUserStart);
    };
  }, []);

  // Frame loop: strictly respects user manual interaction with zero auto-movement
  useFrame((_, delta) => {
    if (!isTransitioning.current) {
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      return;
    }

    const factor = Math.min(1, delta * 6.0);
    camera.position.lerp(targetCamPos.current, factor);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetPos.current, factor);
      controlsRef.current.update();
    }

    const distCam = camera.position.distanceTo(targetCamPos.current);
    const distTarget = controlsRef.current
      ? controlsRef.current.target.distanceTo(targetPos.current)
      : 0;

    if (distCam < 0.1 && distTarget < 0.1) {
      camera.position.copy(targetCamPos.current);
      if (controlsRef.current) {
        controlsRef.current.target.copy(targetPos.current);
        controlsRef.current.update();
      }
      isTransitioning.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enabled={enabled}
      dampingFactor={0.08}
      enableDamping
      autoRotate={false}
      enablePan={true}
      screenSpacePanning={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={1.0}
      maxDistance={Math.max(roomConfig.widthFt, roomConfig.lengthFt) * 4}
    />
  );
};
