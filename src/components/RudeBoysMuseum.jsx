import React, { useEffect, useRef, useState } from 'react';
import {
  RudeBoysMuseumExperience,
  RUDE_BOYS_ARTWORKS,
} from '../three/museumScene';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Compass,
  X,
  Layers,
} from 'lucide-react';
import './RudeBoysMuseum.css';

export default function RudeBoysMuseum({ onReturnToPortal }) {
  const containerRef = useRef(null);
  const experienceRef = useRef(null);

  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const exp = new RudeBoysMuseumExperience(
      containerRef.current,
      (artworkData) => {
        setSelectedArtwork(artworkData);
        if (artworkData) {
          const idx = RUDE_BOYS_ARTWORKS.findIndex((a) => a.id === artworkData.id);
          if (idx !== -1) setSelectedIndex(idx);
        }
      }
    );

    experienceRef.current = exp;

    return () => {
      exp.destroy();
    };
  }, []);

  const handleFocusArtwork = (index) => {
    setSelectedIndex(index);
    if (experienceRef.current) {
      experienceRef.current.focusArtwork(index);
    }
  };

  const handleExitFocus = () => {
    setSelectedArtwork(null);
    if (experienceRef.current) {
      experienceRef.current.exitFocus();
    }
  };

  const handlePrev = () => {
    const nextIdx = (selectedIndex - 1 + RUDE_BOYS_ARTWORKS.length) % RUDE_BOYS_ARTWORKS.length;
    handleFocusArtwork(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (selectedIndex + 1) % RUDE_BOYS_ARTWORKS.length;
    handleFocusArtwork(nextIdx);
  };

  const handleZoomIn = () => {
    if (experienceRef.current) {
      experienceRef.current.zoomIn(0.7);
    }
  };

  const handleZoomOut = () => {
    if (experienceRef.current) {
      experienceRef.current.zoomOut(0.85);
    }
  };

  return (
    <div className="museum-container">
      {/* 3D WebGL Canvas */}
      <div className="museum-canvas-wrapper" ref={containerRef} />

      {/* Top Header */}
      <header className="museum-header">
        <div className="museum-header-left">
          <button className="back-portal-btn" onClick={onReturnToPortal}>
            <ArrowLeft size={14} />
            <span>RETURN TO PORTAL</span>
          </button>
          <div className="museum-title-block">
            <h1 className="museum-title">RUDE BOYS</h1>
            <span className="museum-subtitle">3D GRAFFITI ART MUSEUM</span>
          </div>
        </div>

        <div className="museum-header-right">
          <span className="museum-hall-badge">GALLERY HALL № 04 · EAST WING</span>
        </div>
      </header>

      {/* Floating Left/Right Artwork Navigation Arrows */}
      <div className="museum-nav-arrows">
        <button className="arrow-btn" onClick={handlePrev} title="Previous artwork">
          <ChevronLeft size={18} />
        </button>
        <button className="arrow-btn" onClick={handleNext} title="Next artwork">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Floating 3D Viewport Zoom Controls (+ / -) */}
      <div className="museum-zoom-controls">
        <button className="zoom-btn" onClick={handleZoomIn} title="Zoom in to paint details">
          <Plus size={14} />
        </button>
        <div className="zoom-divider" />
        <button className="zoom-btn" onClick={handleZoomOut} title="Zoom out to gallery">
          <Minus size={14} />
        </button>
      </div>

      {/* Artwork Inspection Detail Panel: Appears on the LEFT side of the screen! */}
      {selectedArtwork && (
        <aside className="artwork-left-panel">
          <div className="panel-header">
            <span className="panel-tag">{selectedArtwork.subtitle}</span>
            <button className="panel-close-btn" onClick={handleExitFocus} title="Exit artwork view">
              <X size={16} />
            </button>
          </div>

          <div className="panel-body">
            <h2 className="artwork-title">{selectedArtwork.title}</h2>
            <span className="artwork-artist">{selectedArtwork.artist} · {selectedArtwork.year}</span>

            <div className="artwork-spec-row">
              <span className="spec-label">MEDIUM & SURFACE</span>
              <p className="spec-value">{selectedArtwork.medium}</p>
            </div>

            <div className="artwork-spec-row">
              <span className="spec-label">DIMENSIONS</span>
              <p className="spec-value">{selectedArtwork.dimensions}</p>
            </div>

            <div className="artwork-spec-row">
              <span className="spec-label">CURATORIAL ESSAY</span>
              <p className="spec-value artwork-desc">{selectedArtwork.description}</p>
            </div>

            <div className="artwork-footer-info">
              <div className="price-edition-block">
                <span className="edition-tag">{selectedArtwork.edition}</span>
                <span className="artwork-price">{selectedArtwork.price}</span>
              </div>

              <div className="panel-button-row">
                <button className="exit-focus-btn" onClick={handleExitFocus}>
                  <span>← FULL GALLERY VIEW</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Bottom Artworks Carousel Strip */}
      <footer className="museum-footer">
        <div className="artwork-strip">
          {RUDE_BOYS_ARTWORKS.map((art, idx) => (
            <button
              key={art.id}
              className={`artwork-pill-btn ${idx === selectedIndex && selectedArtwork ? 'active' : ''}`}
              onClick={() => handleFocusArtwork(idx)}
            >
              <span className="art-dot" style={{ backgroundColor: art.colorTheme }} />
              <span className="art-name">{art.title}</span>
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
