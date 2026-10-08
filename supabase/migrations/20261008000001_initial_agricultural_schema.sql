-- ==============================================================================
-- 🌾 AI AGRI DOCTOR — COMPREHENSIVE SUPABASE POSTGRESQL SCHEMA WITH RLS
-- Adheres to Sections 7, 8, 33, 34, 35, 36, 38 of Master Prompt
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. USERS & ROLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'te', 'hi')),
    state TEXT DEFAULT 'Telangana',
    district TEXT,
    mandal TEXT,
    village TEXT,
    role TEXT DEFAULT 'farmer' CHECK (role IN ('farmer', 'expert', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. FARMS & FIELDS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    total_acres NUMERIC(6, 2) DEFAULT 0.0,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    mandal TEXT,
    village TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    variety TEXT,
    planting_date DATE,
    crop_stage TEXT,
    soil_type TEXT,
    irrigation_type TEXT,
    health_status TEXT DEFAULT 'good' CHECK (health_status IN ('good', 'moderate', 'at_risk')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. PROVENANCE & DATASET REGISTRIES (§4, §5, §6)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dataset_sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    organization TEXT NOT NULL,
    url TEXT,
    license TEXT NOT NULL,
    version TEXT NOT NULL,
    retrieved_at DATE NOT NULL,
    usage_permission TEXT,
    verification_status TEXT DEFAULT 'verified' CHECK (verification_status IN ('verified', 'unverified', 'pending_review')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.agricultural_sources (
    id TEXT PRIMARY KEY,
    dataset_source_id TEXT REFERENCES public.dataset_sources(id) ON DELETE SET NULL,
    source_name TEXT NOT NULL,
    source_url TEXT,
    source_type TEXT NOT NULL CHECK (source_type IN ('icar', 'university', 'gov_dept', 'peer_reviewed', 'extension_service', 'other')),
    license TEXT NOT NULL,
    copyright_information TEXT,
    publication_date DATE,
    retrieval_date DATE NOT NULL,
    region TEXT[] DEFAULT ARRAY['Telangana', 'Andhra Pradesh'],
    language TEXT DEFAULT 'en,te,hi',
    verification_status TEXT DEFAULT 'verified' CHECK (verification_status IN ('verified', 'unverified', 'pending_review')),
    verified_by TEXT,
    last_verified DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. BOTANICAL CROPS, VARIETIES & STAGES (§7, §10)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crops (
    id TEXT PRIMARY KEY,
    common_name TEXT NOT NULL,
    scientific_name TEXT NOT NULL,
    name_te TEXT,
    name_hi TEXT,
    category TEXT DEFAULT 'field_crop',
    icon_url TEXT,
    favorable_climate TEXT,
    soil_types TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.crop_varieties (
    id TEXT PRIMARY KEY,
    crop_id TEXT NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
    variety_name TEXT NOT NULL,
    local_names JSONB DEFAULT '{}'::jsonb,
    duration_days INT,
    resistance_traits TEXT[],
    recommended_regions TEXT[],
    source_id TEXT REFERENCES public.agricultural_sources(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.crop_stages (
    id TEXT PRIMARY KEY,
    crop_id TEXT NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
    stage_name TEXT NOT NULL,
    stage_order INT NOT NULL,
    description TEXT,
    typical_days_from_sowing INT,
    vulnerable_problems TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. SYMPTOMS & PLANT PARTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.affected_plant_parts (
    id TEXT PRIMARY KEY,
    part_name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.symptoms (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_te TEXT,
    name_hi TEXT,
    description TEXT,
    plant_part_id TEXT REFERENCES public.affected_plant_parts(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. DISEASES & TAXONOMY (§7, §8)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.disease_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.diseases (
    id TEXT PRIMARY KEY,
    crop_id TEXT NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
    category_id TEXT REFERENCES public.disease_categories(id),
    common_name TEXT NOT NULL,
    scientific_name TEXT NOT NULL,
    local_names JSONB DEFAULT '{}'::jsonb,
    cause TEXT,
    severity TEXT DEFAULT 'moderate' CHECK (severity IN ('low', 'moderate', 'high', 'critical')),
    spread_method TEXT,
    favorable_conditions JSONB DEFAULT '{}'::jsonb,
    source_id TEXT REFERENCES public.agricultural_sources(id),
    verification_status TEXT DEFAULT 'verified' CHECK (verification_status IN ('verified', 'unverified', 'pending_review')),
    last_verified DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.disease_symptoms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disease_id TEXT NOT NULL REFERENCES public.diseases(id) ON DELETE CASCADE,
    symptom_id TEXT NOT NULL REFERENCES public.symptoms(id) ON DELETE CASCADE,
    crop_stage_id TEXT REFERENCES public.crop_stages(id),
    is_primary_indicator BOOLEAN DEFAULT TRUE
);

-- ------------------------------------------------------------------------------
-- 7. PESTS, INSECTS, MITES, NEMATODES, WEEDS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pest_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.pests (
    id TEXT PRIMARY KEY,
    crop_id TEXT NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
    category_id TEXT REFERENCES public.pest_categories(id),
    common_name TEXT NOT NULL,
    scientific_name TEXT NOT NULL,
    local_names JSONB DEFAULT '{}'::jsonb,
    pest_type TEXT DEFAULT 'insect' CHECK (pest_type IN ('insect', 'mite', 'nematode', 'weed', 'other')),
    etl_threshold TEXT, -- Economic Threshold Level
    favorable_conditions JSONB DEFAULT '{}'::jsonb,
    source_id TEXT REFERENCES public.agricultural_sources(id),
    verification_status TEXT DEFAULT 'verified' CHECK (verification_status IN ('verified', 'unverified', 'pending_review')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pest_symptoms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pest_id TEXT NOT NULL REFERENCES public.pests(id) ON DELETE CASCADE,
    symptom_id TEXT NOT NULL REFERENCES public.symptoms(id) ON DELETE CASCADE,
    is_primary_indicator BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.insects (
    id TEXT PRIMARY KEY REFERENCES public.pests(id) ON DELETE CASCADE,
    order_name TEXT,
    family_name TEXT,
    feeding_habit TEXT,
    overwintering_stage TEXT
);

CREATE TABLE IF NOT EXISTS public.mites (
    id TEXT PRIMARY KEY REFERENCES public.pests(id) ON DELETE CASCADE,
    acaricide_sensitivity TEXT,
    webbing_habit BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public.nematodes (
    id TEXT PRIMARY KEY REFERENCES public.pests(id) ON DELETE CASCADE,
    gall_forming BOOLEAN DEFAULT FALSE,
    host_range TEXT[]
);

CREATE TABLE IF NOT EXISTS public.weeds (
    id TEXT PRIMARY KEY REFERENCES public.pests(id) ON DELETE CASCADE,
    weed_type TEXT CHECK (weed_type IN ('broadleaf', 'grass', 'sedge')),
    life_cycle TEXT CHECK (life_cycle IN ('annual', 'biennial', 'perennial'))
);

-- ------------------------------------------------------------------------------
-- 8. NUTRIENT DEFICIENCIES, ABIOTIC STRESSES & PHYSIOLOGICAL DISORDERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.nutrient_deficiencies (
    id TEXT PRIMARY KEY,
    crop_id TEXT NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
    nutrient_name TEXT NOT NULL,
    nutrient_type TEXT CHECK (nutrient_type IN ('primary_macro', 'secondary_macro', 'micro')),
    deficiency_symptoms JSONB NOT NULL,
    correction_protocol TEXT NOT NULL,
    source_id TEXT REFERENCES public.agricultural_sources(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.abiotic_stresses (
    id TEXT PRIMARY KEY,
    crop_id TEXT NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
    stress_name TEXT NOT NULL,
    stress_type TEXT CHECK (stress_type IN ('drought', 'salinity', 'waterlogging', 'heat', 'cold', 'wind')),
    symptoms JSONB NOT NULL,
    mitigation_practices TEXT[],
    source_id TEXT REFERENCES public.agricultural_sources(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.physiological_disorders (
    id TEXT PRIMARY KEY,
    crop_id TEXT NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
    disorder_name TEXT NOT NULL,
    cause_description TEXT NOT NULL,
    management_practices TEXT[],
    source_id TEXT REFERENCES public.agricultural_sources(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. IPM, CONTROLS & TREATMENTS (§21, §22, §23)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.prevention_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id TEXT NOT NULL, -- references diseases.id or pests.id
    target_type TEXT CHECK (target_type IN ('disease', 'pest', 'deficiency', 'abiotic')),
    method_title TEXT NOT NULL,
    description TEXT NOT NULL,
    recommended_stage TEXT,
    source_id TEXT REFERENCES public.agricultural_sources(id)
);

CREATE TABLE IF NOT EXISTS public.cultural_controls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id TEXT NOT NULL,
    target_type TEXT,
    action_text TEXT NOT NULL,
    source_id TEXT REFERENCES public.agricultural_sources(id)
);

CREATE TABLE IF NOT EXISTS public.mechanical_controls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id TEXT NOT NULL,
    target_type TEXT,
    action_text TEXT NOT NULL,
    traps_per_acre INT,
    source_id TEXT REFERENCES public.agricultural_sources(id)
);

CREATE TABLE IF NOT EXISTS public.biological_controls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id TEXT NOT NULL,
    target_type TEXT,
    organism_name TEXT NOT NULL,
    application_rate TEXT NOT NULL,
    source_id TEXT REFERENCES public.agricultural_sources(id)
);

CREATE TABLE IF NOT EXISTS public.ipm_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id TEXT NOT NULL,
    target_type TEXT,
    protocol_steps TEXT[] NOT NULL,
    source_id TEXT REFERENCES public.agricultural_sources(id)
);

CREATE TABLE IF NOT EXISTS public.management_practices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_id TEXT NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
    practice_type TEXT NOT NULL,
    title TEXT NOT NULL,
    details TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.treatments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id TEXT NOT NULL,
    target_type TEXT NOT NULL,
    active_ingredient TEXT NOT NULL,
    trade_name_examples TEXT,
    cibrc_approved BOOLEAN DEFAULT TRUE,
    official_dosage TEXT NOT NULL,
    waiting_period_days INT NOT NULL,
    safety_instructions TEXT NOT NULL,
    regional_applicability TEXT[] DEFAULT ARRAY['Telangana', 'Andhra Pradesh'],
    source_id TEXT NOT NULL REFERENCES public.agricultural_sources(id),
    verification_status TEXT DEFAULT 'verified' CHECK (verification_status IN ('verified', 'unverified')),
    last_verified DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. AI MODEL REGISTRY & DATASET PIPELINE (§11, §12, §53)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.model_versions (
    model_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    model_type TEXT DEFAULT 'computer_vision',
    dataset_version TEXT NOT NULL,
    metrics JSONB NOT NULL,
    deployed_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'ACTIVE_PRODUCTION' CHECK (status IN ('ACTIVE_PRODUCTION', 'STAGING', 'DEPRECATED', 'ARCHIVED'))
);

CREATE TABLE IF NOT EXISTS public.crop_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_id TEXT NOT NULL REFERENCES public.crops(id),
    condition_id TEXT,
    storage_path TEXT NOT NULL,
    plant_part TEXT CHECK (plant_part IN ('leaf', 'whole_plant', 'stem', 'fruit', 'flower', 'root', 'pest_close_up', 'other')),
    crop_stage TEXT,
    region TEXT,
    capture_environment TEXT DEFAULT 'farm_field' CHECK (capture_environment IN ('farm_field', 'polyhouse', 'nursery', 'lab')),
    quality_score NUMERIC(3, 2),
    annotation_status TEXT DEFAULT 'approved' CHECK (annotation_status IN ('raw', 'annotated', 'approved', 'rejected')),
    source_id TEXT REFERENCES public.dataset_sources(id),
    license TEXT NOT NULL,
    verification_status TEXT DEFAULT 'verified',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.image_annotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_id UUID NOT NULL REFERENCES public.crop_images(id) ON DELETE CASCADE,
    bounding_boxes JSONB,
    segmentation_polygons JSONB,
    annotator_id UUID REFERENCES public.profiles(id),
    verified_by_expert_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.image_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_id UUID REFERENCES public.crop_images(id) ON DELETE SET NULL,
    model_id TEXT NOT NULL REFERENCES public.model_versions(model_id),
    predicted_label TEXT NOT NULL,
    confidence_score NUMERIC(5, 2) NOT NULL,
    raw_logits JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. DIAGNOSIS SESSIONS & RESULTS (§17, §18, §19)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.diagnosis_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    field_id UUID REFERENCES public.fields(id) ON DELETE SET NULL,
    crop_id TEXT REFERENCES public.crops(id),
    crop_stage TEXT,
    region TEXT,
    model_version TEXT REFERENCES public.model_versions(model_id),
    overall_confidence NUMERIC(5, 2),
    confidence_tier TEXT CHECK (confidence_tier IN ('high', 'moderate', 'low')),
    requires_expert_review BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.diagnosis_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.diagnosis_sessions(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    plant_part TEXT CHECK (plant_part IN ('leaf', 'whole_plant', 'stem', 'fruit', 'flower', 'pest_close_up', 'other')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.diagnosis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.diagnosis_sessions(id) ON DELETE CASCADE,
    condition_id TEXT,
    condition_name TEXT NOT NULL,
    scientific_name TEXT,
    confidence NUMERIC(5, 2) NOT NULL,
    observed_symptoms TEXT[],
    what_to_do_now TEXT[],
    prevention_guidance TEXT[],
    ipm_guidance TEXT[],
    chemical_guidance JSONB,
    sources JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 12. WEATHER & RISK ASSESSMENTS (§24, §25)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weather_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region TEXT NOT NULL,
    district TEXT NOT NULL,
    temperature_c NUMERIC(4, 1) NOT NULL,
    humidity_percent INT NOT NULL,
    rainfall_mm NUMERIC(5, 1) NOT NULL,
    wind_kmh NUMERIC(4, 1),
    forecast_summary TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID REFERENCES public.fields(id) ON DELETE CASCADE,
    crop_id TEXT REFERENCES public.crops(id),
    disease_id TEXT REFERENCES public.diseases(id),
    pest_id TEXT REFERENCES public.pests(id),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'moderate', 'high', 'critical')),
    risk_factor_explanation TEXT NOT NULL,
    recommended_prevention TEXT NOT NULL,
    assessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 13. CHATBOT SESSIONS & MESSAGES (§28, §30, §31, §32)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    language TEXT DEFAULT 'en' CHECK (language IN ('en', 'te', 'hi')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    image_paths TEXT[],
    structured_diagnosis JSONB,
    thinking_state TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 14. EXPERT ESCALATION (§51)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.expert_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.diagnosis_sessions(id),
    crop_name TEXT NOT NULL,
    variety TEXT,
    phone_number TEXT NOT NULL,
    farmer_notes TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ASSIGNED', 'IN_REVIEW', 'RESOLVED')),
    assigned_expert_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.expert_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.expert_requests(id) ON DELETE CASCADE,
    expert_id UUID NOT NULL REFERENCES public.profiles(id),
    verified_diagnosis TEXT NOT NULL,
    official_recommendation TEXT NOT NULL,
    attachments TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 15. FARMER FEEDBACK & AUDIT LOGS (§52, §54)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.farmer_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    session_id UUID REFERENCES public.diagnosis_sessions(id) ON DELETE SET NULL,
    is_helpful BOOLEAN NOT NULL,
    user_reported_correct_condition TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_name TEXT NOT NULL,
    entity_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE (§64)
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_fields_farm ON public.fields(farm_id);
CREATE INDEX IF NOT EXISTS idx_diseases_crop ON public.diseases(crop_id);
CREATE INDEX IF NOT EXISTS idx_pests_crop ON public.pests(crop_id);
CREATE INDEX IF NOT EXISTS idx_crop_images_crop ON public.crop_images(crop_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_sessions_farmer ON public.diagnosis_sessions(farmer_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_expert_requests_status ON public.expert_requests(status);
CREATE INDEX IF NOT EXISTS idx_weather_records_region ON public.weather_records(region, recorded_at);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES (§35)
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnosis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnosis_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnosis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_feedback ENABLE ROW LEVEL SECURITY;

-- Authoritative reference tables (read-only for all users, writable only by admins)
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_varieties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pest_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pest_symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nematodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrient_deficiencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abiotic_stresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physiological_disorders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affected_plant_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prevention_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mechanical_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biological_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ipm_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.management_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agricultural_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dataset_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Reference Data Select Policies (Public read-only)
CREATE POLICY "Public read for crops" ON public.crops FOR SELECT USING (true);
CREATE POLICY "Public read for crop varieties" ON public.crop_varieties FOR SELECT USING (true);
CREATE POLICY "Public read for crop stages" ON public.crop_stages FOR SELECT USING (true);
CREATE POLICY "Public read for diseases" ON public.diseases FOR SELECT USING (true);
CREATE POLICY "Public read for disease categories" ON public.disease_categories FOR SELECT USING (true);
CREATE POLICY "Public read for disease symptoms" ON public.disease_symptoms FOR SELECT USING (true);
CREATE POLICY "Public read for pests" ON public.pests FOR SELECT USING (true);
CREATE POLICY "Public read for pest categories" ON public.pest_categories FOR SELECT USING (true);
CREATE POLICY "Public read for pest symptoms" ON public.pest_symptoms FOR SELECT USING (true);
CREATE POLICY "Public read for insects" ON public.insects FOR SELECT USING (true);
CREATE POLICY "Public read for mites" ON public.mites FOR SELECT USING (true);
CREATE POLICY "Public read for nematodes" ON public.nematodes FOR SELECT USING (true);
CREATE POLICY "Public read for weeds" ON public.weeds FOR SELECT USING (true);
CREATE POLICY "Public read for nutrient deficiencies" ON public.nutrient_deficiencies FOR SELECT USING (true);
CREATE POLICY "Public read for abiotic stresses" ON public.abiotic_stresses FOR SELECT USING (true);
CREATE POLICY "Public read for physiological disorders" ON public.physiological_disorders FOR SELECT USING (true);
CREATE POLICY "Public read for symptoms" ON public.symptoms FOR SELECT USING (true);
CREATE POLICY "Public read for plant parts" ON public.affected_plant_parts FOR SELECT USING (true);
CREATE POLICY "Public read for prevention methods" ON public.prevention_methods FOR SELECT USING (true);
CREATE POLICY "Public read for cultural controls" ON public.cultural_controls FOR SELECT USING (true);
CREATE POLICY "Public read for mechanical controls" ON public.mechanical_controls FOR SELECT USING (true);
CREATE POLICY "Public read for biological controls" ON public.biological_controls FOR SELECT USING (true);
CREATE POLICY "Public read for ipm methods" ON public.ipm_methods FOR SELECT USING (true);
CREATE POLICY "Public read for treatments" ON public.treatments FOR SELECT USING (true);
CREATE POLICY "Public read for agricultural sources" ON public.agricultural_sources FOR SELECT USING (true);
CREATE POLICY "Public read for dataset sources" ON public.dataset_sources FOR SELECT USING (true);
CREATE POLICY "Public read for model versions" ON public.model_versions FOR SELECT USING (true);
CREATE POLICY "Public read for weather records" ON public.weather_records FOR SELECT USING (true);
CREATE POLICY "Public read for risk assessments" ON public.risk_assessments FOR SELECT USING (true);

-- 2. Farmer-Isolated Policies
CREATE POLICY "Farmer profile access" ON public.profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Farmer farm access" ON public.farms
    FOR ALL USING (auth.uid() = farmer_id);

CREATE POLICY "Farmer field access" ON public.fields
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.farms WHERE farms.id = fields.farm_id AND farms.farmer_id = auth.uid())
    );

CREATE POLICY "Farmer diagnosis session access" ON public.diagnosis_sessions
    FOR ALL USING (auth.uid() = farmer_id OR farmer_id IS NULL);

CREATE POLICY "Farmer diagnosis images access" ON public.diagnosis_images
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.diagnosis_sessions WHERE diagnosis_sessions.id = diagnosis_images.session_id AND (diagnosis_sessions.farmer_id = auth.uid() OR diagnosis_sessions.farmer_id IS NULL))
    );

CREATE POLICY "Farmer diagnosis results access" ON public.diagnosis_results
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.diagnosis_sessions WHERE diagnosis_sessions.id = diagnosis_results.session_id AND (diagnosis_sessions.farmer_id = auth.uid() OR diagnosis_sessions.farmer_id IS NULL))
    );

CREATE POLICY "Farmer chat session access" ON public.chat_sessions
    FOR ALL USING (auth.uid() = farmer_id OR farmer_id IS NULL);

CREATE POLICY "Farmer chat message access" ON public.chat_messages
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.chat_sessions WHERE chat_sessions.id = chat_messages.session_id AND (chat_sessions.farmer_id = auth.uid() OR chat_sessions.farmer_id IS NULL))
    );

CREATE POLICY "Farmer expert request access" ON public.expert_requests
    FOR ALL USING (auth.uid() = farmer_id);

CREATE POLICY "Expert response view access" ON public.expert_responses
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.expert_requests WHERE expert_requests.id = expert_responses.request_id AND (expert_requests.farmer_id = auth.uid() OR expert_responses.expert_id = auth.uid()))
    );

CREATE POLICY "Farmer feedback insert" ON public.farmer_feedback
    FOR INSERT WITH CHECK (auth.uid() = farmer_id OR farmer_id IS NULL);

-- ------------------------------------------------------------------------------
-- STORAGE BUCKETS DDL & POLICIES (§36)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('plant-images', 'plant-images', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('dataset-images', 'dataset-images', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('profile-images', 'profile-images', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('expert-attachments', 'expert-attachments', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Plant Images
CREATE POLICY "Authenticated users can upload plant images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'plant-images');

CREATE POLICY "Users can access own plant images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'plant-images' AND (auth.uid()::text = (storage.foldername(name))[1] OR bucket_id = 'profile-images'));
