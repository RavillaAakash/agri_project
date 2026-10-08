import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Search, ShieldCheck, Filter, ExternalLink, Loader2 } from 'lucide-react';
import { getConditions, getCrops } from '@/services/supabase/repository';
import type { AgriculturalCondition, Crop } from '@/types/agricultural';

export const LibraryPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [conditions, setConditions] = useState<AgriculturalCondition[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [cropsData, conditionsData] = await Promise.all([
        getCrops(),
        getConditions(selectedCrop),
      ]);
      setCrops(cropsData);
      setConditions(conditionsData);
      setLoading(false);
    }
    loadData();
  }, [selectedCrop]);

  const filtered = conditions.filter((c) => {
    const matchesSearch =
      c.common_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.scientific_name.toLowerCase().includes(searchTerm.toLowerCase());
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
            placeholder="Search condition, pest, scientific name or symptom..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
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
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-xs">Accessing verified agronomy repository...</span>
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
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-semibold text-foreground">Key Field Symptoms:</span>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {item.symptoms.en.map((s, idx) => (
                      <li key={idx}>• {s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
                  <span className="font-semibold text-foreground block">IPM Guidance:</span>
                  <p className="text-muted-foreground">{item.ipm_recommendations[0]}</p>
                </div>
              </div>

              {/* Provenance Footer */}
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Source: {item.provenance.source_name}</span>
                <a
                  href={item.provenance.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 hover:underline flex items-center gap-1"
                >
                  Inspect <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
