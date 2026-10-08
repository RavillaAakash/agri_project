import React from 'react';
import { useTranslation } from 'react-i18next';
import { CloudSun, Wind, Droplets, Thermometer, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { WeatherCondition } from '@/types/agricultural';

export const WeatherPage: React.FC = () => {
  const { t } = useTranslation();

  const weatherData: WeatherCondition = {
    temperature_c: 28.4,
    humidity_percent: 86,
    rainfall_mm: 12.2,
    wind_kmh: 14,
    forecast_summary: 'Cloudy with sporadic evening showers and elevated nocturnal humidity.',
    disease_risk_alerts: [
      {
        crop: 'Paddy / Rice',
        disease: 'Rice Blast & Sheath Blight',
        risk_level: 'high',
        risk_factor: 'Relative humidity (>85%) combined with night temps between 21-24°C heavily accelerates fungal spore germination.',
        preventive_advice: 'Avoid excessive nitrogen urea top-dressing this week. Ensure surface runoff drainage.',
      },
      {
        crop: 'Cotton',
        disease: 'Bacterial Blight',
        risk_level: 'moderate',
        risk_factor: 'Intermittent rain splashes can disseminate Xanthomonas bacterial cells across adjacent rows.',
        preventive_advice: 'Avoid field operations while leaves are wet to prevent mechanical spreading.',
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
          <CloudSun className="w-3.5 h-3.5" />
          <span>Microclimate Disease Risk Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground">
          {t('nav.weather')}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
          Real-time weather parameters correlated against verified epidemiological models (ICAR & State Agrometeorological Advisories).
        </p>
      </div>

      {/* Weather Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Temperature</span>
            <Thermometer className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-foreground">
            {weatherData.temperature_c}°C
          </div>
          <p className="text-[11px] text-muted-foreground">Optimal for crop growth</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Relative Humidity</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-foreground">
            {weatherData.humidity_percent}%
          </div>
          <p className="text-[11px] text-rose-500 font-semibold">Critical blast spore threshold</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Rainfall</span>
            <CloudSun className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-foreground">
            {weatherData.rainfall_mm} mm
          </div>
          <p className="text-[11px] text-muted-foreground">Past 24 hours total</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Wind Speed</span>
            <Wind className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-foreground">
            {weatherData.wind_kmh} km/h
          </div>
          <p className="text-[11px] text-muted-foreground">Westerly breeze</p>
        </div>
      </div>

      {/* Disease Risk Predictions */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-foreground">
          Calculated Microclimate Outbreak Risks
        </h2>

        <div className="space-y-4">
          {weatherData.disease_risk_alerts.map((alert, i) => {
            const isHigh = alert.risk_level === 'high';
            return (
              <div
                key={i}
                className={`p-6 rounded-2xl border bg-card shadow-xs space-y-3 ${
                  isHigh ? 'border-rose-400/50 bg-rose-950/5' : 'border-amber-400/50 bg-amber-950/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">
                      {alert.crop}:
                    </span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      {alert.disease}
                    </span>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isHigh
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {alert.risk_level} Risk
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Etiological Trigger:</strong> {alert.risk_factor}
                </p>

                <div className="p-3 rounded-xl bg-background border border-border text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{alert.preventive_advice}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
