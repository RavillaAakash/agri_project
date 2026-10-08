export type Language = 'en' | 'te' | 'hi';

export type ProblemType =
  | 'disease'
  | 'pest'
  | 'insect'
  | 'mite'
  | 'nematode'
  | 'nutrient_deficiency'
  | 'abiotic_stress'
  | 'physiological_disorder'
  | 'healthy';

export type DiseaseCategory = 'fungal' | 'bacterial' | 'viral' | 'oomycete' | 'nematode' | 'other';

export type VerificationStatus = 'verified' | 'unverified' | 'pending_review' | 'rejected';

export type SeverityLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface LocalizedName {
  en: string;
  te: string;
  hi: string;
  common_farmer_terms?: string[];
}

export interface ProvenanceMetadata {
  source_name: string;
  source_url: string;
  source_type: 'icar' | 'university' | 'gov_dept' | 'peer_reviewed' | 'extension_service' | 'other';
  license: string;
  copyright_information?: string;
  publication_date?: string;
  retrieval_date: string;
  dataset_version?: string;
  region: string[]; // e.g. ['Telangana', 'Andhra Pradesh']
  language: string;
  verification_status: VerificationStatus;
  verified_by?: string;
  last_verified: string;
}

export interface Crop {
  id: string;
  common_name: string;
  scientific_name: string;
  local_names: LocalizedName;
  icon?: string;
  growth_stages: string[];
  favorable_climate: string;
  soil_types: string[];
}

export interface AgriculturalCondition {
  id: string;
  crop_id: string;
  problem_type: ProblemType;
  category?: DiseaseCategory | string;
  common_name: string;
  scientific_name: string;
  local_names: LocalizedName;
  symptoms: {
    en: string[];
    te: string[];
    hi: string[];
  };
  affected_plant_parts: ('leaf' | 'stem' | 'fruit' | 'flower' | 'root' | 'whole_plant')[];
  favorable_conditions: {
    temperature_range?: string;
    humidity_range?: string;
    weather_triggers?: string[];
  };
  spread_method?: string;
  severity: SeverityLevel;
  prevention_methods: string[];
  cultural_control: string[];
  mechanical_control: string[];
  biological_control: string[];
  ipm_recommendations: string[];
  chemical_management?: {
    is_applicable: boolean;
    active_ingredient?: string;
    official_recommendation?: string;
    safety_disclaimer: string;
    regional_approval: string;
    waiting_period_days?: number;
    source: string;
  };
  provenance: ProvenanceMetadata;
}

export interface PlantImageUpload {
  id: string;
  file?: File;
  previewUrl: string;
  plant_part: 'leaf' | 'whole_plant' | 'stem' | 'fruit' | 'pest_close_up' | 'other';
  capture_environment?: 'field' | 'polyhouse' | 'nursery';
}

export interface DiagnosisPrediction {
  id: string;
  condition_id: string;
  condition_name: string;
  scientific_name: string;
  local_names: LocalizedName;
  problem_type: ProblemType;
  confidence: number; // 0 to 100
  confidence_level: 'high' | 'moderate' | 'low';
  observed_symptoms: string[];
  possible_causes: string[];
  what_to_do_now: string[];
  prevention_guidance: string[];
  ipm_guidance: string[];
  chemical_guidance?: {
    active_ingredient?: string;
    official_recommendation?: string;
    safety_disclaimer: string;
    source: string;
    regional_applicability: string;
  };
  sources: ProvenanceMetadata[];
  requires_expert_review: boolean;
}

export type ThinkingOrbState =
  | 'working'
  | 'searching'
  | 'solving'
  | 'listening'
  | 'connecting'
  | 'weaving'
  | 'composing'
  | 'breathing'
  | 'shaping';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  language?: Language;
  images?: string[];
  structured_diagnosis?: DiagnosisPrediction;
  timestamp: string;
  thinkingState?: ThinkingOrbState;
}

export interface FarmRecord {
  id: string;
  name: string;
  location: string;
  district: string;
  state: 'Telangana' | 'Andhra Pradesh' | 'Other';
  total_acres: number;
  crops: {
    crop_id: string;
    crop_name: string;
    variety: string;
    planting_date: string;
    stage: string;
    health_status: 'good' | 'moderate' | 'at_risk';
  }[];
}

export interface WeatherCondition {
  temperature_c: number;
  humidity_percent: number;
  rainfall_mm: number;
  wind_kmh: number;
  forecast_summary: string;
  disease_risk_alerts: {
    crop: string;
    disease: string;
    risk_level: 'low' | 'moderate' | 'high';
    risk_factor: string;
    preventive_advice: string;
  }[];
}
