import React, { useEffect, useRef, useState } from 'react';
import {
  RudeBoysMuseumExperience,
  RUDE_BOYS_ARTWORKS,
} from '../three/museumScene';
import { ChevronLeft, ChevronRight, Plus, Minus, X, ShoppingBag } from 'lucide-react';
import ExperienceHeader from './ExperienceHeader';
import useKeyboardNav from '../hooks/useKeyboardNav';
import './RudeBoysMuseum.css';

export default function RudeBoysMuseum({ onReturnToPortal, bagCount, onAddToBag }) {
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

  // Keep the active title visible in the scrollable strip on narrow screens
  const stripRef = useRef(null);
  useEffect(() => {
    const active = stripRef.current?.querySelector('.artwork-pill-btn.active');
    active?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [selectedIndex, selectedArtwork]);

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

  useKeyboardNav({
    onPrev: handlePrev,
    onNext: handleNext,
    onEscape: () => {
      if (selectedArtwork) handleExitFocus();
    },
  });

  return (
    <div className="museum-container">
      {/* 3D WebGL Canvas */}
      <div className="museum-canvas-wrapper" ref={containerRef} />

      <ExperienceHeader
        title="RUDE BOYS"
        subtitle="STREET ART ROTUNDA"
        badge="HALL 04 · EAST WING"
        bagCount={bagCount}
        onBack={onReturnToPortal}
      />

      {/* Previous / next artwork */}
      <div className="xp-nav-arrows">
        <button className="arrow-btn" onClick={handlePrev} aria-label="Previous artwork" title="Previous artwork (← key)">
          <ChevronLeft size={20} />
        </button>
        <button className="arrow-btn" onClick={handleNext} aria-label="Next artwork" title="Next artwork (→ key)">
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

      {/* Artwork details: left panel on desktop, bottom sheet on phones */}
      {selectedArtwork && (
        <aside className="artwork-left-panel">
          <div className="panel-header">
            <span className="panel-tag">{selectedArtwork.subtitle}</span>
            <button className="panel-close-btn" onClick={handleExitFocus} aria-label="Close artwork details">
              <X size={18} />
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
                <button
                  className="buy-btn panel-buy"
                  onClick={() => onAddToBag({ name: selectedArtwork.title, price: selectedArtwork.price })}
                >
                  <ShoppingBag size={15} />
                  <span>ADD TO BAG</span>
                </button>
                <button className="exit-focus-btn" onClick={handleExitFocus}>
                  ← BACK TO GALLERY
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Bottom Artworks Carousel Strip */}
      <footer className="museum-footer">
        <div className="artwork-strip" ref={stripRef}>
          {RUDE_BOYS_ARTWORKS.map((art, idx) => (
            <button
              key={art.id}
              className={`artwork-pill-btn ${idx === selectedIndex && selectedArtwork ? 'active' : ''}`}
              onClick={() => handleFocusArtwork(idx)}
              aria-pressed={idx === selectedIndex && !!selectedArtwork}
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
