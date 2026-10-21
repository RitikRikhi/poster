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

  // Dynamic font sizing intelligence for Name Heading
  let nameSizeClass = 'text-xl sm:text-2xl md:text-3xl lg:text-4xl';
  let nameInlineStyle: React.CSSProperties = {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 'clamp(0.95rem, 3.8cqi, 2.1rem)',
    lineHeight: '1.08',
    letterSpacing: '-0.025em',
  };

  if (nameLen >= 30 || longestNameWord >= 14) {
    nameSizeClass = 'text-xs sm:text-sm md:text-base lg:text-lg';
    nameInlineStyle = {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: 'clamp(0.72rem, 2.2cqi, 1.1rem)',
      lineHeight: '1.16',
      letterSpacing: '-0.01em',
    };
  } else if (nameLen >= 22 || longestNameWord >= 11) {
    nameSizeClass = 'text-sm sm:text-base md:text-lg lg:text-xl';
    nameInlineStyle = {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: 'clamp(0.85rem, 2.7cqi, 1.35rem)',
      lineHeight: '1.12',
      letterSpacing: '-0.015em',
    };
  } else if (nameLen >= 15 || longestNameWord >= 9) {
    nameSizeClass = 'text-base sm:text-lg md:text-xl lg:text-2xl';
    nameInlineStyle = {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: 'clamp(0.95rem, 3.2cqi, 1.65rem)',
      lineHeight: '1.1',
      letterSpacing: '-0.02em',
    };
  }

  // Dynamic font sizing for Designation
  const desigLen = (data.designation || 'DESIGNATION').trim().length;
  const desigStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize:
      desigLen > 28
        ? 'clamp(0.6rem, 1.7cqi, 0.85rem)'
        : desigLen > 20
        ? 'clamp(0.68rem, 1.95cqi, 0.98rem)'
        : 'clamp(0.74rem, 2.15cqi, 1.08rem)',
    lineHeight: '1.22',
    letterSpacing: '0.04em',
  };

  // Dynamic font sizing for Organization
  const orgLen = (data.organization || 'ORGANIZATION').trim().length;
  const orgStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize:
      orgLen > 30
        ? 'clamp(0.65rem, 1.85cqi, 0.92rem)'
        : orgLen > 20
        ? 'clamp(0.72rem, 2.05cqi, 1.05rem)'
        : 'clamp(0.78rem, 2.25cqi, 1.15rem)',
    lineHeight: '1.24',
    letterSpacing: '0.05em',
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

      {/* 3. Attendee Text Details on the right (Clean heading hierarchy + node pin + paragraph) */}
      <div
        className="absolute z-10 flex flex-col justify-start pointer-events-none"
        style={{
          left: '52.0%',
          top: '46.0%',
          width: '43.0%',
          maxHeight: '44%',
          overflow: 'hidden',
        }}
      >
        {/* Timeline Node Icon & Attendee Details Card */}
        <div className="flex items-start gap-2 sm:gap-2.5">
          {/* Timeline node icon and vertical connector line */}
          <div className="flex flex-col items-center shrink-0 pt-0.5" style={{ height: '100%' }}>
            {/* Purple circle with user icon (from reference image) */}
            <div
              className="rounded-full bg-[#190f40] flex items-center justify-center shadow-sm"
              style={{
                width: 'clamp(18px, 3.8cqi, 26px)',
                height: 'clamp(18px, 3.8cqi, 26px)',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white"
                style={{
                  width: 'clamp(10px, 2.1cqi, 15px)',
                  height: 'clamp(10px, 2.1cqi, 15px)',
                }}
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            {/* Connecting vertical line with bottom dot marker */}
            <div
              className="w-[2px] bg-[#3c286b]/40 rounded-full my-1 relative"
              style={{ minHeight: 'clamp(20px, 4.8cqi, 32px)', flex: 1 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#3c286b] absolute bottom-0 left-1/2 -translate-x-1/2" />
            </div>
          </div>

          {/* Attendee Details Text Block */}
          <div className="flex-1 min-w-0">
            {/* Full Name Heading */}
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
              className="mt-1 font-bold uppercase tracking-wider text-[#3c286b] leading-tight line-clamp-2 transition-all duration-150"
              style={{
                ...desigStyle,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              {data.designation || 'DESIGNATION'}
            </p>

            {/* Organization / Department */}
            <p
              className="mt-1 font-semibold uppercase tracking-wider text-[#584488] leading-tight line-clamp-2 transition-all duration-150"
              style={{
                ...orgStyle,
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

        {/* Vision Statement Paragraph ("grpah" from reference image) */}
        <div className="mt-2.5 sm:mt-3.5 pt-2 sm:pt-2.5 border-t border-[#190f40]/15">
          <p
            className="font-normal text-[#2b2149] leading-relaxed transition-all duration-150"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(0.64rem, 1.88cqi, 0.92rem)',
              lineHeight: '1.4',
              letterSpacing: '-0.005em',
            }}
          >
            {paragraphText.split(/(SAVISKAR 2026|SAVISKAR|CGC University)/g).map((part, index) => {
              if (part === 'SAVISKAR 2026' || part === 'SAVISKAR') {
                return (
                  <strong key={index} className="font-extrabold text-[#190f40]">
                    {part}
                  </strong>
                );
              }
              if (part === 'CGC University') {
                return (
                  <strong key={index} className="font-bold text-[#190f40]">
                    {part}
                  </strong>
                );
              }
              return <React.Fragment key={index}>{part}</React.Fragment>;
            })}
          </p>
        </div>
      </div>

      {/* 4. Bottom-Right Official Date Badge (Exact reference design: 28th & 29th + [OCTOBER 2026] in purple box) */}
      <div
        className="absolute z-10 flex flex-col items-end pointer-events-none"
        style={{
          right: '8.8%',
          bottom: '2.0%',
          transform: 'translateZ(0)',
        }}
      >
        <span
          className="font-extrabold uppercase text-[#190f40]"
          style={{
            fontFamily: "'Plus Jakarta Sans', 'Space Grotesk', sans-serif",
            fontSize: 'clamp(0.78rem, 2.3cqi, 1.25rem)',
            lineHeight: '1.05',
            letterSpacing: '0.02em',
          }}
        >
          28<sup style={{ fontSize: '0.65em', top: '-0.35em' }}>th</sup> &amp; 29<sup style={{ fontSize: '0.65em', top: '-0.35em' }}>th</sup>
        </span>
        <div className="mt-1 px-2.5 py-0.5 rounded-[2px] bg-[#190f40] shadow-sm flex items-center justify-center">
          <span
            className="font-black uppercase tracking-widest text-white"
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Space Grotesk', sans-serif",
              fontSize: 'clamp(0.62rem, 1.85cqi, 1.02rem)',
              lineHeight: '1.15',
              letterSpacing: '0.14em',
            }}
          >
            OCTOBER 2026
          </span>
        </div>
      </div>
    </div>
  );
};
