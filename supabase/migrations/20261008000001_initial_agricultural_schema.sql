-- ==============================================================================
-- 🌾 AI AGRI DOCTOR — SUPABASE POSTGRESQL SCHEMA WITH MANDATORY RLS POLICIES
-- Phase 2 / Section 33, 34, 35
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'te', 'hi')),
    state TEXT DEFAULT 'Telangana',
    district TEXT,
    mandal TEXT,
    role TEXT DEFAULT 'farmer' CHECK (role IN ('farmer', 'expert', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Farms and Fields
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    total_acres NUMERIC(6, 2) DEFAULT 0.0,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    mandal TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Crops & Botanical Taxonomy
CREATE TABLE IF NOT EXISTS public.crops (
    id TEXT PRIMARY KEY,
    common_name TEXT NOT NULL,
    scientific_name TEXT NOT NULL,
    name_te TEXT,
    name_hi TEXT,
    category TEXT DEFAULT 'field_crop',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Dataset Sources & Authoritative Provenance Registry
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

-- 5. Diseases, Pests & Nutritional Deficiencies
CREATE TABLE IF NOT EXISTS public.diseases (
    id TEXT PRIMARY KEY,
    crop_id TEXT NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
    common_name TEXT NOT NULL,
    scientific_name TEXT NOT NULL,
    category TEXT CHECK (category IN ('fungal', 'bacterial', 'viral', 'oomycete', 'other')),
    name_te TEXT,
    name_hi TEXT,
    severity TEXT DEFAULT 'moderate' CHECK (severity IN ('low', 'moderate', 'high', 'critical')),
    symptoms_en TEXT[],
    symptoms_te TEXT[],
    symptoms_hi TEXT[],
    favorable_conditions JSONB,
    cultural_control TEXT[],
    mechanical_control TEXT[],
    biological_control TEXT[],
    chemical_guidance JSONB,
    source_id TEXT REFERENCES public.dataset_sources(id),
    verification_status TEXT DEFAULT 'verified',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Model Versions Registry
CREATE TABLE IF NOT EXISTS public.model_versions (
    model_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    dataset_version TEXT NOT NULL,
    metrics JSONB NOT NULL,
    deployed_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'ACTIVE_PRODUCTION'
);

-- 7. Diagnostic Sessions and Results
CREATE TABLE IF NOT EXISTS public.diagnosis_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    crop_id TEXT REFERENCES public.crops(id),
    growth_stage TEXT,
    region TEXT,
    model_version TEXT REFERENCES public.model_versions(model_id),
    overall_confidence NUMERIC(5, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.diagnosis_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.diagnosis_sessions(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    plant_part TEXT CHECK (plant_part IN ('leaf', 'whole_plant', 'stem', 'fruit', 'flower', 'pest_close_up', 'other')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Expert Escalation Requests
CREATE TABLE IF NOT EXISTS public.expert_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.diagnosis_sessions(id),
    crop_name TEXT NOT NULL,
    notes TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ASSIGNED', 'RESOLVED')),
    assigned_expert_id UUID REFERENCES public.profiles(id),
    expert_resolution TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 9. Chatbot Sessions & Messages
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnosis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnosis_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Read-only public reference data
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dataset_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view verified crops" ON public.crops FOR SELECT USING (true);
CREATE POLICY "Anyone can view verified diseases" ON public.diseases FOR SELECT USING (true);
CREATE POLICY "Anyone can view dataset sources" ON public.dataset_sources FOR SELECT USING (true);
CREATE POLICY "Anyone can view deployed model versions" ON public.model_versions FOR SELECT USING (true);

-- Farmer isolated policies
CREATE POLICY "Users can manage own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Farmers can manage own farms" ON public.farms
    FOR ALL USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can manage own fields" ON public.fields
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.farms WHERE farms.id = fields.farm_id AND farms.farmer_id = auth.uid())
    );

CREATE POLICY "Farmers can view own diagnoses" ON public.diagnosis_sessions
    FOR ALL USING (auth.uid() = farmer_id OR farmer_id IS NULL);

CREATE POLICY "Farmers can manage own expert requests" ON public.expert_requests
    FOR ALL USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can manage own chat sessions" ON public.chat_sessions
    FOR ALL USING (auth.uid() = farmer_id OR farmer_id IS NULL);

CREATE POLICY "Farmers can manage own chat messages" ON public.chat_messages
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.chat_sessions WHERE chat_sessions.id = chat_messages.session_id AND (chat_sessions.farmer_id = auth.uid() OR chat_sessions.farmer_id IS NULL))
    );
