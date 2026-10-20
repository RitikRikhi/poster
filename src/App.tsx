import React, { useState, useRef, useEffect } from 'react';
import { BrandLogo } from './components/brand/BrandLogo';
import { PosterCanvas } from './components/poster/PosterCanvas';
import { PosterData, AttendeeRole } from './types/poster';
import { BRAND_CONFIG } from './config/brandConfig';
import {
  exportPosterAsImage,
  sharePosterWithImage,
  copyPosterImageToClipboard,
} from './utils/exportPoster';
import { SmartSelfieModal } from './components/camera/SmartSelfieModal';
import cgcLogo from './assets/cgc-logo.png';
import cgcLogoWhite from './assets/cgc-logo-white.png';
import saviskarLogoWhite from './assets/saviskar-logo-white.png';
import saviskarLogoDark from './assets/saviskar-logo-dark.png';
import { getRoleCaption } from './data/captions';
import {
  Sparkles,
  Download,
  RefreshCw,
  Calendar,
  MessageCircle,
  Sun,
  Moon,
  CheckCircle2,
  Share2,
  Copy,
  Image as ImageIcon,
  Eye,
} from 'lucide-react';

const ROLE_THEME_COLORS: Record<
  AttendeeRole,
  { pillBg: string; pillActive: string; accentHex: string }
> = {
  Speaker: {
    pillBg: 'bg-[#5bbeeb]',
    pillActive: 'bg-[#5bbeeb] text-[#2c2531] border-[#2c2531] shadow-[0_3px_0_#2c2531]',
    accentHex: '#5bbeeb',
  },
  Startup: {
    pillBg: 'bg-[#fde047]',
    pillActive: 'bg-[#fde047] text-[#2c2531] border-[#2c2531] shadow-[0_3px_0_#2c2531]',
    accentHex: '#fde047',
  },
  Investor: {
    pillBg: 'bg-[#05f292]',
    pillActive: 'bg-[#05f292] text-[#2c2531] border-[#2c2531] shadow-[0_3px_0_#2c2531]',
    accentHex: '#05f292',
  },
  Host: {
    pillBg: 'bg-[#ff8a65]',
    pillActive: 'bg-[#ff8a65] text-[#2c2531] border-[#2c2531] shadow-[0_3px_0_#2c2531]',
    accentHex: '#ff8a65',
  },
};

/**
 * Normalizes gallery images so modern high-MP phone cameras (12MP–50MP)
 * don't choke the mobile GPU texture limit or get blurred by aggressive browser decimation.
 * Applies high-quality bicubic smoothing up to 2048px.
 */
const processGalleryImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const naturalW = img.naturalWidth || img.width;
      const naturalH = img.naturalHeight || img.height;

      // 2048px is the optimal dimension for crisp rendering without GPU texture downsampling
      const maxDimension = 2048;

      let targetW = naturalW;
      let targetH = naturalH;

      if (naturalW > maxDimension || naturalH > maxDimension) {
        if (naturalW >= naturalH) {
          targetW = maxDimension;
          targetH = Math.round((naturalH * maxDimension) / naturalW);
        } else {
          targetH = maxDimension;
          targetW = Math.round((naturalW * maxDimension) / naturalH);
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetW, targetH);

      // Save as pristine high-quality JPEG
      const dataUrl = canvas.toDataURL('image/jpeg', 0.96);
      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    };

    img.src = objectUrl;
  });
};

