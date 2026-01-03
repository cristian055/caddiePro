import React from 'react';

type IconName =
  | 'golf'
  | 'list'
  | 'people'
  | 'phone'
  | 'message'
  | 'chart'
  | 'lock'
  | 'settings'
  | 'arrow-left'
  | 'clipboard';

export const Icon: React.FC<{ name: IconName; className?: string; size?: number }> = ({ name, className = '', size = 18 }) => {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' } as any;

  switch (name) {
    case 'golf':
      return (
        <svg {...common} className={className}>
          <path d="M6 2v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M6 3.5c4.5-2 10 0 10 3.5s-5.5 5.5-10 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'list':
      return (
        <svg {...common} className={className}>
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'people':
      return (
        <svg {...common} className={className}>
          <path d="M17 21v-2a4 4 0 00-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 21v-2a4 4 0 013-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 7a4 4 0 110-8 4 4 0 010 8z" transform="translate(0,7)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...common} className={className}>
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 013 4.18 2 2 0 015 2h3a2 2 0 012 1.72c.12 1.05.38 2.07.78 3.02a2 2 0 01-.45 2.11L9.91 10.09a14.42 14.42 0 006 6l1.24-1.24a2 2 0 012.11-.45c.95.4 1.97.66 3.02.78A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case 'message':
      return (
        <svg {...common} className={className}>
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case 'chart':
      return (
        <svg {...common} className={className}>
          <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M12 17V8M7 17V11M17 17v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...common} className={className}>
          <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M7 11V8a5 5 0 0110 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...common} className={className}>
          <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 014.28 17.9l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82L4.21 4.9A2 2 0 016.9 2.28l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09c.12.66.48 1.22 1 1.51h.01a1.65 1.65 0 001.82-.33l.06-.06A2 2 0 0119.72 6.1l-.06.06a1.65 1.65 0 00-.33 1.82v.01c.25.46.4.98.4 1.52v.01c0 .54-.15 1.06-.4 1.52v.01z" stroke="currentColor" strokeWidth="0.6" fill="none" />
        </svg>
      );
    case 'arrow-left':
      return (
        <svg {...common} className={className}>
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case 'clipboard':
      return (
        <svg {...common} className={className}>
          <path d="M9 2h6a2 2 0 012 2v1H7V4a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
        </svg>
      );
    default:
      return null;
  }
};

export default Icon;
