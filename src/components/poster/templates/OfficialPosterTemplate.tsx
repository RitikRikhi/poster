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

  // Dynamic font sizing intelligence for Name Heading with robust rem/cqi fallbacks
  let nameInlineStyle: React.CSSProperties = {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 'clamp(0.92rem, 3.0cqi, 1.85rem)',
    lineHeight: '1.1',
    letterSpacing: '-0.025em',
    color: '#120836',
  };

  if (nameLen >= 30 || longestNameWord >= 14) {
    nameInlineStyle = {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: 'clamp(0.72rem, 2.0cqi, 1.05rem)',
      lineHeight: '1.16',
      letterSpacing: '-0.01em',
      color: '#120836',
    };
  } else if (nameLen >= 22 || longestNameWord >= 11) {
    nameInlineStyle = {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: 'clamp(0.80rem, 2.35cqi, 1.25rem)',
      lineHeight: '1.12',
      letterSpacing: '-0.015em',
      color: '#120836',
    };
  } else if (nameLen >= 13 || longestNameWord >= 8) {
    nameInlineStyle = {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: 'clamp(0.86rem, 2.65cqi, 1.48rem)',
      lineHeight: '1.1',
      letterSpacing: '-0.02em',
      color: '#120836',
    };
  }

  // Dynamic font sizing for Designation
  const desigLen = (data.designation || 'DESIGNATION').trim().length;
  const desigStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize:
      desigLen > 28
        ? 'clamp(0.58rem, 1.65cqi, 0.82rem)'
        : desigLen > 20
        ? 'clamp(0.65rem, 1.85cqi, 0.94rem)'
        : 'clamp(0.72rem, 2.05cqi, 1.05rem)',
    lineHeight: '1.22',
    letterSpacing: '0.04em',
    color: '#3c286b',
  };

  // Dynamic font sizing for Organization
  const orgLen = (data.organization || 'ORGANIZATION').trim().length;
  const orgStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize:
      orgLen > 30
        ? 'clamp(0.62rem, 1.75cqi, 0.88rem)'
        : orgLen > 20
        ? 'clamp(0.68rem, 1.95cqi, 0.98rem)'
        : 'clamp(0.74rem, 2.15cqi, 1.08rem)',
    lineHeight: '1.24',
    letterSpacing: '0.05em',
    color: '#533d7d',
  };

  // Role-based or custom Vision Tagline (sleek, punchy, and spacious)
  const getParagraph = () => {
    if (data.tagline !== undefined) {
      return data.tagline.trim();
    }
    switch (data.role) {
      case 'Speaker':
        return "Inspiring 35,000+ creators & innovators at SAVISKAR 2026.";
      case 'Startup':
        return "Demoing breakthrough tech & inventions at SAVISKAR 2026.";
      case 'Investor':
        return "Empowering India's next generation of student builders.";
      case 'Host':
        return "Electrifying the mainstage at SAVISKAR 2026 • CGC University.";
      default:
        return "Uniting 35,000+ innovators under the Mohali stars at SAVISKAR 2026.";
    }
  };

  const paragraphText = getParagraph();

  // Photo transform controls (zoom + pan offset)
  const photoScale = data.photoScale ?? 1;
  const photoOffsetY = data.photoOffsetY ?? 0;
  const photoOffsetX = data.photoOffsetX ?? 0;

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none bg-[#03040c] font-sans"
      style={{ color: '#120836' }}
    >
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
            className="w-full h-full object-cover"
            style={{
              imageRendering: '-webkit-optimize-contrast' as any,
              transform: `translate(${photoOffsetX}%, ${photoOffsetY}%) scale(${photoScale}) translateZ(0)`,
              WebkitTransform: `translate(${photoOffsetX}%, ${photoOffsetY}%) scale(${photoScale}) translateZ(0)`,
              transformOrigin: 'center center',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          />
        </div>
      )}

      {/* 3. Attendee Text Details on the right (Spacious, airy, executive hierarchy) */}
      <div
        className="absolute z-10 flex flex-col justify-start pointer-events-none"
        style={{
          left: '50.5%',
          top: '43.5%',
          width: '45.0%',
          maxHeight: '41%',
          overflow: 'hidden',
        }}
      >
        {/* Full Name Heading - full width for crisp readability */}
        <h1
          className="font-black tracking-tight uppercase transition-all duration-150"
          style={{
            ...nameInlineStyle,
            color: '#120836',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {data.name || 'FULL NAME'}
        </h1>

        {/* Designation */}
        <p
          className="font-bold uppercase tracking-wider leading-tight line-clamp-2 transition-all duration-150"
          style={{
            ...desigStyle,
            marginTop: '5px',
            color: '#3c286b',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {data.designation || 'DESIGNATION'}
        </p>

        {/* Organization / Department */}
        <p
          className="font-semibold uppercase tracking-wider leading-tight line-clamp-2 transition-all duration-150"
          style={{
            ...orgStyle,
            marginTop: '4px',
            color: '#533d7d',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {data.organization
            ? data.department && !data.organization.includes('/')
              ? `${data.organization} / ${data.department}`
              : data.organization
            : 'CGC UNIVERSITY / MOHALI'}
        </p>

        {/* Optional Punchy Tagline / Vision Quote (generous breathing room, completely optional) */}
        {paragraphText && (
          <div
            className="mt-3 sm:mt-3.5 pt-2 sm:pt-2.5"
            style={{ borderTop: '1.5px solid rgba(25, 15, 64, 0.14)' }}
          >
            <p
              className="font-medium leading-relaxed transition-all duration-150"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize:
                  paragraphText.length > 90
                    ? 'clamp(0.58rem, 1.65cqi, 0.78rem)'
                    : 'clamp(0.64rem, 1.85cqi, 0.88rem)',
                lineHeight: '1.38',
                letterSpacing: '-0.005em',
                color: '#261b47',
                margin: 0,
              }}
            >
              {paragraphText.split(/(SAVISKAR 2026|SAVISKAR|CGC University)/g).map((part, index) => {
                if (part === 'SAVISKAR 2026' || part === 'SAVISKAR') {
                  return (
                    <strong key={index} className="font-extrabold" style={{ color: '#120836' }}>
                      {part}
                    </strong>
                  );
                }
                if (part === 'CGC University') {
                  return (
                    <strong key={index} className="font-bold" style={{ color: '#120836' }}>
                      {part}
                    </strong>
                  );
                }
                return <React.Fragment key={index}>{part}</React.Fragment>;
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
