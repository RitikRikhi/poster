import React from 'react';
import { Flame, Music, Volume2 } from 'lucide-react';
import { PosterData } from '../../../types/poster';
import { BRAND_CONFIG } from '../../../config/brandConfig';

interface TemplateProps {
  data: PosterData;
}

export const MainstageAnthemTemplate: React.FC<TemplateProps> = ({ data }) => {
  const isSquare = data.ratio === 'square';

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#030611] text-white select-none flex flex-col justify-between p-7 sm:p-9 font-sans">
      {/* Concert Spotlight Beams */}
      <div 
        className="absolute bottom-0 left-1/4 -translate-x-1/2 w-32 h-[120%] bg-gradient-to-t from-sky-400/20 via-sky-500/5 to-transparent blur-2xl -rotate-12 pointer-events-none origin-bottom" 
      />
      <div 
        className="absolute bottom-0 right-1/4 translate-x-1/2 w-32 h-[120%] bg-gradient-to-t from-blue-500/20 via-indigo-500/5 to-transparent blur-2xl rotate-12 pointer-events-none origin-bottom" 
      />
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-full bg-gradient-to-t from-cyan-400/25 via-blue-600/5 to-transparent blur-3xl pointer-events-none" 
      />

      {/* Stage Fog / Smoke layer */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-midnight-950 via-midnight-950/80 to-transparent pointer-events-none z-0" />

      {/* TOP HEADER: Concert Lineup Style */}
      <div className="relative z-10 flex items-start justify-between border-b border-silver-400/20 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-icy-400 text-[10px] font-tech uppercase tracking-widest">
            <Volume2 className="w-3.5 h-3.5" />
            <span>MAINSTAGE LIVE</span>
          </div>
          <h2 className="font-cinematic font-black text-xl sm:text-2xl text-white tracking-[0.2em] mt-1 leading-none">
            {BRAND_CONFIG.festivalName}
          </h2>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[10px] font-tech font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(56,189,248,0.4)]">
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>{data.badgeType || 'OFFICIAL ATTENDEE'}</span>
          </div>
          <span className="block text-[8px] font-tech text-silver-400 tracking-widest mt-1">
            EDITION {BRAND_CONFIG.edition}
          </span>
        </div>
      </div>

      {/* CENTER: Concert Attendee Spotlight */}
      <div className={`relative z-10 flex flex-col items-center justify-center my-auto ${isSquare ? 'py-1' : 'py-3'}`}>
        {/* Spotlight Ring Frame */}
        <div className="relative mb-4">
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-t from-sky-500/40 via-cyan-400/20 to-transparent blur-md" />
          
          <div className={`relative rounded-2xl overflow-hidden border-2 border-icy-400/70 shadow-[0_0_30px_rgba(56,189,248,0.4)] bg-midnight-900 ${
            isSquare ? 'w-32 h-32 sm:w-36 sm:h-36' : 'w-36 h-44 sm:w-44 sm:h-52'
          }`}>
            {data.photoUrl ? (
              <img
                src={data.photoUrl}
                alt={data.name}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 p-4">
                <Music className="w-10 h-10 text-icy-400 mb-2" />
                <span className="text-[10px] font-tech text-silver-400 uppercase tracking-widest">SAVISKAR LIVE</span>
              </div>
            )}
            
            {/* Live Stamp */}
            <div className="absolute top-2 left-2 bg-red-600/90 text-white text-[8px] font-tech font-bold px-1.5 py-0.5 rounded tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              IN THE CROWD
            </div>
          </div>
        </div>

        {/* Headline Attendee Details */}
        <div className="text-center max-w-sm">
          <p className="text-[10px] font-tech uppercase tracking-[0.35em] text-icy-300 font-semibold mb-1">
            SAVISKAR FESTIVAL PASS
          </p>

          <h1 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            {data.name || 'YOUR NAME'}
          </h1>

          {data.department && (
            <p className="text-xs font-tech text-silver-300 tracking-wider mt-1">
              {data.department}
            </p>
          )}

          {data.tagline && (
            <p className="text-xs italic text-silver-200 mt-2 bg-black/40 px-3 py-1 rounded-md border border-white/10">
              "{data.tagline}"
            </p>
          )}

          {data.handle && (
            <p className="text-[11px] font-tech text-icy-400 mt-2">
              {data.handle.startsWith('@') ? data.handle : `@${data.handle}`}
            </p>
          )}
        </div>
      </div>

      {/* BOTTOM FOOTER: Crowd Silhouette & University Info */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-tech text-silver-400 pt-3 border-t border-silver-400/20">
        <div>
          <span className="block text-silver-200 uppercase font-semibold tracking-wider">
            {BRAND_CONFIG.universityName}
          </span>
          <span className="text-[8px] text-silver-500 uppercase tracking-widest">
            {BRAND_CONFIG.campusLocation}
          </span>
        </div>

        <div className="text-right">
          <span className="text-icy-300 uppercase font-bold tracking-widest block">
            MAINSTAGE '26
          </span>
          <span className="text-[8px] text-silver-400 tracking-wider">
            OFFICIAL ATTENDEE TICKET
          </span>
        </div>
      </div>
    </div>
  );
};
