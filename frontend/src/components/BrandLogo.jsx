import { useState } from 'react';
import './BrandLogo.css';

export default function BrandLogo({ className = '', compact = false }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={`brand-logo brand-logo-fallback ${compact ? 'compact' : ''} ${className}`}>
        Medan Smart City
      </span>
    );
  }

  return (
    <img
      className={`brand-logo ${compact ? 'compact' : ''} ${className}`}
      src="/medan-smart-city-logo.png"
      alt="Medan Smart City"
      onError={() => setFailed(true)}
    />
  );
}
