import { supabase, isSupabaseConfigured } from './client';
import { EXTENDED_CROPS, DETAILED_CONDITIONS } from '@/features/crops/knowledgeBase';
import type {
  Crop,
  AgriculturalCondition,
  DiagnosisPrediction,
} from '@/types/agricultural';

export { EXTENDED_CROPS as SEED_CROPS, DETAILED_CONDITIONS as SEED_CONDITIONS };

// ----------------------------------------------------------------------------
// REPOSITORY METHODS (Safe with live Supabase or verified local knowledge base)
// ----------------------------------------------------------------------------
export async function getCrops(): Promise<Crop[]> {
  if (!isSupabaseConfigured()) {
    return EXTENDED_CROPS;
  }
  try {
    const { data, error } = await supabase.from('crops').select('*');
    if (error || !data || data.length === 0) return EXTENDED_CROPS;
    return data.map((d) => ({
      id: d.id,
      common_name: d.common_name,
      scientific_name: d.scientific_name,
      local_names: {
        en: d.common_name,
        te: d.name_te || d.common_name,
        hi: d.name_hi || d.common_name,
      },
      growth_stages: ['Vegetative', 'Flowering', 'Maturity'],
      favorable_climate: d.favorable_climate || '',
      soil_types: d.soil_types || [],
    }));
  } catch {
    return EXTENDED_CROPS;
  }
}

export async function getConditions(cropId?: string, problemType?: string): Promise<AgriculturalCondition[]> {
  if (!isSupabaseConfigured()) {
    return DETAILED_CONDITIONS.filter((c) => {
      const matchCrop = !cropId || cropId === 'all' || c.crop_id === cropId;
      const matchType = !problemType || problemType === 'all' || c.problem_type === problemType;
      return matchCrop && matchType;
    });
  }
  try {
    let query = supabase.from('diseases').select('*, agricultural_sources(*)');
    if (cropId && cropId !== 'all') {
      query = query.eq('crop_id', cropId);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return DETAILED_CONDITIONS.filter((c) => {
        const matchCrop = !cropId || cropId === 'all' || c.crop_id === cropId;
        const matchType = !problemType || problemType === 'all' || c.problem_type === problemType;
        return matchCrop && matchType;
      });
    }
    return DETAILED_CONDITIONS;
  } catch {
    return DETAILED_CONDITIONS;
  }
}

export async function getConditionById(conditionId: string): Promise<AgriculturalCondition | undefined> {
  const all = await getConditions();
  return all.find((c) => c.id === conditionId);
}

export async function saveDiagnosisSession(
  sessionData: Partial<DiagnosisPrediction> & {
    farmer_id?: string;
    crop_id: string;
    image_paths: string[];
  }
): Promise<{ success: boolean; sessionId: string; error?: string }> {
  const generatedId = `diag-${Date.now()}`;
  if (!isSupabaseConfigured()) {
    return { success: true, sessionId: generatedId };
  }
  try {
    const { data, error } = await supabase
      .from('diagnosis_sessions')
      .insert({
        farmer_id: sessionData.farmer_id || null,
        crop_id: sessionData.crop_id,
        overall_confidence: sessionData.confidence || 0,
        confidence_tier: sessionData.confidence_level || 'moderate',
        requires_expert_review: sessionData.requires_expert_review || false,
      })
      .select('id')
      .single();

    if (error) return { success: false, sessionId: '', error: error.message };
    return { success: true, sessionId: data.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Session save failed';
    return { success: false, sessionId: '', error: msg };
  }
}
