import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Stethoscope, Upload, Camera, AlertCircle, ShieldAlert, CheckCircle2, Award, ChevronRight, X } from 'lucide-react';
import { ThinkingOrbWrapper } from '@/components/ui/ThinkingOrbWrapper';
import { validateImageFile } from '@/services/supabase/storage';
import { saveDiagnosisSession } from '@/services/supabase/repository';
import { runMultimodalInference, type LesionSegmentationEstimate } from '@/services/ai/visionInference';
import { checkRateLimit } from '@/services/ai/rateLimiter';
import type { PlantImageUpload, DiagnosisPrediction } from '@/types/agricultural';

const CHILLI_SAMPLE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%231e3a1e"/><path d="M200,60 C260,110 320,200 290,300 C270,340 220,360 200,380 C180,360 130,340 110,300 C80,200 140,110 200,60 Z" fill="%234d7c0f" stroke="%23365314" stroke-width="6"/><path d="M200,60 L200,370" stroke="%23a3e635" stroke-width="4"/><path d="M200,140 Q250,130 280,160 M200,200 Q260,190 290,240 M200,260 Q240,250 270,290" stroke="%23a3e635" stroke-width="2.5"/><path d="M200,140 Q150,130 120,160 M200,200 Q140,190 110,240 M200,260 Q160,250 130,290" stroke="%23a3e635" stroke-width="2.5"/><circle cx="230" cy="180" r="18" fill="%23ca8a04" opacity="0.85"/><circle cx="160" cy="220" r="22" fill="%23eab308" opacity="0.8"/><circle cx="210" cy="270" r="15" fill="%23a16207" opacity="0.9"/><text x="200" y="38" font-family="sans-serif" font-size="16" font-weight="bold" fill="%23fef08a" text-anchor="middle">Chilli Leaf Curl &amp; Thrips (Sample)</text></svg>`;

const PADDY_SAMPLE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23132e1b"/><path d="M200,30 C230,120 250,240 220,380 C210,385 190,385 180,380 C150,240 170,120 200,30 Z" fill="%2315803d" stroke="%2314532d" stroke-width="5"/><path d="M200,30 L200,380" stroke="%2386efac" stroke-width="3"/><ellipse cx="200" cy="150" rx="18" ry="36" fill="%23fef9c3" stroke="%23991b1b" stroke-width="4"/><ellipse cx="200" cy="150" rx="9" ry="20" fill="%23e2e8f0"/><ellipse cx="204" cy="240" rx="14" ry="28" fill="%23fef9c3" stroke="%23991b1b" stroke-width="3"/><ellipse cx="204" cy="240" rx="7" ry="15" fill="%23cbd5e1"/><ellipse cx="196" cy="310" rx="12" ry="22" fill="%23fef9c3" stroke="%23991b1b" stroke-width="3"/><text x="200" y="380" font-family="sans-serif" font-size="16" font-weight="bold" fill="%23fef08a" text-anchor="middle">Rice Blast Spindle Lesions (Sample)</text></svg>`;

const COTTON_SAMPLE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%232b1f13"/><circle cx="200" cy="200" r="110" fill="%234d7c0f" stroke="%23365314" stroke-width="6"/><path d="M140,210 C160,170 240,170 260,210 C240,260 160,260 140,210 Z" fill="%23f8fafc"/><circle cx="190" cy="175" r="9" fill="%23451a03"/><path d="M190,175 Q210,195 220,185" stroke="%23f43f5e" stroke-width="6" stroke-linecap="round"/><circle cx="220" cy="185" r="4" fill="%239f1239"/><text x="200" y="360" font-family="sans-serif" font-size="16" font-weight="bold" fill="%23fbcfe8" text-anchor="middle">Cotton Bollworm Entrance (Sample)</text></svg>`;

