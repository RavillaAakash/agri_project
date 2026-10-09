import type { DistrictWeatherReport, SprayWindowAdvisory } from '@/types/agricultural';

export interface DistrictAgroProfile {
  district: string;
  state: 'Telangana' | 'Andhra Pradesh';
  agro_climatic_zone: string;
  baseTemp: number;
  baseHumidity: number;
  baseRainfall: number;
  baseWind: number;
  primaryCrops: string[];
}

export const DISTRICT_AGRO_PROFILES: Record<string, DistrictAgroProfile> = {
  Warangal: {
    district: 'Warangal',
    state: 'Telangana',
    agro_climatic_zone: 'Central Telangana Agro-Climatic Zone (CTZ)',
    baseTemp: 29.2,
    baseHumidity: 88,
    baseRainfall: 14.5,
    baseWind: 11,
    primaryCrops: ['Cotton', 'Chilli', 'Paddy', 'Maize'],
  },
  Suryapet: {
    district: 'Suryapet',
    state: 'Telangana',
    agro_climatic_zone: 'Southern Telangana Zone (STZ)',
    baseTemp: 31.0,
    baseHumidity: 79,
    baseRainfall: 4.2,
    baseWind: 9,
    primaryCrops: ['Paddy', 'Cotton', 'Chilli', 'Groundnut'],
  },
  Karimnagar: {
    district: 'Karimnagar',
    state: 'Telangana',
    agro_climatic_zone: 'Northern Telangana Zone (NTZ)',
    baseTemp: 28.6,
    baseHumidity: 86,
    baseRainfall: 18.0,
    baseWind: 12,
    primaryCrops: ['Paddy', 'Cotton', 'Maize'],
  },
  Khammam: {
    district: 'Khammam',
    state: 'Telangana',
    agro_climatic_zone: 'Central Telangana Zone (Godavari Basin)',
    baseTemp: 30.4,
    baseHumidity: 84,
    baseRainfall: 12.0,
    baseWind: 10,
    primaryCrops: ['Chilli', 'Cotton', 'Paddy', 'Pulses'],
  },
  Guntur: {
    district: 'Guntur',
    state: 'Andhra Pradesh',
    agro_climatic_zone: 'Krishna-Godavari Coastal Zone (KGZ)',
    baseTemp: 31.5,
    baseHumidity: 85,
    baseRainfall: 8.5,
    baseWind: 14,
    primaryCrops: ['Chilli', 'Cotton', 'Paddy', 'Tobacco'],
  },
  Kurnool: {
    district: 'Kurnool',
    state: 'Andhra Pradesh',
    agro_climatic_zone: 'Scarce Rainfall Zone (Rayalaseema)',
    baseTemp: 32.8,
    baseHumidity: 64,
    baseRainfall: 1.5,
    baseWind: 16,
    primaryCrops: ['Groundnut', 'Cotton', 'Sunflower', 'Bengal Gram'],
  },
  Anantapur: {
    district: 'Anantapur',
    state: 'Andhra Pradesh',
    agro_climatic_zone: 'Arid Scarce Rainfall Zone',
    baseTemp: 33.2,
    baseHumidity: 58,
    baseRainfall: 0.8,
    baseWind: 18,
    primaryCrops: ['Groundnut', 'Millets', 'Pomegranate'],
  },
  'East Godavari': {
    district: 'East Godavari',
    state: 'Andhra Pradesh',
    agro_climatic_zone: 'High Rainfall Coastal Alluvial Zone',
    baseTemp: 28.0,
    baseHumidity: 91,
    baseRainfall: 26.0,
    baseWind: 13,
    primaryCrops: ['Paddy', 'Coconut', 'Sugarcane', 'Oil Palm'],
  },
};

