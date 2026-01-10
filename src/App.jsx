import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MusicPortfolio from './pages/MusicPortfolio';
import DevPortfolio from './pages/DevPortfolio';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/music" element={<MusicPortfolio />} />
        <Route path="/dev" element={<DevPortfolio />} />
      </Routes>
    </Router>
  );
}

export default App;
