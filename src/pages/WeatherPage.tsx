import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CloudSun,
  MapPin,
  Compass,
  X,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { LiveLocationWeatherCard, type LiveLocationCoords } from '@/components/weather/LiveLocationWeatherCard';
import { LiveFarmMap, type FarmLocation } from '@/components/maps/LiveFarmMap';
import type { DistrictWeatherReport } from '@/types/agricultural';

export const WeatherPage: React.FC = () => {
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<LiveLocationCoords | null>(null);
  const [activeReport, setActiveReport] = useState<DistrictWeatherReport | null>(null);

  const handleWeatherLoaded = (report: DistrictWeatherReport, coords: LiveLocationCoords) => {
    setActiveReport(report);
    setCurrentCoords(coords);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/30 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <CloudSun className="w-3.5 h-3.5 text-emerald-400" />
            <span>Real-Time Satellite GPS Weather &amp; Pathogen Forewarning</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Live Farm Weather &amp; Outbreak Forecast
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Turn on location to detect your exact field coordinates. We forecast live microclimate triggers (relative humidity spikes, dew point, and wind drift) to predict fungal blast and insect pest outbreaks before they damage your harvest.
          </p>
        </div>

        {/* Quick Link to Diagnosis */}
        <button
          type="button"
          onClick={() => navigate('/diagnose')}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-2 cursor-pointer shrink-0 z-10 active:scale-95"
        >
          <Stethoscope className="w-4 h-4 text-slate-950" />
          <span>Scan Crop in this Weather</span>
        </button>
      </div>

      {/* Interactive Map Modal/Panel */}
      {showMap && (
        <div className="p-5 sm:p-6 rounded-3xl bg-card border border-emerald-500/30 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                Live Farm Satellite Radar &amp; Field Coordinates
              </h2>
              <p className="text-xs text-muted-foreground">
                Move the pin to select a specific plot or view nearby Krishi Vigyan Kendra (KVK) centers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowMap(false)}
              className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <LiveFarmMap
            initialLocation={
              currentCoords
                ? {
                    latitude: currentCoords.latitude,
                    longitude: currentCoords.longitude,
                    district: currentCoords.district,
                    state: currentCoords.state,
                    placeName: currentCoords.placeName,
                  }
                : undefined
            }
            onLocationSelect={(loc: FarmLocation) => {
              setCurrentCoords({
                latitude: loc.latitude,
                longitude: loc.longitude,
                accuracyMeters: loc.accuracyMeters,
                placeName: loc.placeName,
                district: loc.district,
                state: loc.state,
              });
            }}
          />
        </div>
      )}

      {/* Main Live Location Weather Engine Component */}
      <LiveLocationWeatherCard
        onWeatherLoaded={handleWeatherLoaded}
        showMapToggle={true}
        onToggleMap={() => setShowMap(!showMap)}
      />

      {/* Agro-Meteorological Principles & ICAR Guidance */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-600" />
          Why Live Location &amp; Microclimate Determine Disease Severity
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground leading-relaxed">
          <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1.5">
            <span className="font-bold text-foreground block">
              1. High Relative Humidity (&gt;80%)
            </span>
            <p>
              When evening relative humidity remains high with cool overnight temperatures (20-26°C), fungal spores of Rice Blast (<em>Magnaporthe oryzae</em>) and Chilli Anthracnose germinate and penetrate foliar stomata within 6-8 hours.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1.5">
            <span className="font-bold text-foreground block">
              2. Warm Dry Spells (&gt;31°C)
            </span>
            <p>
              Hot temperatures accelerate the reproductive multiplication of sucking pests like Chilli Thrips (<em>Scirtothrips dorsalis</em>) and Cotton Whitefly, causing sudden severe upward/downward leaf curling.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1.5">
            <span className="font-bold text-foreground block">
              3. Wind Velocity &amp; Drift Hazard
            </span>
            <p>
              Winds above 14 km/h cause chemical spray droplets to drift off-target, contaminating water sources and wasting inputs. Spraying should occur during early morning (6:30 AM – 9:30 AM) when thermal inversion is calm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
