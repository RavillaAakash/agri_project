import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Award, FileCheck2, Scale } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-emerald-900/10 dark:border-emerald-800/20 bg-muted/30 py-10 text-xs text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Safety Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-amber-900 dark:text-amber-200">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-xs tracking-wide uppercase">
              Important Farmer Safety & Decision Support Notice
            </span>
            <p className="text-xs leading-relaxed opacity-90">
              {t('app.disclaimer')}
              Never apply unverified chemical mixtures. Always check the official registered product label, active ingredient suitability, and current pesticide regulations mandated by your state agriculture university (PJTSAU / ANGRAU) or ICAR extension officer.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
          <div className="space-y-2">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Scientific Data Provenance</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Curated from verified agricultural authorities including ICAR, PJTSAU (Telangana), ANGRAU (Andhra Pradesh), and peer-reviewed phytopathology literature.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>Safety & IPM First</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Integrated Pest Management prioritizes biological, mechanical, and cultural control before chemical intervention.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Regional Focus</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Primary production MVP coverage: Paddy (వరి / धान), Cotton (ప్రత్తి / कपास), and Chilli (మిర్చి / मिर्च) with regional Telugu, Hindi, and English support.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-foreground">NS Agri AI Doctor System</div>
            <p className="text-muted-foreground">
              v1.0.0-production-preview • Built for sustainable, evidence-based agricultural decision support.
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-4 text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} NS Agri AI Doctor. All agricultural guidance strictly adheres to national agricultural protection frameworks.
        </div>
      </div>
    </footer>
  );
};
