import React from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

/**
 * Header shared by the showroom and the museum so both read as one store.
 */
export default function ExperienceHeader({ title, subtitle, badge, bagCount, onBack, onBagClick }) {
  return (
    <header className="xp-header">
      <div className="xp-header-left">
        {onBack && (
          <button className="xp-back-btn" onClick={onBack} aria-label="Back to portal">
            <ArrowLeft size={14} />
            <span className="back-label">PORTAL</span>
          </button>
        )}
        <div className="xp-title-block">
          <h1 className="xp-title">{title}</h1>
          <span className="xp-subtitle">{subtitle}</span>
        </div>
      </div>

      <div className="xp-header-right">
        {badge && <span className="xp-badge">{badge}</span>}
        <button
          className="bag-pill"
          onClick={onBagClick}
          disabled={!onBagClick}
          aria-label={`${bagCount} items in bag, go to checkout`}
        >
          <ShoppingBag size={14} />
          <span className="bag-label">BAG</span>
          <span className="bag-count">{bagCount}</span>
        </button>
      </div>
    </header>
  );
}
