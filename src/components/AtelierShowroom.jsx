import React, { useEffect, useRef, useState } from 'react';
import {
  VirtualRackExperience,
  GARMENT_DATA,
} from '../three/rackScene';
import {
  ArrowDown,
  ArrowUp,
  RotateCw,
  Wind,
  Compass,
  ChevronLeft,
  ChevronRight,
  Layers,
  X,
  Eye,
  Plus,
  Minus,
  MoreHorizontal,
  ShoppingBag,
} from 'lucide-react';
import ExperienceHeader from './ExperienceHeader';
import useKeyboardNav from '../hooks/useKeyboardNav';
import '../App.css';

export default function AtelierShowroom({ onReturnToPortal, bagCount, onAddToBag }) {
  const containerRef = useRef(null);
  const experienceRef = useRef(null);

  const [selectedGarment, setSelectedGarment] = useState(GARMENT_DATA[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [garmentState, setGarmentState] = useState('HANGING');

  // View controls row is collapsible on phones
  const [actionsOpen, setActionsOpen] = useState(false);

  // Macro Fabric Zoom Mode
  const [fabricInspectMode, setFabricInspectMode] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const exp = new VirtualRackExperience(
      containerRef.current,
      (data, state) => {
        setSelectedGarment(data);
        const idx = GARMENT_DATA.findIndex((g) => g.id === data.id);
        if (idx !== -1) setSelectedIndex(idx);
        if (state) setGarmentState(state);
      },
      (state) => {
        setGarmentState(state);
      }
    );

    experienceRef.current = exp;

    const interval = setInterval(() => {
      if (exp && exp.garments[exp.selectedIndex]) {
        setGarmentState(exp.garments[exp.selectedIndex].physics.state);
      }
    }, 150);

    return () => {
      clearInterval(interval);
      exp.destroy();
    };
  }, []);

  const handleSelect = (index) => {
    if (experienceRef.current) {
      experienceRef.current.selectGarment(index);
    }
  };

  const handleToggleDrop = () => {
    if (experienceRef.current) {
      experienceRef.current.toggleDropGarment();
    }
  };

  const handleNudge = () => {
    if (experienceRef.current) {
      experienceRef.current.nudgeSelected();
    }
  };

  const handleFlip = () => {
    if (experienceRef.current) {
      experienceRef.current.flipGarment();
    }
  };

  const handleResetCamera = () => {
    if (experienceRef.current) {
      experienceRef.current.resetCamera();
    }
    setFabricInspectMode(false);
  };

  const handleZoomIn = () => {
    if (experienceRef.current) {
      experienceRef.current.zoomIn(0.65);
    }
  };

  const handleZoomOut = () => {
    if (experienceRef.current) {
      experienceRef.current.zoomOut(0.75);
    }
  };

  const handlePrev = () => {
    const nextIdx = (selectedIndex - 1 + GARMENT_DATA.length) % GARMENT_DATA.length;
    handleSelect(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (selectedIndex + 1) % GARMENT_DATA.length;
    handleSelect(nextIdx);
  };

  const handleToggleFabricInspect = () => {
    const nextMode = !fabricInspectMode;
    setFabricInspectMode(nextMode);
    if (experienceRef.current) {
      experienceRef.current.setFabricInspect(nextMode);
    }
  };

  const handleAddToBag = () => {
    onAddToBag({ name: `${selectedGarment.name} Tee`, price: selectedGarment.price });
  };

  useKeyboardNav({
    onPrev: handlePrev,
    onNext: handleNext,
    onEscape: () => {
      if (fabricInspectMode) handleToggleFabricInspect();
      else setActionsOpen(false);
    },
  });

  const swatchColor = (item) => `#${item.color.toString(16).padStart(6, '0')}`;

  return (
    <div className="store-container">
      {/* 3D WebGL Canvas Viewport */}
      <div className="canvas-wrapper" ref={containerRef} />

      <ExperienceHeader
        title="ATELIER ÉTHOS"
        subtitle="AW26 HEAVYWEIGHT TEES"
        bagCount={bagCount}
        onBack={onReturnToPortal}
      />

      {/* Previous / next garment */}
      <div className="xp-nav-arrows">
        <button className="arrow-btn" onClick={handlePrev} aria-label="Previous garment" title="Previous garment (← key)">
          <ChevronLeft size={20} />
        </button>
        <button className="arrow-btn" onClick={handleNext} aria-label="Next garment" title="Next garment (→ key)">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Zoom controls */}
      <div className="xp-zoom-controls">
        <button className="zoom-btn" onClick={handleZoomIn} aria-label="Zoom in" title="Zoom in">
          <Plus size={16} />
        </button>
        <div className="zoom-divider" />
        <button className="zoom-btn" onClick={handleZoomOut} aria-label="Zoom out" title="Zoom out">
          <Minus size={16} />
        </button>
      </div>

      {/* Fabric close-up details */}
      {fabricInspectMode && (
        <aside className="fabric-side-panel">
          <div className="side-panel-header">
            <div className="header-badge">
              <Eye size={14} />
              <span>FABRIC CLOSE-UP</span>
            </div>
            <button
              className="panel-close-btn"
              onClick={handleToggleFabricInspect}
              aria-label="Close fabric close-up"
            >
              <X size={18} />
            </button>
          </div>

          <div className="side-panel-body">
            <h3 className="side-garment-name">{selectedGarment.name}</h3>
            <span className="side-garment-fit">{selectedGarment.fit}</span>

            <div className="fabric-spec-group">
              <span className="spec-heading">MATERIAL</span>
              <p className="spec-desc">{selectedGarment.fabric}</p>
            </div>

            <div className="fabric-spec-group">
              <span className="spec-heading">WEAVE & FINISH</span>
              <p className="spec-desc">{selectedGarment.finish}</p>
            </div>

            <div className="fabric-micro-features">
              <div className="feature-pill">280+ GSM cotton</div>
              <div className="feature-pill">Ribbed crew collar</div>
              <div className="feature-pill">Enzyme wash</div>
              <div className="feature-pill">Pre-shrunk</div>
            </div>

            <button className="exit-zoom-btn" onClick={handleToggleFabricInspect}>
              ← BACK TO RAIL
            </button>
          </div>
        </aside>
      )}

      {/* Product dock: always visible, works with tap or mouse */}
      <div className={`showroom-dock ${actionsOpen ? 'actions-open' : ''}`}>
        <div className="dock-identity">
          <div className="dock-title-line">
            <span className="dock-num-tag">{selectedGarment.num}</span>
            <span className="dock-garment-title">{selectedGarment.name}</span>
          </div>
          <div className="dock-meta-row">
            <span className="dock-garment-price">{selectedGarment.price}</span>
            <span className="meta-divider">·</span>
            <span className="dock-garment-fit">{selectedGarment.fit}</span>
          </div>
        </div>

        <div className="dock-swatches" role="group" aria-label="Colourway">
          {GARMENT_DATA.map((item, idx) => (
            <button
              key={item.id}
              className={`dock-swatch-btn ${idx === selectedIndex ? 'active' : ''}`}
              onClick={() => handleSelect(idx)}
              aria-label={item.name}
              aria-pressed={idx === selectedIndex}
              title={item.name}
            >
              <span className="swatch-chip" style={{ backgroundColor: swatchColor(item) }} />
            </button>
          ))}
        </div>

        <div className="dock-actions">
          <button
            className={`dock-action-btn ${fabricInspectMode ? 'active' : ''}`}
            onClick={handleToggleFabricInspect}
            aria-label="Fabric close-up"
          >
            <Layers size={14} />
            <span>FABRIC</span>
          </button>
          <button className="dock-action-btn" onClick={handleFlip} aria-label="Flip to see the back">
            <RotateCw size={14} />
            <span>FLIP</span>
          </button>
          <button
            className={`dock-action-btn ${garmentState !== 'HANGING' ? 'active' : ''}`}
            onClick={handleToggleDrop}
            aria-label={garmentState === 'HANGING' ? 'Drop garment to shelf' : 'Hang garment back on rail'}
          >
            {garmentState === 'HANGING' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
            <span>{garmentState === 'HANGING' ? 'DROP' : 'HANG'}</span>
          </button>
          <button className="dock-action-btn" onClick={handleNudge} aria-label="Sway the garment">
            <Wind size={14} />
            <span>SWAY</span>
          </button>
          <button className="dock-action-btn" onClick={handleResetCamera} aria-label="Reset camera">
            <Compass size={14} />
            <span>RESET</span>
          </button>
        </div>

        <button className="buy-btn dock-buy" onClick={handleAddToBag}>
          <ShoppingBag size={15} />
          <span>ADD TO BAG</span>
        </button>

        <button
          className="dock-more-btn"
          onClick={() => setActionsOpen((open) => !open)}
          aria-expanded={actionsOpen}
          aria-label={actionsOpen ? 'Hide view controls' : 'Show view controls'}
        >
          {actionsOpen ? <X size={18} /> : <MoreHorizontal size={18} />}
        </button>
      </div>
    </div>
  );
}
