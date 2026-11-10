import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Disc } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage({ onSelectExperience }) {
  // 'none' | 'atelier' | 'rudeboys'
  const [hoveredSide, setHoveredSide] = useState('none');

  return (
    <div className={`landing-container hover-${hoveredSide}`}>
      {/* Roughens the wordmark's edges, like a dry marker */}
      <svg className="rough-defs" aria-hidden="true">
        <filter id="rough-edge">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="5" />
        </filter>
      </svg>

      <header className="landing-hero">
        <h1 className="brand-wordmark" aria-label="RRUDE BOY">
          <span className="wordmark-r">R</span>RUDE BOY
        </h1>
        <p className="brand-line">Raw ideas turned into unapologetic art, objects, and experiences.</p>
      </header>

      {/* Split Interactive Screen */}
      <main className="split-wrapper">
        {/* Left Side: The Clothes */}
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

            <h2 className="side-title">THE CLOTHES</h2>
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

        {/* Right Side: The Work */}
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

            <h2 className="side-title rudeboys-title">THE WORK</h2>
            <p className="side-tagline rudeboys-tagline">Eight one-of-one pieces in a sunlit rotunda.</p>

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
    </div>
  );
}
