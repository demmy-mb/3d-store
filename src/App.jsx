import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import AtelierShowroom from './components/AtelierShowroom';
import RudeBoysMuseum from './components/RudeBoysMuseum';

export default function App() {
  // 'PORTAL' | 'ATELIER' | 'RUDEBOYS'
  const [currentView, setCurrentView] = useState('PORTAL');

  return (
    <>
      {currentView === 'PORTAL' && (
        <LandingPage onSelectExperience={(exp) => setCurrentView(exp)} />
      )}

      {currentView === 'ATELIER' && (
        <AtelierShowroom onReturnToPortal={() => setCurrentView('PORTAL')} />
      )}

      {currentView === 'RUDEBOYS' && (
        <RudeBoysMuseum onReturnToPortal={() => setCurrentView('PORTAL')} />
      )}
    </>
  );
}
