import { toPng, toBlob } from 'html-to-image';
import confetti from 'canvas-confetti';

export interface ExportResult {
  success: boolean;
  dataUrl?: string;
  blob?: Blob;
  error?: string;
}

/**
 * Triggers a cinematic celebratory confetti explosion
 */
export const triggerFestivalCelebration = () => {
  // Center blast
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#38bdf8', '#818cf8', '#f8fafc', '#0284c7', '#c084fc'],
  });

  // Starlight sparkles
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#38bdf8', '#f8fafc', '#bae6fd'],
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#818cf8', '#f8fafc', '#c084fc'],
    });
  }, 250);
};

const getOptimalPixelRatio = (element: HTMLElement): number => {
  const width = element.offsetWidth || 360;
  // Ensure the exported poster is at least 1440px wide for ultra-sharp clarity on all screens
  return Math.max(1440 / width, 3);
};

/**
 * Generates a high-resolution PNG from the poster element
 */
export const exportPosterAsImage = async (
  element: HTMLElement,
  studentName: string = 'Attendee'
): Promise<ExportResult> => {
  try {
    const ratio = getOptimalPixelRatio(element);

    // Generate ultra high resolution PNG
    const dataUrl = await toPng(element, {
      quality: 0.98,
      pixelRatio: ratio,
      cacheBust: true,
      skipFonts: true,
    });

    const blob = await toBlob(element, {
      quality: 0.98,
      pixelRatio: ratio,
      cacheBust: true,
      skipFonts: true,
    });

    // Clean up filename
    const sanitizedName = studentName.replace(/[^a-zA-Z0-9_-]/g, '_') || 'Attendee';
    const fileName = `Saviskar_2026_Attendee_${sanitizedName}.png`;

    // Trigger download
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Fire celebration
    triggerFestivalCelebration();

    return {
      success: true,
      dataUrl,
      blob: blob || undefined,
    };
  } catch (err: any) {
    console.error('Error generating poster image:', err);
    return {
      success: false,
      error: err.message || 'Failed to render poster image',
    };
  }
};

/**
 * Generates a high-resolution Blob from the poster element
 */
export const generatePosterBlob = async (
  element: HTMLElement
): Promise<Blob | null> => {
  try {
    const ratio = getOptimalPixelRatio(element);
    return await toBlob(element, {
      quality: 0.98,
      pixelRatio: ratio,
      cacheBust: true,
      skipFonts: true,
    });
  } catch (err) {
    console.error('Failed to generate poster blob:', err);
    return null;
  }
};

/**
 * Copies the actual high-resolution poster image directly to the system clipboard
 */
export const copyPosterImageToClipboard = async (
  element: HTMLElement
): Promise<boolean> => {
  try {
    const blob = await generatePosterBlob(element);
    if (!blob) return false;
    if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Could not copy image to clipboard:', err);
    return false;
  }
};

/**
 * Shares the poster with the actual image file attached
 */
export const sharePosterWithImage = async (
  element: HTMLElement,
  attendeeName: string,
  captionText: string
): Promise<{ success: boolean; method: 'native' | 'clipboard' | 'download' }> => {
  try {
    const sanitizedName = attendeeName.replace(/[^a-zA-Z0-9_-]/g, '_') || 'Attendee';
    const fileName = `Saviskar_2026_${sanitizedName}_Poster.png`;
    const blob = await generatePosterBlob(element);

    if (!blob) {
      await exportPosterAsImage(element, attendeeName);
      return { success: true, method: 'download' };
    }

    const file = new File([blob], fileName, { type: 'image/png' });

    // 1. Check if native Web Share with files is supported (mobile iOS/Android/Mac)
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: `Saviskar 2026 Official Pass - ${attendeeName}`,
          text: captionText,
          files: [file],
        });
        triggerFestivalCelebration();
        return { success: true, method: 'native' };
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return { success: false, method: 'native' };
        }
      }
    }

    // 2. Fallback for desktop: copy actual image to clipboard + auto-download
    let copiedImage = false;
    if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
      try {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        copiedImage = true;
      } catch {}
    }

    // Trigger download of the image file
    const dataUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(dataUrl), 5000);

    triggerFestivalCelebration();
    return {
      success: true,
      method: copiedImage ? 'clipboard' : 'download',
    };
  } catch (err) {
    console.error('Error sharing poster with image:', err);
    await exportPosterAsImage(element, attendeeName);
    return { success: true, method: 'download' };
  }
};

/**
 * Native Web Share API integration (legacy wrapper)
 */
export const sharePoster = async (
  element: HTMLElement,
  studentName: string,
  captionText: string
): Promise<{ shared: boolean; method: 'native' | 'download' }> => {
  const res = await sharePosterWithImage(element, studentName, captionText);
  return { shared: res.success, method: res.method === 'native' ? 'native' : 'download' };
};
