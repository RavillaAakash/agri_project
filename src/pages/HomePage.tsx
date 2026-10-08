import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AgriCanvas3D } from '@/components/visual/AgriCanvas3D';
import { MetalButton } from '@/components/ui/MetalButton';
import { ThinkingOrbWrapper } from '@/components/ui/ThinkingOrbWrapper';
import {
  Stethoscope,
  MessageSquare,
  BookOpen,
  ShieldCheck,
  Award,
  Layers,
  ArrowRight,
  Sparkles,
  CloudSun,
  ShieldAlert,
  Sprout
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();

  const supportedCrops = [
    {
      name: 'Paddy / Rice',
      te: 'వరి',
      hi: 'धान',
      scientific: 'Oryza sativa',
      tag: 'Cereal Grain',
      conditions: ['Blast (మెడ విరుపు)', 'Sheath Blight', 'Brown Planthopper (సుడిదోమ)'],
      color: 'from-emerald-700/20 to-emerald-900/30 border-emerald-600/30',
    },
    {
      name: 'Cotton',
      te: 'ప్రత్తి',
      hi: 'कपास',
      scientific: 'Gossypium hirsutum',
      tag: 'Fiber Crop',
      conditions: ['Pink Bollworm (గులాబీ రంగు పురుగు)', 'Bacterial Blight', 'Leaf Curl Virus'],
      color: 'from-amber-700/20 to-amber-900/30 border-amber-600/30',
    },
    {
      name: 'Chilli',
      te: 'మిర్చి',
      hi: 'मिर्च',
      scientific: 'Capsicum annuum',
      tag: 'Cash & Spice Crop',
      conditions: ['Thrips (తామర పురుగులు)', 'Anthracnose / Die-back', 'Gemini Virus (ఆకు ముడుత)'],
      color: 'from-red-700/20 to-red-900/30 border-red-600/30',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Multi-Angle Image Capture',
      desc: 'Capture a crisp close-up of the affected leaf/lesion plus an overall whole-plant view in natural sunlight.',
      icon: Stethoscope,
    },
    {
      step: '02',
      title: 'Multimodal AI Vision & Crop Stage',
      desc: 'Our computer vision pipeline cross-references crop stage, leaf symptom distribution, and visual damage patterns.',
      icon: Sparkles,
    },
    {
      step: '03',
      title: 'Authoritative RAG Grounding',
      desc: 'AI predictions are strictly cross-verified against ICAR and state agricultural university registries. Zero hallucinated chemicals.',
      icon: Award,
    },
    {
      step: '04',
      title: 'IPM Action Plan & Local Advisory',
      desc: 'Receive immediate cultural and mechanical steps first, followed by biological controls and verified safety guidelines.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Hero Section with Original 3D Farmland Simulation */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-border">
        <AgriCanvas3D />

        {/* Hero Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 backdrop-blur-md text-emerald-300 text-xs font-medium shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ICAR & State University Aligned Knowledge Base</span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08]">
              {t('hero.title_primary')}{' '}
              <span className="bg-gradient-to-r from-emerald-500 via-green-400 to-amber-400 bg-clip-text text-transparent">
                {t('hero.title_highlight')}
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Interactive Thinking Orb Preview */}
          <div className="flex items-center justify-center py-2">
            <ThinkingOrbWrapper
              state="breathing"
              size={64}
              label="AgriAI Diagnostics Engine Active"
            />
          </div>

          {/* Action Buttons with MetalFx */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/diagnose">
              <MetalButton variant="primary" className="text-sm px-7 py-3.5">
                <Stethoscope className="w-4 h-4 mr-1 text-emerald-200" />
                {t('hero.cta_scan')}
              </MetalButton>
            </Link>

            <Link to="/chat">
              <MetalButton variant="accent" className="text-sm px-7 py-3.5">
                <MessageSquare className="w-4 h-4 mr-1 text-amber-950" />
                {t('hero.cta_chat')}
              </MetalButton>
            </Link>

            <Link
              to="/library"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm border border-emerald-800/30 bg-background/80 hover:bg-muted/80 backdrop-blur-md transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              {t('hero.cta_library')}
            </Link>
          </div>

          {/* Safety Micro-notice */}
          <p className="text-[11px] text-muted-foreground/80 max-w-lg mx-auto flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>AI-assisted identification with confidence scoring. Follow official labels.</span>
          </p>
        </div>
      </section>

      {/* Primary MVP Crops Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Target Focus Crops (Telangana & Andhra Pradesh)
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Deep agronomic profiles covering regional fungal, bacterial, viral conditions, mites, and severe pest complexes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supportedCrops.map((crop) => (
            <div
              key={crop.name}
              className={`p-6 rounded-2xl border bg-gradient-to-b ${crop.color} backdrop-blur-xs flex flex-col justify-between space-y-4 hover:scale-[1.01] transition-transform`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-background/60 text-muted-foreground border border-border">
                    {crop.tag}
                  </span>
                  <Sprout className="w-5 h-5 text-emerald-500" />
                </div>

                <div className="mt-4">
                  <h3 className="text-xl font-bold text-foreground">{crop.name}</h3>
                  <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {crop.te} • {crop.hi} • <span className="italic">{crop.scientific}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Common Regional Threats:
                  </span>
                  <ul className="space-y-1 text-xs text-foreground/90">
                    {crop.conditions.map((cond, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {cond}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                to={`/library?crop=${encodeURIComponent(crop.name)}`}
                className="mt-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 hover:underline pt-2 border-t border-border/50"
              >
                Explore crop condition protocols <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              How AgriAI Doctor Diagnoses Your Crops
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Built on scientific multi-angle evidence and strictly verified agricultural knowledge bases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {workflowSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-3 relative overflow-hidden"
                >
                  <div className="text-4xl font-black text-muted/60 absolute -right-2 -bottom-2 select-none">
                    {step.step}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-700/10 dark:bg-emerald-500/15 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-foreground">{step.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Weather & Field Intelligence Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-emerald-900/90 to-emerald-950 text-white border border-emerald-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold">
              <CloudSun className="w-3.5 h-3.5" />
              <span>Weather-Aware Crop Risk Engine</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold">
              Predict Disease Outbreaks Before They Spread
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Fungal spores and insect reproduction surge under specific relative humidity and temperature windows. AgriAI correlates your local microclimate to calculate proactive preventive advisories.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link to="/weather">
              <button
                type="button"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-colors"
              >
                Check Regional Weather Risk
              </button>
            </Link>
            <Link to="/dashboard">
              <button
                type="button"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
              >
                Open Farmer Dashboard
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
