import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { Capacitor } from '@capacitor/core';
import './index.css';
import App from './App.tsx';

async function init() {
  if (Capacitor.getPlatform() === 'web') {
    const { defineCustomElements } = await import('jeep-sqlite/loader');
    defineCustomElements(window);
    await customElements.whenDefined('jeep-sqlite');
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
      <Analytics />
    </StrictMode>
  );
}

init();