const TOMATO_SAMPLE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%231a2e16"/><path d="M200,50 C290,120 330,220 280,330 C240,365 210,350 200,370 C190,350 160,365 120,330 C70,220 110,120 200,50 Z" fill="%233f6212" stroke="%231a2e05" stroke-width="5"/><circle cx="190" cy="170" r="38" fill="%23ca8a04" opacity="0.6"/><circle cx="190" cy="170" r="28" fill="%23713f12" stroke="%23451a03" stroke-width="3"/><circle cx="190" cy="170" r="18" fill="%23451a03" stroke="%231c1917" stroke-width="2"/><circle cx="190" cy="170" r="8" fill="%231c1917"/><circle cx="240" cy="250" r="24" fill="%23ca8a04" opacity="0.6"/><circle cx="240" cy="250" r="16" fill="%23713f12" stroke="%23451a03" stroke-width="2"/><circle cx="240" cy="250" r="8" fill="%231c1917"/><text x="200" y="375" font-family="sans-serif" font-size="16" font-weight="bold" fill="%23fef08a" text-anchor="middle">Tomato Early Blight Target Rings (Sample)</text></svg>`;

export const DiagnosePage: React.FC = () => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadPart, setActiveUploadPart] = useState<'leaf' | 'whole_plant' | 'stem'>('leaf');
  const [selectedCrop, setSelectedCrop] = useState('Paddy / Rice');
  const [cropStage, setCropStage] = useState('Tillering / Vegetative');
  const [region, setRegion] = useState('Telangana (Warangal / Nalgonda)');
  const [uploads, setUploads] = useState<PlantImageUpload[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [prediction, setPrediction] = useState<DiagnosisPrediction | null>(null);
  const [segmentation, setSegmentation] = useState<LesionSegmentationEstimate | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setUploadError(null);
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setUploadError(validation.error || 'Invalid image file.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const newUpload: PlantImageUpload = {
      id: Math.random().toString(),
      file,
      previewUrl,
      plant_part: activeUploadPart,
    };
    setUploads((prev) => [...prev, newUpload]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFile(files[0]);
    if (e.target) e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const triggerFileUpload = (part: 'leaf' | 'whole_plant' | 'stem') => {
    setActiveUploadPart(part);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const triggerCameraUpload = (part: 'leaf' | 'whole_plant' | 'stem') => {
    setActiveUploadPart(part);
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleRemoveUpload = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  };

  const loadSample = (
    cropName: string,
    stage: string,
    svgData: string,
    part: 'leaf' | 'whole_plant' | 'stem'
  ) => {
    setSelectedCrop(cropName);
    setCropStage(stage);
    setUploadError(null);
    const sampleUpload: PlantImageUpload = {
      id: 'demo-' + Date.now(),
      previewUrl: svgData,
      plant_part: part,
    };
    setUploads([sampleUpload]);
  };

  const handleRunAnalysis = async () => {
    if (uploads.length === 0) return;

    const rateCheck = checkRateLimit({ key: 'diagnosis_engine', maxRequests: 15, windowMs: 60000 });
    if (!rateCheck.allowed) {
      setUploadError(
        `Diagnostic analysis limit reached. Please wait ${
          rateCheck.retryAfterSeconds || 10
        } seconds before running another inference.`
      );
      return;
    }

    setIsAnalyzing(true);
    setPrediction(null);
    setSegmentation(null);

    const cropIdKey = selectedCrop.toLowerCase().includes('paddy') || selectedCrop.toLowerCase().includes('rice')
      ? 'paddy'
      : selectedCrop.toLowerCase().includes('cotton')
      ? 'cotton'
      : selectedCrop.toLowerCase().includes('tomato')
      ? 'tomato'
      : selectedCrop.toLowerCase().includes('maize') || selectedCrop.toLowerCase().includes('corn')
      ? 'maize'
      : selectedCrop.toLowerCase().includes('groundnut') || selectedCrop.toLowerCase().includes('peanut')
      ? 'groundnut'
      : 'chilli';

    try {
      const { prediction: pred, segmentation: seg } = await runMultimodalInference({
        images: uploads,
        cropId: cropIdKey,
        cropStage,
        region,
      });

      setIsAnalyzing(false);
      setPrediction(pred);
      setSegmentation(seg);

      // Save diagnostic session record
      await saveDiagnosisSession({
        crop_id: cropIdKey,
        confidence: pred.confidence,
        confidence_level: pred.confidence_level,
        requires_expert_review: pred.requires_expert_review,
        image_paths: uploads.map((u) => u.previewUrl),
      });
    } catch (err: unknown) {
      setIsAnalyzing(false);
      const msg = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setUploadError(msg);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Multimodal Agricultural Diagnostics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
          {t('diagnose.title')}
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          {t('diagnose.subtitle')}
        </p>
      </div>

      {/* 1-Click Interactive Test Samples */}
      <div className="p-4 rounded-2xl bg-card border border-border space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            ⚡ Quick Test Samples (1-Click Instant Demo)
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Test any sample without local files
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => loadSample('Chilli', 'Vegetative / ఎదుగుదల దశ', CHILLI_SAMPLE_SVG, 'leaf')}
            className="p-2.5 rounded-xl border border-border bg-background hover:bg-muted text-left text-xs space-y-1 transition-all hover:border-emerald-500 cursor-pointer shadow-xs"
          >
            <span className="font-bold text-foreground block">🌶️ Chilli Leaf Curl</span>
            <span className="text-[10px] text-muted-foreground block">Thrips &amp; Mites Complex</span>
          </button>
          <button
            type="button"
            onClick={() => loadSample('Paddy / Rice', 'Tillering / Vegetative', PADDY_SAMPLE_SVG, 'leaf')}
            className="p-2.5 rounded-xl border border-border bg-background hover:bg-muted text-left text-xs space-y-1 transition-all hover:border-emerald-500 cursor-pointer shadow-xs"
          >
            <span className="font-bold text-foreground block">🌾 Paddy Blast</span>
            <span className="text-[10px] text-muted-foreground block">Spindle Lesions</span>
          </button>
          <button
            type="button"
            onClick={() => loadSample('Cotton', 'Fruiting / Maturation', COTTON_SAMPLE_SVG, 'stem')}
            className="p-2.5 rounded-xl border border-border bg-background hover:bg-muted text-left text-xs space-y-1 transition-all hover:border-emerald-500 cursor-pointer shadow-xs"
          >
            <span className="font-bold text-foreground block">☁️ Cotton Bollworm</span>
            <span className="text-[10px] text-muted-foreground block">Pink Bollworm Entrance</span>
          </button>
          <button
            type="button"
            onClick={() => loadSample('Tomato', 'Vegetative / ఎదుగుదల దశ', TOMATO_SAMPLE_SVG, 'leaf')}
            className="p-2.5 rounded-xl border border-border bg-background hover:bg-muted text-left text-xs space-y-1 transition-all hover:border-emerald-500 cursor-pointer shadow-xs"
          >
            <span className="font-bold text-foreground block">🍅 Tomato Early Blight</span>
            <span className="text-[10px] text-muted-foreground block">Target-Ring Lesions</span>
          </button>
        </div>
      </div>

      {/* Input Form & Image Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Crop Context */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Crop Context (ICAR Field Metadata)
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Target Crop</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Paddy / Rice">Paddy / Rice (వరి / धान)</option>
              <option value="Cotton">Cotton (ప్రత్తి / कपास)</option>
              <option value="Chilli">Chilli (మిర్చి / मिर्च)</option>
              <option value="Tomato">Tomato (టమాట / टमाटर)</option>
              <option value="Maize / Corn">Maize / Corn (మొక్కజొన్న / मक्का)</option>
              <option value="Groundnut / Peanut">Groundnut / Peanut (వేరుశనగ / मूंगफली)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Growth Stage</label>
            <select
              value={cropStage}
              onChange={(e) => setCropStage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Nursery / Seedling">Nursery / Seedling</option>
              <option value="Tillering / Vegetative">Tillering / Vegetative</option>
              <option value="Flowering / Panicle Initiation">Flowering / Panicle</option>
              <option value="Fruiting / Maturation">Fruiting / Maturation</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Region / District</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Karimnagar, Guntur, Khammam"
            />
          </div>

          <div className="p-3 rounded-xl bg-muted/50 border border-border text-[11px] text-muted-foreground space-y-1">
            <span className="font-semibold text-foreground block">Why Crop Context Matters:</span>
            Diseases like blast or pink bollworm are stage-specific. Cross-referencing stage prevents false-positive diagnosis.
          </div>
        </div>

        {/* Right Column: Multi-Angle Image Uploader */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-card border border-border shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Multi-Angle Image Evidence
            </h2>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              {uploads.length} Image{uploads.length === 1 ? '' : 's'} Loaded
            </span>
          </div>

          {/* Interactive Upload / Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            onClick={() => triggerFileUpload('leaf')}
            className={`border-2 border-dashed rounded-2xl p-6 text-center space-y-3 cursor-pointer transition-all ${
              isDragging
                ? 'border-emerald-500 bg-emerald-500/15'
                : 'border-emerald-800/30 dark:border-emerald-700/40 bg-emerald-950/5 dark:bg-emerald-950/20 hover:border-emerald-500'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-emerald-700/10 dark:bg-emerald-500/20 mx-auto flex items-center justify-center text-emerald-600">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground">
                {t('diagnose.upload_zone')}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Click anywhere or drag &amp; drop photos here. Mobile cameras supported directly.
              </p>
            </div>

            {/* Hidden native file input (Accepts all image formats) */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Hidden native camera direct capture input */}
            <input
              type="file"
              ref={cameraInputRef}
              onChange={handleFileChange}
              accept="image/*"
              capture="environment"
              className="hidden"
            />

            {/* Error notice if validation fails */}
            {uploadError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Camera / Upload Action Buttons */}
            <div
              className="flex flex-wrap justify-center gap-2 pt-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => triggerCameraUpload('leaf')}
                className="px-3.5 py-2 text-xs rounded-xl border border-emerald-600 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-600" /> 📸 Snap with Camera
              </button>
              <button
                type="button"
                onClick={() => triggerFileUpload('leaf')}
                className="px-3.5 py-2 text-xs rounded-xl border border-emerald-700/30 bg-background hover:bg-muted font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                + Add Leaf Close-up
              </button>
              <button
                type="button"
                onClick={() => triggerFileUpload('whole_plant')}
                className="px-3.5 py-2 text-xs rounded-xl border border-emerald-700/30 bg-background hover:bg-muted font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                + Add Whole Plant
              </button>
              <button
                type="button"
                onClick={() => triggerFileUpload('stem')}
                className="px-3.5 py-2 text-xs rounded-xl border border-emerald-700/30 bg-background hover:bg-muted font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                + Add Stem / Pest
              </button>
            </div>
          </div>

          {/* Uploaded Thumbnails with Delete button */}
          {uploads.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {uploads.map((u) => (
                <div key={u.id} className="relative rounded-xl overflow-hidden border border-border aspect-square group shadow-xs">
                  <img src={u.previewUrl} alt="Sample preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveUpload(u.id)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer"
                    aria-label="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 bg-black/70 px-2 py-1 text-[10px] text-white capitalize text-center">
                    {u.plant_part.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              disabled={uploads.length === 0 || isAnalyzing}
              onClick={handleRunAnalysis}
              className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4" />
              {isAnalyzing ? t('diagnose.analyzing') : t('diagnose.analyze_btn')}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Thinking State */}
      {isAnalyzing && (
        <div className="p-10 rounded-2xl bg-card border border-border text-center space-y-4">
          <ThinkingOrbWrapper state="solving" size={64} label="Multimodal Vision & Agronomic RAG Processing..." />
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Extracting lesion boundary geometry, color spectrum degradation, and correlating with regional ICAR disease triggers...
          </p>
        </div>
      )}

      {/* Results Section */}
      {prediction && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-emerald-600/30 shadow-xl space-y-6">
          {/* Header & Confidence */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                AI Diagnostic Identification
              </span>
              <h2 className="text-2xl font-bold text-foreground">
                {prediction.condition_name}
              </h2>
              <div className="text-xs italic text-muted-foreground">
                Scientific Taxon: {prediction.scientific_name}
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-400/50 text-emerald-900 dark:text-emerald-200 text-right">
              <div className="text-[10px] font-semibold uppercase tracking-wider">
                {t('diagnose.confidence')}
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {prediction.confidence}%
              </div>
            </div>
          </div>

          {/* Symptoms & Causes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {t('diagnose.observed_symptoms')}
              </h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground bg-muted/40 p-4 rounded-xl">
                {(prediction.observed_symptoms || []).map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                {t('diagnose.possible_cause')}
              </h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground bg-muted/40 p-4 rounded-xl">
                {(prediction.possible_causes || []).map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Recommendations: IPM & Cultural First */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              {t('diagnose.immediate_actions')} & IPM Protocols
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Cultural & Mechanical Control:
                </span>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {(prediction.what_to_do_now || []).map((act, i) => (
                    <li key={i}>• {act}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Biological Control (IPM):
                </span>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {(prediction.ipm_guidance || []).map((ipm, i) => (
                    <li key={i}>• {ipm}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Verified Chemical Information with Mandatory Safeguards */}
          {prediction.chemical_guidance && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Verified Agricultural Chemical Information (Follow Product Label)</span>
              </div>
              <p className="text-foreground/90 font-medium">
                Active Ingredient: {prediction.chemical_guidance.active_ingredient}
              </p>
              <p className="text-muted-foreground">
                Recommendation: {prediction.chemical_guidance.official_recommendation}
              </p>
              <div className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold pt-1 border-t border-amber-500/20">
                {prediction.chemical_guidance.safety_disclaimer}
              </div>
            </div>
          )}

          {/* Lesion Segmentation & Multi-Angle Telemetry (§13, §18) */}
          {segmentation && (
            <div className="p-4 rounded-2xl bg-muted/40 border border-border grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                  Estimated Foliage Damage
                </span>
                <span className="text-base font-extrabold text-foreground">
                  {segmentation.estimatedLesionAreaPercent}% Leaf Area
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                  Multi-Angle Consensus
                </span>
                <span className="text-base font-extrabold text-emerald-600">
                  {(segmentation.multiAngleConsensusScore * 100).toFixed(0)}% Certainty
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                  Lesion Morphology Type
                </span>
                <span className="text-xs font-semibold text-foreground capitalize">
                  {segmentation.dominantSymptomType.replace('_', ' ')}
                </span>
              </div>
            </div>
          )}

          {/* Mandatory Safety Rule Banner (§20) */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
            <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-xs uppercase tracking-wider block">
                Statutory Safety Standard: AI-Assisted Identification
              </span>
              <p className="leading-relaxed opacity-95">
                This prediction is an AI-assisted evidentiary analysis and <strong>NOT a guaranteed laboratory diagnosis</strong>. Fungal sporulations, viral vectors, and physiological stresses frequently exhibit overlapping foliar necrosis. Always verify critical chemical applications with official registered product labels and local mandal agricultural officers (MAO).
              </p>
            </div>
          </div>

          {/* Low Confidence or Complex Case Escalation (§51) */}
          <div className="p-4 rounded-2xl bg-emerald-950/10 dark:bg-emerald-900/20 border border-emerald-600/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-foreground block">
                Need Human Scientific Confirmation?
              </span>
              <p className="text-muted-foreground text-[11px]">
                Request an agronomist review through our university extension partnership.
              </p>
            </div>
            <a
              href="/expert"
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              Request Agronomist Review <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Sources & Provenance */}
          <div className="pt-2 text-xs text-muted-foreground flex items-center justify-between border-t border-border">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">Scientific Provenance:</span>
              <span>{prediction.sources[0]?.source_name} ({prediction.sources[0]?.verification_status})</span>
            </div>
            <a
              href={prediction.sources[0]?.source_url}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
            >
              Verify Source <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
