import * as THREE from 'three';

// Generates procedural realistic canvas textures for wood grains, bouclé fabrics, marble, and leather
export function createWoodTexture(baseColorHex: string, grainDarkness: number = 0.25): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base timber tone
  ctx.fillStyle = baseColorHex;
  ctx.fillRect(0, 0, 1024, 1024);

  // Parse color to RGB
  const baseColor = new THREE.Color(baseColorHex);
  const r = Math.floor(baseColor.r * 255);
  const g = Math.floor(baseColor.g * 255);
  const b = Math.floor(baseColor.b * 255);

  // Fine longitudinal wood grain lines
  for (let i = 0; i < 600; i++) {
    const y = Math.random() * 1024;
    const waveFreq = 0.003 + Math.random() * 0.005;
    const waveAmp = 4 + Math.random() * 12;
    const darkRatio = 0.7 + Math.random() * 0.6;

    ctx.beginPath();
    ctx.strokeStyle = `rgba(${Math.max(0, Math.floor(r * (1 - grainDarkness * darkRatio)))}, ${Math.max(0, Math.floor(g * (1 - grainDarkness * darkRatio)))}, ${Math.max(0, Math.floor(b * (1 - grainDarkness * darkRatio)))}, ${0.15 + Math.random() * 0.25})`;
    ctx.lineWidth = 0.8 + Math.random() * 2.2;

    for (let x = 0; x <= 1024; x += 8) {
      const currentY = y + Math.sin(x * waveFreq) * waveAmp + Math.cos(x * 0.001) * 6;
      if (x === 0) ctx.moveTo(x, currentY);
      else ctx.lineTo(x, currentY);
    }
    ctx.stroke();
  }

  // Teak growth rings / knots
  for (let k = 0; k < 4; k++) {
    const kx = 150 + Math.random() * 700;
    const ky = 150 + Math.random() * 700;
    const radX = 30 + Math.random() * 50;
    const radY = 120 + Math.random() * 180;

    for (let ring = 0; ring < 6; ring++) {
      ctx.beginPath();
      ctx.ellipse(kx, ky, radX + ring * 12, radY + ring * 25, 0.1, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${Math.max(0, Math.floor(r * 0.6))}, ${Math.max(0, Math.floor(g * 0.6))}, ${Math.max(0, Math.floor(b * 0.6))}, 0.12)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

export function createFabricTexture(colorHex: string, pattern: 'boucle' | 'velvet' | 'leather' | 'linen' = 'boucle'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, 512, 512);

  const baseColor = new THREE.Color(colorHex);
  const r = Math.floor(baseColor.r * 255);
  const g = Math.floor(baseColor.g * 255);
  const b = Math.floor(baseColor.b * 255);

  if (pattern === 'boucle' || pattern === 'linen') {
    // Nubby woven Bouclé texture
    for (let x = 0; x < 512; x += 4) {
      for (let y = 0; y < 512; y += 4) {
        const isHighlight = (x + y) % 8 === 0;
        const shade = isHighlight ? 1.25 : 0.82;
        ctx.fillStyle = `rgba(${Math.min(255, Math.floor(r * shade))}, ${Math.min(255, Math.floor(g * shade))}, ${Math.min(255, Math.floor(b * shade))}, ${0.25 + Math.random() * 0.25})`;
        ctx.fillRect(x + Math.random() * 2, y + Math.random() * 2, 2.5, 2.5);
      }
    }
  } else if (pattern === 'leather') {
    // Natural pebbled grain leather
    for (let i = 0; i < 3500; i++) {
      const px = Math.random() * 512;
      const py = Math.random() * 512;
      const pr = 1.2 + Math.random() * 2.8;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.18)';
      ctx.fill();
    }
  } else {
    // Soft Velvet sheen fibers
    for (let y = 0; y < 512; y += 2) {
      ctx.fillStyle = Math.sin(y * 0.08) > 0 ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, y, 512, 1.5);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

export function createMarbleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#F4F2EB';
  ctx.fillRect(0, 0, 1024, 1024);

  // Gold & grey veins
  for (let v = 0; v < 18; v++) {
    let curX = Math.random() * 1024;
    let curY = 0;
    const isGold = Math.random() > 0.6;
    ctx.beginPath();
    ctx.strokeStyle = isGold ? 'rgba(212, 175, 55, 0.35)' : 'rgba(120, 120, 120, 0.25)';
    ctx.lineWidth = isGold ? 1.5 : 2.5;

    while (curY < 1024) {
      curX += (Math.random() - 0.5) * 24 + 10;
      curY += Math.random() * 30 + 10;
      ctx.lineTo(curX, curY);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  return texture;
}
