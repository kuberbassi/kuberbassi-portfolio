import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KineticLandingPage from './pages/KineticLandingPage'; // Updated V3 Kinetic Glass Landing

// Lazy load heavy portfolios
const MusicPortfolio = lazy(() => import('./pages/MusicPortfolio'));
const DevPortfolio = lazy(() => import('./pages/DevPortfolio'));

function App() {
  return (
    <Router>
      <Suspense fallback={
        <div style={{ height: '100vh', width: '100vw', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Minimal Loading State */}
        </div>
      }>
        <Routes>
          <Route path="/" element={<KineticLandingPage />} />
          <Route path="/music" element={<MusicPortfolio />} />
          <Route path="/dev" element={<DevPortfolio />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
