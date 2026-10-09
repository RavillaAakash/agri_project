import type { FieldRecord, AgronomicTask } from '@/types/agricultural';

const LOCAL_STORAGE_FIELDS_KEY = 'agri_farmer_fields_v1';
const LOCAL_STORAGE_TASKS_KEY = 'agri_farmer_tasks_v1';

export const INITIAL_FIELDS: FieldRecord[] = [
  {
    id: 'fld-01',
    crop_id: 'paddy',
    crop_name: 'Paddy / Rice (వరి)',
    variety: 'BPT 5204 (Samba Mahsuri)',
    acres: 4.0,
    planting_date: '2026-07-15',
    stage: 'Panicle Initiation & Booting (పొట్ట దశ)',
    soil_type: 'Heavy Clay Loam with High Water Retention',
    irrigation_type: 'Canal Lift + Shallow Tube-well',
    health_status: 'good',
    last_scanned: '2 days ago',
    notes: 'Transplanted at 25-day seedling stage. No blast lesions observed on flag leaves.',
  },
  {
    id: 'fld-02',
    crop_id: 'cotton',
    crop_name: 'Cotton (ప్రత్తి)',
    variety: 'Bt Hybrid RCH-659 BG-II',
    acres: 2.5,
    planting_date: '2026-06-28',
    stage: 'Square & Early Boll Formation (మొగ్గ & కాయ దశ)',
    soil_type: 'Deep Black Cotton Vertisol (Regur)',
    irrigation_type: 'Drip Irrigation with Fertigation Venturi',
    health_status: 'moderate',
    last_scanned: 'Yesterday',
    notes: 'Pheromone trap count: 4 moths/night (below 8 ETL threshold). Minor jassid curling on lower leaves.',
  },
  {
    id: 'fld-03',
    crop_id: 'chilli',
    crop_name: 'Chilli (మిర్చి)',
    variety: 'Teja S17 Hot Pepper',
    acres: 2.0,
    planting_date: '2026-08-10',
    stage: 'Vegetative & Early Flowering (పూత & పిందె దశ)',
    soil_type: 'Well-drained Red Sandy Loam',
    irrigation_type: 'Furrow Irrigation with Plastic Mulch',
    health_status: 'at_risk',
    last_scanned: '3 hours ago',
    notes: 'Upward cup curling and bronze undersides observed on apical buds. Sucking mite/thrips complex suspected.',
  },
];

export const INITIAL_TASKS: AgronomicTask[] = [
  {
    id: 'task-01',
    crop_id: 'chilli',
    title: 'Install 25 Blue & 25 Yellow Sticky Traps',
    description: 'Erect traps at crop canopy height in Chilli Block 3 to monitor thrips and whiteflies before ETL crossing.',
    priority: 'high',
    due_date: 'Today',
    is_completed: false,
    category: 'ipm',
  },
  {
    id: 'task-02',
    crop_id: 'paddy',
    title: 'AWD Drainage for BPH Suppression',
    description: 'Drain standing water for 48 hours to expose tiller bases to sunlight and inhibit brown planthopper nymph clustering.',
    priority: 'high',
    due_date: 'Tomorrow',
    is_completed: false,
    category: 'irrigation',
  },
  {
    id: 'task-03',
    crop_id: 'cotton',
    title: 'Scout Pheromone Traps for Pink Bollworm',
    description: 'Check 5 trap septa in Cotton Block 2. Record daily moth count. If count exceeds 8 moths/night for 3 nights, trigger biological Trichogramma release.',
    priority: 'medium',
    due_date: 'In 2 days',
    is_completed: true,
    category: 'scouting',
  },
  {
    id: 'task-04',
    crop_id: 'paddy',
    title: 'Top-Dress Muriate of Potash (MOP)',
    description: 'Apply 20 kg/acre potash at panicle emergence to enhance grain filling and strengthen culms against blast lodging.',
    priority: 'medium',
    due_date: 'This week',
    is_completed: false,
    category: 'nutrition',
  },
];

export function getStoredFields(): FieldRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FIELDS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_FIELDS_KEY, JSON.stringify(INITIAL_FIELDS));
      return INITIAL_FIELDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_FIELDS;
  }
}

export function saveStoredFields(fields: FieldRecord[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_FIELDS_KEY, JSON.stringify(fields));
  } catch (e) {
    console.error('Failed to save fields to localStorage:', e);
  }
}

export function getStoredTasks(): AgronomicTask[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TASKS;
  }
}

export function saveStoredTasks(tasks: AgronomicTask[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks to localStorage:', e);
  }
}
