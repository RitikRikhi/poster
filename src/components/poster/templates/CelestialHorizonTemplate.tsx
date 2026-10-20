import React from 'react';
import { Sparkles, MapPin, Compass } from 'lucide-react';
import { PosterData } from '../../../types/poster';
import { BRAND_CONFIG } from '../../../config/brandConfig';

interface TemplateProps {
  data: PosterData;
}

export const CelestialHorizonTemplate: React.FC<TemplateProps> = ({ data }) => {
  const isSquare = data.ratio === 'square';
  const isPortrait = data.ratio === 'portrait';

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#02040a] text-white select-none flex flex-col justify-between p-7 sm:p-9 font-sans">
      {/* Aevorian Aurora Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/30 via-indigo-950/20 to-[#02040a] pointer-events-none" />
      
      {/* Ethereal Aurora Pillar */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-44 bg-gradient-to-b from-[#00f2fe]/20 via-indigo-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-1 h-2/3 bg-gradient-to-b from-[#00f2fe]/50 via-cyan-400/20 to-transparent blur-sm pointer-events-none" />

      {/* TOP BAR: Festival Branding & Aevorian Reverie Anthem */}
      <div className="relative z-10 flex items-start justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f2fe] shadow-[0_0_10px_#00f2fe]" />
            <span className="font-cinematic font-black text-lg sm:text-xl tracking-[0.25em] text-white">
              {BRAND_CONFIG.festivalName}
            </span>
          </div>
          <p className="text-[10px] font-tech text-[#00f2fe]/90 tracking-widest mt-0.5 uppercase">
            {BRAND_CONFIG.themeTitle} • {BRAND_CONFIG.dates}
          </p>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe] text-[9px] font-tech tracking-wider uppercase font-semibold">
            <Sparkles className="w-3 h-3 text-[#00f2fe]" />
            <span>{data.badgeType || 'OFFICIAL ATTENDEE'}</span>
          </div>
          <p className="text-[8px] font-tech text-silver-400 tracking-wider mt-1">
            {BRAND_CONFIG.universityName}
          </p>
        </div>
      </div>

      {/* CENTER: Attendee Visual & Dynamic Portal */}
      <div className={`relative z-10 flex flex-col items-center justify-center my-auto ${isSquare ? 'py-1' : 'py-3'}`}>
        {/* Portal Frame for Photo */}
        <div className="relative mb-4 group">
          <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-[#00f2fe]/30 via-transparent to-indigo-600/30 blur-md" />
          <div className="absolute -inset-1 rounded-full border border-[#00f2fe]/40 animate-pulse" />

          {/* Photo Container */}
          <div className={`relative rounded-full overflow-hidden border-2 border-[#00f2fe]/60 shadow-[0_0_30px_rgba(0,242,254,0.35)] bg-black ${
            isSquare ? 'w-28 h-28 sm:w-32 sm:h-32' : isPortrait ? 'w-32 h-32 sm:w-40 sm:h-40' : 'w-36 h-36 sm:w-48 sm:h-48'
          }`}>
            {data.photoUrl ? (
              <img
                src={data.photoUrl}
                alt={data.name}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-black text-[#00f2fe] p-4">
                <Compass className="w-8 h-8 text-[#00f2fe] stroke-1 mb-1 animate-spin-slow" />
                <span className="text-[9px] font-tech uppercase tracking-widest text-silver-300">ATTENDEE</span>
              </div>
            )}
          </div>

          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/90 border border-[#00f2fe]/60 text-[8px] font-tech text-[#00f2fe] tracking-wider whitespace-nowrap shadow-lg">
            VERIFIED
          </div>
        </div>

        {/* Status Callout */}
        <div className="flex items-center gap-2 mb-1">
          <span className="h-px w-5 bg-[#00f2fe]/40" />
          <span className="text-[10px] font-tech uppercase tracking-[0.25em] text-[#00f2fe]">
            I AM ATTENDING
          </span>
          <span className="h-px w-5 bg-[#00f2fe]/40" />
        </div>

        {/* Student Name */}
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-center text-white tracking-tight leading-tight max-w-md uppercase drop-shadow-[0_2px_12px_rgba(255,255,255,0.2)]">
          {data.name || 'YOUR NAME HERE'}
        </h1>

        {/* Department / College */}
        {data.department && (
          <p className="text-xs font-tech text-silver-300 tracking-wider mt-1 text-center max-w-sm">
            {data.department}
          </p>
        )}

        {/* Tagline */}
        {data.tagline && (
          <p className="text-xs italic text-cyan-100/90 text-center max-w-xs mt-2 px-3 py-1 rounded-lg bg-black/50 border border-white/10 font-sans">
            "{data.tagline}"
          </p>
        )}

        {data.handle && (
          <p className="text-[10px] font-tech text-[#00f2fe]/80 mt-1.5">
            {data.handle.startsWith('@') ? data.handle : `@${data.handle}`}
          </p>
        )}
      </div>

      {/* BOTTOM BAR: Official Coordinates & Campus Info */}
      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[9px] font-tech text-silver-400">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#00f2fe]" />
          <span className="tracking-widest uppercase">CGC MOHALI • {BRAND_CONFIG.coordinates}</span>
        </div>

        <div className="tracking-[0.15em] uppercase text-silver-300 font-semibold">
          #AEVORIANREVERIE
        </div>
      </div>
    </div>
  );
};