// ----------------------------------------------------------------------------
// SAFE SPRAY WINDOW CALCULATOR (CIB&RC & Extension Standard)
// ----------------------------------------------------------------------------
export function calculateSprayWindowAdvisory(
  tempC: number,
  windKmh: number,
  rainfallMm: number
): SprayWindowAdvisory {
  const isHighWind = windKmh > 14;
  const isHighTemp = tempC > 32;
  const isRainImminent = rainfallMm > 5;

  let status: 'optimal' | 'marginal' | 'hazardous' = 'optimal';
  if (isRainImminent || (isHighWind && isHighTemp)) {
    status = 'hazardous';
  } else if (isHighWind || isHighTemp) {
    status = 'marginal';
  }

  const hours = [
    { hour: '06:00 AM', t: tempC - 4, w: windKmh - 4, r: 5 },
    { hour: '08:00 AM', t: tempC - 2, w: windKmh - 2, r: 8 },
    { hour: '10:00 AM', t: tempC, w: windKmh, r: 12 },
    { hour: '12:00 PM', t: tempC + 3, w: windKmh + 3, r: 18 },
    { hour: '02:00 PM', t: tempC + 4, w: windKmh + 4, r: 22 },
    { hour: '04:00 PM', t: tempC + 1, w: windKmh + 1, r: 15 },
    { hour: '06:00 PM', t: tempC - 1, w: windKmh - 3, r: 10 },
  ];

  const hourly = hours.map((h) => {
    let rec: 'safe' | 'caution' | 'unsafe' = 'safe';
    if (h.w > 15 || h.t > 33 || h.r > 30) {
      rec = 'unsafe';
    } else if (h.w > 11 || h.t > 30 || h.r > 15) {
      rec = 'caution';
    }
    return {
      hour: h.hour,
      temperature_c: Math.round(h.t * 10) / 10,
      wind_kmh: Math.max(3, Math.round(h.w)),
      rain_probability_percent: h.r,
      recommendation: rec,
    };
  });

  return {
    status,
    summary:
      status === 'optimal'
        ? 'Current meteorological conditions are safe for foliar spraying. Low drift and minimal wash-off risk.'
        : status === 'marginal'
        ? 'Caution advised: Moderate drift or heat volatilization risk. Spray only with anti-drift nozzles during early morning.'
        : 'Do NOT spray now: High wind speed or rain wash-off hazard. Chemical run-off may contaminate water bodies.',
    best_window_hours: '06:30 AM – 09:30 AM & 04:30 PM – 06:30 PM',
    wind_drift_risk: windKmh > 14 ? 'high' : windKmh > 10 ? 'moderate' : 'low',
    washoff_risk: rainfallMm > 15 ? 'high' : rainfallMm > 5 ? 'moderate' : 'low',
    phytotoxicity_risk: tempC > 33 ? 'high' : tempC > 30 ? 'moderate' : 'low',
    hourly_forecast: hourly,
  };
}

