import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KineticLandingPage from './pages/KineticLandingPage'; // Updated V3 Kinetic Glass Landing

// Lazy load heavy portfolios
const MusicPortfolio = lazy(() => import('./pages/MusicPortfolio'));
const DevPortfolio = lazy(() => import('./pages/DevPortfolio'));

function App() {
  const hostname = window.location.hostname;
  // Check for subdomains
  const isDevSubdomain = hostname.startsWith('dev.');
  const isMusicSubdomain = hostname.startsWith('music.');

  return (
    <Router>
      <Suspense fallback={
        <div style={{ height: '100vh', width: '100vw', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Minimal Loading State */}
        </div>
      }>
        <Routes>
          {/* Subdomain Routing Rules */}
          {isDevSubdomain && <Route path="*" element={<DevPortfolio />} />}
          {isMusicSubdomain && <Route path="*" element={<MusicPortfolio />} />}

          {/* Main Domain Routing (Fallback + Localhost Support) */}
          {!isDevSubdomain && !isMusicSubdomain && (
            <>
              <Route path="/" element={<KineticLandingPage />} />
              <Route path="/dev" element={<DevPortfolio />} />
              <Route path="/music" element={<MusicPortfolio />} />
            </>
          )}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
