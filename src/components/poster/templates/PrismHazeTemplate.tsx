import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { PosterData } from '../../../types/poster';
import { BRAND_CONFIG } from '../../../config/brandConfig';

interface TemplateProps {
  data: PosterData;
}

export const PrismHazeTemplate: React.FC<TemplateProps> = ({ data }) => {
  const isSquare = data.ratio === 'square';

  return (
    <div className="relative w-full h-full overflow-hidden bg-midnight-950 text-white select-none flex flex-col justify-between p-7 sm:p-9 font-sans">
      {/* Auroral Dreamscape Background Blurs */}
      <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-blue-600/25 blur-[90px] pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-indigo-500/25 blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full bg-sky-500/20 blur-[100px] pointer-events-none" />

      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 noise-overlay pointer-events-none opacity-20" />

      {/* TOP BAR: Dreamscape Festival Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-cinematic font-bold text-lg sm:text-xl tracking-[0.25em] text-white">
              {BRAND_CONFIG.festivalName}
            </span>
            <span className="text-xs font-tech px-2 py-0.5 rounded-full bg-white/10 text-icy-200 border border-white/20">
              {BRAND_CONFIG.edition}
            </span>
          </div>
          <span className="text-[10px] font-tech text-silver-300 tracking-widest mt-0.5">
            DREAMSCAPE FESTIVAL
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-tech tracking-wider text-icy-200 shadow-lg">
          <Sparkles className="w-3 h-3 text-icy-300" />
          <span>{data.badgeType || 'VIP GUEST'}</span>
        </div>
      </div>

      {/* CENTER: Frosted Glass Horizon & Attendee Portrait */}
      <div className={`relative z-10 flex flex-col items-center justify-center my-auto ${isSquare ? 'py-1' : 'py-3'}`}>
        {/* Soft Glowing Portal */}
        <div className="relative mb-4">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-sky-400/30 to-indigo-500/30 blur-xl" />
          
          <div className={`relative rounded-full overflow-hidden border-2 border-white/40 shadow-[0_0_35px_rgba(125,211,252,0.3)] bg-midnight-900 ${
            isSquare ? 'w-28 h-28 sm:w-32 sm:h-32' : 'w-36 h-36 sm:w-44 sm:h-44'
          }`}>
            {data.photoUrl ? (
              <img
                src={data.photoUrl}
                alt={data.name}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-midnight-900 to-indigo-950 p-4">
                <Sparkles className="w-8 h-8 text-icy-300 mb-1 animate-pulse" />
                <span className="text-[9px] font-tech text-silver-300 uppercase tracking-widest">SAVISKAR</span>
              </div>
            )}
          </div>
        </div>

        {/* Frosted Detail Pill */}
        <div className="flex flex-col items-center text-center max-w-sm px-6 py-3 rounded-2xl bg-midnight-900/60 backdrop-blur-md border border-white/10 shadow-xl">
          <div className="flex items-center gap-1 text-[10px] font-tech text-icy-300 tracking-[0.25em] uppercase mb-1">
            <span>SAVISKAR CONFIRMED</span>
          </div>

          <h1 className="font-display font-extrabold text-xl sm:text-3xl text-white tracking-tight uppercase leading-snug">
            {data.name || 'YOUR NAME'}
          </h1>

          {data.department && (
            <p className="text-xs font-tech text-silver-300 tracking-wider mt-0.5">
              {data.department}
            </p>
          )}

          {data.tagline && (
            <p className="text-xs italic text-silver-200 mt-2">
              "{data.tagline}"
            </p>
          )}

          {data.handle && (
            <p className="text-[10px] font-tech text-icy-300/80 mt-1.5">
              {data.handle.startsWith('@') ? data.handle : `@${data.handle}`}
            </p>
          )}
        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-tech text-silver-300 pt-3 border-t border-white/10">
        <div className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" />
          <span className="uppercase tracking-wider">{BRAND_CONFIG.universityName}</span>
        </div>

        <span className="tracking-[0.2em] uppercase text-icy-300">
          #SAVISKAR2026
        </span>
      </div>
    </div>
  );
};
