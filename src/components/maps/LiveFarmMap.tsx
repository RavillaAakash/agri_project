import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Compass, AlertCircle, RefreshCw, Crosshair } from 'lucide-react';

export interface FarmLocation {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  district?: string;
  state?: string;
  placeName?: string;
  agroZone?: string;
}

interface LiveFarmMapProps {
  onLocationSelect: (loc: FarmLocation) => void;
  initialLocation?: FarmLocation;
}

// Agricultural Research Stations & Krishi Vigyan Kendra (KVK) Centers
const REGIONAL_KVK_CENTERS = [
  { name: 'KVK Warangal (Malyal)', lat: 17.6184, lng: 79.8821, desc: 'PJTSAU Extension & Pest Forewarning Station' },
  { name: 'KVK Khammam (Wyra)', lat: 17.1895, lng: 80.3541, desc: 'Cotton & Chilli Crop Health Diagnostic Lab' },
  { name: 'KVK Karimnagar (Jammikunta)', lat: 18.2865, lng: 79.4678, desc: 'Paddy Rice Blast Advisory Center' },
  { name: 'KVK Nalgonda (Kampasagar)', lat: 16.9247, lng: 79.5212, desc: 'Nagarjuna Sagar Command Area Extension' },
  { name: 'ANGRAU Lam Farm (Guntur)', lat: 16.3812, lng: 80.4431, desc: 'Regional Agricultural Research Station (Chilli & Cotton)' },
  { name: 'PJTSAU Main Campus (Rajendranagar)', lat: 17.3205, lng: 78.4068, desc: 'Central Diagnostic & IPM Cell' },
  { name: 'KVK Anantapur (Reddipalli)', lat: 14.6819, lng: 77.6006, desc: 'Groundnut & Dryland Farming Research' },
  { name: 'KVK Kurnool (Yagantipalle)', lat: 15.4211, lng: 78.1422, desc: 'Seed Certification & Pest Surveillance' },
];

