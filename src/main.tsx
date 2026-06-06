import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign WebSocket/HMR rejection and console error noise from Vite inside the iframe sandbox
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const msg = String(event.reason?.message || event.reason);
    if (
      msg.includes('WebSocket') || 
      msg.includes('websocket') || 
      msg.includes('HMR') || 
      msg.includes('hmr')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  const originalConsoleError = console.error;
  console.error = (...args) => {
    const errorStr = args.map(arg => String(arg)).join(' ');
    if (
      errorStr.includes('[vite] failed to connect to websocket') ||
      errorStr.includes('WebSocket connection') || 
      errorStr.includes('failed to connect to websocket')
    ) {
      // Log it silently to console.debug instead of console.error to keep developer console clear
      console.debug('[Vite-HMR-Muted]', ...args);
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

