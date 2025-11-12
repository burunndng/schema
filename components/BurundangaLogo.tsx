import React from 'react';

interface BurundangaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BurundangaLogo: React.FC<BurundangaLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  const dimensions = sizeMap[size];

  return (
    <svg
      width={dimensions}
      height={dimensions}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle background */}
      <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" opacity="0.1" />

      {/* Therapy Couch - oversized and slightly tilted */}
      <g>
        {/* Couch base */}
        <rect x="15" y="45" width="70" height="12" rx="2" fill="currentColor" opacity="0.3" />
        {/* Couch back/pillow */}
        <rect x="15" y="30" width="8" height="30" rx="2" fill="currentColor" opacity="0.4" />
        {/* Armrest */}
        <circle cx="82" cy="52" r="5" fill="currentColor" opacity="0.3" />
      </g>

      {/* Person sitting on couch */}
      <g>
        {/* Head - geometric */}
        <circle cx="48" cy="22" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
        {/* Left eye - looking up pensively */}
        <circle cx="44" cy="20" r="1.5" fill="currentColor" />
        {/* Right eye - looking up pensively */}
        <circle cx="52" cy="20" r="1.5" fill="currentColor" />
        {/* Mouth - slight concerned expression */}
        <path d="M 44 26 Q 48 27 52 26" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Body - sitting position */}
        <rect x="42" y="33" width="12" height="15" rx="1" stroke="currentColor" strokeWidth="2.5" fill="none" />

        {/* Arms */}
        <line x1="42" y1="38" x2="30" y2="42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="54" y1="38" x2="66" y2="42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />

        {/* Legs - dangling */}
        <line x1="44" y1="48" x2="42" y2="62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="52" y1="48" x2="54" y2="62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Thought bubbles - representing schemas/thoughts */}
      <g>
        <circle cx="68" cy="15" r="3" fill="currentColor" opacity="0.6" />
        <circle cx="75" cy="12" r="2.5" fill="currentColor" opacity="0.4" />
        <circle cx="80" cy="10" r="2" fill="currentColor" opacity="0.2" />
      </g>

      {/* Gradient definition */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0.5 }} />
        </linearGradient>
      </defs>
    </svg>
  );
};
