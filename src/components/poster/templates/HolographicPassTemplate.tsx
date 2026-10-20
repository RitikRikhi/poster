import React from 'react';
import { QrCode, ShieldCheck, Zap } from 'lucide-react';
import { PosterData } from '../../../types/poster';
import { BRAND_CONFIG } from '../../../config/brandConfig';

interface TemplateProps {
  data: PosterData;
}

export const HolographicPassTemplate: React.FC<TemplateProps> = ({ data }) => {
  const isSquare = data.ratio === 'square';

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#050914] text-white select-none flex flex-col justify-between p-6 sm:p-8 font-sans">
      {/* Outer Pass Border & Holographic Sheen */}
      <div className="absolute inset-2 sm:inset-3 rounded-2xl border border-white/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-indigo-600/10 pointer-events-none" />

      {/* Lanyard Hole Cutout Slot */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-3 rounded-full bg-black border border-silver-400/40 shadow-inner flex items-center justify-center">
          <div className="w-10 h-1 rounded-full bg-zinc-900" />
        </div>
      </div>

      {/* Holographic Header Bar */}
      <div className="relative z-10 mt-3 p-3 rounded-xl bg-gradient-to-r from-cyan-400/30 via-indigo-400/30 via-pink-400/20 to-sky-400/30 border border-white/30 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-black/60 flex items-center justify-center text-cyan-300">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-cinematic font-bold text-sm sm:text-base tracking-[0.2em] text-white block">
              {BRAND_CONFIG.festivalName}
            </span>
            <span className="text-[8px] font-tech text-cyan-200 tracking-widest block">
              FESTIVAL CREDENTIAL {BRAND_CONFIG.edition}
            </span>
          </div>
        </div>

        <div className="px-2.5 py-1 rounded bg-black/70 text-cyan-300 border border-cyan-400/40 text-[9px] font-tech font-bold uppercase tracking-wider">
          {data.badgeType || 'VIP PASS'}
        </div>
      </div>

      {/* CENTER: Credential Details & Photo */}
      <div className={`relative z-10 flex flex-col items-center justify-center my-auto ${isSquare ? 'py-1' : 'py-3'}`}>
        {/* Photo with Smart Chip and Security Watermark */}
        <div className="relative mb-3">
          <div className={`relative rounded-xl overflow-hidden border-2 border-cyan-400/60 shadow-[0_0_25px_rgba(34,211,238,0.3)] bg-midnight-950 ${
            isSquare ? 'w-28 h-28 sm:w-32 sm:h-32' : 'w-36 h-44 sm:w-40 sm:h-48'
          }`}>
            {data.photoUrl ? (
              <img
                src={data.photoUrl}
                alt={data.name}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-silver-400 p-4">
                <ShieldCheck className="w-10 h-10 text-cyan-400 mb-1" />
                <span className="text-[9px] font-tech uppercase tracking-widest">CREDENTIAL</span>
              </div>
            )}

            {/* Smart Chip graphic overlay */}
            <div className="absolute top-2 left-2 w-7 h-5 rounded bg-gradient-to-tr from-amber-400 to-amber-200 border border-amber-600/80 shadow opacity-90 flex items-center justify-center">
              <div className="w-full h-px bg-amber-700/60" />
            </div>

            {/* Verified check badge */}
            <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[8px] font-tech text-cyan-300 border border-cyan-400/40 flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-cyan-400" />
              VERIFIED
            </div>
          </div>
        </div>

        {/* Student Name */}
        <div className="text-center max-w-sm">
          <span className="text-[9px] font-tech uppercase tracking-[0.3em] text-silver-400 block mb-0.5">
            PASS HOLDER
          </span>
          <h1 className="font-display font-black text-xl sm:text-3xl text-white uppercase tracking-tight leading-tight">
            {data.name || 'YOUR NAME'}
          </h1>

          {data.department && (
            <p className="text-xs font-tech text-silver-300 tracking-wider mt-0.5">
              {data.department}
            </p>
          )}

          {data.tagline && (
            <p className="text-[11px] font-sans italic text-cyan-200 mt-1.5 px-3 py-1 rounded bg-midnight-900/60 border border-cyan-500/20 inline-block">
              "{data.tagline}"
            </p>
          )}

          {data.handle && (
            <p className="text-[10px] font-tech text-silver-400 mt-1">
              {data.handle.startsWith('@') ? data.handle : `@${data.handle}`}
            </p>
          )}
        </div>
      </div>

      {/* BOTTOM FOOTER: Barcode & University Sign-off */}
      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[8px] font-tech uppercase tracking-widest text-silver-500">
            ISSUING INSTITUTION
          </span>
          <span className="text-[10px] font-tech font-bold text-silver-200 uppercase tracking-wider">
            {BRAND_CONFIG.universityName}
          </span>
          <span className="text-[8px] font-tech text-cyan-400 tracking-widest">
            {BRAND_CONFIG.campusLocation}
          </span>
        </div>

        {/* QR Code / Barcode Simulation */}
        <div className="flex items-center gap-2 bg-white p-1 rounded">
          <QrCode className="w-7 h-7 text-black stroke-[1.5]" />
        </div>
      </div>
    </div>
  );
};
