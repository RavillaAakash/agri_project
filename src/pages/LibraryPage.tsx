import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Search,
  ShieldCheck,
  Filter,
  ExternalLink,
  Loader2,
  X,
  AlertTriangle,
  Award,
  ChevronRight,
  ShieldAlert,
  Sprout,
  Bug,
  Activity
} from 'lucide-react';
import { getConditions, getCrops } from '@/services/supabase/repository';
import type { AgriculturalCondition, Crop } from '@/types/agricultural';

export const LibraryPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [conditions, setConditions] = useState<AgriculturalCondition[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModalItem, setActiveModalItem] = useState<AgriculturalCondition | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [cropsData, conditionsData] = await Promise.all([
        getCrops(),
        getConditions(selectedCrop, selectedType),
      ]);
      setCrops(cropsData);
      setConditions(conditionsData);
      setLoading(false);
    }
    loadData();
  }, [selectedCrop, selectedType]);

  const filtered = conditions.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      c.common_name.toLowerCase().includes(term) ||
      c.scientific_name.toLowerCase().includes(term) ||
      (c.local_names.te && c.local_names.te.includes(term)) ||
      (c.local_names.hi && c.local_names.hi.includes(term));
    return matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Authoritative Agricultural Knowledge Base</span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground">
          {t('nav.library')}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
          Scientific crop protection records with provenance tracking from ICAR, PJTSAU, and ANGRAU research institutes.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search disease, pest, scientific or vernacular name (e.g. అగ్గితెగులు)..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-border bg-background"
            >
              <option value="all">All Crops</option>
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.common_name} ({c.local_names.te})
                </option>
              ))}
            </select>
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-border bg-background"
          >
            <option value="all">All Categories</option>
            <option value="disease">Fungal & Bacterial Diseases</option>
            <option value="pest">Insect Pests & Sucking Insects</option>
            <option value="mite">Mites & Complexes</option>
            <option value="nutrient_deficiency">Nutrient Deficiencies</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-xs">Accessing verified agronomy repository...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-card border border-border text-muted-foreground text-xs space-y-2">
          <p>No agricultural records matched your search filters.</p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedCrop('all');
              setSelectedType('all');
            }}
            className="px-3 py-1.5 rounded-lg bg-muted text-foreground font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Encyclopedia Records Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4 hover:border-emerald-600/40 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                    {item.crop_id.toUpperCase()} • {item.problem_type.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {item.provenance.verification_status}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground">{item.common_name}</h3>
                  <p className="text-xs italic text-muted-foreground">{item.scientific_name}</p>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {item.local_names.te} • {item.local_names.hi}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-semibold text-foreground">Key Field Symptoms:</span>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {item.symptoms.en.slice(0, 2).map((s, idx) => (
                      <li key={idx}>• {s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
                  <span className="font-semibold text-foreground block">IPM Guidance:</span>
                  <p className="text-muted-foreground">{item.ipm_recommendations[0]}</p>
                </div>
              </div>

              {/* Action & Provenance Footer */}
              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(item)}
                  className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                >
                  View Scientific Protocol <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={item.provenance.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground text-[11px] flex items-center gap-1"
                >
                  Source <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Complete Scientific Protocol Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-start justify-between bg-muted/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {activeModalItem.crop_id.toUpperCase()} • {activeModalItem.category?.toUpperCase() || activeModalItem.problem_type.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {activeModalItem.provenance.verification_status}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  {activeModalItem.common_name}
                </h2>
                <div className="text-xs italic text-muted-foreground">
                  {activeModalItem.scientific_name}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs leading-relaxed">
              {/* Vernacular Names */}
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1">
                <span className="font-bold text-foreground block uppercase text-[10px] tracking-wider">
                  Regional Vernacular Terminology (§9)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Telugu (తెలుగు)</span>
                    <strong className="text-foreground">{activeModalItem.local_names.te}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Hindi (हिन्दी)</span>
                    <strong className="text-foreground">{activeModalItem.local_names.hi}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">English</span>
                    <strong className="text-foreground">{activeModalItem.local_names.en}</strong>
                  </div>
                </div>
              </div>

              {/* Observed Symptoms */}
              <div className="space-y-2">
                <h4 className="font-bold text-foreground uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Observed Diagnostic Symptoms
                </h4>
                <ul className="space-y-1.5 text-muted-foreground bg-background p-4 rounded-xl border border-border">
                  {activeModalItem.symptoms.en.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Microclimate Triggers */}
              <div className="space-y-2">
                <h4 className="font-bold text-foreground uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  Favorable Microclimate Conditions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-background border border-border">
                  {activeModalItem.favorable_conditions.temperature_range && (
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Temperature Window</span>
                      <strong className="text-foreground">{activeModalItem.favorable_conditions.temperature_range}</strong>
                    </div>
                  )}
                  {activeModalItem.favorable_conditions.humidity_range && (
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Relative Humidity</span>
                      <strong className="text-foreground">{activeModalItem.favorable_conditions.humidity_range}</strong>
                    </div>
                  )}
                  {activeModalItem.favorable_conditions.weather_triggers && (
                    <div className="sm:col-span-2">
                      <span className="text-muted-foreground block text-[10px]">Weather Outbreak Triggers</span>
                      <span className="text-foreground">{activeModalItem.favorable_conditions.weather_triggers.join('; ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cultural & Mechanical IPM */}
              <div className="space-y-2">
                <h4 className="font-bold text-foreground uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Cultural, Mechanical & Biological Controls (§23)
                </h4>
                <div className="space-y-2">
                  <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs">Cultural Practices:</span>
                    <ul className="text-muted-foreground space-y-0.5">
                      {activeModalItem.cultural_control.map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>

                  {activeModalItem.mechanical_control.length > 0 && (
                    <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs">Mechanical & Trapping Controls:</span>
                      <ul className="text-muted-foreground space-y-0.5">
                        {activeModalItem.mechanical_control.map((m, i) => (
                          <li key={i}>• {m}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeModalItem.biological_control.length > 0 && (
                    <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs">Biological Controls:</span>
                      <ul className="text-muted-foreground space-y-0.5">
                        {activeModalItem.biological_control.map((b, i) => (
                          <li key={i}>• {b}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Statutory Chemical Advisory */}
              {activeModalItem.chemical_management?.is_applicable && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Statutory Chemical Advisory (§22)</span>
                  </div>
                  <div className="text-foreground">
                    <strong>Active Ingredient:</strong> {activeModalItem.chemical_management.active_ingredient}
                  </div>
                  <p className="text-muted-foreground">
                    {activeModalItem.chemical_management.official_recommendation}
                  </p>
                  <div className="pt-2 border-t border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-200 font-semibold">
                    {activeModalItem.chemical_management.safety_disclaimer}
                  </div>
                </div>
              )}

              {/* Provenance Details */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border text-[11px] space-y-1">
                <span className="font-bold text-foreground uppercase tracking-wider block">
                  Scientific Provenance & Verification (§4, §5)
                </span>
                <p className="text-muted-foreground">
                  Institution: {activeModalItem.provenance.source_name} • License: {activeModalItem.provenance.license}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-emerald-600 font-medium">Verified for: {activeModalItem.provenance.region.join(', ')}</span>
                  <a
                    href={activeModalItem.provenance.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                  >
                    View Source Document <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border flex justify-end bg-muted/20">
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="px-5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold"
              >
                Close Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