export const App: React.FC = () => {
  const posterRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);

  // Theme state: 'webflow' (light playful) | 'midnight' (cyber dark)
  const [theme, setTheme] = useState<'webflow' | 'midnight'>('webflow');

  // Active Role: Speaker | Startup | Investor | Host
  const [selectedRole, setSelectedRole] = useState<AttendeeRole>('Speaker');

  // Exact requested fields: Full Name, Designation, Organization, Photo
  const [formData, setFormData] = useState<PosterData>({
    name: 'Aarav Sharma',
    designation: 'Keynote Speaker',
    organization: 'Tech Visionary',
    photoUrl: null,
    role: 'Speaker',
  });

  // Smart Selfie Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Export State
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleRoleSelect = (role: AttendeeRole) => {
    setSelectedRole(role);
    setFormData((prev) => {
      let defaultDesig = prev.designation;
      let defaultOrg = prev.organization;

      if (role === 'Speaker') {
        defaultDesig = 'Keynote Speaker';
        defaultOrg = 'Tech Visionary';
      } else if (role === 'Startup') {
        defaultDesig = 'Founder & CEO';
        defaultOrg = 'Acme Labs';
      } else if (role === 'Investor') {
        defaultDesig = 'Venture Partner';
        defaultOrg = 'Angel Capital';
      } else if (role === 'Host') {
        defaultDesig = 'Mainstage Emcee';
        defaultOrg = 'Saviskar 2026 Host';
      }

      return {
        ...prev,
        role,
        designation: defaultDesig,
        organization: defaultOrg,
      };
    });
    showToast(`Switched to ${role} realm! ✨`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        showToast('Please select an image smaller than 25MB');
        return;
      }
      showToast('Optimizing photo clarity... ✨');
      try {
        const optimizedPhoto = await processGalleryImage(file);
        setFormData((prev) => ({ ...prev, photoUrl: optimizedPhoto }));
        showToast('Photo framed with ultra-sharp clarity! 📁✨');
      } catch {
        const reader = new FileReader();
        reader.onload = () => {
          setFormData((prev) => ({ ...prev, photoUrl: reader.result as string }));
          showToast('Photo uploaded! 📁');
        };
        reader.readAsDataURL(file);
      }
    }
    // Clear input value so selecting the same file again triggers onChange
    e.target.value = '';
  };

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setIsExporting(true);
    try {
      const result = await exportPosterAsImage(posterRef.current, formData.name || selectedRole);
      if (result.success) {
        showToast('Poster downloaded in high resolution! 🎉');
      } else {
        showToast('Download failed. Please try again.');
      }
    } catch (err) {
      showToast('Download failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // 1. Direct Share (Opens Native Share Sheet on mobile with actual poster image attached!)
  const handleDirectShare = async () => {
    if (!posterRef.current) return;
    const caption = getRoleCaption(selectedRole);
    showToast('Preparing your poster image... 🖼️✨');
    const res = await sharePosterWithImage(posterRef.current, formData.name || selectedRole, caption);
    if (res.method === 'native') {
      showToast('Shared with official poster image! 🎉');
    } else if (res.method === 'clipboard') {
      showToast('Poster image copied to clipboard & downloaded! Paste (Ctrl+V) anywhere! 🖼️📋');
    } else {
      showToast('Poster downloaded! Attach it to your share. 📥');
    }
  };

  // 2. WhatsApp: Uses native share with image attached on mobile; copies image to clipboard on desktop!
  const handleWhatsAppShare = async () => {
    if (!posterRef.current) return;
    const caption = `IT'S OFFICIAL!! 🚀 I'm attending Saviskar 2026 as a ${selectedRole} at CGC University, Mohali!\n\nHere is my official poster! #Saviskar2026 #CGCUniversity`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      const res = await sharePosterWithImage(posterRef.current, formData.name || selectedRole, caption);
      if (res.method === 'native') return;
    }

    // On Desktop: Copy image to clipboard + download as backup, then open WhatsApp Web
    await copyPosterImageToClipboard(posterRef.current);
    await handleDownload();
    const text = encodeURIComponent(`${caption}\n\n(Poster image copied! Press Ctrl+V to attach)`);
    showToast('Poster image copied & downloaded! Just press Ctrl+V in WhatsApp to send! 🖼️💬');
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // 3. LinkedIn: Copies image to clipboard & downloads file, opens LinkedIn post composer
  const handleLinkedInShare = async () => {
    if (!posterRef.current) return;
    const caption = getRoleCaption(selectedRole);
    try {
      await navigator.clipboard.writeText(caption);
    } catch {}

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      const res = await sharePosterWithImage(posterRef.current, formData.name || selectedRole, caption);
      if (res.method === 'native') return;
    }

    await copyPosterImageToClipboard(posterRef.current);
    await handleDownload();
    showToast('Poster image & caption copied! Press Ctrl+V in your LinkedIn post! 💼🖼️');
    const shareUrl = encodeURIComponent(window.location.origin);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank');
  };

  // 4. Instagram Story: Attaches image on mobile; copies & downloads for Story on desktop
  const handleInstagramStoryShare = async () => {
    if (!posterRef.current) return;
    const caption = `Saviskar 2026 @ CGC University, Mohali ✨ #Saviskar2026 #AevorianReverie #${selectedRole}`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      const res = await sharePosterWithImage(posterRef.current, formData.name || selectedRole, caption);
      if (res.method === 'native') return;
    }

    await copyPosterImageToClipboard(posterRef.current);
    await handleDownload();
    showToast('Poster image downloaded & copied! Paste (Ctrl+V) into Instagram Story 📸✨');
    window.open('https://www.instagram.com/', '_blank');
  };

  // 5. X (Twitter): Copies image to clipboard & downloads file, opens tweet composer
  const handleTwitterShare = async () => {
    if (!posterRef.current) return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      const caption = `IT'S OFFICIAL!! 🚀 Excited to join Saviskar 2026 as ${selectedRole} at CGC University, Mohali! ⚡✨ #Saviskar2026 #CGCUniversity`;
      const res = await sharePosterWithImage(posterRef.current, formData.name || selectedRole, caption);
      if (res.method === 'native') return;
    }

    await copyPosterImageToClipboard(posterRef.current);
    await handleDownload();
    const text = encodeURIComponent(
      `IT'S OFFICIAL!! 🚀 Excited to join Saviskar 2026 as ${selectedRole} at CGC University, Mohali! ⚡✨`
    );
    const tags = encodeURIComponent('Saviskar2026,CGCUniversity,AevorianReverie');
    showToast('Poster image copied! Press Ctrl+V to attach image to your tweet! ⚡🖼️');
    window.open(`https://twitter.com/intent/tweet?text=${text}&hashtags=${tags}`, '_blank');
  };

  // 6. Copy Poster Image directly to system clipboard
  const handleCopyImage = async () => {
    if (!posterRef.current) return;
    const success = await copyPosterImageToClipboard(posterRef.current);
    if (success) {
      showToast('Poster image copied to clipboard! Paste it anywhere with Ctrl+V! 🖼️📋');
    } else {
      await handleDownload();
      showToast('Poster image downloaded to your files! 📥');
    }
  };

  // 7. Copy Caption text
  const handleCopyCaption = async () => {
    const caption = getRoleCaption(selectedRole);
    try {
      await navigator.clipboard.writeText(caption);
      showToast('Official caption & hashtags copied! 📋✨');
    } catch {
      showToast('Could not copy to clipboard.');
    }
  };

  const isDark = theme === 'midnight';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-300 relative ${
        isDark
          ? 'bg-[#08091a] text-white selection:bg-[#00f5ff] selection:text-black'
          : 'wf-bg-mesh text-[#2c2531] selection:bg-[#fd92fe] selection:text-[#2c2531]'
      }`}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-xs font-black tracking-wide shadow-2xl flex items-center gap-2 border animate-bounce ${
            isDark
              ? 'bg-[#1b1735] text-white border-[#8b5cf6]/60 shadow-[0_0_25px_rgba(139,92,246,0.4)]'
              : 'bg-[#2c2531] text-white border-2 border-[#2c2531] shadow-[0_4px_0_#2c2531]'
          }`}
        >
          <Sparkles className={`w-4 h-4 ${isDark ? 'text-[#00f5ff]' : 'text-[#fd92fe]'}`} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Smart Intelligent Selfie Studio Modal */}
      <SmartSelfieModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPhotoCaptured={(photoUrl) => {
          setFormData((prev) => ({ ...prev, photoUrl }));
          showToast('Selfie framed & applied! 🤳✨');
        }}
        onOpenGalleryFallback={() => fileInputRef.current?.click()}
        onOpenNativeCamera={() => nativeCameraInputRef.current?.click()}
        isDark={isDark}
      />

      {/* TOP NAVBAR */}
      <header
        className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
          isDark
            ? 'bg-[#08091a]/90 backdrop-blur-md border-b border-white/10'
            : 'bg-white/85 backdrop-blur-md border-b-2 border-[#2c2531]/12'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          <BrandLogo isDark={isDark} />

          <div className="flex items-center gap-3">
            {/* Festival Date Pill */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold ${
                isDark
                  ? 'bg-white/5 border border-white/15 text-silver-300'
                  : 'bg-white border-2 border-[#2c2531]/15 text-[#2c2531] shadow-sm'
              }`}
            >
              <Calendar
                className={`w-3.5 h-3.5 ${isDark ? 'text-[#00f5ff]' : 'text-[#2c2531]'}`}
              />
              <span>Oct 28–29, 2026</span>
            </div>

            {/* THEME TOGGLE SWITCHER */}
            <div
              className={`flex items-center p-1 rounded-full border ${
                isDark
                  ? 'bg-[#151636] border-white/15 text-white'
                  : 'bg-white border-2 border-[#2c2531] shadow-[0_2px_0_#2c2531]'
              }`}
            >
              <button
                type="button"
                onClick={() => setTheme('webflow')}
                className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  !isDark
                    ? 'bg-[#2c2531] text-white shadow-sm'
                    : 'text-silver-400 hover:text-white'
                }`}
                title="Switch to Webflow Playful Light theme"
              >
                <Sun className="w-3.5 h-3.5 text-[#fde047]" />
                <span className="hidden sm:inline">Playful</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('midnight')}
                className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  isDark
                    ? 'bg-gradient-to-r from-[#00f5ff] to-[#8b5cf6] text-black shadow-sm font-black'
                    : 'text-[#716979] hover:text-[#2c2531]'
                }`}
                title="Switch to Midnight Cyber Dark theme"
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Midnight</span>
              </button>
            </div>

            {/* Primary Download Button */}
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownload}
              className={`px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 ${
                isDark
                  ? 'bg-gradient-to-r from-[#00f5ff] to-[#8b5cf6] hover:from-cyan-300 hover:to-violet-400 text-black shadow-[0_0_20px_rgba(0,245,255,0.4)]'
                  : 'bg-[#2c2531] hover:bg-[#fd92fe] text-white hover:text-[#2c2531] border-2 border-[#2c2531] shadow-[0_3px_0_#2c2531]'
              }`}
            >
              {isExporting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
              <span>Download</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN GENERATOR CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-12">
        {/* Header Hero Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 flex flex-col items-center">
          {/* Official Partner Brand Logos Lockup */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-5 px-5 py-2">
            <img
              src={isDark ? cgcLogoWhite : cgcLogo}
              alt="CGC University Mohali"
              className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform hover:scale-105 duration-200"
            />
            <div
              className={`h-10 sm:h-12 md:h-14 w-[1.5px] rounded-full ${
                isDark ? 'bg-white/20' : 'bg-[#2c2531]/20'
              }`}
            />
            <img
              src={isDark ? saviskarLogoWhite : saviskarLogoDark}
              alt="Saviskar 2026 - Aevorian Reverie"
              className="h-11 sm:h-13 md:h-15 w-auto object-contain transition-transform hover:scale-105 duration-200"
            />
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border mb-3 ${
              isDark
                ? 'bg-[#00f5ff]/10 border-[#00f5ff]/30 text-[#00f5ff]'
                : 'bg-[#fde047] text-[#2c2531] border-2 border-[#2c2531] shadow-[0_2px_0_#2c2531] rotate-1'
            }`}
          >
            <span>✦</span>
            <span>OFFICIAL SAVISKAR 2026 GENERATOR</span>
          </div>

          <h1
            className={`text-3xl sm:text-5xl font-black tracking-tight leading-tight uppercase ${
              isDark ? 'text-white' : 'text-[#2c2531]'
            }`}
          >
            Your Saviskar Story Starts Here.
          </h1>

          <p
            className={`text-xs sm:text-base font-medium mt-2.5 max-w-lg mx-auto ${
              isDark ? 'text-silver-400' : 'text-[#716979]'
            }`}
          >
            Make it official. Create your Saviskar poster and share the excitement with everyone.
          </p>
        </div>

        {/* 2-Column Split: Controls on Left, Large Live Poster on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Clean Minimal Form (Exact layout specified by user) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Mobile Quick Jump to Poster Preview */}
            <div
              className={`lg:hidden flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-[#00f5ff]/10 via-[#8b5cf6]/10 to-[#fd92fe]/10 border-white/15'
                  : 'bg-[#fff] border-2 border-[#2c2531] shadow-[0_3px_0_#2c2531]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🖼️</span>
                <div>
                  <div className="text-xs font-black uppercase tracking-wide">
                    Live Poster Preview Below
                  </div>
                  <div className={`text-[10px] ${isDark ? 'text-silver-400' : 'text-[#716979]'}`}>
                    Updates in real-time as you type
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  posterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`py-1.5 px-3 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
                  isDark
                    ? 'bg-[#00f5ff] text-black hover:bg-cyan-300'
                    : 'bg-[#2c2531] text-white hover:bg-[#fd92fe] hover:text-[#2c2531]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Poster ↓</span>
              </button>
            </div>

            {/* 1. Template Role Selector (Student, Speaker, Startup, Investor, Host) */}
            <div
              className={`p-5 rounded-3xl transition-all ${
                isDark
                  ? 'bg-[#11132f] border border-white/10 shadow-xl'
                  : 'bg-white border-2 border-[#2c2531] shadow-[0_6px_0_#2c2531]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[11px] font-black tracking-wider uppercase ${
                    isDark ? 'text-silver-400' : 'text-[#2c2531]'
                  }`}
                >
                  Choose Your Realm
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isDark
                      ? 'bg-white/10 text-silver-300'
                      : 'bg-[#f4f3f7] text-[#716979] border border-[#2c2531]/15'
                  }`}
                >
                  {selectedRole} Mode
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5">
                {(['Speaker', 'Startup', 'Investor', 'Host'] as AttendeeRole[]).map(
                  (role) => {
                    const isSelected = selectedRole === role;
                    const roleColor = ROLE_THEME_COLORS[role];

                    if (isDark) {
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handleRoleSelect(role)}
                          className={`py-2 px-1 sm:py-2.5 sm:px-1.5 rounded-xl text-[11px] sm:text-xs font-bold tracking-tight sm:tracking-normal text-center transition-all border ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#00f5ff]/25 to-[#8b5cf6]/35 border-[#00f5ff] text-white shadow-[0_0_15px_rgba(0,245,255,0.35)] -translate-y-0.5'
                              : 'bg-white/5 hover:bg-white/10 text-silver-400 border-white/10'
                          }`}
                        >
                          {role}
                        </button>
                      );
                    }

                    // Webflow Playful Light
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleSelect(role)}
                        className={`py-2 px-1 sm:py-2.5 sm:px-1.5 rounded-2xl text-[11px] sm:text-xs font-bold tracking-tight sm:tracking-normal text-center transition-all border-2 ${
                          isSelected
                            ? `${roleColor.pillActive} -translate-y-1 font-black`
                            : 'bg-[#f4f3f7] hover:bg-white text-[#2c2531] border-[#2c2531]/20'
                        }`}
                      >
                        {role}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* 2. The User's Exact Form Component */}
            <div
              className={`p-4 sm:p-7 rounded-3xl transition-all ${
                isDark
                  ? 'bg-[#11132f] border border-white/10 shadow-xl'
                  : 'bg-white border-2 border-[#2c2531] shadow-[0_6px_0_#2c2531]'
              }`}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Full Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: isDark ? 'rgb(208, 225, 235)' : '#2c2531',
                    }}
                  >
                    Full Name
                    <span style={{ color: isDark ? 'rgb(8, 181, 173)' : '#e11d48' }}> *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav Sharma"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-4 py-3 text-base sm:text-sm font-semibold rounded-xl outline-none transition-all ${
                      isDark
                        ? 'bg-white/10 text-white placeholder-silver-500 border border-white/20 focus:border-[#00f5ff] focus:ring-1 focus:ring-[#00f5ff]'
                        : 'bg-[#f8f7fa] text-[#2c2531] placeholder-[#9c94a4] border-2 border-[#2c2531]/20 focus:border-[#2c2531] focus:bg-white focus:shadow-[0_3px_0_#2c2531]'
                    }`}
                  />
                </div>

                {/* Designation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: isDark ? 'rgb(208, 225, 235)' : '#2c2531',
                    }}
                  >
                    Designation
                    <span style={{ color: isDark ? 'rgb(8, 181, 173)' : '#e11d48' }}> *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Founder & CEO"
                    required
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, designation: e.target.value }))
                    }
                    className={`w-full px-4 py-3 text-base sm:text-sm font-semibold rounded-xl outline-none transition-all ${
                      isDark
                        ? 'bg-white/10 text-white placeholder-silver-500 border border-white/20 focus:border-[#00f5ff] focus:ring-1 focus:ring-[#00f5ff]'
                        : 'bg-[#f8f7fa] text-[#2c2531] placeholder-[#9c94a4] border-2 border-[#2c2531]/20 focus:border-[#2c2531] focus:bg-white focus:shadow-[0_3px_0_#2c2531]'
                    }`}
                  />
                </div>

                {/* Organization */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: isDark ? 'rgb(208, 225, 235)' : '#2c2531',
                    }}
                  >
                    Organization
                    <span style={{ color: isDark ? 'rgb(8, 181, 173)' : '#e11d48' }}> *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Labs"
                    required
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, organization: e.target.value }))
                    }
                    className={`w-full px-4 py-3 text-base sm:text-sm font-semibold rounded-xl outline-none transition-all ${
                      isDark
                        ? 'bg-white/10 text-white placeholder-silver-500 border border-white/20 focus:border-[#00f5ff] focus:ring-1 focus:ring-[#00f5ff]'
                        : 'bg-[#f8f7fa] text-[#2c2531] placeholder-[#9c94a4] border-2 border-[#2c2531]/20 focus:border-[#2c2531] focus:bg-white focus:shadow-[0_3px_0_#2c2531]'
                    }`}
                  />
                </div>

                {/* Divider */}
                <div
                  className={`my-1 h-[2px] ${
                    isDark
                      ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent'
                      : 'bg-gradient-to-r from-transparent via-[#2c2531]/15 to-transparent'
                  }`}
                />

                {/* Your Photo (Choose File & Take Selfie with Visual Preview) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="flex items-center justify-between">
                    <label
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        color: isDark ? 'rgb(208, 225, 235)' : '#2c2531',
                      }}
                    >
                      Your Photo{' '}
                      <span style={{ color: isDark ? 'rgb(8, 181, 173)' : '#e11d48' }}>*</span>
                    </label>
                    {formData.photoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, photoUrl: null }));
                          showToast('Photo removed. Template silhouette active! 👤');
                        }}
                        className="text-[11px] font-bold text-rose-500 hover:text-rose-600 transition-colors"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>

                  {formData.photoUrl ? (
                    /* Rich Visual Photo Preview Card for the user's uploaded image */
                    <div
                      className={`p-3.5 rounded-2xl flex items-center gap-4 transition-all ${
                        isDark
                          ? 'border-2 border-[#00f5ff]/40 bg-[#161838] shadow-[0_0_20px_rgba(0,245,255,0.15)]'
                          : 'border-2 border-[#2c2531] bg-white shadow-[0_4px_0_#2c2531]'
                      }`}
                    >
                      {/* Photo Thumbnail Preview */}
                      <div className="relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 border-emerald-500 shadow-md bg-black/40">
                        <img
                          src={formData.photoUrl}
                          alt="Your Uploaded Photo"
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Details & Actions */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-wider text-emerald-500">
                              Photo Active on Poster
                            </span>
                          </div>
                          <p
                            className={`text-[11px] mt-0.5 font-medium ${
                              isDark ? 'text-silver-300' : 'text-[#716979]'
                            }`}
                          >
                            Framed inside the neon hexagonal pass
                          </p>
                        </div>

                        <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                              isDark
                                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                                : 'bg-[#f4f3f7] hover:bg-[#eae8ef] text-[#2c2531] border border-[#2c2531]/20'
                            }`}
                          >
                            <span>📁 Replace</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setIsCameraOpen(true)}
                            className={`py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                              isDark
                                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                                : 'bg-[#f4f3f7] hover:bg-[#eae8ef] text-[#2c2531] border border-[#2c2531]/20'
                            }`}
                          >
                            <span>🤳 Selfie</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, photoUrl: null }));
                              showToast('Photo removed! 👤');
                            }}
                            className="py-1.5 px-2 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Clean Upload & Camera Options */
                    <div
                      className={`rounded-2xl overflow-hidden transition-all ${
                        isDark
                          ? 'border-2 border-dashed border-white/25 bg-white/5 hover:border-white/40'
                          : 'border-2 border-dashed border-[#2c2531]/30 hover:border-[#2c2531] bg-[#faf9fc]'
                      }`}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                        {/* Choose File Button */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className={`flex flex-col items-center gap-1.5 py-4 px-3 cursor-pointer transition-colors border-r ${
                            isDark
                              ? 'border-white/15 hover:bg-white/10 text-white'
                              : 'border-[#2c2531]/15 hover:bg-white text-[#2c2531]'
                          }`}
                        >
                          <span className="text-2xl">📁</span>
                          <span className="text-xs font-bold">Choose File</span>
                          <span
                            className={`text-[10px] ${
                              isDark ? 'text-silver-400' : 'text-[#716979]'
                            }`}
                          >
                            From gallery
                          </span>
                        </button>

                        {/* Take Selfie Button */}
                        <button
                          type="button"
                          onClick={() => setIsCameraOpen(true)}
                          className={`flex flex-col items-center gap-1.5 py-4 px-3 cursor-pointer transition-colors ${
                            isDark
                              ? 'hover:bg-white/10 text-white'
                              : 'hover:bg-white text-[#2c2531]'
                          }`}
                        >
                          <span className="text-2xl">🤳</span>
                          <span className="text-xs font-bold">Take Selfie</span>
                          <span
                            className={`text-[10px] ${
                              isDark ? 'text-silver-400' : 'text-[#716979]'
                            }`}
                          >
                            Camera portrait
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    accept="image/*"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />

                  {/* Native Device Camera input (fallback for phones, tablets & Windows Camera) */}
                  <input
                    ref={nativeCameraInputRef}
                    accept="image/*"
                    capture="user"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons: Primary Download */}
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownload}
              className={`w-full py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all transform active:scale-95 disabled:opacity-50 ${
                isDark
                  ? 'bg-gradient-to-r from-[#00f5ff] via-[#38bdf8] to-[#8b5cf6] hover:from-cyan-300 hover:to-violet-400 text-black shadow-[0_0_25px_rgba(0,245,255,0.35)]'
                  : 'bg-[#2c2531] hover:bg-[#fd92fe] text-white hover:text-[#2c2531] border-2 border-[#2c2531] shadow-[0_5px_0_#2c2531] active:translate-y-1 active:shadow-[0_1px_0_#2c2531]'
              }`}
            >
              {isExporting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4 stroke-[3]" />
              )}
              <span>Download High-Res Poster (PNG)</span>
            </button>

            {/* Share Your Official Pass Card */}
            <div
              className={`p-5 rounded-3xl transition-all ${
                isDark
                  ? 'bg-[#11132f] border border-white/10 shadow-xl'
                  : 'bg-white border-2 border-[#2c2531] shadow-[0_6px_0_#2c2531]'
              }`}
            >
              <div className="flex items-center justify-between mb-3.5">
                <span
                  className={`text-[11px] font-black tracking-wider uppercase flex items-center gap-1.5 ${
                    isDark ? 'text-silver-300' : 'text-[#2c2531]'
                  }`}
                >
                  <Share2 className={`w-3.5 h-3.5 ${isDark ? 'text-[#00f5ff]' : 'text-[#fd92fe]'}`} />
                  <span>Share Your Official Pass</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopyImage}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
                      isDark
                        ? 'bg-white/10 hover:bg-white/15 text-silver-300 hover:text-white border border-white/10'
                        : 'bg-[#f4f3f7] hover:bg-[#eae8ef] text-[#2c2531] border border-[#2c2531]/15'
                    }`}
                    title="Copy poster image directly to clipboard"
                  >
                    <ImageIcon className="w-3 h-3 text-[#00f5ff]" />
                    <span>Copy Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyCaption}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
                      isDark
                        ? 'bg-white/10 hover:bg-white/15 text-silver-300 hover:text-white border border-white/10'
                        : 'bg-[#f4f3f7] hover:bg-[#eae8ef] text-[#2c2531] border border-[#2c2531]/15'
                    }`}
                    title="Copy caption with official hashtags"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Caption</span>
                  </button>
                </div>
              </div>

              {/* 4 Social Share Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-2.5">
                {/* 1. WhatsApp */}
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 text-white shadow-sm transition-all transform active:scale-95 ${
                    isDark
                      ? 'bg-[#25D366] hover:bg-[#20ba5a]'
                      : 'bg-[#25D366] hover:bg-[#20ba5a] border-2 border-[#2c2531] shadow-[0_2px_0_#2c2531]'
                  }`}
                  title="Share to WhatsApp with poster image"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp</span>
                </button>

                {/* 2. Instagram Story */}
                <button
                  type="button"
                  onClick={handleInstagramStoryShare}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 text-white shadow-sm transition-all transform active:scale-95 ${
                    isDark
                      ? 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95'
                      : 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] border-2 border-[#2c2531] shadow-[0_2px_0_#2c2531]'
                  }`}
                  title="Export poster & open Instagram Story"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>Insta Story</span>
                </button>

                {/* 3. LinkedIn */}
                <button
                  type="button"
                  onClick={handleLinkedInShare}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 text-white shadow-sm transition-all transform active:scale-95 ${
                    isDark
                      ? 'bg-[#0A66C2] hover:bg-[#004182]'
                      : 'bg-[#0A66C2] hover:bg-[#004182] border-2 border-[#2c2531] shadow-[0_2px_0_#2c2531]'
                  }`}
                  title="Share to LinkedIn with poster image"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>LinkedIn</span>
                </button>

                {/* 4. X (Twitter) */}
                <button
                  type="button"
                  onClick={handleTwitterShare}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 text-white shadow-sm transition-all transform active:scale-95 ${
                    isDark
                      ? 'bg-black hover:bg-neutral-900 border border-white/20'
                      : 'bg-[#0f1419] hover:bg-black border-2 border-[#2c2531] shadow-[0_2px_0_#2c2531]'
                  }`}
                  title="Share to X with poster image"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>X (Twitter)</span>
                </button>
              </div>

              {/* Direct Native Share Button with File Attached */}
              <button
                type="button"
                onClick={handleDirectShare}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 text-[#00f5ff] border border-white/10'
                    : 'bg-[#f4f3f7] hover:bg-[#eae8ef] text-[#2c2531] border border-[#2c2531]/15'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Poster with Any App (Direct File Share)</span>
              </button>

              <p
                className={`text-[10px] text-center mt-2 font-medium ${
                  isDark ? 'text-silver-400' : 'text-[#716979]'
                }`}
              >
                ✨ Automatically attaches the poster image on mobile, or copies it to your clipboard (Ctrl+V) on desktop.
              </p>
            </div>
          </div>

          {/* RIGHT: Large Live Poster Preview (Clean, Exact 4:5 Poster) */}
          <div className="lg:col-span-6 flex flex-col items-center sticky top-24">
            <div
              className={`w-full max-w-sm sm:max-w-md p-4 rounded-3xl relative transition-all ${
                isDark
                  ? 'bg-[#11132f] border border-white/15 shadow-2xl'
                  : 'bg-white border-2 border-[#2c2531] shadow-[0_8px_0_#2c2531]'
              }`}
            >
              {/* Badge Pill on top */}
              <div
                className={`absolute -top-3.5 right-4 z-20 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                  isDark
                    ? 'bg-gradient-to-r from-[#00f5ff] to-[#8b5cf6] text-black shadow-[0_0_15px_rgba(0,245,255,0.5)]'
                    : 'bg-[#fde047] text-[#2c2531] border-2 border-[#2c2531] shadow-[0_2px_0_#2c2531] rotate-2'
                }`}
              >
                {selectedRole} Official Pass
              </div>

              {/* The Poster Element */}
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-black/20">
                <PosterCanvas ref={posterRef} data={formData} className="w-full" />
              </div>

              {/* Instant Export Button */}
              <button
                type="button"
                disabled={isExporting}
                onClick={handleDownload}
                className={`w-full mt-4 py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                    : 'bg-[#2c2531] hover:bg-[#fd92fe] text-white hover:text-[#2c2531] border-2 border-[#2c2531] shadow-[0_3px_0_#2c2531] active:translate-y-0.5'
                }`}
              >
                {isExporting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>Export 1080p Poster</span>
              </button>

              {/* Direct Share with Image Button */}
              <button
                type="button"
                onClick={handleDirectShare}
                className={`w-full mt-2.5 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                  isDark
                    ? 'bg-gradient-to-r from-[#00f5ff]/20 to-[#8b5cf6]/20 hover:from-[#00f5ff]/30 hover:to-[#8b5cf6]/30 text-[#00f5ff] border border-[#00f5ff]/40 shadow-[0_0_15px_rgba(0,245,255,0.2)]'
                    : 'bg-[#f4f3f7] hover:bg-[#eae8ef] text-[#2c2531] border-2 border-[#2c2531] shadow-[0_2px_0_#2c2531]'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Pass with Image</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        className={`border-t py-6 px-4 sm:px-8 mt-16 text-center text-xs transition-colors ${
          isDark
            ? 'border-white/10 bg-[#060814]/90 text-silver-400'
            : 'border-2 border-[#2c2531]/10 bg-white/70 text-[#716979]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLogo isDark={isDark} />
          <div className="font-semibold">
            {BRAND_CONFIG.festivalName} 2026 • {BRAND_CONFIG.universityName} • {BRAND_CONFIG.dates}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
