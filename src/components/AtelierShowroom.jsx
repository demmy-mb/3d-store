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
  ArrowLeft,
} from 'lucide-react';
import '../App.css';

export default function AtelierShowroom({ onReturnToPortal }) {
  const containerRef = useRef(null);
  const experienceRef = useRef(null);
  const hoverTimerRef = useRef(null);

  const [selectedGarment, setSelectedGarment] = useState(GARMENT_DATA[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [garmentState, setGarmentState] = useState('HANGING');

  // Dock display states: 'MINIMAL' (3 dots) | 'SWATCHES' (all colors pill) | 'EXPANDED' (full dock)
  const [dockState, setDockState] = useState('MINIMAL');

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
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
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

  const handleDockMouseEnter = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setDockState('SWATCHES');
    hoverTimerRef.current = setTimeout(() => {
      setDockState('EXPANDED');
    }, 300);
  };

  const handleDockMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setDockState('MINIMAL');
  };

  const handleSwatchClick = (idx, e) => {
    e.stopPropagation();
    handleSelect(idx);
    setDockState('EXPANDED');
  };

  const previewIndices = [
    (selectedIndex - 1 + GARMENT_DATA.length) % GARMENT_DATA.length,
    selectedIndex,
    (selectedIndex + 1) % GARMENT_DATA.length,
  ];

  return (
    <div className="store-container">
      {/* 3D WebGL Canvas Viewport */}
      <div className="canvas-wrapper" ref={containerRef} />

      {/* Top Brand Header */}
      <header className="brand-header">
        <div className="brand-left">
          <button className="back-portal-btn" onClick={onReturnToPortal}>
            <ArrowLeft size={13} />
            <span>PORTAL</span>
          </button>
          <div className="brand-text-block">
            <h1 className="brand-title">ATELIER ÉTHOS</h1>
            <span className="brand-sub">3D CLOTHING RACK SHOWROOM</span>
          </div>
        </div>

        <nav className="header-nav">
          <button
            className="nav-action-btn"
            onClick={handleNudge}
            title="Simulate wind to test cloth sway"
          >
            <Wind size={13} />
            <span>SWISH BREEZE</span>
          </button>
        </nav>
      </header>

      {/* Floating Left/Right Arrows for Quick Switching */}
      <div className="carousel-nav-arrows">
        <button className="arrow-btn" onClick={handlePrev} title="Previous garment (Left)">
          <ChevronLeft size={18} />
        </button>
        <button className="arrow-btn" onClick={handleNext} title="Next garment (Right)">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Floating Quick Zoom Controls (+ / -) */}
      <div className="viewport-zoom-controls">
        <button className="zoom-btn" onClick={handleZoomIn} title="Zoom in to fabric">
          <Plus size={14} />
        </button>
        <div className="zoom-divider" />
        <button className="zoom-btn" onClick={handleZoomOut} title="Zoom out to full room">
          <Minus size={14} />
        </button>
      </div>

      {/* Floating Side Fabric Detail Card (Appears beside the shirt when zoomed in) */}
      {fabricInspectMode && (
        <aside className="fabric-side-panel">
          <div className="side-panel-header">
            <div className="header-badge">
              <Eye size={12} />
              <span>MACRO WEAVE INSPECTION</span>
            </div>
            <button
              className="panel-close-btn"
              onClick={handleToggleFabricInspect}
              title="Exit zoom view"
            >
              <X size={15} />
            </button>
          </div>

          <div className="side-panel-body">
            <h3 className="side-garment-name">{selectedGarment.name}</h3>
            <span className="side-garment-fit">{selectedGarment.fit}</span>

            <div className="fabric-spec-group">
              <span className="spec-heading">MATERIAL COMPOSITION</span>
              <p className="spec-desc">{selectedGarment.fabric}</p>
            </div>

            <div className="fabric-spec-group">
              <span className="spec-heading">TACTILE WEAVE & FINISH</span>
              <p className="spec-desc">{selectedGarment.finish}</p>
            </div>

            <div className="fabric-micro-features">
              <div className="feature-pill">280+ GSM Heavy Cotton</div>
              <div className="feature-pill">Ribbed Crewneck Collar</div>
              <div className="feature-pill">Enzyme Peach Skin Wash</div>
              <div className="feature-pill">Pre-Shrunk Compact Yarn</div>
            </div>

            <button className="exit-zoom-btn" onClick={handleToggleFabricInspect}>
              <span>← EXIT CLOSE-UP VIEW</span>
            </button>
          </div>
        </aside>
      )}

      {/* Interactive Hover-To-Reveal Bottom Dock */}
      <div
        className={`hover-dock-trigger ${dockState}`}
        onMouseEnter={handleDockMouseEnter}
        onMouseLeave={handleDockMouseLeave}
      >
        {/* State 1: Minimal 3-Color Dot Pill (Default Rest State) */}
        {dockState === 'MINIMAL' && (
          <div className="dock-pill minimal-pill">
            <div className="three-dots-row">
              {previewIndices.map((idx, pos) => (
                <span
                  key={pos}
                  className={`color-preview-dot ${idx === selectedIndex ? 'active' : ''}`}
                  style={{
                    backgroundColor: `#${GARMENT_DATA[idx].color.toString(16).padStart(6, '0')}`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* State 2: Swatches Pill (Hovered) */}
        {dockState === 'SWATCHES' && (
          <div className="dock-pill swatches-pill">
            <div className="full-swatches-strip">
              {GARMENT_DATA.map((item, idx) => (
                <button
                  key={item.id}
                  className={`dock-swatch-btn ${idx === selectedIndex ? 'active' : ''}`}
                  style={{ backgroundColor: `#${item.color.toString(16).padStart(6, '0')}` }}
                  onClick={(e) => handleSwatchClick(idx, e)}
                  title={item.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* State 3: Full Pop-Out Dock (Stayed on / Clicked) */}
        {dockState === 'EXPANDED' && (
          <div className="dock-pill expanded-dock">
            {/* Left Section: Garment Identity */}
            <div className="dock-identity-section">
              <div className="identity-text">
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
            </div>

            {/* Center Section: Full Color Swatches */}
            <div className="dock-palette-section">
              <div className="dock-swatches">
                {GARMENT_DATA.map((item, idx) => (
                  <button
                    key={item.id}
                    className={`dock-swatch-btn ${idx === selectedIndex ? 'active' : ''}`}
                    style={{ backgroundColor: `#${item.color.toString(16).padStart(6, '0')}` }}
                    onClick={(e) => handleSwatchClick(idx, e)}
                    title={item.name}
                  />
                ))}
              </div>
            </div>

            {/* Right Section: Actions */}
            <div className="dock-action-section">
              {/* Zoom Into Fabric */}
              <button
                className={`dock-action-btn ${fabricInspectMode ? 'active-zoom' : ''}`}
                onClick={handleToggleFabricInspect}
                title="Zoom into shirt fabric details"
              >
                <Layers size={11} />
                <span>{fabricInspectMode ? 'CLOSE FABRIC' : 'FABRIC'}</span>
              </button>

              {/* Drop / Hang Button */}
              <button
                className={`dock-action-btn primary ${garmentState !== 'HANGING' ? 'fallen' : ''}`}
                onClick={handleToggleDrop}
                title={garmentState === 'HANGING' ? 'Drop garment to bottom shelf' : 'Hang garment back on rack'}
              >
                {garmentState === 'HANGING' ? (
                  <>
                    <ArrowDown size={12} />
                    <span>DROP</span>
                  </>
                ) : (
                  <>
                    <ArrowUp size={12} />
                    <span>HANG</span>
                  </>
                )}
              </button>

              {/* Flip Front / Back */}
              <button
                className="dock-action-btn"
                onClick={handleFlip}
                title="Rotate 180° to inspect back"
              >
                <RotateCw size={11} />
                <span>FLIP</span>
              </button>

              {/* Test Sway */}
              <button
                className="dock-action-btn"
                onClick={handleNudge}
                title="Simulate wind to test cloth sway"
              >
                <Wind size={11} />
                <span>SWAY</span>
              </button>

              {/* Reset Camera */}
              <button
                className="dock-action-btn"
                onClick={handleResetCamera}
                title="Reset 3D camera"
              >
                <Compass size={11} />
                <span>RESET</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