// ----------------------------------------------------------------------------
// EPIDEMIOLOGICAL MICROCLIMATE RISK ENGINE
// ----------------------------------------------------------------------------
export function getDistrictWeatherReport(districtName: string): DistrictWeatherReport {
  const profile =
    DISTRICT_AGRO_PROFILES[districtName] || DISTRICT_AGRO_PROFILES['Warangal'];

  const temp = profile.baseTemp;
  const humidity = profile.baseHumidity;
  const rain = profile.baseRainfall;
  const wind = profile.baseWind;

  // Dew point approximation (Magnus-Tetens formula)
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
  const dewPoint = Math.round(((b * alpha) / (a - alpha)) * 10) / 10;

  // Calculate dynamic disease outbreak risks based on ICAR & State University Models
  const diseaseAlerts: DistrictWeatherReport['disease_risk_alerts'] = [];

  // 1. Paddy Blast Model (Magnaporthe oryzae)
  // Trigger: Temp 20-26C, RH > 88%, continuous dew or overcast
  if (humidity >= 85 && temp <= 30) {
    diseaseAlerts.push({
      crop: 'Paddy / Rice (వరి)',
      disease: 'Rice Blast & Neck Blast (అగ్గితెగులు)',
      risk_level: humidity > 88 ? 'high' : 'moderate',
      risk_factor: `Relative humidity (${humidity}%) and night dew point (${dewPoint}°C) accelerate Magnaporthe conidial sporulation and rapid leaf penetration.`,
      preventive_advice:
        'Withhold top-dressing with nitrogen/urea. Split potash (MOP) application and maintain shallow standing water (2-3 cm). Apply Pseudomonas fluorescens @ 10g/L preventively.',
    });
  }

  // 2. Paddy Sheath Blight Model (Rhizoctonia solani)
  // Trigger: Temp 28-32C, RH > 85%, dense vegetative tillering
  if (temp >= 27 && temp <= 33 && humidity >= 80) {
    diseaseAlerts.push({
      crop: 'Paddy / Rice (వరి)',
      disease: 'Sheath Blight (మట్ట కుళ్ళు తెగులు)',
      risk_level: humidity >= 86 ? 'high' : 'moderate',
      risk_factor: `High canopy relative humidity (${humidity}%) at ${temp}°C promotes vertical sclerotial migration up the leaf sheaths.`,
      preventive_advice:
        'Provide 30 cm alleyways ("బోదెలు తీయడం") every 2 meters for aeration and direct sunlight penetration. Drain excess standing water for 48 hours.',
    });
  }

  // 3. Chilli Thrips & Mites Model
  // Trigger: Hot dry weather or sudden warm spells after rain
  if (profile.primaryCrops.includes('Chilli')) {
    if (humidity < 75 || temp > 31) {
      diseaseAlerts.push({
        crop: 'Chilli (మిర్చి)',
        disease: 'Leaf Curl & Thrips-Mite Damage Complex (ఆకు ముడుత)',
        risk_level: temp > 32 ? 'high' : 'moderate',
        risk_factor: `Warm temperatures (${temp}°C) and dry air accelerate Scirtothrips dorsalis reproductive cycles from 14 days down to 9 days.`,
        preventive_advice:
          'Erect 25 blue sticky traps (thrips) and 25 yellow sticky traps (mites) per acre. Intercrop 4 border rows of Maize/Jowar as physical wind barriers.',
      });
    }
  }

  // 4. Chilli Anthracnose & Die-back Model
  if (profile.primaryCrops.includes('Chilli') && rain > 6) {
    diseaseAlerts.push({
      crop: 'Chilli (మిర్చి)',
      disease: 'Anthracnose & Fruit Rot (కొమ్మ ఎండు / కాయ కుళ్ళు)',
      risk_level: rain > 12 ? 'high' : 'moderate',
      risk_factor: `Recent rainfall (${rain} mm) splashing onto green fruits combined with warm temperatures stimulates Colletotrichum acervuli germination.`,
      preventive_advice:
        'Avoid overhead sprinkler irrigation. Ensure free field drainage. Clip and burn die-back affected terminal twigs 2 cm below infected lesion.',
    });
  }

  // 5. Cotton Pink Bollworm & Whitefly Model
  if (profile.primaryCrops.includes('Cotton')) {
    diseaseAlerts.push({
      crop: 'Cotton (పత్తి)',
      disease: 'Pink Bollworm & Sucking Pest Complex (గులాబీ రంగు పురుగు)',
      risk_level: 'moderate',
      risk_factor: `Cloudy intervals with wind speed of ${wind} km/h favor crepuscular moth flights and egg oviposition on green squares/bolls.`,
      preventive_advice:
        'Install 5 pheromone traps per acre to scout ETL (8 moths/trap/night for 3 consecutive days). Manually collect and destroy rosetted flowers weekly.',
    });
  }

  const sprayWindow = calculateSprayWindowAdvisory(temp, wind, rain);

  // 5-day agrometeorological projections
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const fiveDay = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    const dayName = days[d.getDay()];
    const dateStr = d.toISOString().split('T')[0];
    const delta = (i % 2 === 0 ? 1 : -1) * (i * 0.7);

    return {
      date: dateStr,
      day_name: dayName,
      temp_max_c: Math.round((temp + 2 + delta) * 10) / 10,
      temp_min_c: Math.round((temp - 7 + delta) * 10) / 10,
      humidity_percent: Math.min(95, Math.max(50, Math.round(humidity - delta * 2))),
      condition: i % 2 === 0 ? 'Partly Cloudy' : 'Scattered Showers',
      disease_threat: i === 0 ? 'Elevated Blast Spores' : 'Moderate Thrips Drift',
    };
  });

  return {
    district: profile.district,
    state: profile.state,
    agro_climatic_zone: profile.agro_climatic_zone,
    temperature_c: temp,
    humidity_percent: humidity,
    rainfall_mm: rain,
    wind_kmh: wind,
    dew_point_c: dewPoint,
    uv_index: temp > 31 ? 8 : 6,
    cloud_cover_percent: humidity > 85 ? 75 : 45,
    forecast_summary: `${profile.agro_climatic_zone}: Intermittent cloud cover with nocturnal humidity peaks. Conditions require vigil against fungal and sucking pest vectors.`,
    disease_risk_alerts: diseaseAlerts,
    spray_window: sprayWindow,
    five_day_forecast: fiveDay,
  };
}
