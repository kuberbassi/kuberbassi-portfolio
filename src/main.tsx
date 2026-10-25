import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './styles/globals.css';

// Section navigation uses URL hashes; don't restore a stale section/scroll on reload.
const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
if (navigationEntry?.type === 'reload') {
  window.history.scrollRestoration = 'manual';
  window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}`);
  window.scrollTo(0, 0);
  window.addEventListener('pageshow', () => { window.history.scrollRestoration = 'auto'; }, { once: true });
}

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
