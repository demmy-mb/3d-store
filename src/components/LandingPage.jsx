import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Disc } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage({ onSelectExperience }) {
  // 'none' | 'atelier' | 'rudeboys'
  const [hoveredSide, setHoveredSide] = useState('none');

  return (
    <div className={`landing-container hover-${hoveredSide}`}>
      {/* Dynamic Background Atmosphere */}
      <div className="backdrop-layer">
        <div className="backdrop-atelier" />
        <div className="backdrop-rudeboys" />
      </div>

      {/* Top Header */}
      <header className="landing-top-bar">
        <div className="portal-brand">
          <span className="brand-dot" />
          <span className="portal-name">ÉTHOS × RUDE BOYS</span>
        </div>
        <span className="portal-season">AUTUMN / WINTER 2026 ARCHIVE</span>
      </header>

      {/* Split Interactive Screen */}
      <main className="split-wrapper">
        {/* Left Side: Atelier Éthos */}
        <section
          className={`split-side side-atelier ${hoveredSide === 'atelier' ? 'active-hover' : ''}`}
          onMouseEnter={() => setHoveredSide('atelier')}
          onMouseLeave={() => setHoveredSide('none')}
          onClick={() => onSelectExperience('ATELIER')}
        >
          <div className="side-content">
            <div className="side-category">
              <Sparkles size={12} />
              <span>01 / VIRTUAL SHOWROOM</span>
            </div>

            <h2 className="side-title">ATELIER ÉTHOS</h2>
            <p className="side-tagline">Minimalist Showroom & 8-Bone Dynamic Physics</p>

            <p className="side-description">
              Tailored heavyweight cotton garments rendered with real-time 8-bone spring dynamics, responsive rail sliding, and physical drop mechanics inside an infinite white cyclorama.
            </p>

            <div className="experience-pills">
              <span className="pill">8-Bone Cloth Rig</span>
              <span className="pill">Rail Physics</span>
              <span className="pill">Studio Lighting</span>
            </div>

            <button
              className="portal-btn atelier-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSelectExperience('ATELIER');
              }}
            >
              <span>ENTER SHOWROOM</span>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </section>

        {/* Center Divider Seam */}
        <div className="split-divider" />

        {/* Right Side: Rude Boys Museum */}
        <section
          className={`split-side side-rudeboys ${hoveredSide === 'rudeboys' ? 'active-hover' : ''}`}
          onMouseEnter={() => setHoveredSide('rudeboys')}
          onMouseLeave={() => setHoveredSide('none')}
          onClick={() => onSelectExperience('RUDEBOYS')}
        >
          <div className="side-content">
            <div className="side-category rudeboys-cat">
              <Disc size={12} />
              <span>02 / CONTEMPORARY EXHIBITION</span>
            </div>

            <h2 className="side-title rudeboys-title">RUDE BOYS</h2>
            <p className="side-tagline rudeboys-tagline">Circular Museum Rotunda & Street Art Gallery</p>

            <p className="side-description rudeboys-desc">
              Monumental circular gallery rotunda crowned with natural ceiling skyholes. Inspect original street art canvases, liquid chrome aerosol, and curatorial archives.
            </p>

            <div className="experience-pills">
              <span className="pill rudeboys-pill">Circular Rotunda</span>
              <span className="pill rudeboys-pill">Ceiling Skyholes</span>
              <span className="pill rudeboys-pill">Curatorial Archive</span>
            </div>

            <button
              className="portal-btn rudeboys-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSelectExperience('RUDEBOYS');
              }}
            >
              <span>ENTER MUSEUM</span>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </section>
      </main>

      {/* Footer Info */}
      <footer className="landing-footer">
        <span>INTERACTIVE 3D SPATIAL EXPERIENCES</span>
        <span>HOVER TO PREVIEW · CLICK TO ENTER</span>
      </footer>
    </div>
  );
}
