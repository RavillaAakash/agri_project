import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Search, ShieldCheck, Filter, ChevronRight, ExternalLink } from 'lucide-react';
import type { AgriculturalCondition } from '@/types/agricultural';

export const LibraryPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');

  const conditions: AgriculturalCondition[] = [
    {
      id: 'c-01',
      crop_id: 'paddy',
      problem_type: 'disease',
      category: 'fungal',
      common_name: 'Rice Blast (అగ్గితెగులు / మెడవిరుపు / ब्लास्ट)',
      scientific_name: 'Magnaporthe oryzae',
      local_names: {
        en: 'Rice Blast',
        te: 'వరి అగ్గితెగులు',
        hi: 'धान का झुलसा रोग',
      },
      symptoms: {
        en: ['Spindle-shaped lesions with ash centers', 'Neck rot causing chaffy grains'],
        te: ['నూలు కండె ఆకారపు మచ్చలు బూడిద రంగు కేంద్రంతో', 'మెడ విరుపు వల్ల గింజలు తప్పలుగా మారడం'],
        hi: ['तर्कुआकार धब्बे राख के रंग के केंद्र के साथ', 'गर्दन टूटना जिससे दाने नहीं बनते'],
      },
      affected_plant_parts: ['leaf', 'stem'],
      favorable_conditions: {
        temperature_range: '20-26°C',
        humidity_range: '>90%',
      },
      severity: 'high',
      prevention_methods: ['Treat seed with Trichoderma viride', 'Balanced NPK without excess nitrogen'],
      cultural_control: ['Maintain optimal plant spacing', 'Ensure clean bunds and weed removal'],
      mechanical_control: ['Drain fields temporarily to halt sporulation'],
      biological_control: ['Pseudomonas fluorescens foliar spray @ 2.5 kg/ha'],
      ipm_recommendations: ['Monitor weekly using light traps and leaf scouting'],
      chemical_management: {
        is_applicable: true,
        active_ingredient: 'Tricyclazole 75% WP @ 0.6 g/L',
        safety_disclaimer: 'Follow waiting period of 30 days. Strictly observe official product label.',
        regional_approval: 'Approved by PJTSAU / ANGRAU',
        source: 'ICAR-NRRI Cuttack Guidelines',
      },
      provenance: {
        source_name: 'ICAR - National Rice Research Institute',
        source_url: 'https://icar-nrri.gov.in',
        source_type: 'icar',
        license: 'Government Public Advisory',
        retrieval_date: '2026-10-08',
        region: ['Telangana', 'Andhra Pradesh'],
        language: 'en, te, hi',
        verification_status: 'verified',
        last_verified: '2026-10-01',
      },
    },
    {
      id: 'c-02',
      crop_id: 'cotton',
      problem_type: 'pest',
      category: 'insect',
      common_name: 'Pink Bollworm (గులాబీ రంగు పురుగు / गुलाबी सुंडी)',
      scientific_name: 'Pectinophora gossypiella',
      local_names: {
        en: 'Pink Bollworm',
        te: 'గులాబీ రంగు బొల్వార్మ్',
        hi: 'गुलाबी सुंडी',
      },
      symptoms: {
        en: ['Rosetted flowers with petals twisted together', 'Exit holes in developing bolls with stained lint'],
        te: ['రోసెట్ పువ్వులు (ముడిపడిన రేకులు)', 'కాయల్లో రంధ్రాలు మరియు రంగు మారిన దూది'],
        hi: ['गुलाब जैसे मुड़े हुए फूल', 'टिंडों में छेद और खराब हुई रुई'],
      },
      affected_plant_parts: ['flower', 'fruit'],
      favorable_conditions: {
        temperature_range: '24-32°C',
      },
      severity: 'critical',
      prevention_methods: ['Install pheromone traps @ 5 per acre for monitoring', 'Refuge crop planting'],
      cultural_control: ['Destroy crop residues post-harvest to break diapause'],
      mechanical_control: ['Hand-pick and destroy rosetted flowers'],
      biological_control: ['Release Trichogramma bactrae egg parasitoid @ 60,000/acre'],
      ipm_recommendations: ['Economic Threshold Level: 8 moths/trap/night for 3 consecutive days or 10% damaged bolls'],
      chemical_management: {
        is_applicable: true,
        active_ingredient: 'Emamectin Benzoate 5% SG @ 0.4 g/L (At ETL cross only)',
        safety_disclaimer: 'Rotate chemical groups to prevent insect resistance development.',
        regional_approval: 'Approved by Central Insecticide Board (CIB&RC)',
        source: 'ICAR - Central Institute for Cotton Research (CICR)',
      },
      provenance: {
        source_name: 'ICAR - Central Institute for Cotton Research',
        source_url: 'https://cicr.icar.gov.in',
        source_type: 'icar',
        license: 'Government Public Advisory',
        retrieval_date: '2026-10-08',
        region: ['Telangana', 'Andhra Pradesh', 'Maharashtra'],
        language: 'en, te, hi',
        verification_status: 'verified',
        last_verified: '2026-10-01',
      },
    },
    {
      id: 'c-03',
      crop_id: 'chilli',
      problem_type: 'pest',
      category: 'mite',
      common_name: 'Chilli Murda / Thrips & Mite Complex (ఆకు ముడుత / चुरड़ा-मुरड़ा)',
      scientific_name: 'Scirtothrips dorsalis & Polyphagotarsonemus latus',
      local_names: {
        en: 'Chilli Leaf Curl Complex',
        te: 'మిర్చి బొబ్బర / ఆకు ముడుత',
        hi: 'मिर्च का पर्ण कुंचन',
      },
      symptoms: {
        en: ['Upward boat-shaped leaf curl (thrips)', 'Downward inverted cup curl with brittle leaves (mites)'],
        te: ['ఆకులు పైకి దోనె ఆకారంలో ముడతలు (తామర పురుగులు)', 'ఆకులు క్రిందికి గిలక ఆకారంలో ముడతలు (నల్లి)'],
        hi: ['पत्तियां नाव के आकार में ऊपर मुड़ना (थ्रिप्स)', 'पत्तियां नीचे की ओर मुड़ना (माइट्स)'],
      },
      affected_plant_parts: ['leaf', 'flower'],
      favorable_conditions: {
        weather_triggers: ['Hot dry weather followed by humid intervals'],
      },
      severity: 'high',
      prevention_methods: ['Grow border barrier crops of Sorghum or Maize (4 rows)', 'Use blue/yellow sticky traps'],
      cultural_control: ['Avoid excessive urea application which softens foliage for sucking pests'],
      mechanical_control: ['Set up 20 yellow + 20 blue sticky traps per acre'],
      biological_control: ['Foliar spray with Verticillium lecanii @ 5 g/L'],
      ipm_recommendations: ['Initiate sprays with botanicals (NSKE 5%) before chemical thresholds are reached'],
      provenance: {
        source_name: 'Prof. Jayashankar Telangana State Agricultural University (PJTSAU)',
        source_url: 'https://pjtsau.edu.in',
        source_type: 'university',
        license: 'Academic Extension Circular',
        retrieval_date: '2026-10-08',
        region: ['Telangana', 'Andhra Pradesh'],
        language: 'en, te',
        verification_status: 'verified',
        last_verified: '2026-10-01',
      },
    },
  ];

  const filtered = conditions.filter((c) => {
    const matchesCrop = selectedCrop === 'all' || c.crop_id === selectedCrop;
    const matchesSearch =
      c.common_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.scientific_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCrop && matchesSearch;
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
            <option value="paddy">Paddy / Rice (వరి)</option>
            <option value="cotton">Cotton (ప్రత్తి)</option>
            <option value="chilli">Chilli (మిర్చి)</option>
          </select>
        </div>
      </div>

      {/* Encyclopedia Records Grid */}
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
    </div>
  );
};
