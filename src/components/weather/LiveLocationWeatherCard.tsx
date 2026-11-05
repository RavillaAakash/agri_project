import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  MapPin,
  Crosshair,
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Navigation,
  Compass,
  Calendar,
  CloudRain,
  ChevronRight,
  Sun,
} from 'lucide-react';
import {
  fetchLiveMicroclimate,
  getDistrictWeatherReport,
} from '@/services/weather/microclimateEngine';
import type { DistrictWeatherReport } from '@/types/agricultural';

export interface LiveLocationCoords {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  placeName?: string;
  district?: string;
  state?: string;
}

interface LiveLocationWeatherCardProps {
  onWeatherLoaded?: (report: DistrictWeatherReport, coords: LiveLocationCoords) => void;
  showMapToggle?: boolean;
  onToggleMap?: () => void;
  compact?: boolean;
}

export const LiveLocationWeatherCard: React.FC<LiveLocationWeatherCardProps> = ({
  onWeatherLoaded,
  showMapToggle = true,
  onToggleMap,
  compact = false,
}) => {
  const [coords, setCoords] = useState<LiveLocationCoords | null>(null);
  const [weatherReport, setWeatherReport] = useState<DistrictWeatherReport | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    'prompt' | 'requesting' | 'granted' | 'denied' | 'fallback'
  >('prompt');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [selectedFallbackDistrict, setSelectedFallbackDistrict] = useState('Warangal');
  const watchIdRef = useRef<number | null>(null);

  // Reverse Geocoding via Nominatim
  const reverseGeocode = async (lat: number, lng: number): Promise<{ placeName: string; district: string; state: string }> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data = await res.json();
        const address = data.address || {};
        const district = address.county || address.state_district || address.district || address.city || 'Regional Zone';
        const state = address.state || 'Telangana';
        const village = address.village || address.suburb || address.town || address.hamlet || '';
        const placeName = village ? `${village}, ${district}` : `${district}, ${state}`;
        return { placeName, district, state };
      }
    } catch {
      // Fallback
    }
    return {
      placeName: `Field at ${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`,
      district: 'Regional Zone',
      state: 'Telangana',
    };
  };

  // Fetch weather and update state
  const loadWeather = useCallback(
    async (lat: number, lng: number, accuracy?: number) => {
      try {
        const { placeName, district, state } = await reverseGeocode(lat, lng);
        const report = await fetchLiveMicroclimate(lat, lng, district, state);

        const currentCoords: LiveLocationCoords = {
          latitude: lat,
          longitude: lng,
          accuracyMeters: accuracy,
          placeName,
          district,
          state,
        };

        setCoords(currentCoords);
        setWeatherReport(report);
        setLocationStatus('granted');
        setErrorMessage(null);

        if (onWeatherLoaded) {
          onWeatherLoaded(report, currentCoords);
        }
      } catch (err) {
        console.warn('Live weather error, using fallback:', err);
        const fallback = getDistrictWeatherReport(selectedFallbackDistrict);
        setWeatherReport(fallback);
      }
    },
    [onWeatherLoaded, selectedFallbackDistrict]
  );

  // User explicitly clicks "Turn On Location"
  const requestLiveLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      setErrorMessage('Geolocation is not supported by your browser.');
      const fallback = getDistrictWeatherReport(selectedFallbackDistrict);
      setWeatherReport(fallback);
      return;
    }

    setLocationStatus('requesting');
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        await loadWeather(latitude, longitude, accuracy);
      },
      (error) => {
        setLocationStatus('denied');
        if (error.code === 1) {
          setErrorMessage(
            'Location permission was denied. Please allow location access in your browser or enable device GPS.'
          );
        } else if (error.code === 2) {
          setErrorMessage('Position unavailable. Please ensure your device GPS/location is turned on.');
        } else {
          setErrorMessage('Location request timed out. Please try again or select district.');
        }
        // Load fallback report so user is never stuck
        const fallback = getDistrictWeatherReport(selectedFallbackDistrict);
        setWeatherReport(fallback);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 10000,
      }
    );
  }, [loadWeather, selectedFallbackDistrict]);

  // Toggle Live Tracking as farmer moves across field
  const toggleLiveTracking = () => {
    if (isLiveTracking) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsLiveTracking(false);
    } else {
      if (!navigator.geolocation) return;
      setIsLiveTracking(true);
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          loadWeather(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
        },
        () => setIsLiveTracking(false),
        { enableHighAccuracy: true, maximumAge: 5000 }
      );
    }
  };

  // Check initial permission status on load
  useEffect(() => {
    if ('permissions' in navigator && navigator.permissions?.query) {
      navigator.permissions
        .query({ name: 'geolocation' as PermissionName })
        .then((status) => {
          if (status.state === 'granted') {
            requestLiveLocation();
          } else if (status.state === 'denied') {
            setLocationStatus('denied');
            setWeatherReport(getDistrictWeatherReport(selectedFallbackDistrict));
          } else {
            // 'prompt' - wait for user to click or auto-load default
            setWeatherReport(getDistrictWeatherReport(selectedFallbackDistrict));
          }
        })
        .catch(() => {
          setWeatherReport(getDistrictWeatherReport(selectedFallbackDistrict));
        });
    } else {
      setWeatherReport(getDistrictWeatherReport(selectedFallbackDistrict));
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const handleFallbackDistrictChange = (dist: string) => {
    setSelectedFallbackDistrict(dist);
    const report = getDistrictWeatherReport(dist);
    setWeatherReport(report);
    if (onWeatherLoaded) {
      onWeatherLoaded(report, {
        latitude: 17.9784,
        longitude: 79.5941,
        placeName: `${dist}, ${report.state}`,
        district: dist,
        state: report.state,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Prominent "Turn On Location" Banner if not yet granted */}
      {locationStatus !== 'granted' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border-2 border-emerald-500/50 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
          <div className="space-y-1.5 max-w-xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>📍 Live Field GPS &amp; Weather Engine</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Turn On Location to Predict Real-Time Weather &amp; Crop Disease Risks
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Enable your device GPS to get instant hyper-local satellite weather (Temperature, Humidity, Rain &amp; Wind) directly for your field to forecast fungal spore incubation and safe spray windows.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 z-10 w-full sm:w-auto">
            <button
              type="button"
              disabled={locationStatus === 'requesting'}
              onClick={requestLiveLocation}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-900/40 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {locationStatus === 'requesting' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-900" />
                  <span>Acquiring GPS Satellite Lock...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 text-slate-950" />
                  <span>Turn On Location (Allow GPS)</span>
                </>
              )}
            </button>

            {/* Fallback District Selector */}
            <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-2 rounded-xl border border-white/10 text-xs">
              <span className="text-muted-foreground whitespace-nowrap">Or District:</span>
              <select
                value={selectedFallbackDistrict}
                onChange={(e) => handleFallbackDistrictChange(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="Warangal" className="bg-slate-900">Warangal (వరంగల్)</option>
                <option value="Khammam" className="bg-slate-900">Khammam (ఖమ్మం)</option>
                <option value="Karimnagar" className="bg-slate-900">Karimnagar (కరీంనగర్)</option>
                <option value="Suryapet" className="bg-slate-900">Suryapet (సూర్యాపేట)</option>
                <option value="Guntur" className="bg-slate-900">Guntur (గుంటూరు)</option>
                <option value="Kurnool" className="bg-slate-900">Kurnool (కర్నూలు)</option>
                <option value="Anantapur" className="bg-slate-900">Anantapur (అనంతపురం)</option>
                <option value="East Godavari" className="bg-slate-900">East Godavari (తూర్పు గోదావరి)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Geolocation Denied / Error Warning */}
      {locationStatus === 'denied' && errorMessage && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{errorMessage} Using regional agro profile for <strong>{selectedFallbackDistrict}</strong>.</span>
          </div>
          <button
            type="button"
            onClick={requestLiveLocation}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer"
          >
            Retry Location
          </button>
        </div>
      )}

      {/* 2. Live Weather & Outbreak Prediction Card */}
      {weatherReport && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-emerald-500/30 shadow-xl space-y-6">
          {/* Top Bar: Location Name & GPS Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${locationStatus === 'granted' ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {locationStatus === 'granted' ? 'Exact Live Field GPS Active' : 'Regional Agro Forecast'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground">
                {coords?.placeName || `${weatherReport.district}, ${weatherReport.state}`}
              </h2>
              {coords && (
                <div className="text-xs text-muted-foreground font-mono">
                  Coordinates: {coords.latitude.toFixed(4)}° N, {coords.longitude.toFixed(4)}° E
                  {coords.accuracyMeters && ` • Accuracy: ±${Math.round(coords.accuracyMeters)}m`}
                </div>
              )}
            </div>

            {/* Actions: Refresh & Map Toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={requestLiveLocation}
                disabled={locationStatus === 'requesting'}
                className="px-3.5 py-2 rounded-xl border border-border bg-background hover:bg-muted font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Refresh Live Weather"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${locationStatus === 'requesting' ? 'animate-spin' : ''}`} />
                <span>{locationStatus === 'requesting' ? 'Updating...' : 'Refresh'}</span>
              </button>

              {locationStatus === 'granted' && (
                <button
                  type="button"
                  onClick={toggleLiveTracking}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    isLiveTracking
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'border border-border bg-background hover:bg-muted text-foreground'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{isLiveTracking ? 'Tracking Field Live' : 'Live Track'}</span>
                </button>
              )}

              {showMapToggle && onToggleMap && (
                <button
                  type="button"
                  onClick={onToggleMap}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Interactive Map</span>
                </button>
              )}
            </div>
          </div>

          {/* Primary Meteorological Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Temperature */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 space-y-1.5">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                <span>Field Temperature</span>
                <Thermometer className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-foreground">
                {weatherReport.temperature_c}°C
              </div>
              <div className="text-[11px] text-muted-foreground">
                Night Dew Point: <span className="font-bold text-foreground">{weatherReport.dew_point_c}°C</span>
              </div>
            </div>

            {/* Relative Humidity */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 space-y-1.5">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                <span>Relative Humidity</span>
                <Droplets className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-3xl font-black text-foreground">
                {weatherReport.humidity_percent}%
              </div>
              <div className={`text-[11px] font-bold ${weatherReport.humidity_percent > 80 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600'}`}>
                {weatherReport.humidity_percent > 80 ? '⚠️ High Fungal Spore Risk' : 'Normal Moisture Level'}
              </div>
            </div>

            {/* Wind Velocity */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-teal-500/5 border border-cyan-500/20 space-y-1.5">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                <span>Wind Velocity</span>
                <Wind className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="text-3xl font-black text-foreground">
                {weatherReport.wind_kmh} <span className="text-sm font-normal text-muted-foreground">km/h</span>
              </div>
              <div className="text-[11px] text-muted-foreground font-medium">
                {weatherReport.wind_kmh > 14 ? '⚠️ High Spray Drift Hazard' : 'Low Chemical Drift Risk'}
              </div>
            </div>

            {/* Precipitation & Sky Condition */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/20 space-y-1.5">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                <span>Precipitation</span>
                <CloudRain className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-foreground">
                {weatherReport.rainfall_mm} <span className="text-sm font-normal text-muted-foreground">mm</span>
              </div>
              <div className="text-[11px] text-muted-foreground font-semibold">
                Cloud Cover: {weatherReport.cloud_cover_percent}%
              </div>
            </div>
          </div>

          {/* Disease Outbreak Predictions Generated from Live Weather */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Live Agro-Climatic Disease Outbreak Predictions for Your Location
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {weatherReport.disease_risk_alerts.map((alert, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border space-y-2 text-xs ${
                    alert.risk_level === 'high'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-100'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">
                      {alert.crop}: {alert.disease}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        alert.risk_level === 'high'
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500 text-stone-950'
                      }`}
                    >
                      {alert.risk_level} Risk
                    </span>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {alert.risk_factor}
                  </p>

                  <div className="pt-1.5 border-t border-border/50 font-medium text-foreground">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">Action: </span>
                    {alert.preventive_advice}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spray Window Advisory */}
          {!compact && (
            <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  CIB&amp;RC Foliar Spray Window Status:
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                    weatherReport.spray_window.status === 'optimal'
                      ? 'bg-emerald-600 text-white'
                      : weatherReport.spray_window.status === 'marginal'
                      ? 'bg-amber-500 text-black'
                      : 'bg-rose-600 text-white'
                  }`}>
                    {weatherReport.spray_window.status}
                  </span>
                </span>
                <p className="text-muted-foreground text-[11px]">
                  {weatherReport.spray_window.summary}
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-background border border-border font-mono text-[11px] text-emerald-700 dark:text-emerald-300 font-bold shrink-0">
                Best Window: {weatherReport.spray_window.best_window_hours}
              </div>
            </div>
          )}

          {/* 5-Day Weather & Disease Threat Forecast */}
          {!compact && weatherReport.five_day_forecast && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                5-Day Local Weather &amp; Pathogen Forecast
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {weatherReport.five_day_forecast.map((day, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl border border-border bg-background space-y-1.5 text-center text-xs shadow-xs"
                  >
                    <div className="font-bold text-foreground">{day.day_name}</div>
                    <div className="text-[10px] text-muted-foreground">{day.date}</div>
                    <div className="text-base font-black text-foreground">
                      {day.temp_max_c}° <span className="text-xs font-normal text-muted-foreground">/ {day.temp_min_c}°</span>
                    </div>
                    <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 truncate">
                      {day.condition}
                    </div>
                    <div className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground truncate">
                      {day.disease_threat}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
