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
              <span>01 / THE SHOWROOM</span>
            </div>

            <h2 className="side-title">ATELIER ÉTHOS</h2>
            <p className="side-tagline">Heavyweight tees, hung on a live rail.</p>

            <p className="side-description">
              Browse six colourways of the AW26 tee. Slide the rail, flip each piece to see the back, and zoom in close enough to read the knit.
            </p>

            <div className="experience-pills">
              <span className="pill">6 colourways</span>
              <span className="pill">From $85</span>
              <span className="pill">Fabric close-up</span>
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
              <span>02 / THE EXHIBITION</span>
            </div>

            <h2 className="side-title rudeboys-title">RUDE BOYS</h2>
            <p className="side-tagline rudeboys-tagline">Eight original street works in a sunlit rotunda.</p>

            <p className="side-description rudeboys-desc">
              Walk the circular gallery, step up to any canvas, and read the story behind it. Every piece is a one-of-one original.
            </p>

            <div className="experience-pills">
              <span className="pill rudeboys-pill">8 originals</span>
              <span className="pill rudeboys-pill">1 of 1 editions</span>
              <span className="pill rudeboys-pill">Curator notes</span>
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
        <span>INTERACTIVE 3D STORE</span>
        <span>CHOOSE A SPACE TO ENTER</span>
      </footer>
    </div>
  );
}
