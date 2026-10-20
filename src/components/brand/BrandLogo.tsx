import React from 'react';
import cgcLogo from '../../assets/cgc-logo.png';
import cgcLogoWhite from '../../assets/cgc-logo-white.png';
import saviskarLogoWhite from '../../assets/saviskar-logo-white.png';
import saviskarLogoDark from '../../assets/saviskar-logo-dark.png';

interface BrandLogoProps {
  className?: string;
  isDark?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', isDark = false }) => {
  const cgcImg = isDark ? cgcLogoWhite : cgcLogo;
  const saviskarImg = isDark ? saviskarLogoWhite : saviskarLogoDark;

  return (
    <div className={`flex items-center gap-3 sm:gap-4 ${className}`}>
      {/* CGC University Mohali Official Logo */}
      <img
        src={cgcImg}
        alt="CGC University Mohali"
        className="h-9 sm:h-11 md:h-12 w-auto object-contain transition-transform hover:scale-[1.03] duration-150"
      />

      {/* Clean vertical divider */}
      <div
        className={`h-7 sm:h-9 md:h-10 w-[1.5px] rounded-full transition-colors ${
          isDark ? 'bg-white/20' : 'bg-[#2c2531]/20'
        }`}
      />

      {/* Saviskar 2026 Official Fest Logo */}
      <img
        src={saviskarImg}
        alt="Saviskar 2026 - Aevorian Reverie"
        className="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform hover:scale-[1.03] duration-150"
      />
    </div>
  );
};
