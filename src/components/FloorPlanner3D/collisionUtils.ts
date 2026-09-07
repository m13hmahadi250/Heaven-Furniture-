import { PlacedFurniture, RoomConfig, CatalogItem } from './types';
import { CATALOG_ITEMS } from './catalogData';

export interface CollisionResult {
  hasCollisions: boolean;
  collidingInstances: Set<string>;
  wallCollisions: Set<string>;
  furnitureCollisions: Set<string>;
  collisionMessages: Record<string, string>;
}

// Snap a value to a specified step (e.g. 0.5 ft magnetic grid)
export function snapToGrid(val: number, step: number = 0.5): number {
  return Math.round(val / step) * step;
}

// Compute effective AABB bounds for a rotated box on the ground plane (X and Z)
export function getItemFootprintBounds(
  item: CatalogItem,
  x: number,
  z: number,
  rotationY: number
) {
  const cos = Math.abs(Math.cos(rotationY));
  const sin = Math.abs(Math.sin(rotationY));

  const effHalfW = (item.widthFt * cos + item.depthFt * sin) / 2;
  const effHalfL = (item.widthFt * sin + item.depthFt * cos) / 2;

  return {
    minX: x - effHalfW,
    maxX: x + effHalfW,
    minZ: z - effHalfL,
    maxZ: z + effHalfL,
    effHalfW,
    effHalfL
  };
}

// Detect collisions with room walls and other furniture pieces
export function evaluateCollisions(
  placedList: PlacedFurniture[],
  roomConfig: RoomConfig
): CollisionResult {
  const collidingInstances = new Set<string>();
  const wallCollisions = new Set<string>();
  const furnitureCollisions = new Set<string>();
  const collisionMessages: Record<string, string> = {};

  const halfRoomW = roomConfig.widthFt / 2;
  const halfRoomL = roomConfig.lengthFt / 2;

  // Cache catalog items map
  const itemMap = new Map<string, CatalogItem>();
  CATALOG_ITEMS.forEach((it) => itemMap.set(it.id, it));

  // 1. Check Wall Collisions
  for (const placed of placedList) {
    const meta = itemMap.get(placed.itemId);
    if (!meta) continue;

    const bounds = getItemFootprintBounds(meta, placed.x, placed.z, placed.rotationY);

    // If beyond walls (with 0.05 ft tolerance)
    if (
      bounds.maxX > halfRoomW + 0.05 ||
      bounds.minX < -halfRoomW - 0.05 ||
      bounds.maxZ > halfRoomL + 0.05 ||
      bounds.minZ < -halfRoomL - 0.05
    ) {
      wallCollisions.add(placed.instanceId);
      collidingInstances.add(placed.instanceId);
      collisionMessages[placed.instanceId] = 'Overlapping room perimeter wall';
    }
  }

  // 2. Check Inter-Furniture Collisions (Pairwise AABB overlap with safety buffer)
  for (let i = 0; i < placedList.length; i++) {
    const a = placedList[i];
    const metaA = itemMap.get(a.itemId);
    if (!metaA) continue;
    const boundsA = getItemFootprintBounds(metaA, a.x, a.z, a.rotationY);

    for (let j = i + 1; j < placedList.length; j++) {
      const b = placedList[j];
      const metaB = itemMap.get(b.itemId);
      if (!metaB) continue;
      const boundsB = getItemFootprintBounds(metaB, b.x, b.z, b.rotationY);

      // Check AABB intersection with 0.15 ft clearance margin
      const overlapX = Math.min(boundsA.maxX, boundsB.maxX) - Math.max(boundsA.minX, boundsB.minX);
      const overlapZ = Math.min(boundsA.maxZ, boundsB.maxZ) - Math.max(boundsA.minZ, boundsB.minZ);

      if (overlapX > 0.15 && overlapZ > 0.15) {
        furnitureCollisions.add(a.instanceId);
        furnitureCollisions.add(b.instanceId);
        collidingInstances.add(a.instanceId);
        collidingInstances.add(b.instanceId);
        collisionMessages[a.instanceId] = `Colliding with ${metaB.name}`;
        collisionMessages[b.instanceId] = `Colliding with ${metaA.name}`;
      }
    }
  }

  return {
    hasCollisions: collidingInstances.size > 0,
    collidingInstances,
    wallCollisions,
    furnitureCollisions,
    collisionMessages
  };
}

// Calculate total footprint area of placed furniture
export function calculateFurnitureFootprintSqFt(placedList: PlacedFurniture[]): number {
  const itemMap = new Map<string, CatalogItem>();
  CATALOG_ITEMS.forEach((it) => itemMap.set(it.id, it));

  let totalSqFt = 0;
  for (const p of placedList) {
    const meta = itemMap.get(p.itemId);
    if (meta) {
      totalSqFt += meta.widthFt * meta.depthFt;
    }
  }
  return Math.round(totalSqFt * 10) / 10;
}
