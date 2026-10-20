import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PosterData } from '../../../types/poster';
import { BRAND_CONFIG } from '../../../config/brandConfig';

interface TemplateProps {
  data: PosterData;
}

export const EditorialMonolithTemplate: React.FC<TemplateProps> = ({ data }) => {
  const isSquare = data.ratio === 'square';

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#07070a] text-silver-100 select-none flex flex-col justify-between p-7 sm:p-9 font-sans">
      {/* Editorial Grain Overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none opacity-40" />

      {/* TOP HEADER: Architectural Editorial Headline */}
      <div className="relative z-10 border-b border-silver-400/20 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-tech uppercase tracking-[0.4em] text-silver-400">
              OFFICIAL ATTENDEE DOCUMENT
            </span>
            <span className="font-cinematic font-black text-xl sm:text-2xl text-white tracking-[0.2em] mt-0.5">
              {BRAND_CONFIG.festivalName}
            </span>
          </div>
          <div className="text-right">
            <span className="font-tech text-3xl font-light text-silver-300 tracking-tighter">
              '{BRAND_CONFIG.edition.slice(-2)}
            </span>
            <span className="block text-[8px] font-tech uppercase tracking-widest text-silver-400">
              ANNUAL FEST
            </span>
          </div>
        </div>
      </div>

      {/* CENTER: Editorial Layout with Photo & Massive Type */}
      <div className={`relative z-10 flex flex-col ${isSquare ? 'gap-2 my-auto' : 'gap-4 my-auto'}`}>
        {/* Massive statement */}
        <div className="leading-none">
          <span className="block font-tech text-xs sm:text-sm uppercase tracking-[0.3em] text-silver-400 mb-1">
            CONFIRMED PRESENCE
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight uppercase leading-none">
            I AM ATTENDING.
          </h2>
        </div>

        {/* Photo Container in Editorial Frame */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className={`relative shrink-0 overflow-hidden border border-silver-300/40 bg-zinc-900 shadow-2xl ${
            isSquare ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-28 h-36 sm:w-36 sm:h-44'
          }`}>
            {data.photoUrl ? (
              <img
                src={data.photoUrl}
                alt={data.name}
                className="w-full h-full object-cover grayscale contrast-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-silver-500 font-tech text-xs tracking-widest uppercase">
                NO PHOTO
              </div>
            )}
            <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 text-[8px] font-tech text-silver-300">
              PASS #{BRAND_CONFIG.edition}
            </div>
          </div>

          {/* Attendee Details */}
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-tech uppercase tracking-widest text-icy-400 font-semibold">
              {data.badgeType || 'DELEGATE PASS'}
            </span>
            <h1 className="font-display font-extrabold text-xl sm:text-3xl text-white uppercase tracking-tight leading-tight mt-1">
              {data.name || 'YOUR NAME'}
            </h1>
            {data.department && (
              <p className="text-xs font-tech text-silver-300 mt-1 uppercase tracking-wider">
                {data.department}
              </p>
            )}
            {data.handle && (
              <p className="text-[11px] font-tech text-silver-400 mt-1">
                {data.handle.startsWith('@') ? data.handle : `@${data.handle}`}
              </p>
            )}
          </div>
        </div>

        {/* Tagline / Quote Block */}
        {data.tagline && (
          <div className="border-l-2 border-silver-400/40 pl-3 py-1">
            <p className="text-xs sm:text-sm font-sans italic text-silver-200">
              "{data.tagline}"
            </p>
          </div>
        )}
      </div>

      {/* BOTTOM FOOTER: Editorial Swiss Metadata */}
      <div className="relative z-10 border-t border-silver-400/20 pt-3">
        <div className="grid grid-cols-3 gap-2 text-[9px] font-tech uppercase text-silver-400">
          <div>
            <span className="block text-silver-400/60 text-[8px]">HOST</span>
            <span className="text-silver-200 font-medium">{BRAND_CONFIG.universityName}</span>
          </div>
          <div>
            <span className="block text-silver-400/60 text-[8px]">LOCATION</span>
            <span className="text-silver-200 font-medium">{BRAND_CONFIG.campusLocation}</span>
          </div>
          <div className="text-right flex items-center justify-end gap-1 text-silver-200 font-semibold">
            <span>OFFICIAL PASS</span>
            <ArrowUpRight className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
