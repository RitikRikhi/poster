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

  // Role-based or custom Vision Paragraph highlighting Saviskar as CGC University's greatest event
  const getParagraph = () => {
    if (data.tagline && data.tagline.trim()) {
      return data.tagline.trim();
    }
    switch (data.role) {
      case 'Speaker':
        return "CGC University's grandest annual mega-event, SAVISKAR 2026 brings world-class innovators and keynote voices to inspire 35,000+ ambitious creators.";
      case 'Startup':
        return "The greatest innovation spectacle at CGC University, SAVISKAR 2026 empowers student founders to demo breakthrough inventions and pitch to leading investors.";
      case 'Investor':
        return "CGC University's flagship innovation platform, SAVISKAR 2026 unites top venture leaders and angel mentors with the sharpest student builders in India.";
      case 'Host':
        return "CGC University's biggest and grandest annual celebration, SAVISKAR 2026 electrifies the mainstage with star nights, cutting-edge battles, and 35,000+ voices.";
      default:
        return "CGC University's grandest techno-cultural spectacle, SAVISKAR 2026 unites 35,000+ creators, builders, and dreamers under the Mohali stars to shape the future.";
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

      {/* 3. Attendee Text Details on the right (Clean heading hierarchy + node pin + paragraph) */}
      <div
        className="absolute z-10 flex flex-col justify-start pointer-events-none"
        style={{
          left: '50.5%',
          top: '42.5%',
          width: '45.0%',
          maxHeight: '43%',
          overflow: 'hidden',
        }}
      >
        {/* Timeline Node Icon & Attendee Details Card */}
        <div className="flex items-start gap-2 sm:gap-2.5">
          {/* Timeline node icon and vertical connector line */}
          <div className="flex flex-col items-center shrink-0 pt-0.5" style={{ height: '100%' }}>
            {/* Purple circle with user icon (solid background for rock-solid contrast) */}
            <div
              className="rounded-full flex items-center justify-center shadow-sm"
              style={{
                width: 'clamp(18px, 3.8cqi, 26px)',
                height: 'clamp(18px, 3.8cqi, 26px)',
                backgroundColor: '#190f40',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                style={{
                  width: 'clamp(10px, 2.1cqi, 15px)',
                  height: 'clamp(10px, 2.1cqi, 15px)',
                  fill: '#ffffff',
                  color: '#ffffff',
                }}
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            {/* Connecting vertical line with bottom dot marker */}
            <div
              className="rounded-full my-1 relative"
              style={{
                width: '2px',
                backgroundColor: 'rgba(60, 40, 107, 0.45)',
                minHeight: 'clamp(18px, 4.2cqi, 28px)',
                flex: 1,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2"
                style={{ backgroundColor: '#3c286b' }}
              />
            </div>
          </div>

          {/* Attendee Details Text Block */}
          <div className="flex-1 min-w-0">
            {/* Full Name Heading */}
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
                marginTop: '3px',
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
                marginTop: '3px',
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
          </div>
        </div>

        {/* Vision Statement Paragraph (guaranteed zero truncation) */}
        <div
          className="mt-2 sm:mt-2.5 pt-2 sm:pt-2.5"
          style={{ borderTop: '1.5px solid rgba(25, 15, 64, 0.18)' }}
        >
          <p
            className="font-medium leading-relaxed transition-all duration-150"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize:
                paragraphText.length > 135
                  ? 'clamp(0.56rem, 1.62cqi, 0.78rem)'
                  : 'clamp(0.62rem, 1.82cqi, 0.88rem)',
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
      </div>

      {/* 4. Bottom-Right Official Date Badge (Cleanly anchored in corner, never overlaps text) */}
      <div
        className="absolute z-10 flex flex-col items-end pointer-events-none"
        style={{
          right: '6.5%',
          bottom: '2.5%',
          transform: 'translateZ(0)',
        }}
      >
        <span
          className="font-extrabold uppercase"
          style={{
            fontFamily: "'Plus Jakarta Sans', 'Space Grotesk', sans-serif",
            fontSize: 'clamp(0.72rem, 2.15cqi, 1.15rem)',
            lineHeight: '1.05',
            letterSpacing: '0.02em',
            color: '#120836',
          }}
        >
          28<sup style={{ fontSize: '0.65em', top: '-0.35em' }}>th</sup> &amp; 29<sup style={{ fontSize: '0.65em', top: '-0.35em' }}>th</sup>
        </span>
        <div
          className="mt-1 px-2.5 py-0.5 rounded-[3px] shadow-sm flex items-center justify-center"
          style={{ backgroundColor: '#190f40' }}
        >
          <span
            className="font-black uppercase tracking-widest"
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Space Grotesk', sans-serif",
              fontSize: 'clamp(0.58rem, 1.72cqi, 0.95rem)',
              lineHeight: '1.15',
              letterSpacing: '0.14em',
              color: '#ffffff',
            }}
          >
            OCTOBER 2026
          </span>
        </div>
      </div>
    </div>
  );
};
