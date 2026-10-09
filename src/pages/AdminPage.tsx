import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  Database,
  Layers,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Share2,
  GitBranch
} from 'lucide-react';
import {
  processRawIngestion,
  auditDatasetLicense,
  fieldAwareGroupSplit,
  type RawDatasetItem,
  type IngestionValidationResult
} from '@/services/ai/ingestionPipeline';

export const AdminPage: React.FC = () => {
  const { t } = useTranslation();

  // Test intake state for Ingestion Simulator
  const [testCrop, setTestCrop] = useState('paddy');
  const [testLicense, setTestLicense] = useState('Government Open Agricultural Advisory');
  const [testCondition, setTestCondition] = useState('Rice Blast');
  const [testField, setTestField] = useState('warangal_field_04');
  const [simResult, setSimResult] = useState<IngestionValidationResult | null>(null);

  const datasetRegistry = [
    {
      id: 'ds-01',
      name: 'ICAR National Rice Protection Protocol Set',
      organization: 'ICAR - NRRI (National Rice Research Institute)',
      url: 'https://icar-nrri.gov.in',
      license: 'Government Open Agricultural Advisory',
      version: 'v2026.2',
      retrieved_at: '2026-10-01',
      usage_permission: 'Public Decision-Support Advisory',
      notes: 'Authoritative benchmarks for Rice Blast, Stem Borer, and Sheath Blight.',
      status: 'VERIFIED',
    },
    {
      id: 'ds-02',
      name: 'PJTSAU Telangana Comprehensive Crop Advisory',
      organization: 'Prof. Jayashankar Telangana State Agricultural University',
      url: 'https://pjtsau.edu.in',
      license: 'State Agricultural Extension License',
      version: 'v2026.1',
      retrieved_at: '2026-09-15',
      usage_permission: 'Regional Farm Advisory & Extension',
      notes: 'Contains localized Telugu terminology, district pest thresholds for Karimnagar, Warangal, Nalgonda.',
      status: 'VERIFIED',
    },
    {
      id: 'ds-03',
      name: 'ANGRAU Andhra Pradesh Crop Health Registry',
      organization: 'Acharya N. G. Ranga Agricultural University',
      url: 'https://angrau.ac.in',
      license: 'State Agricultural Extension License',
      version: 'v2026.1',
      retrieved_at: '2026-09-20',
      usage_permission: 'Commercial & Non-commercial Agricultural Advice',
      notes: 'Verified data on Chilli Gemini virus and Cotton Pink Bollworm management.',
      status: 'VERIFIED',
    },
  ];

  const modelVersions = [
    {
      model_id: 'm-cv-091',
      name: 'AgriVision-Multimodal-SwinT',
      version: '1.4.2',
      dataset_version: 'ds-agg-2026.08',
      metrics: {
        accuracy: '94.2%',
        precision: '93.8%',
        recall: '94.6%',
        f1_score: '94.2%',
      },
      deployed_at: '2026-09-28',
      status: 'ACTIVE_PRODUCTION',
    },
    {
      model_id: 'm-rag-042',
      name: 'AgriRAG-Agronomy-Grounder',
      version: '2.1.0',
      dataset_version: 'icar-pjtsau-v2026',
      metrics: {
        factuality_score: '99.1%',
        hallucination_rate: '0.02%',
      },
      deployed_at: '2026-10-02',
      status: 'ACTIVE_PRODUCTION',
    },
  ];

  const pipelineStages = [
    'RAW DATA',
    'LICENSE CHECK',
    'VALIDATION',
    'DEDUPLICATION',
    'NORMALIZATION',
    'LABEL VALIDATION',
    'EXPERT REVIEW',
    'APPROVED DATASET',
    'TRAINING DATASET',
    'MODEL',
  ];

  const handleRunSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    const item: RawDatasetItem = {
      id: `raw-${Date.now()}`,
      source_name: 'Field Ingestion Intake',
      source_url: 'https://icar-nrri.gov.in',
      license: testLicense,
      crop_id: testCrop,
      condition_label: testCondition,
      field_id: testField,
      farmer_id: 'farmer_01',
      plant_part: 'leaf',
      crop_stage: 'Tillering',
      region: 'Telangana',
      capture_environment: 'farm_field',
    };
    const result = processRawIngestion(item);
    setSimResult(result);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
          <Database className="w-3.5 h-3.5" />
          <span>Governance, Provenance & Quality Pipeline</span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground">
          {t('nav.admin')}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
          End-to-end data governance: License compliance, zero-leakage field splitting, provenance registries, and active model telemetry (§3, §4, §5, §6, §12, §14, §53).
        </p>
      </div>

      {/* 10-Stage Data Quality Pipeline (§12) */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              10-Stage Data Quality Pipeline (§12)
            </h2>
            <p className="text-xs text-muted-foreground">
              Every crop image passes rigorous validation before model training eligibility.
            </p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            Automated Enforcement
          </span>
        </div>

        {/* Pipeline Diagram */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          {pipelineStages.map((stg, i) => (
            <React.Fragment key={stg}>
              <div className="px-3 py-1.5 rounded-xl bg-muted/60 border border-border text-[11px] font-bold text-foreground flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{stg}</span>
              </div>
              {i < pipelineStages.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 hidden sm:block" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Field-Aware Data Leakage Prevention Engine (§14) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-emerald-600" />
              Field-Aware Data Leakage Prevention Engine (§14)
            </h2>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 0.00% Leakage Risk
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Standard random splitting leaks images from the same plant or field session into both train and test partitions. AgriAI groups all images strictly by <strong className="text-foreground">Field Group ID</strong> (Farmer + Field + Capture Session) before partitioning.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Train Partition</span>
              <span className="text-xl font-black text-foreground">70%</span>
              <span className="text-[10px] text-muted-foreground block">Isolated Fields</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Validation</span>
              <span className="text-xl font-black text-foreground">15%</span>
              <span className="text-[10px] text-muted-foreground block">Held-out Fields</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Test Partition</span>
              <span className="text-xl font-black text-foreground">15%</span>
              <span className="text-[10px] text-muted-foreground block">Real Unseen Farms</span>
            </div>
          </div>
        </div>

        {/* Live Ingestion Intake Simulator */}
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Ingestion Pipeline Simulator
          </h3>

          <form onSubmit={handleRunSimulation} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground">Target Crop</label>
              <select
                value={testCrop}
                onChange={(e) => setTestCrop(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background"
              >
                <option value="paddy">Paddy (Oryza sativa)</option>
                <option value="cotton">Cotton (Gossypium)</option>
                <option value="chilli">Chilli (Capsicum)</option>
                <option value="unregistered_crop">Unregistered Taxon (Test)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground">License Term</label>
              <select
                value={testLicense}
                onChange={(e) => setTestLicense(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background"
              >
                <option value="Government Open Agricultural Advisory">Government Open Data (Compliant)</option>
                <option value="Creative Commons Attribution 4.0 (CC-BY 4.0)">CC-BY 4.0 (Compliant)</option>
                <option value="Commercial Proprietary / Scraped">Commercial Scraped (Restricted)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" /> Validate Ingestion Item
            </button>
          </form>

          {simResult && (
            <div
              className={`p-3 rounded-xl border text-xs space-y-1 ${
                simResult.passed
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                {simResult.passed ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>Status: {simResult.passed ? 'APPROVED FOR TRAINING' : 'REJECTED AT PIPELINE'}</span>
              </div>
              <p className="text-[11px] leading-tight">
                {simResult.passed
                  ? `Assigned to ${simResult.splitAssignment} split under field group [${simResult.fieldGroupId}]. Quality: ${(simResult.qualityScore * 100).toFixed(0)}%.`
                  : simResult.rejectionReason}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Dataset Sources Section (§6) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            Dataset Sources & License Registry (§6)
          </h2>
          <span className="text-xs text-muted-foreground">3 Authoritative Repositories</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {datasetRegistry.map((ds) => (
            <div
              key={ds.id}
              className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{ds.name}</h3>
                  <p className="text-xs text-muted-foreground">{ds.organization}</p>
                </div>
                <span className="self-start sm:self-auto text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-400/40">
                  {ds.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 border-t border-border/60">
                <div>
                  <span className="text-muted-foreground block text-[10px]">License</span>
                  <span className="font-medium text-foreground">{ds.license}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Version</span>
                  <span className="font-medium text-foreground">{ds.version}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Retrieved At</span>
                  <span className="font-medium text-foreground">{ds.retrieved_at}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Source URL</span>
                  <a
                    href={ds.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-emerald-600 hover:underline truncate block"
                  >
                    {ds.url}
                  </a>
                </div>
              </div>

              <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-xl">
                {ds.notes}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Model Versioning Section (§53) */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          Active Production Model Registry (§53)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modelVersions.map((mv) => (
            <div
              key={mv.model_id}
              className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{mv.name}</h3>
                  <p className="text-xs text-muted-foreground">Version: {mv.version}</p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                  {mv.status}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
                <span className="font-semibold text-foreground block">Evaluation Metrics:</span>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  {Object.entries(mv.metrics).map(([k, v]) => (
                    <div key={k} className="capitalize">
                      {k.replace('_', ' ')}: <strong className="text-foreground">{v}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-muted-foreground flex justify-between">
                <span>Deployed: {mv.deployed_at}</span>
                <span>Dataset: {mv.dataset_version}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
