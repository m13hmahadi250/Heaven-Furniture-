import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import * as THREE from 'three';
import App from './App.tsx';
import './index.css';

// Configure Three.js logging to suppress known upstream deprecation notice (THREE.Clock used in R3F store)
// and non-fatal DirectX/ANGLE shader precision notes (warning X4122)
if (typeof THREE.setConsoleFunction === 'function') {
  THREE.setConsoleFunction((type, message, ...params) => {
    if (typeof message === 'string' && message.includes('Clock: This module has been deprecated')) {
      return;
    }
    if (typeof message === 'string' && message.includes('WebGLProgram: Program Info Log')) {
      const logStr = params.map((p) => (typeof p === 'string' ? p : '')).join(' ');
      if (logStr.includes('warning X4122') || !logStr.toLowerCase().includes('error')) {
        return;
      }
    }
    if (type === 'warn') {
      console.warn(message, ...params);
    } else if (type === 'error') {
      console.error(message, ...params);
    } else {
      console.log(message, ...params);
    }
  });
}

// Fallback filter for direct console.warn calls
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  const combined = args.map((a) => (typeof a === 'string' ? a : '')).join(' ');
  if (
    combined.includes('THREE.Clock: This module has been deprecated') ||
    (combined.includes('THREE.WebGLProgram: Program Info Log') && combined.includes('warning X4122'))
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

