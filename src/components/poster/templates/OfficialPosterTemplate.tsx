import React from 'react';
import { PosterData, AttendeeRole } from '../../../types/poster';
import studentTemplate from '../../../assets/templates/template-student.jpg';
import speakerTemplate from '../../../assets/templates/template-speaker.jpg';
import startupTemplate from '../../../assets/templates/template-startup.jpg';
import investorTemplate from '../../../assets/templates/template-investor.jpg';
import hostTemplate from '../../../assets/templates/template-host.jpg';

const TEMPLATE_IMAGES: Record<AttendeeRole, string> = {
  Speaker: speakerTemplate,
  Startup: startupTemplate,
  Investor: investorTemplate,
  Host: hostTemplate,
};

interface OfficialPosterTemplateProps {
  data: PosterData;
}

export const OfficialPosterTemplate: React.FC<OfficialPosterTemplateProps> = ({ data }) => {
  const activeTemplateImg = TEMPLATE_IMAGES[data.role || 'Speaker'] || speakerTemplate;

  const rawName = (data.name || 'FULL NAME').trim();
  const nameLen = rawName.length;
  const nameWords = rawName.split(/\s+/);
  const longestNameWord = Math.max(...nameWords.map((w) => w.length), 0);

  // Dynamic font sizing intelligence for Name:
  // Dynamically adapts based on total length and longest word to prevent overflow
  let nameSizeClass = 'text-xl sm:text-2xl md:text-3xl lg:text-4xl';
  let nameInlineStyle: React.CSSProperties = {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 'clamp(0.95rem, 4.4cqi, 2.3rem)',
    lineHeight: '1.05',
    letterSpacing: '-0.025em',
  };

  if (nameLen >= 30 || longestNameWord >= 14) {
    nameSizeClass = 'text-xs sm:text-sm md:text-base lg:text-lg';
    nameInlineStyle = {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: 'clamp(0.75rem, 2.3cqi, 1.15rem)',
      lineHeight: '1.16',
      letterSpacing: '-0.01em',
    };
  } else if (nameLen >= 22 || longestNameWord >= 11) {
    nameSizeClass = 'text-sm sm:text-base md:text-lg lg:text-xl';
    nameInlineStyle = {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: 'clamp(0.9rem, 2.9cqi, 1.45rem)',
      lineHeight: '1.12',
      letterSpacing: '-0.015em',
    };
  } else if (nameLen >= 15 || longestNameWord >= 9) {
    nameSizeClass = 'text-base sm:text-lg md:text-xl lg:text-2xl';
    nameInlineStyle = {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: 'clamp(1.05rem, 3.6cqi, 1.85rem)',
      lineHeight: '1.08',
      letterSpacing: '-0.02em',
    };
  }

  // Dynamic font sizing for Designation
  const desigLen = (data.designation || 'DESIGNATION').trim().length;
  const desigStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize:
      desigLen > 24
        ? 'clamp(0.65rem, 1.9cqi, 0.95rem)'
        : 'clamp(0.76rem, 2.3cqi, 1.12rem)',
    lineHeight: '1.2',
  };

  // Dynamic font sizing for Organization
  const orgLen = (data.organization || 'ORGANIZATION').trim().length;
  const orgStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize:
      orgLen > 30
        ? 'clamp(0.85rem, 2.6cqi, 1.25rem)'
        : orgLen > 20
        ? 'clamp(0.98rem, 3.0cqi, 1.45rem)'
        : 'clamp(1.1rem, 3.4cqi, 1.65rem)',
    lineHeight: '1.25',
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#03040c] font-sans">
      {/* 1. Official Festival Template Graphic for the selected Role */}
      <img
        src={activeTemplateImg}
        alt={`Saviskar 2026 ${data.role || 'Attendee'} Poster Template`}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* 2. Photo Area (Fits accurately inside the beveled neon frame on the left) */}
      {data.photoUrl && (
        <div
          className="absolute z-10 overflow-hidden"
          style={{
            left: '8.6%',
            top: '34.0%',
            width: '35.4%',
            height: '37.0%',
            clipPath:
              'polygon(9% 0%, 91% 0%, 100% 7%, 100% 93%, 91% 100%, 9% 100%, 0% 93%, 0% 7%)',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            willChange: 'transform',
          }}
        >
          <img
            src={data.photoUrl}
            alt={data.name || 'Attendee'}
            crossOrigin={
              data.photoUrl.startsWith('data:') || data.photoUrl.startsWith('blob:')
                ? undefined
                : 'anonymous'
            }
            className="w-full h-full object-cover object-top"
            style={{
              imageRendering: '-webkit-optimize-contrast' as any,
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          />
        </div>
      )}

      {/* 3. Attendee Text Details on the right (Minimal, dynamic sizing, beautifully spaced) */}
      <div
        className="absolute z-10 flex flex-col justify-start pointer-events-none"
        style={{
          left: '52.5%',
          top: '46.0%',
          width: '42.5%',
          maxHeight: '38%',
          overflow: 'hidden',
        }}
      >
        {/* Full Name (with dynamic font size scaling) */}
        <h1
          className={`font-black tracking-tight uppercase text-[#190f40] transition-all duration-150 ${nameSizeClass}`}
          style={{
            ...nameInlineStyle,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {data.name || 'FULL NAME'}
        </h1>

        {/* Designation */}
        <p
          className="mt-1.5 sm:mt-2 font-bold uppercase tracking-wider text-[#3c286b] leading-snug line-clamp-2 transition-all duration-150"
          style={{
            ...desigStyle,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {data.designation || 'DESIGNATION'}
        </p>

        {/* Organization */}
        <p
          className="mt-1.5 font-semibold text-[#483375] leading-snug line-clamp-3 transition-all duration-150"
          style={{
            ...orgStyle,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {data.organization || 'ORGANIZATION'}
        </p>
      </div>
    </div>
  );
};
