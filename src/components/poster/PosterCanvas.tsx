import React, { forwardRef } from 'react';
import { PosterData } from '../../types/poster';
import { OfficialPosterTemplate } from './templates/OfficialPosterTemplate';

interface PosterCanvasProps {
  data: PosterData;
  scale?: number;
  className?: string;
  isExporting?: boolean;
}

export const PosterCanvas = forwardRef<HTMLDivElement, PosterCanvasProps>(
  ({ data, scale = 1, className = '', isExporting = false }, ref) => {
    // Determine aspect ratio class (default 4:5 matches the official template dimensions 3375x4219)
    const ratioAspectStyle = {
      portrait: 'aspect-[4/5]',
      story: 'aspect-[9/16]',
      square: 'aspect-square',
    }[data.ratio || 'portrait'];

    return (
      <div
        ref={ref}
        id="saviskar-poster-canvas"
        className={`relative overflow-hidden shadow-2xl transition-all duration-300 ${ratioAspectStyle} ${className}`}
        style={{
          // For high-res exports or scaled previews
          width: isExporting ? '1080px' : undefined,
          maxWidth: isExporting ? '1080px' : '100%',
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top center',
          containerType: 'inline-size',
        }}
      >
        <OfficialPosterTemplate data={data} />
      </div>
    );
  }
);

PosterCanvas.displayName = 'PosterCanvas';