export const LiveFarmMap: React.FC<LiveFarmMapProps> = ({ onLocationSelect, initialLocation }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const [currentLoc, setCurrentLoc] = useState<FarmLocation>(
    initialLocation || {
      latitude: 17.9784,
      longitude: 79.5941,
      district: 'Warangal',
      state: 'Telangana',
      placeName: 'Kakatiya Agro-Zone, Telangana',
      agroZone: 'Central Telangana Agro-Climatic Zone (CTZ)',
    }
  );

  const [isLocating, setIsLocating] = useState(false);
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [addressResolving, setAddressResolving] = useState(false);

  // Reverse Geocoding helper (OpenStreetMap Nominatim + Fallback)
  const resolveAddress = useCallback(async (lat: number, lng: number): Promise<Partial<FarmLocation>> => {
    try {
      setAddressResolving(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        {
          headers: { 'Accept-Language': 'en' },
        }
      );
      if (res.ok) {
        const data = await res.json();
        const address = data.address || {};
        const district = address.county || address.state_district || address.district || address.city || 'Regional Ag Zone';
        const state = address.state || 'Telangana / Andhra Pradesh';
        const village = address.village || address.suburb || address.town || address.hamlet || '';
        const placeName = village ? `${village}, ${district}` : `${district}, ${state}`;

        return {
          district,
          state,
          placeName,
          agroZone: determineAgroZone(lat, lng, district),
        };
      }
    } catch {
      // Network or rate-limit fallback
    } finally {
      setAddressResolving(false);
    }

    return {
      district: 'Regional Zone',
      state: 'Deccan Plateau',
      placeName: `Coordinates (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
      agroZone: 'Semi-Arid Deccan Agro-Climatic Zone',
    };
  }, []);

  const determineAgroZone = (lat: number, _lng: number, district: string): string => {
    const d = district.toLowerCase();
    if (d.includes('warangal') || d.includes('khammam') || d.includes('karimnagar') || d.includes('nalgonda')) {
      return 'Central Telangana Zone (Godavari & Krishna Basin)';
    }
    if (d.includes('guntur') || d.includes('krishna') || d.includes('godavari')) {
      return 'Krishna-Godavari Coastal Alluvial Zone (KGZ)';
    }
    if (d.includes('anantapur') || d.includes('kurnool') || d.includes('kadapa')) {
      return 'Scarce Rainfall Rayalaseema Dryland Zone';
    }
    if (lat > 18) {
      return 'Northern Telangana Agro-Climatic Zone (NTZ)';
    }
    return 'Southern Deccan Plateau Agro-Climatic Zone';
  };

  // Update map marker and circle position
  const updateMapMarker = useCallback((lat: number, lng: number, accuracy?: number) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Custom Icon for user farm
    const farmerIcon = L.divIcon({
      className: 'custom-farmer-pin',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
          <span style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; background: rgba(16, 185, 129, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <div style="width: 26px; height: 26px; border-radius: 9999px; background: #047857; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
            🌾
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker([lat, lng], {
        icon: farmerIcon,
        draggable: true,
      }).addTo(map);

      // Allow dragging marker to precise field corner
      userMarkerRef.current.on('dragend', async (e) => {
        const marker = e.target;
        const position = marker.getLatLng();
        handleNewCoordinates(position.lat, position.lng);
      });
    } else {
      userMarkerRef.current.setLatLng([lat, lng]);
    }

    // Accuracy Circle
    if (accuracy && accuracy > 0) {
      if (!accuracyCircleRef.current) {
        accuracyCircleRef.current = L.circle([lat, lng], {
          radius: Math.min(accuracy, 1000),
          color: '#10b981',
          fillColor: '#10b981',
          fillOpacity: 0.12,
          weight: 1.5,
        }).addTo(map);
      } else {
        accuracyCircleRef.current.setLatLng([lat, lng]);
        accuracyCircleRef.current.setRadius(Math.min(accuracy, 1000));
      }
    }

    map.panTo([lat, lng], { animate: true });
  }, []);

  const handleNewCoordinates = useCallback(async (lat: number, lng: number, accuracy?: number) => {
    updateMapMarker(lat, lng, accuracy);
    const resolved = await resolveAddress(lat, lng);
    const newLoc: FarmLocation = {
      latitude: lat,
      longitude: lng,
      accuracyMeters: accuracy,
      ...resolved,
    };
    setCurrentLoc(newLoc);
    onLocationSelect(newLoc);
  }, [resolveAddress, updateMapMarker, onLocationSelect]);

  // Request high-accuracy GPS location
  const detectLiveLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('GPS Geolocation is not supported by this browser.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsLocating(false);
        const { latitude, longitude, accuracy } = pos.coords;
        await handleNewCoordinates(latitude, longitude, accuracy);
      },
      (err) => {
        setIsLocating(false);
        setGeoError(
          err.code === 1
            ? 'Location permission denied. Please allow location access in your browser.'
            : 'Unable to pinpoint exact satellite coordinates. Defaulting to regional zone.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 10000,
      }
    );
  }, [handleNewCoordinates]);

  // Toggle Continuous Live Field Tracking
  const toggleLiveTracking = useCallback(() => {
    if (isLiveTracking) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsLiveTracking(false);
    } else {
      if (!navigator.geolocation) {
        setGeoError('GPS tracking not supported');
        return;
      }
      setIsLiveTracking(true);
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          handleNewCoordinates(latitude, longitude, accuracy);
        },
        () => {
          setIsLiveTracking(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
        }
      );
    }
  }, [isLiveTracking, handleNewCoordinates]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [currentLoc.latitude, currentLoc.longitude],
      zoom: 13,
      zoomControl: false,
    });

    // Add high-resolution OpenStreetMap TileLayer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // KVK & Agri University Icons
    const kvkIcon = L.divIcon({
      className: 'kvk-pin',
      html: `
        <div style="background: #1e3a8a; border: 2px solid #ffffff; width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); color: white;">
          🏛️
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    REGIONAL_KVK_CENTERS.forEach((kvk) => {
      L.marker([kvk.lat, kvk.lng], { icon: kvkIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-size: 11px; line-height: 1.4; color: #1e293b;">
            <strong style="color: #0f172a; display: block;">${kvk.name}</strong>
            <span style="color: #64748b;">${kvk.desc}</span>
          </div>
        `);
    });

    // Handle map click to drop pin on precise field
    map.on('click', (e) => {
      handleNewCoordinates(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;
    updateMapMarker(currentLoc.latitude, currentLoc.longitude, currentLoc.accuracyMeters);

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="space-y-3">
      {/* Map Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-foreground block">
              {addressResolving ? 'Pinpointing Agro-Zone...' : currentLoc.placeName || 'Field Coordinates'}
            </span>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-600" />
              {currentLoc.latitude.toFixed(4)}° N, {currentLoc.longitude.toFixed(4)}° E
              {currentLoc.accuracyMeters && ` (±${Math.round(currentLoc.accuracyMeters)}m precision)`}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={detectLiveLocation}
            disabled={isLocating}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {isLocating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Crosshair className="w-3.5 h-3.5" />
            )}
            <span>{isLocating ? 'Locating...' : 'Detect Field GPS'}</span>
          </button>

          <button
            type="button"
            onClick={toggleLiveTracking}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs ${
              isLiveTracking
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-700 dark:text-rose-300'
                : 'bg-background hover:bg-muted border-border text-foreground'
            }`}
          >
            <Navigation className={`w-3.5 h-3.5 ${isLiveTracking ? 'animate-pulse text-rose-500' : ''}`} />
            <span>{isLiveTracking ? 'Tracking Live' : 'Track Field'}</span>
          </button>
        </div>
      </div>

      {/* Geolocation Notice or Error */}
      {geoError && (
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Interactive Leaflet Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-border shadow-md h-72 sm:h-80 w-full z-10">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Map Legend & Instructions Overlay */}
        <div className="absolute top-2.5 left-2.5 z-[400] bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border text-[10px] text-muted-foreground shadow-sm flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> Your Field
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-blue-700 inline-block" /> KVK / ICAR Stations
          </span>
          <span className="hidden sm:inline text-foreground/80 font-medium border-l border-border pl-2">
            Click map or drag pin to adjust field
          </span>
        </div>

        {/* Live Agro-Climatic Zone Tag */}
        {currentLoc.agroZone && (
          <div className="absolute bottom-2.5 left-2.5 z-[400] bg-emerald-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30 text-[11px] text-emerald-200 shadow-md">
            <span className="font-semibold block">Agro-Climatic Zone:</span>
            <span>{currentLoc.agroZone}</span>
          </div>
        )}
      </div>
    </div>
  );
};
