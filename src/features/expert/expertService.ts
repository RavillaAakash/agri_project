export interface EscalationTicket {
  id: string;
  farmerId: string;
  farmerName: string;
  phone: string;
  district: string;
  mandal: string;
  cropId: string;
  cropName: string;
  variety: string;
  images: {
    leafUrl?: string;
    wholePlantUrl?: string;
    stemUrl?: string;
    pestUrl?: string;
  };
  symptomsDescription: string;
  fertilizerHistory: string;
  aiConfidence: number;
  aiPreDiagnosis: string;
  status: 'pending_review' | 'under_investigation' | 'resolved_verified';
  createdAt: string;
  agronomistResponse?: {
    expertName: string;
    institution: string;
    officialDiagnosis: string;
    prescription: {
      culturalActions: string[];
      biologicalControl: string[];
      chemicalActiveIngredient?: string;
      cibrcDosage?: string;
      waitingPeriodDays?: number;
    };
    statutoryWarning: string;
    signedAt: string;
  };
}

const LOCAL_STORAGE_TICKETS_KEY = 'agri_escalation_tickets_v1';

export const INITIAL_TICKETS: EscalationTicket[] = [
  {
    id: 'EXP-8291',
    farmerId: 'f-101',
    farmerName: 'Aakash Ravilla',
    phone: '+91 98490 12345',
    district: 'Warangal',
    mandal: 'Geesugonda',
    cropId: 'chilli',
    cropName: 'Chilli (మిర్చి)',
    variety: 'Teja S17 Hot Pepper',
    images: {
      leafUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=600&auto=format&fit=crop&q=80',
      wholePlantUrl: 'https://images.unsplash.com/photo-1588615419957-46387062a420?w=600&auto=format&fit=crop&q=80',
    },
    symptomsDescription:
      'Terminal leaves curled upwards in boat shape, followed by downward petiole elongation. Heavy flower drop noticed after recent warm spell.',
    fertilizerHistory: 'Applied 50 kg Urea + 25 kg DAP basal. Sprayed Acephate 15 days ago with no improvement.',
    aiConfidence: 68,
    aiPreDiagnosis: 'Possible Chilli Leaf Curl & Sucking Pest Complex (Scirtothrips dorsalis / Mites)',
    status: 'resolved_verified',
    createdAt: '2026-10-07 10:30 AM',
    agronomistResponse: {
      expertName: 'Dr. P. Seshagiri Rao, Ph.D. (Plant Pathology)',
      institution: 'Regional Agricultural Research Station (RARS), PJTSAU, Warangal',
      officialDiagnosis:
        'Chilli Leaf Curl & Yellow Mite Severe Infestation Complex (Polyphagotarsonemus latus)',
      prescription: {
        culturalActions: [
          'Immediately install 25 yellow sticky traps and 25 blue sticky traps per acre.',
          'Withhold further nitrogen top-dressing; apply light furrow irrigation to reduce canopy heat stress.',
        ],
        biologicalControl: [
          'Spray 5% Neem Seed Kernel Extract (NSKE) or Neem oil 10,000 ppm @ 2 ml/L directed toward leaf undersides.',
        ],
        chemicalActiveIngredient: 'Diafenthiuron 50% WP OR Spiromesifen 22.9% SC',
        cibrcDosage: '1.25 g/L (Diafenthiuron) OR 1.0 ml/L (Spiromesifen)',
        waitingPeriodDays: 15,
      },
      statutoryWarning:
        'Official PJTSAU Extension Notice: Do not mix with synthetic pyrethroids to avoid secondary pest resurgence. Follow CIB&RC approved pre-harvest interval.',
      signedAt: '2026-10-07 03:45 PM',
    },
  },
  {
    id: 'EXP-8292',
    farmerId: 'f-102',
    farmerName: 'Mallesh Goud',
    phone: '+91 94401 67890',
    district: 'Suryapet',
    mandal: 'Chivvemla',
    cropId: 'paddy',
    cropName: 'Paddy / Rice (వరి)',
    variety: 'BPT 5204 (Samba Mahsuri)',
    images: {
      leafUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600&auto=format&fit=crop&q=80',
    },
    symptomsDescription:
      'Blackish-brown water soaked lesion at panicle neck node just below the earhead during 5% heading stage. Panicle breaking down.',
    fertilizerHistory: 'High urea application (75 kg/acre) without potash balance.',
    aiConfidence: 64,
    aiPreDiagnosis: 'Rice Neck Blast (Magnaporthe oryzae) vs Sheath Rot',
    status: 'under_investigation',
    createdAt: '2026-10-08 09:15 AM',
  },
  {
    id: 'EXP-8293',
    farmerId: 'f-103',
    farmerName: 'K. Venkateswarlu',
    phone: '+91 99892 34567',
    district: 'Guntur',
    mandal: 'Tenali',
    cropId: 'cotton',
    cropName: 'Cotton (ప్రత్తి)',
    variety: 'Bt Hybrid RCH-659',
    images: {
      leafUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&auto=format&fit=crop&q=80',
    },
    symptomsDescription:
      'Rosetted flowers that twist tightly and do not open. Found tiny pinkish caterpillar inside young green boll.',
    fertilizerHistory: 'Standard NPK schedule + micro-nutrient foliar spray last week.',
    aiConfidence: 71,
    aiPreDiagnosis: 'Pink Bollworm (Pectinophora gossypiella)',
    status: 'pending_review',
    createdAt: '2026-10-09 08:00 AM',
  },
];

export function getStoredTickets(): EscalationTicket[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TICKETS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_TICKETS_KEY, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TICKETS;
  }
}

export function saveStoredTickets(tickets: EscalationTicket[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_TICKETS_KEY, JSON.stringify(tickets));
  } catch (e) {
    console.error('Failed to save escalation tickets:', e);
  }
}
