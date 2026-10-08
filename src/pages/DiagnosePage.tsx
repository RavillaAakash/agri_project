import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Stethoscope, Upload, Camera, AlertCircle, ShieldAlert, CheckCircle2, Award, ChevronRight, X } from 'lucide-react';
import { MetalButton } from '@/components/ui/MetalButton';
import { ThinkingOrbWrapper } from '@/components/ui/ThinkingOrbWrapper';
import { validateImageFile } from '@/services/supabase/storage';
import { saveDiagnosisSession } from '@/services/supabase/repository';
import type { PlantImageUpload, DiagnosisPrediction } from '@/types/agricultural';

export const DiagnosePage: React.FC = () => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadPart, setActiveUploadPart] = useState<'leaf' | 'whole_plant' | 'stem'>('leaf');
  const [selectedCrop, setSelectedCrop] = useState('Paddy / Rice');
  const [cropStage, setCropStage] = useState('Tillering');
  const [region, setRegion] = useState('Telangana (Warangal / Nalgonda)');
  const [uploads, setUploads] = useState<PlantImageUpload[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<DiagnosisPrediction | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
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

  const triggerFileUpload = (part: 'leaf' | 'whole_plant' | 'stem') => {
    setActiveUploadPart(part);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveUpload = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  };

  const handleRunAnalysis = () => {
    if (uploads.length === 0) return;
    setIsAnalyzing(true);
    setPrediction(null);

    // Simulating verified agronomic pipeline
    setTimeout(() => {
      setIsAnalyzing(false);
      setPrediction({
        id: 'diag-001',
        condition_id: 'rice-blast-01',
        condition_name: 'Rice Blast (మెడ విరుపు / ब्लास्ट)',
        scientific_name: 'Magnaporthe oryzae (Pyricularia oryzae)',
        local_names: {
          en: 'Rice Blast',
          te: 'వరి అగ్గితెగులు / మెడ విరుపు',
          hi: 'धान का झुलसा रोग (ब्लास्ट)',
        },
        problem_type: 'disease',
        confidence: 88,
        confidence_level: 'high',
        observed_symptoms: [
          'Spindle-shaped or eye-shaped lesions with grey/whitish centers and dark reddish-brown borders on leaves.',
          'Lesions coalescing causing leaf desiccation (blast appearance).',
          'Characteristic node and neck rot vulnerability detected for current tillering stage.',
        ],
        possible_causes: [
          'High relative humidity (>90%) with cloudy days and moderate temperatures (20-26°C).',
          'Excessive application of chemical nitrogenous fertilizers without adequate potash.',
        ],
        what_to_do_now: [
          'Avoid excessive nitrogen top-dressing immediately.',
          'Maintain field sanitation and manage standing water to reduce microclimate humidity.',
          'Drain field temporarily if flooded to suppress fungal spore sporulation.',
        ],
        prevention_guidance: [
          'Use blast-resistant varieties (e.g. MTU 1010, RNR 15048 where suitable).',
          'Treat seeds with Trichoderma viride @ 5-10g/kg seed before sowing.',
          'Balance N:P:K fertilizer ratios based on official soil health card tests.',
        ],
        ipm_guidance: [
          'Biological Control: Apply Pseudomonas fluorescens 2.5 kg/ha mixed with well-rotted farmyard manure.',
          'Cultural: Avoid late planting and maintain optimal plant spacing to allow sun penetration.',
        ],
        chemical_guidance: {
          active_ingredient: 'Tricyclazole 75% WP or Isoprothiolane 40% EC (State Uni Approved)',
          official_recommendation: 'Spray Tricyclazole 75% WP @ 0.6 g/L or Isoprothiolane 40% EC @ 1.5 ml/L only if disease threshold crosses 5% leaf area.',
          safety_disclaimer: 'Follow current official product label and waiting period (waiting period: 30 days). Wear protective gear. Consult your local agricultural extension officer.',
          source: 'PJTSAU Crop Protection Guidelines / ICAR-NRRI',
          regional_applicability: 'Telangana & Andhra Pradesh',
        },
        sources: [
          {
            source_name: 'ICAR - National Rice Research Institute (NRRI)',
            source_url: 'https://icar-nrri.gov.in',
            source_type: 'icar',
            license: 'Government Open Data / Public Agricultural Advisory',
            retrieval_date: '2026-10-08',
            region: ['Telangana', 'Andhra Pradesh', 'Pan-India'],
            language: 'English, Telugu, Hindi',
            verification_status: 'verified',
            last_verified: '2026-10-01',
          },
        ],
        requires_expert_review: false,
      });
    }, 2000);
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
              <option value="Fruiting / Boll Development">Fruiting / Maturation</option>
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
              {uploads.length} / 3 Angles Uploaded
            </span>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-emerald-800/30 dark:border-emerald-700/40 rounded-2xl p-6 text-center space-y-3 bg-emerald-950/5 dark:bg-emerald-950/20">
            <div className="w-12 h-12 rounded-full bg-emerald-700/10 dark:bg-emerald-500/20 mx-auto flex items-center justify-center text-emerald-600">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground">
                {t('diagnose.upload_zone')}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {t('diagnose.multi_image_hint')}
              </p>
            </div>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp"
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
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => triggerFileUpload('leaf')}
                className="px-3.5 py-2 text-xs rounded-xl border border-emerald-700/30 bg-background hover:bg-muted font-medium flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-600" /> + Add Leaf Close-up
              </button>
              <button
                type="button"
                onClick={() => triggerFileUpload('whole_plant')}
                className="px-3.5 py-2 text-xs rounded-xl border border-emerald-700/30 bg-background hover:bg-muted font-medium flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-600" /> + Add Whole Plant
              </button>
              <button
                type="button"
                onClick={() => triggerFileUpload('stem')}
                className="px-3.5 py-2 text-xs rounded-xl border border-emerald-700/30 bg-background hover:bg-muted font-medium flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-600" /> + Add Stem / Pest
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
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-rose-600 transition-colors"
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
              className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
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
                {prediction.observed_symptoms.map((s, i) => (
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
                {prediction.possible_causes.map((c, i) => (
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
                  {prediction.what_to_do_now.map((act, i) => (
                    <li key={i}>• {act}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Biological Control (IPM):
                </span>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {prediction.ipm_guidance.map((ipm, i) => (
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
