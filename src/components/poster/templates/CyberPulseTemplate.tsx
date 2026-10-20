import React from 'react';
import { Activity, Cpu, Radio, Shield } from 'lucide-react';
import { PosterData } from '../../../types/poster';
import { BRAND_CONFIG } from '../../../config/brandConfig';

interface TemplateProps {
  data: PosterData;
}

export const CyberPulseTemplate: React.FC<TemplateProps> = ({ data }) => {
  const isSquare = data.ratio === 'square';

  return (
    <div className="relative w-full h-full overflow-hidden bg-black text-white select-none flex flex-col justify-between p-7 sm:p-9 font-tech">
      {/* Background Cybernetic Grid & Neon Flares */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 240, 255, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      />
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

      {/* TOP BAR: Cyber Header with Frequency Indicator */}
      <div className="relative z-10 flex items-center justify-between border-b border-cyan-500/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded border border-cyan-400 bg-cyan-950/60 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.4)]">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="font-cinematic font-bold tracking-[0.25em] text-white text-base sm:text-lg">
              {BRAND_CONFIG.festivalName}
            </span>
            <span className="block text-[8px] tracking-[0.3em] text-cyan-400">
              SYS.FREQ // {BRAND_CONFIG.edition}.HZ
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="px-2.5 py-0.5 rounded border border-cyan-400/50 bg-cyan-500/10 text-cyan-300 text-[10px] tracking-widest uppercase font-semibold">
            {data.badgeType || 'ALL-ACCESS PASS'}
          </div>
          <span className="text-[8px] text-silver-500 tracking-wider mt-1">STATUS: CONFIRMED</span>
        </div>
      </div>

      {/* CENTER: Techno Photo Frame & Attendee Hologram */}
      <div className={`relative z-10 flex flex-col items-center justify-center my-auto ${isSquare ? 'py-2' : 'py-3'}`}>
        {/* Angular Tech Container */}
        <div className="relative mb-4">
          {/* Corner brackets */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

          {/* Photo Frame */}
          <div className={`relative overflow-hidden border border-cyan-500/50 bg-midnight-950 shadow-[0_0_30px_rgba(0,240,255,0.2)] ${
            isSquare ? 'w-32 h-32 sm:w-36 sm:h-36' : 'w-40 h-48 sm:w-48 sm:h-56'
          }`}>
            {data.photoUrl ? (
              <img
                src={data.photoUrl}
                alt={data.name}
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 p-4 text-cyan-400">
                <Cpu className="w-12 h-12 stroke-1 mb-2 animate-pulse" />
                <span className="text-[9px] tracking-widest text-silver-400">ATTENDEE.ID</span>
              </div>
            )}
            
            {/* Scanline overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent pointer-events-none" />
          </div>

          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/80 px-1.5 py-0.5 rounded text-[8px] text-cyan-400 border border-cyan-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            LIVE
          </div>
        </div>

        {/* Soundwave graphic */}
        <div className="flex items-center gap-1 my-2">
          {[8, 14, 22, 12, 28, 16, 24, 10, 18, 14, 24, 12, 18, 8].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-full"
              style={{ height: `${h}px`, opacity: 0.8 }}
            />
          ))}
        </div>

        {/* Identity block */}
        <p className="text-[10px] tracking-[0.4em] text-cyan-400 uppercase font-semibold">
          ATTENDEE ACCESS // GRANTED
        </p>

        <h1 className="font-display font-black text-2xl sm:text-3xl text-center text-white tracking-tight uppercase mt-1 drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
          {data.name || 'YOUR NAME'}
        </h1>

        {data.department && (
          <p className="text-xs text-silver-300 tracking-wider text-center mt-0.5">
            {data.department}
          </p>
        )}

        {data.tagline && (
          <p className="text-xs text-cyan-200/90 text-center max-w-xs mt-2 font-sans italic">
            "{data.tagline}"
          </p>
        )}

        {data.handle && (
          <div className="mt-2 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800 text-[10px] text-cyan-300">
            {data.handle.startsWith('@') ? data.handle : `@${data.handle}`}
          </div>
        )}
      </div>

      {/* BOTTOM BAR: Barcode & University Credentials */}
      <div className="relative z-10 pt-3 border-t border-cyan-500/30 flex items-end justify-between">
        <div>
          <span className="block text-[8px] text-silver-500 uppercase tracking-widest">VENUE // PUNJAB</span>
          <span className="block text-[10px] font-semibold text-silver-200 uppercase tracking-wider">
            {BRAND_CONFIG.universityName}
          </span>
        </div>

        {/* Simulated Barcode */}
        <div className="flex flex-col items-end">
          <div className="flex items-stretch h-5 gap-0.5 bg-white/90 px-1 py-0.5 rounded">
            {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 3, 1, 4, 2, 1, 2].map((w, i) => (
              <div key={i} className="bg-black" style={{ width: `${w}px` }} />
            ))}
          </div>
          <span className="text-[8px] text-silver-400 tracking-widest mt-1">
            AUTH-2026-SVSKR
          </span>
        </div>
      </div>
    </div>
  );
};
