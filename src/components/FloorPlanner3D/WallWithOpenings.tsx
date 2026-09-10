import React, { useMemo } from 'react';
import * as THREE from 'three';
import { WallSide, WallOpening, LightingPreset } from './types';

interface WallWithOpeningsProps {
  wallSide: WallSide;
  totalLength: number;
  wallH: number;
  wallThick?: number;
  wallMaterial: THREE.Material;
  glassMaterial: THREE.Material;
  frameMaterial: THREE.Material;
  timberMaterial: THREE.Material;
  openings: WallOpening[];
  outsideVista?: 'skyline' | 'garden';
  lightingPreset?: LightingPreset;
  position: [number, number, number];
  rotation: [number, number, number];
  isCutaway?: boolean;
}

export const WallWithOpenings: React.FC<WallWithOpeningsProps> = ({
  wallSide,
  totalLength,
  wallH,
  wallThick = 0.3,
  wallMaterial,
  glassMaterial,
  frameMaterial,
  timberMaterial,
  openings,
  outsideVista = 'garden',
  lightingPreset = 'day',
  position,
  rotation,
  isCutaway = false
}) => {
  // Filter and process openings for this specific wall
  const validOpenings = useMemo(() => {
    const list = openings
      .filter((o) => o.wall === wallSide)
      .map((o) => {
        const w = Math.max(1.8, Math.min(o.widthFt, totalLength - 0.8));
        const maxH = isCutaway ? Math.min(wallH, 2.4) : wallH - 0.2;
        const h = Math.max(1.5, Math.min(o.heightFt, maxH));
        const sill =
          o.type === 'door'
            ? 0
            : Math.max(0.4, Math.min(o.sillHeightFt ?? 2.2, Math.max(0.4, wallH - h - 0.2)));

        // Center along local X [-totalLength/2, +totalLength/2]
        const rawCenter = (o.positionRatio - 0.5) * totalLength;
        const minCenter = -totalLength / 2 + w / 2 + 0.2;
        const maxCenter = totalLength / 2 - w / 2 - 0.2;
        const center = Math.max(minCenter, Math.min(maxCenter, rawCenter));

        return {
          ...o,
          w,
          h,
          sill,
          center,
          left: center - w / 2,
          right: center + w / 2
        };
      })
      .sort((a, b) => a.left - b.left);

    // Filter out severe overlaps
    const nonOverlapping: typeof list = [];
    for (const op of list) {
      if (nonOverlapping.length === 0) {
        nonOverlapping.push(op);
      } else {
        const prev = nonOverlapping[nonOverlapping.length - 1];
        if (op.left >= prev.right + 0.2) {
          nonOverlapping.push(op);
        }
      }
    }
    return nonOverlapping;
  }, [openings, wallSide, totalLength, wallH, isCutaway]);

  // Compute solid wall segments along local X
  const segments = useMemo(() => {
    const segs: { x: number; w: number; h: number; y: number }[] = [];
    let cursor = -totalLength / 2;

    for (const op of validOpenings) {
      // 1. Solid segment before this opening
      if (op.left > cursor + 0.05) {
        const segW = op.left - cursor;
        const segX = cursor + segW / 2;
        segs.push({
          x: segX,
          w: segW,
          h: wallH,
          y: wallH / 2
        });
      }

      // 2. Section below opening (sill)
      if (op.sill > 0.05) {
        segs.push({
          x: op.center,
          w: op.w,
          h: op.sill,
          y: op.sill / 2
        });
      }

      // 3. Section above opening (lintel/header)
      const headerH = wallH - (op.sill + op.h);
      if (headerH > 0.05) {
        segs.push({
          x: op.center,
          w: op.w,
          h: headerH,
          y: op.sill + op.h + headerH / 2
        });
      }

      cursor = op.right;
    }

    // Final solid segment after the last opening
    if (cursor < totalLength / 2 - 0.05) {
      const segW = totalLength / 2 - cursor;
      const segX = cursor + segW / 2;
      segs.push({
        x: segX,
        w: segW,
        h: wallH,
        y: wallH / 2
      });
    }

    return segs;
  }, [validOpenings, totalLength, wallH]);

  // Door handle material (brushed warm brass)
  const brassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#D4AF37',
        metalness: 0.9,
        roughness: 0.2
      }),
    []
  );

  return (
    <group position={position} rotation={rotation}>
      {/* 1. SOLID WALL SEGMENTS */}
      {segments.map((s, idx) => (
        <mesh key={`seg-${idx}`} position={[s.x, s.y, 0]} receiveShadow material={wallMaterial}>
          <boxGeometry args={[s.w, s.h, wallThick]} />
        </mesh>
      ))}

      {/* 2. BASEBOARD SKIRTING (Breaks at door openings) */}
      {segments
        .filter((s) => s.y <= wallH / 2 && s.h >= 0.5)
        .map((s, idx) => (
          <mesh key={`skirt-${idx}`} position={[s.x, 0.2, wallThick / 2 + 0.025]} material={frameMaterial}>
            <boxGeometry args={[s.w, 0.4, 0.05]} />
          </mesh>
        ))}

      {/* 3. WALL OPENINGS (WINDOWS & DOORS) */}
      {validOpenings.map((op) => {
        if (op.type === 'window') {
          const frameD = wallThick + 0.08;
          const frameThick = 0.1;
          const glassW = op.w - frameThick * 2;
          const glassH = op.h - frameThick * 2;

          return (
            <group key={op.id} position={[op.center, op.sill + op.h / 2, 0]}>
              {/* Top and Bottom Frame Rails */}
              <mesh position={[0, op.h / 2 - frameThick / 2, 0]} material={frameMaterial}>
                <boxGeometry args={[op.w, frameThick, frameD]} />
              </mesh>
              <mesh position={[0, -op.h / 2 + frameThick / 2, 0]} material={frameMaterial}>
                <boxGeometry args={[op.w, frameThick, frameD]} />
              </mesh>

              {/* Left and Right Frame Stiles */}
              <mesh position={[-op.w / 2 + frameThick / 2, 0, 0]} material={frameMaterial}>
                <boxGeometry args={[frameThick, op.h, frameD]} />
              </mesh>
              <mesh position={[op.w / 2 - frameThick / 2, 0, 0]} material={frameMaterial}>
                <boxGeometry args={[frameThick, op.h, frameD]} />
              </mesh>

              {/* Window Glass Pane */}
              <mesh position={[0, 0, 0]} material={glassMaterial}>
                <boxGeometry args={[glassW, glassH, 0.04]} />
              </mesh>

              {/* Architectural Center Mullion Bar */}
              <mesh position={[0, 0, 0]} material={frameMaterial}>
                <boxGeometry args={[0.07, glassH, 0.08]} />
              </mesh>

              {/* Architectural Transom Bar */}
              <mesh position={[0, glassH * 0.2, 0]} material={frameMaterial}>
                <boxGeometry args={[glassW, 0.07, 0.08]} />
              </mesh>

              {/* Interior Wooden Sill Stool / Ledge */}
              <mesh position={[0, -op.h / 2, wallThick / 2 + 0.08]} material={timberMaterial}>
                <boxGeometry args={[op.w + 0.3, 0.08, 0.22]} />
              </mesh>

              {/* Exterior Scenic Vista Plane */}
              <group position={[0, 0, -1.2]}>
                <mesh>
                  <planeGeometry args={[op.w * 1.6, op.h * 1.5]} />
                  <meshBasicMaterial
                    color={
                      lightingPreset === 'evening'
                        ? '#FB923C'
                        : lightingPreset === 'gallery'
                        ? '#1E293B'
                        : outsideVista === 'garden'
                        ? '#A7F3D0'
                        : '#BAE6FD'
                    }
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Silhouette foliage / architectural skyline backdrop */}
                <mesh position={[0, -op.h * 0.2, 0.02]}>
                  <boxGeometry args={[op.w * 1.2, op.h * 0.8, 0.01]} />
                  <meshBasicMaterial
                    color={
                      lightingPreset === 'evening'
                        ? '#451A03'
                        : lightingPreset === 'gallery'
                        ? '#090D16'
                        : outsideVista === 'garden'
                        ? '#064E3B'
                        : '#0F172A'
                    }
                    opacity={lightingPreset === 'gallery' ? 0.65 : 0.45}
                    transparent
                  />
                </mesh>
              </group>
            </group>
          );
        }

        // ==========================================
        // DOOR OPENING
        // ==========================================
        const frameD = wallThick + 0.06;
        const frameThick = 0.12;
        const leafW = op.w - frameThick * 2;
        const leafH = op.h - frameThick;
        const openAngleRad = ((op.doorOpenAngle ?? 40) * Math.PI) / 180;

        return (
          <group key={op.id} position={[op.center, 0, 0]}>
            {/* Top Door Header Lintel */}
            <mesh position={[0, op.h - frameThick / 2, 0]} material={frameMaterial}>
              <boxGeometry args={[op.w, frameThick, frameD]} />
            </mesh>

            {/* Left and Right Door Jambs */}
            <mesh position={[-op.w / 2 + frameThick / 2, op.h / 2, 0]} material={frameMaterial}>
              <boxGeometry args={[frameThick, op.h, frameD]} />
            </mesh>
            <mesh position={[op.w / 2 - frameThick / 2, op.h / 2, 0]} material={frameMaterial}>
              <boxGeometry args={[frameThick, op.h, frameD]} />
            </mesh>

            {/* Floor Level Metallic Threshold */}
            <mesh position={[0, 0.015, 0]} material={brassMaterial}>
              <boxGeometry args={[op.w, 0.03, wallThick + 0.04]} />
            </mesh>

            {/* Door Leaf (Hinged at left jamb, swinging into room +Z) */}
            <group
              position={[-op.w / 2 + frameThick, 0, wallThick / 2 - 0.02]}
              rotation={[0, openAngleRad, 0]}
            >
              {/* Solid Seasoned Timber Leaf */}
              <mesh position={[leafW / 2, leafH / 2, 0]} receiveShadow material={timberMaterial}>
                <boxGeometry args={[leafW, leafH, 0.08]} />
              </mesh>

              {/* Decorative Recessed Timber Inlay Panels */}
              <mesh position={[leafW / 2, leafH * 0.7, 0.042]} material={frameMaterial}>
                <boxGeometry args={[leafW * 0.75, leafH * 0.4, 0.01]} />
              </mesh>
              <mesh position={[leafW / 2, leafH * 0.25, 0.042]} material={frameMaterial}>
                <boxGeometry args={[leafW * 0.75, leafH * 0.35, 0.01]} />
              </mesh>

              {/* Solid Brass Lever Handle & Escutcheon */}
              <group position={[leafW - 0.25, 3.2, 0.05]}>
                {/* Backplate */}
                <mesh position={[0, 0, 0]} material={brassMaterial}>
                  <boxGeometry args={[0.08, 0.35, 0.02]} />
                </mesh>
                {/* Lever Handle */}
                <mesh position={[-0.08, 0, 0.04]} material={brassMaterial}>
                  <boxGeometry args={[0.2, 0.04, 0.04]} />
                </mesh>
              </group>
            </group>
          </group>
        );
      })}
    </group>
  );
};
