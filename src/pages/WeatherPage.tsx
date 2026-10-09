import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Clock,
  Compass,
  Sun,
  CloudRain,
  ChevronRight,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  getDistrictWeatherReport,
  DISTRICT_AGRO_PROFILES,
} from '@/services/weather/microclimateEngine';

export const WeatherPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedDistrict, setSelectedDistrict] = useState('Warangal');

  const report = getDistrictWeatherReport(selectedDistrict);
  const spray = report.spray_window;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & District Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <CloudSun className="w-3.5 h-3.5" />
            <span>Microclimate Disease Risk & Spray Advisory Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            {report.district} Agrometeorology
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            {report.state} • <span className="font-semibold text-foreground">{report.agro_climatic_zone}</span>
          </p>
        </div>

        {/* District Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">District:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-4 py-2 rounded-xl bg-background border border-border text-foreground font-bold text-xs shadow-xs focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <optgroup label="Telangana Agro-Climatic Zones">
              <option value="Warangal">Warangal (Cotton & Chilli Belt)</option>
              <option value="Suryapet">Suryapet (Paddy & Pulses)</option>
              <option value="Karimnagar">Karimnagar (Paddy Powerhouse)</option>
              <option value="Khammam">Khammam (Godavari Basin)</option>
            </optgroup>
            <optgroup label="Andhra Pradesh Agro-Climatic Zones">
              <option value="Guntur">Guntur (Chilli Capital & Delta)</option>
              <option value="Kurnool">Kurnool (Rayalaseema Scarce Rain)</option>
              <option value="Anantapur">Anantapur (Arid Groundnut Zone)</option>
              <option value="East Godavari">East Godavari (Coastal Alluvial)</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* Primary Agrometeorological Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temperature */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Air Temperature</span>
            <Thermometer className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-foreground">
            {report.temperature_c}°C
          </div>
          <div className="text-[11px] text-muted-foreground">
            Dew Point: <span className="font-semibold text-foreground">{report.dew_point_c}°C</span>
          </div>
        </div>

        {/* Relative Humidity */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Relative Humidity</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-foreground">
            {report.humidity_percent}%
          </div>
          <div className="text-[11px] font-semibold text-rose-500">
            {report.humidity_percent >= 85 ? 'High Blast Spore Window' : 'Normal Canopy Transpiration'}
          </div>
        </div>

        {/* Rainfall */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>24h Rainfall</span>
            <CloudRain className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-foreground">
            {report.rainfall_mm} <span className="text-xs font-normal text-muted-foreground">mm</span>
          </div>
          <div className="text-[11px] text-muted-foreground">
            Cloud Cover: <span className="font-semibold text-foreground">{report.cloud_cover_percent}%</span>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Wind & Drift Speed</span>
            <Wind className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-3xl font-black text-foreground">
            {report.wind_kmh} <span className="text-xs font-normal text-muted-foreground">km/h</span>
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-teal-600" /> South-Westerly Breeze
          </div>
        </div>
      </div>

      {/* Safe Chemical Spray Window Calculator Box (§23) */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-foreground">
                Safe Chemical & Biopesticide Spray Window (CIB&RC Standard)
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  spray.status === 'optimal'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : spray.status === 'marginal'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}
              >
                {spray.status === 'optimal'
                  ? 'Safe Window Active'
                  : spray.status === 'marginal'
                  ? 'Proceed With Caution'
                  : 'Hazardous — Spray Restricted'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{spray.summary}</p>
          </div>

          <div className="p-3 rounded-2xl bg-muted/60 text-xs border border-border shrink-0">
            <span className="text-muted-foreground block text-[10px] font-bold uppercase">Recommended Timing:</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-300">{spray.best_window_hours}</span>
          </div>
        </div>

        {/* Drift & Washoff Risk Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
            <span className="text-muted-foreground font-medium">Off-Target Drift Risk:</span>
            <span
              className={`font-bold uppercase text-[11px] px-2 py-0.5 rounded-md ${
                spray.wind_drift_risk === 'low'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {spray.wind_drift_risk}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
            <span className="text-muted-foreground font-medium">Rain Wash-off Risk:</span>
            <span
              className={`font-bold uppercase text-[11px] px-2 py-0.5 rounded-md ${
                spray.washoff_risk === 'low'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}
            >
              {spray.washoff_risk}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
            <span className="text-muted-foreground font-medium">Heat Phytotoxicity:</span>
            <span
              className={`font-bold uppercase text-[11px] px-2 py-0.5 rounded-md ${
                spray.phytotoxicity_risk === 'low'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {spray.phytotoxicity_risk}
            </span>
          </div>
        </div>

        {/* Hourly Forecast Timeline */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-foreground">Today's Hourly Spray Feasibility</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {spray.hourly_forecast.map((h, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-2xl border text-center space-y-1 text-xs ${
                  h.recommendation === 'safe'
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/50'
                    : h.recommendation === 'caution'
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/50'
                    : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800/50'
                }`}
              >
                <div className="font-bold text-[11px] text-foreground">{h.hour}</div>
                <div className="text-xs font-semibold">{h.temperature_c}°C</div>
                <div className="text-[10px] text-muted-foreground">{h.wind_kmh} km/h wind</div>
                <span
                  className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                    h.recommendation === 'safe'
                      ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200'
                      : h.recommendation === 'caution'
                      ? 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
                      : 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200'
                  }`}
                >
                  {h.recommendation}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calculated Microclimate Outbreak Alerts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Epidemiological Disease Outbreak Predictions ({report.disease_risk_alerts.length})
          </h2>
          <span className="text-xs text-muted-foreground">ICAR & Agricultural University Validated Models</span>
        </div>

        <div className="space-y-4">
          {report.disease_risk_alerts.map((alert, i) => {
            const isHigh = alert.risk_level === 'high';
            return (
              <div
                key={i}
                className={`p-6 rounded-3xl border bg-card shadow-xs space-y-4 transition-all ${
                  isHigh ? 'border-rose-400/60 bg-rose-950/5' : 'border-amber-400/60 bg-amber-950/5'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                      {alert.crop}
                    </span>
                    <h3 className="text-base font-bold text-foreground">{alert.disease}</h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 self-start sm:self-auto ${
                      isHigh
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {isHigh ? <AlertTriangle className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
                    {alert.risk_level} Outbreak Risk
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-muted/60 text-xs text-muted-foreground border border-border/60">
                  <strong className="text-foreground">Etiological Trigger & Microclimate Vector:</strong>{' '}
                  {alert.risk_factor}
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5 text-emerald-950 dark:text-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-bold">Preventive University Protocol:</strong>{' '}
                      {alert.preventive_advice}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/diagnose')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] shrink-0 self-end sm:self-auto cursor-pointer shadow-xs flex items-center gap-1"
                  >
                    Scan Foliage <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-Day Agrometeorological Projections */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          5-Day Agricultural Weather & Disease Threat Projections
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-semibold">
                <th className="pb-3">Day / Date</th>
                <th className="pb-3">Temp (Max / Min)</th>
                <th className="pb-3">Humidity</th>
                <th className="pb-3">Sky Condition</th>
                <th className="pb-3">Primary Pathogen Threat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {report.five_day_forecast.map((f, i) => (
                <tr key={i} className="py-2.5 hover:bg-muted/30">
                  <td className="py-3 font-bold text-foreground">
                    {f.day_name} <span className="text-[11px] text-muted-foreground font-normal">({f.date})</span>
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-foreground">{f.temp_max_c}°C</span> /{' '}
                    <span className="text-muted-foreground">{f.temp_min_c}°C</span>
                  </td>
                  <td className="py-3 font-semibold text-blue-600 dark:text-blue-400">
                    {f.humidity_percent}%
                  </td>
                  <td className="py-3 text-muted-foreground">{f.condition}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {f.disease_threat}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
