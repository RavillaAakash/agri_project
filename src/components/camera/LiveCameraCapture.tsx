import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, X, Check, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

interface LiveCameraCaptureProps {
  onCapture: (file: File, previewUrl: string) => void;
  onClose: () => void;
}

export const LiveCameraCapture: React.FC<LiveCameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [flashActive, setFlashActive] = useState(false);

  // Play synthesized camera shutter sound via Web Audio API
  const playShutterSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // AudioContext not allowed or muted
    }
  };

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setErrorMessage(null);
    stopStream();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser or environment.');
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: unknown) {
      setHasPermission(false);
      const msg = err instanceof Error ? err.message : 'Unable to access camera';
      if (msg.includes('NotAllowedError') || msg.includes('Permission denied')) {
        setErrorMessage('Camera permission was denied. Please allow camera permissions in your browser address bar.');
      } else if (msg.includes('NotFoundError') || msg.includes('DevicesNotFoundError')) {
        setErrorMessage('No camera device found on this hardware.');
      } else {
        setErrorMessage(msg);
      }
    }
  }, [facingMode, stopStream]);

  useEffect(() => {
    startCamera();
    return () => {
      stopStream();
    };
  }, [startCamera, stopStream]);

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flash animation
    setFlashActive(true);
    playShutterSound();
    setTimeout(() => setFlashActive(false), 180);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      setCapturedBlob(blob);
      setCapturedPreview(url);
      setIsScanning(false);
    }, 'image/jpeg', 0.95);
  };

  const handleRetake = () => {
    if (capturedPreview) {
      URL.revokeObjectURL(capturedPreview);
    }
    setCapturedPreview(null);
    setCapturedBlob(null);
    setIsScanning(true);
  };

  const handleConfirm = () => {
    if (!capturedBlob || !capturedPreview) return;
    const file = new File([capturedBlob], `crop-diagnosis-${Date.now()}.jpg`, {
      type: 'image/jpeg',
    });
    onCapture(file, capturedPreview);
    stopStream();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-950 border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/90 border-b border-emerald-500/20 text-white z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Camera className="w-4 h-4" /> Real-time Leaf &amp; Pest Scanner
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              stopStream();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Camera"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[360px] sm:min-h-[440px]">
          {/* Flash Effect */}
          {flashActive && <div className="absolute inset-0 bg-white z-30 pointer-events-none transition-opacity duration-150" />}

          {/* Hidden Canvas for capture rendering */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Active Video Stream */}
          {!capturedPreview && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}

          {/* Frozen Captured Preview */}
          {capturedPreview && (
            <img
              src={capturedPreview}
              alt="Captured sample preview"
              className="w-full h-full object-cover"
            />
          )}

          {/* Scanning HUD Overlay when live */}
          {!capturedPreview && isScanning && hasPermission && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              {/* Animated Laser Scan Bar */}
              <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce" style={{ top: '45%' }} />

              {/* Bounding Box / Reticle */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 border-2 border-emerald-400/60 rounded-2xl">
                {/* Corner markers */}
                <span className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-emerald-400" />
                <span className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-emerald-400" />
                <span className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-emerald-400" />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-emerald-400" />

                {/* Center crosshair */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-0.5 bg-emerald-400/50" />
                  <div className="h-6 w-0.5 bg-emerald-400/50 absolute" />
                </div>
              </div>

              {/* Guidance Badge */}
              <div className="mt-4 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-emerald-400/40 text-[11px] text-emerald-200 font-medium flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Align damaged leaf lesion inside the frame in good light
              </div>
            </div>
          )}

          {/* Permission or Error Banner */}
          {hasPermission === false && (
            <div className="p-6 text-center text-white space-y-3 max-w-sm">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold">Camera Access Required</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {errorMessage || 'Please enable camera permissions in your browser to inspect plant foliage.'}
              </p>
              <button
                type="button"
                onClick={startCamera}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Retry Camera Access
              </button>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="px-5 py-4 bg-slate-900 border-t border-emerald-500/20 flex items-center justify-between z-20">
          {!capturedPreview ? (
            <>
              {/* Switch Camera Button */}
              <button
                type="button"
                onClick={toggleFacingMode}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Switch between front and back camera"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {facingMode === 'environment' ? 'Back (Field)' : 'Front'}
                </span>
              </button>

              {/* Shutter Button */}
              <button
                type="button"
                disabled={!hasPermission}
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-300 p-1 shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 transition-transform cursor-pointer disabled:opacity-40"
                aria-label="Take Photo"
              >
                <div className="w-full h-full rounded-full border-4 border-slate-950 bg-white flex items-center justify-center text-slate-900">
                  <Camera className="w-6 h-6 text-emerald-800" />
                </div>
              </button>

              {/* Quality Hint */}
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>HD Vision AI</span>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-3 px-4 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer text-center"
              >
                Retake Picture
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Use This Photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
