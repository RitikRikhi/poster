import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  X,
  RotateCcw,
  Check,
  FlipHorizontal,
  Timer,
  AlertCircle,
  Upload,
  Sparkles,
  RefreshCw,
  Smartphone,
} from 'lucide-react';

interface SmartSelfieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCaptured: (dataUrl: string) => void;
  onOpenGalleryFallback: () => void;
  onOpenNativeCamera: () => void;
  isDark?: boolean;
}

export const SmartSelfieModal: React.FC<SmartSelfieModalProps> = ({
  isOpen,
  onClose,
  onPhotoCaptured,
  onOpenGalleryFallback,
  onOpenNativeCamera,
  isDark = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isMirrored, setIsMirrored] = useState(true);
  const [useCountdown, setUseCountdown] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ title: string; desc: string; type: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  // Cleanly stops any active media stream
  const stopActiveStream = () => {
    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping track:', e);
        }
      });
      activeStreamRef.current = null;
    }
    setStream(null);
  };

  // Safe camera initializer with race-condition prevention (essential for Windows webcams & StrictMode)
  const startCamera = async (deviceIdToUse?: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    // Stop previous track before opening new one to avoid NotReadableError: Could not start video source
    stopActiveStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage({
        title: 'Camera API Not Supported',
        desc: 'Your browser environment does not support WebRTC camera access. Please use your device camera or upload a photo.',
        type: 'unsupported',
      });
      setIsLoading(false);
      return;
    }

    let mediaStream: MediaStream | null = null;

    // Strategy 1: Ideal 720p or selected device
    try {
      const constraints: MediaStreamConstraints = {
        video: deviceIdToUse
          ? { deviceId: { exact: deviceIdToUse } }
          : {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: 'user',
            },
        audio: false,
      };
      mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err1: any) {
      console.warn('Strategy 1 failed, trying Strategy 2 ({ video: true })...', err1);

      // Strategy 2: Simple generic video constraint (fixes Windows laptops where facingMode throws)
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      } catch (err2: any) {
        console.warn('Strategy 2 failed, trying Strategy 3 (device enumeration)...', err2);

        // Strategy 3: Enumerate devices and explicitly try the first video input
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevs = devices.filter((d) => d.kind === 'videoinput');
          if (videoDevs.length > 0) {
            mediaStream = await navigator.mediaDevices.getUserMedia({
              video: { deviceId: { exact: videoDevs[0].deviceId } },
              audio: false,
            });
          } else {
            throw new Error('NotFoundError');
          }
        } catch (err3: any) {
          console.error('All camera strategies failed:', err3);

          const errName = err3?.name || err2?.name || err1?.name || '';
          const errMsg = err3?.message || err2?.message || '';

          if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
            setErrorMessage({
              title: 'Camera Permission Denied',
              desc: 'Camera access is blocked in your browser settings. You can click below to use your native device camera or upload a photo.',
              type: 'permission',
            });
          } else if (errName === 'NotReadableError' || errMsg.includes('NotReadableError') || errMsg.includes('Could not start video source')) {
            setErrorMessage({
              title: 'Webcam In Use by Another App',
              desc: 'Your camera is currently locked by another application (Zoom, Teams, Discord, or another browser tab). Close other camera apps and retry, or use the Native Camera below.',
              type: 'locked',
            });
          } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError' || errMsg.includes('No webcam') || errMsg.includes('NotFoundError')) {
            setErrorMessage({
              title: 'No Webcam Detected',
              desc: 'No camera hardware was detected on this device. You can snap a photo with your device camera or upload an image.',
              type: 'not_found',
            });
          } else {
            setErrorMessage({
              title: 'Camera Not Accessible',
              desc: `Could not access camera (${errMsg || errName || 'Device unavailable'}). Please use Device Camera or choose a photo.`,
              type: 'general',
            });
          }

          setIsLoading(false);
          return;
        }
      }
    }

    if (mediaStream) {
      activeStreamRef.current = mediaStream;
      setStream(mediaStream);
      setIsLoading(false);

      // Attach immediately to video if mounted
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch((e) => console.warn('video play interrupted:', e));
      }

      // Check available camera devices for device switcher
      try {
        const devs = await navigator.mediaDevices.enumerateDevices();
        const vDevs = devs.filter((d) => d.kind === 'videoinput');
        setAvailableDevices(vDevs);
        const curTrack = mediaStream.getVideoTracks()[0];
        const s = curTrack?.getSettings?.();
        if (s?.deviceId) {
          setSelectedDeviceId(s.deviceId);
        }
      } catch (devErr) {
        console.warn('Device enumeration error:', devErr);
      }
    }
  };

  // Launch camera when modal opens; safely close stream on close
  useEffect(() => {
    let isCancelled = false;

    if (isOpen && !capturedPhoto) {
      startCamera();
    }

    return () => {
      isCancelled = true;
      stopActiveStream();
    };
  }, [isOpen]);

  // Ensure stream stays bound whenever video element mounts or stream updates
  useEffect(() => {
    if (videoRef.current && stream) {
      if (videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream;
      }
      videoRef.current.play().catch((e) => console.warn('play error:', e));
    }
  }, [stream]);

  // Handle countdown taking photo
  const triggerCapture = () => {
    if (useCountdown) {
      setCountdown(3);
    } else {
      performSnap();
    }
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 900);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      performSnap();
      setCountdown(null);
    }
  }, [countdown]);

  // Smart Snap: Center-crops video frame to 4:5 portrait ratio to match poster neon frame
  const performSnap = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const vWidth = video.videoWidth || 640;
    const vHeight = video.videoHeight || 480;

    // Trigger visual camera flash
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 220);

    // Calculate intelligent center crop for 4:5 portrait framing
    const targetRatio = 4 / 5;
    let sWidth = vWidth;
    let sHeight = vHeight;
    let sx = 0;
    let sy = 0;

    if (vWidth / vHeight > targetRatio) {
      // Video is wider than 4:5 (e.g. 16:9 widescreen) -> crop horizontal edges to center face
      sWidth = vHeight * targetRatio;
      sx = (vWidth - sWidth) / 2;
    } else {
      // Video is taller than 4:5 -> crop top/bottom slightly
      sHeight = vWidth / targetRatio;
      sy = (vHeight - sHeight) / 2;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 960;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.save();
      // If mirrored, flip horizontally
      if (isMirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      const dataUrl = canvas.toDataURL('image/jpeg', 0.94);
      setCapturedPhoto(dataUrl);
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setCountdown(null);
    startCamera(selectedDeviceId);
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onPhotoCaptured(capturedPhoto);
      handleClose();
    }
  };

  const handleClose = () => {
    stopActiveStream();
    setCapturedPhoto(null);
    setCountdown(null);
    setErrorMessage(null);
    onClose();
  };

  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    startCamera(deviceId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className={`max-w-md w-full rounded-3xl p-4 sm:p-6 my-auto max-h-[94dvh] overflow-y-auto transition-all relative flex flex-col ${
          isDark
            ? 'bg-[#11132f] border border-white/20 text-white shadow-[0_0_50px_rgba(0,0,0,0.8)]'
            : 'bg-white border-2 border-[#2c2531] shadow-[0_10px_0_#2c2531] text-[#2c2531]'
        }`}
      >
        {/* Flash Effect Overlay */}
        {isFlashing && (
          <div className="absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-200" />
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                isDark
                  ? 'bg-[#00f5ff]/20 text-[#00f5ff] border border-[#00f5ff]/40'
                  : 'bg-[#fd92fe] text-[#2c2531] border-2 border-[#2c2531] shadow-[0_2px_0_#2c2531]'
              }`}
            >
              <Camera className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-wide">
                Smart Selfie Studio
              </h3>
              <p
                className={`text-[10px] font-semibold ${
                  isDark ? 'text-silver-400' : 'text-[#716979]'
                }`}
              >
                Saviskar Official Pass Portrait
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className={`p-2 rounded-full transition-colors ${
              isDark
                ? 'hover:bg-white/10 text-white'
                : 'hover:bg-black/5 text-[#2c2531]'
            }`}
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Camera Viewport / Diagnostic Area */}
        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-black border-2 border-black/20 shadow-inner flex items-center justify-center">
          {/* If Error: Clear, friendly diagnostics with direct fallback buttons */}
          {errorMessage ? (
            <div className="p-6 text-center flex flex-col items-center justify-center text-white h-full bg-[#0d0e1f]/95">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-3">
                <AlertCircle className="w-6 h-6 stroke-[2.5]" />
              </div>

              <h4 className="font-extrabold text-base text-white mb-1.5">
                {errorMessage.title}
              </h4>

              <p className="text-xs text-silver-300 mb-6 max-w-xs leading-relaxed">
                {errorMessage.desc}
              </p>

              {/* Foolproof Fallback Actions */}
              <div className="flex flex-col gap-2.5 w-full max-w-xs">
                {/* 1. Native Device Camera (works directly on phones, tablets & laptops) */}
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onOpenNativeCamera();
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#00f5ff] to-[#8b5cf6] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-transform active:scale-95"
                >
                  <Smartphone className="w-4 h-4 stroke-[2.5]" />
                  <span>Take Photo with Device Camera</span>
                </button>

                {/* 2. Choose Photo from Files */}
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onOpenGalleryFallback();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/15 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Photo from Files</span>
                </button>

                {/* 3. Retry webcam */}
                <button
                  type="button"
                  onClick={() => startCamera(selectedDeviceId)}
                  className="w-full py-2 px-4 text-silver-400 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Webcam Access</span>
                </button>
              </div>
            </div>
          ) : capturedPhoto ? (
            /* Snapshot Review Screen */
            <div className="relative w-full h-full">
              <img
                src={capturedPhoto}
                alt="Captured Selfie"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#fde047]" />
                <span>Framed Preview</span>
              </div>
            </div>
          ) : (
            /* Live Video Stream View */
            <>
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 text-white z-20">
                  <RefreshCw className="w-7 h-7 animate-spin text-[#00f5ff] mb-2.5" />
                  <span className="text-xs font-bold tracking-wide">Starting camera feed...</span>
                </div>
              )}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={() => {
                  videoRef.current?.play().catch(console.warn);
                }}
                className={`w-full h-full object-cover transition-transform duration-200 ${
                  isMirrored ? '-scale-x-100' : ''
                }`}
              />

              {/* Intelligent Face Guide Overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                {/* Oval silhouette face guide */}
                <div className="w-[58%] h-[68%] rounded-[50%] border-2 border-dashed border-[#00f5ff]/70 shadow-[0_0_20px_rgba(0,245,255,0.4)] flex items-center justify-center relative">
                  <div className="absolute -top-3 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-sm text-[#00f5ff] text-[9px] font-bold tracking-widest uppercase border border-[#00f5ff]/50">
                    Align Face Here
                  </div>
                </div>
              </div>

              {/* Countdown overlay */}
              {countdown !== null && countdown > 0 && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-30">
                  <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white flex items-center justify-center text-white text-5xl font-black animate-ping">
                    {countdown}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Camera Controls & Tooling (when stream is live) */}
        {!errorMessage && !capturedPhoto && (
          <div className="mt-4 flex flex-col gap-3">
            {/* Quick Intelligent Adjusters */}
            <div className="flex items-center justify-between text-xs font-semibold">
              <button
                type="button"
                onClick={() => setIsMirrored((prev) => !prev)}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                  isMirrored
                    ? isDark
                      ? 'bg-[#00f5ff]/20 text-[#00f5ff] border-[#00f5ff]/40'
                      : 'bg-[#2c2531] text-white border-[#2c2531]'
                    : isDark
                    ? 'bg-white/5 text-silver-300 border-white/10'
                    : 'bg-[#f4f3f7] text-[#716979] border-[#2c2531]/15'
                }`}
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
                <span>{isMirrored ? 'Mirrored' : 'Normal'}</span>
              </button>

              <button
                type="button"
                onClick={() => setUseCountdown((prev) => !prev)}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                  useCountdown
                    ? isDark
                      ? 'bg-[#8b5cf6]/20 text-[#c084fc] border-[#8b5cf6]/40'
                      : 'bg-[#fd92fe] text-[#2c2531] border-2 border-[#2c2531]'
                    : isDark
                    ? 'bg-white/5 text-silver-300 border-white/10'
                    : 'bg-[#f4f3f7] text-[#716979] border-[#2c2531]/15'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>{useCountdown ? '3s Timer On' : 'Instant Snap'}</span>
              </button>

              {availableDevices.length > 1 && (
                <select
                  value={selectedDeviceId}
                  onChange={(e) => handleDeviceChange(e.target.value)}
                  className={`text-[11px] py-1 px-2 rounded-lg outline-none border ${
                    isDark
                      ? 'bg-[#1a1c3d] text-white border-white/15'
                      : 'bg-[#f4f3f7] text-[#2c2531] border-[#2c2531]/15'
                  }`}
                >
                  {availableDevices.map((dev, idx) => (
                    <option key={dev.deviceId} value={dev.deviceId}>
                      {dev.label || `Camera ${idx + 1}`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Main Action Snap Button */}
            <button
              type="button"
              disabled={isLoading || countdown !== null}
              onClick={triggerCapture}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 ${
                isDark
                  ? 'bg-gradient-to-r from-[#00f5ff] via-[#38bdf8] to-[#8b5cf6] text-black shadow-[0_0_20px_rgba(0,245,255,0.4)]'
                  : 'bg-[#2c2531] hover:bg-[#fd92fe] text-white hover:text-[#2c2531] border-2 border-[#2c2531] shadow-[0_4px_0_#2c2531]'
              }`}
            >
              <Camera className="w-4 h-4 stroke-[2.5]" />
              <span>
                {countdown !== null
                  ? `Capturing in ${countdown}...`
                  : useCountdown
                  ? 'Start 3s Countdown & Snap'
                  : 'Take Photo'}
              </span>
            </button>
          </div>
        )}

        {/* Snapshot Review Actions (Retake vs Apply) */}
        {capturedPhoto && (
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleRetake}
              className={`flex-1 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                isDark
                  ? 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                  : 'bg-[#f4f3f7] hover:bg-white text-[#2c2531] border-2 border-[#2c2531]/20'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake</span>
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className={`flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                isDark
                  ? 'bg-gradient-to-r from-[#00f5ff] to-[#8b5cf6] text-black shadow-lg'
                  : 'bg-[#2c2531] hover:bg-[#fd92fe] text-white hover:text-[#2c2531] border-2 border-[#2c2531] shadow-[0_4px_0_#2c2531]'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Apply to Poster</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
