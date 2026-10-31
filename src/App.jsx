import React, { useEffect, useState } from 'react';
import LandingPage from './components/LandingPage';
import AtelierShowroom from './components/AtelierShowroom';
import RudeBoysMuseum from './components/RudeBoysMuseum';

export default function App() {
  // 'PORTAL' | 'ATELIER' | 'RUDEBOYS'
  const [currentView, setCurrentView] = useState('PORTAL');

  // Front-end bag shared by both experiences (no checkout wired yet)
  const [bag, setBag] = useState([]);
  const [toast, setToast] = useState(null);

  const handleAddToBag = (item) => {
    setBag((prev) => [...prev, item]);
    setToast(`${item.name} added to bag · ${item.price}`);
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <>
      {currentView === 'PORTAL' && (
        <LandingPage onSelectExperience={(exp) => setCurrentView(exp)} />
      )}

      {currentView === 'ATELIER' && (
        <AtelierShowroom
          onReturnToPortal={() => setCurrentView('PORTAL')}
          bagCount={bag.length}
          onAddToBag={handleAddToBag}
        />
      )}

      {currentView === 'RUDEBOYS' && (
        <RudeBoysMuseum
          onReturnToPortal={() => setCurrentView('PORTAL')}
          bagCount={bag.length}
          onAddToBag={handleAddToBag}
        />
      )}

      {toast && (
        <div className="bag-toast" role="status">
          {toast}
        </div>
      )}
    </>
  );
}
