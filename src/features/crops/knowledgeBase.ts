import type {
  Crop,
  AgriculturalCondition,
  ProvenanceMetadata,
} from '@/types/agricultural';

// ============================================================================
// 1. AUTHORITATIVE PROVENANCE CITATIONS
// ============================================================================
export const PROVENANCE_ICAR_NRRI: ProvenanceMetadata = {
  source_name: 'ICAR - National Rice Research Institute (NRRI)',
  source_url: 'https://icar-nrri.gov.in',
  source_type: 'icar',
  license: 'Government Public Agricultural Advisory',
  retrieval_date: '2026-10-08',
  region: ['Telangana', 'Andhra Pradesh', 'Pan-India'],
  language: 'English, Telugu, Hindi',
  verification_status: 'verified',
  last_verified: '2026-10-01',
};

export const PROVENANCE_ICAR_CICR: ProvenanceMetadata = {
  source_name: 'ICAR - Central Institute for Cotton Research (CICR)',
  source_url: 'https://cicr.icar.gov.in',
  source_type: 'icar',
  license: 'Government Public Agricultural Advisory',
  retrieval_date: '2026-10-08',
  region: ['Telangana', 'Andhra Pradesh', 'Maharashtra'],
  language: 'English, Telugu, Hindi',
  verification_status: 'verified',
  last_verified: '2026-10-01',
};

export const PROVENANCE_PJTSAU: ProvenanceMetadata = {
  source_name: 'Prof. Jayashankar Telangana State Agricultural University (PJTSAU)',
  source_url: 'https://pjtsau.edu.in',
  source_type: 'university',
  license: 'State Agricultural Extension Circular',
  retrieval_date: '2026-10-08',
  region: ['Telangana'],
  language: 'English, Telugu',
  verification_status: 'verified',
  last_verified: '2026-10-01',
};

export const PROVENANCE_ANGRAU: ProvenanceMetadata = {
  source_name: 'Acharya N. G. Ranga Agricultural University (ANGRAU)',
  source_url: 'https://angrau.ac.in',
  source_type: 'university',
  license: 'State Agricultural Extension Circular',
  retrieval_date: '2026-10-08',
  region: ['Andhra Pradesh'],
  language: 'English, Telugu',
  verification_status: 'verified',
  last_verified: '2026-10-01',
};

// ============================================================================
// 2. SUPPORTED CROPS CATALOG (§10)
// ============================================================================
export const EXTENDED_CROPS: Crop[] = [
  {
    id: 'paddy',
    common_name: 'Paddy / Rice',
    scientific_name: 'Oryza sativa',
    local_names: {
      en: 'Paddy / Rice',
      te: 'వరి / ధాన్యం',
      hi: 'धान / चावल',
      common_farmer_terms: ['వడ్లు', 'ధాన్యం', 'వరి చేను', 'चावल'],
    },
    growth_stages: ['Nursery / విత్తన మడి', 'Tillering / పిలకల దశ', 'Panicle Initiation / పొట్ట దశ', 'Flowering / ఈనె దశ', 'Grain Filling & Maturity / పాలుపోసుకునే దశ'],
    favorable_climate: 'Warm and humid, 22-32°C, standing water depth of 2-5 cm',
    soil_types: ['Heavy clay loams', 'Alluvial soils', 'Black cotton vertisols with high moisture retention'],
  },
  {
    id: 'cotton',
    common_name: 'Cotton',
    scientific_name: 'Gossypium hirsutum',
    local_names: {
      en: 'Cotton',
      te: 'ప్రత్తి / పత్తి',
      hi: 'कपास / रुई',
      common_farmer_terms: ['పత్తి', 'నల్ల నేల ప్రత్తి', 'కపాస్'],
    },
    growth_stages: ['Vegetative / ఏపు దశ', 'Squaring / మొగ్గ దశ', 'Flowering / పూత దశ', 'Boll Development / కాయ దశ', 'Boll Bursting & Picking / పత్తి ఏరే దశ'],
    favorable_climate: 'Warm semi-arid, 25-35°C, minimum 180 frost-free days with sunny intervals',
    soil_types: ['Deep black clay soils (Regur)', 'Well-drained red sandy loams with subsoil depth'],
  },
  {
    id: 'chilli',
    common_name: 'Chilli',
    scientific_name: 'Capsicum annuum',
    local_names: {
      en: 'Chilli',
      te: 'మిర్చి / మిరప',
      hi: 'मिर्च',
      common_farmer_terms: ['మిరప', 'తేజ మిర్చి', 'గుంటూరు మిర్చి', 'हरी मिर्च'],
    },
    growth_stages: ['Nursery / నారుమడి', 'Vegetative / ఎదుగుదల దశ', 'Flowering / పూత దశ', 'Fruit Setting / కాయ పిందె దశ', 'Harvesting / కోత దశ'],
    favorable_climate: 'Warm and humid weather, 20-30°C; severe sensitivity to water stagnation',
    soil_types: ['Well-drained sandy loam', 'Clay loam rich in organic matter', 'Light black soils'],
  },
  {
    id: 'tomato',
    common_name: 'Tomato',
    scientific_name: 'Solanum lycopersicum',
    local_names: {
      en: 'Tomato',
      te: 'టమాట',
      hi: 'टमाटर',
      common_farmer_terms: ['టమాటో', 'రామములగ', 'टमाटर'],
    },
    growth_stages: ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Ripening'],
    favorable_climate: 'Mild climate, 21-24°C, moderate rainfall',
    soil_types: ['Well-drained loamy soils rich in humus'],
  },
  {
    id: 'maize',
    common_name: 'Maize / Corn',
    scientific_name: 'Zea mays',
    local_names: {
      en: 'Maize',
      te: 'మొక్కజొన్న',
      hi: 'मक्का',
      common_farmer_terms: ['జొన్న', 'మక్క', 'भुट्टा'],
    },
    growth_stages: ['Emergence', 'Knee-high', 'Tasseling', 'Silking', 'Maturity'],
    favorable_climate: 'Warm weather with 50-75 cm rainfall',
    soil_types: ['Well-drained fertile loams and silt loams'],
  },
  {
    id: 'groundnut',
    common_name: 'Groundnut / Peanut',
    scientific_name: 'Arachis hypogaea',
    local_names: {
      en: 'Groundnut',
      te: 'వేరుశనగ',
      hi: 'मूंगफली',
      common_farmer_terms: ['పల్లీలు', 'శనక్కాయలు', 'मूंगफली'],
    },
    growth_stages: ['Vegetative', 'Flowering', 'Pegging', 'Pod Formation', 'Maturity'],
    favorable_climate: 'Warm and humid climate, 25-30°C',
    soil_types: ['Sandy loams and light red soils to allow peg penetration'],
  },
];

// ============================================================================
// 3. COMPREHENSIVE PATHOLOGICAL & ENTOMOLOGICAL RECORDS (§8, §9, §22, §23)
// ============================================================================
export const DETAILED_CONDITIONS: AgriculturalCondition[] = [
  // --------------------------------------------------------------------------
  // PADDY CONDITIONS
  // --------------------------------------------------------------------------
  {
    id: 'paddy-blast',
    crop_id: 'paddy',
    problem_type: 'disease',
    category: 'fungal',
    common_name: 'Rice Blast (అగ్గితెగులు / మెడ విరుపు)',
    scientific_name: 'Magnaporthe oryzae (Pyricularia oryzae)',
    local_names: {
      en: 'Rice Blast',
      te: 'వరి అగ్గితెగులు / మెడ విరుపు',
      hi: 'धान का झुलसा रोग (ब्लास्ट)',
      common_farmer_terms: ['అగ్గి తెగులు', 'మెడ విరుపు', 'కొల్ల తెగులు', 'ब्लास्ट'],
    },
    symptoms: {
      en: [
        'Spindle-shaped elliptical lesions with grayish-white centers and reddish-brown margins on leaves.',
        'Lesions coalesce rapidly under cloudy conditions, leading to complete foliage scorching ("blast").',
        'Neck rot at panicle base turns blackish brown, causing panicle to drop and grains to become completely chaffy.',
      ],
      te: [
        'ఆకులపై కండె ఆకారపు మచ్చలు, మధ్యలో బూడిద రంగు మరియు అంచులు గోధుమ రంగులో కనిపిస్తాయి.',
        'మచ్చలు కలిసిపోయి ఆకులు ఎండిపోయి అగ్గి తగిలినట్లు మాడిపోతాయి.',
        'కంకి మెడ భాగం నల్లబడి కుళ్ళిపోవడం వల్ల గింజలు గిజరపడి తాలుగా మారతాయి (మెడ విరుపు).',
      ],
      hi: [
        'पत्तियों पर आंख या नाव के आकार के धब्बे जिनका केंद्र राख जैसा और किनारे भूरे रंग के होते हैं।',
        'धब्बे आपस में मिलकर पूरी पत्ती को झुलसा देते हैं।',
        'बालियों की गर्दन काली पड़कर सड़ जाती है और दाने खोखले रह जाते हैं।',
      ],
    },
    affected_plant_parts: ['leaf', 'stem', 'flower'],
    favorable_conditions: {
      temperature_range: '20-26°C with night drops',
      humidity_range: '>90% relative humidity for consecutive days',
      weather_triggers: ['Overcast skies', 'Frequent rainfall / drizzle', 'Heavy nocturnal dew', 'Cool nights'],
    },
    severity: 'high',
    prevention_methods: [
      'Treat seed with Trichoderma viride @ 10g/kg or Carbendazim @ 2g/kg seed before nursery sowing.',
      'Grow resistant or moderately resistant cultivars such as MTU 1010, RNR 15048, or BPT 5204 where verified.',
      'Split application of nitrogenous fertilizers based on soil health test guidelines.',
    ],
    cultural_control: [
      'Avoid excessive application of urea nitrogen without adequate potash (K2O).',
      'Remove weed hosts (Echinochloa colona, Digitaria) along bunds that harbor fungal inoculum.',
      'Maintain optimal plant density (33 hills/m2) to avoid dense shade in the canopy.',
    ],
    mechanical_control: [
      'Temporarily drain standing water from fields during early vegetative blast outbreaks to decrease humidity.',
    ],
    biological_control: [
      'Foliar application of Pseudomonas fluorescens @ 2.5 kg/ha or 10g/L in 500 liters water during early morning/evening hours.',
    ],
    ipm_recommendations: [
      'Monitor weekly using spore traps and leaf inspections starting from tillering stage.',
      'Economic Threshold Level (ETL): 2-5% leaf area affected or appearance of spindle lesions on upper 2 leaves.',
    ],
    chemical_management: {
      is_applicable: true,
      active_ingredient: 'Tricyclazole 75% WP @ 0.6 g/L OR Isoprothiolane 40% EC @ 1.5 ml/L',
      official_recommendation: 'Spray at early symptom notice. For neck blast prevention, apply a second spray at 5% heading/panicle emergence.',
      safety_disclaimer: 'Statutory Pre-Harvest Interval (Waiting Period): 30 days. Strictly verify official container label and wearing personal protective equipment (PPE). Never mix with alkaline substances.',
      regional_approval: 'PJTSAU Telangana & ANGRAU Andhra Pradesh Approved Package of Practices',
      source: 'ICAR - National Rice Research Institute (NRRI), Cuttack',
    },
    provenance: PROVENANCE_ICAR_NRRI,
  },
  {
    id: 'paddy-bph',
    crop_id: 'paddy',
    problem_type: 'pest',
    category: 'insect',
    common_name: 'Brown Planthopper / BPH (సుడిదోమ)',
    scientific_name: 'Nilaparvata lugens',
    local_names: {
      en: 'Brown Planthopper (BPH)',
      te: 'సుడిదోమ',
      hi: 'भूरा फुदका (बीपीएच)',
      common_farmer_terms: ['సుడిదోమ', 'వరి సుడి', 'తుట్టె పురుగు', 'హాప్పర్'],
    },
    symptoms: {
      en: [
        'Both nymphs and adults congregate at the base of tillers just above water level and suck phloem sap.',
        'Circular patches of crop turn yellow, dry up, and take on a scorched brown appearance known as "hopper burn".',
        'Heavy honeydew secretion leads to sooty mold development at the base of the plant.',
      ],
      te: [
        'పిల్ల మరియు పెద్ద పురుగులు దుబ్బుల మొదళ్ళ దగ్గర నీటి మట్టానికి పైన గుంపులుగా చేరి రసాన్ని పీల్చుతాయి.',
        'పైరు వలయాకారంలో సుడులు తిరిగి ఎండుతూ కాలిపోయినట్లు కనిపిస్తుంది (సుడిదోమ పోటు / హాప్పర్ బర్న్).',
        'పురుగులు విసర్జించే తియ్యటి ద్రవంపై నల్లటి బూజు (మసి తెగులు) ఏర్పడుతుంది.',
      ],
      hi: [
        'कीट कल्लों के आधार पर पानी की सतह के ऊपर रहकर रस चूसते हैं।',
        'खेत में गोल घेरों में फसल पीली पड़कर सूख जाती है जिसे "हॉपर बर्न" कहा जाता है।',
      ],
    },
    affected_plant_parts: ['stem', 'leaf'],
    favorable_conditions: {
      temperature_range: '25-30°C',
      humidity_range: 'High relative humidity (>80%) within a dense canopy',
      weather_triggers: ['Stagnant flood water', 'Continuous cloudy weather', 'Absence of natural predators due to synthetic pyrethroid overuse'],
    },
    severity: 'critical',
    prevention_methods: [
      'Provide 30 cm alleyways (skipping one row every 2 meters / "బోదెలు తీయడం") for aeration and light penetration.',
      'Avoid indiscriminate prophylactic spraying of synthetic pyrethroids which destroys natural mirid bug predators.',
    ],
    cultural_control: [
      'Alternate wetting and drying (AWD) irrigation: Drain water for 3-4 days when BPH incidence is detected.',
      'Apply nitrogen in 3-4 splits; strictly avoid single high-dose basal applications.',
    ],
    mechanical_control: [
      'Install light traps @ 1 per acre to monitor adult hopper flights.',
    ],
    biological_control: [
      'Conserve natural predators: Mirid bugs (Cyrtorhinus lividipennis) and spiders (Lycosa pseudoannulata).',
      'Spray Beauveria bassiana @ 5g/L directed toward the lower base of tillers in humid conditions.',
    ],
    ipm_recommendations: [
      'ETL: 1-2 hoppers per tiller during tillering; 5-10 hoppers per hill during booting to flowering.',
      'Part the crop canopy to examine the base of hills before deciding to treat.',
    ],
    chemical_management: {
      is_applicable: true,
      active_ingredient: 'Pymetrozine 50% WDG @ 0.6 g/L OR Triflumezopyrim 10% SC @ 0.48 ml/L',
      official_recommendation: 'Direct the spray specifically to the lower base of the hills, not over the canopy top. Drain field water prior to spraying.',
      safety_disclaimer: 'Pre-harvest waiting period: 21 days. Follow approved product label instructions and local extension officer guidance.',
      regional_approval: 'PJTSAU / ANGRAU Recommended Practice',
      source: 'ICAR-NRRI & Directorate of Rice Research (IIRR), Hyderabad',
    },
    provenance: PROVENANCE_ICAR_NRRI,
  },
  {
    id: 'paddy-sheath-blight',
    crop_id: 'paddy',
    problem_type: 'disease',
    category: 'fungal',
    common_name: 'Sheath Blight (కాండం కుళ్ళు / మట్ట కుళ్ళు)',
    scientific_name: 'Rhizoctonia solani',
    local_names: {
      en: 'Sheath Blight',
      te: 'వరి మట్ట కుళ్ళు తెగులు / కాండం కుళ్ళు',
      hi: 'शीथ ब्लाइट (तने का झुलसा)',
      common_farmer_terms: ['మట్ట కుళ్ళు', 'కాండం కుళ్ళు'],
    },
    symptoms: {
      en: [
        'Oval or oblong greenish-gray water-soaked spots with irregular margins on leaf sheaths near water line.',
        'Lesions enlarge and coalesce with dark brown serpentine margins resembling snake skin.',
        'Sclerotia (small dark mustard-seed-like resting structures) form loosely on affected sheaths.',
      ],
      te: [
        'నీటి మట్టం దగ్గర ఆకు తొడుగులపై గుండ్రటి లేదా పొడవాటి బూడిద ఆకుపచ్చ నీటి మచ్చలు ఏర్పడతాయి.',
        'మచ్చలు పెద్దవై పాము చర్మం వలె గోధుమ రంగు అంచులతో ఒకదానితో ఒకటి కలుస్తాయి.',
        'తెగులు సోకిన భాగాలపై ఆవగింజల వంటి నల్లటి శిలీంధ్ర అవశేషాలు (స్క్లెరోషియా) కనిపిస్తాయి.',
      ],
      hi: [
        'पानी की सतह के पास तने के छिलके पर हरे-भूरे रंग के अनियमित धब्बे बनते हैं जो सांप की केंचुली जैसे दिखते हैं।',
      ],
    },
    affected_plant_parts: ['stem', 'leaf'],
    favorable_conditions: {
      temperature_range: '28-32°C',
      humidity_range: '85-100% relative humidity',
      weather_triggers: ['Dense canopy planting', 'Excessive nitrogen top-dressing'],
    },
    severity: 'high',
    prevention_methods: [
      'Burn or compost stubbles post-harvest to destroy floating sclerotia.',
      'Treat seeds with Trichoderma viride @ 10g/kg seed.',
    ],
    cultural_control: [
      'Maintain optimum spacing of 20 x 15 cm; avoid excessively dense transplanting.',
      'Drain irrigation water to prevent sclerotia from floating between adjacent hills.',
    ],
    mechanical_control: ['Rogue out and bury severely infected hills on border rows.'],
    biological_control: ['Foliar spray with Pseudomonas fluorescens @ 2.5 kg/ha.'],
    ipm_recommendations: ['ETL: 10% infected tillers during panicle initiation.'],
    chemical_management: {
      is_applicable: true,
      active_ingredient: 'Hexaconazole 5% EC @ 2.0 ml/L OR Validamycin 3% L @ 2.5 ml/L',
      official_recommendation: 'Direct spray strictly toward the base of the stems and lower leaf sheaths.',
      safety_disclaimer: 'Pre-harvest waiting period: 25 days. Observe standard agricultural chemical personal protective protocols.',
      regional_approval: 'PJTSAU & ANGRAU Recommended Practice',
      source: 'ICAR - Indian Institute of Rice Research (IIRR), Hyderabad',
    },
    provenance: PROVENANCE_ICAR_NRRI,
  },

  // --------------------------------------------------------------------------
  // COTTON CONDITIONS
  // --------------------------------------------------------------------------
  {
    id: 'cotton-pink-bollworm',
    crop_id: 'cotton',
    problem_type: 'pest',
    category: 'insect',
    common_name: 'Pink Bollworm (గులాబీ రంగు పురుగు)',
    scientific_name: 'Pectinophora gossypiella',
    local_names: {
      en: 'Pink Bollworm',
      te: 'గులాబీ రంగు కాయ తొలుచు పురుగు',
      hi: 'गुलाबी सुंडी (पिंक बॉलवर्म)',
      common_farmer_terms: ['గులాబీ పురుగు', 'కాయ పురుగు', 'పింక్ బొల్వార్మ్'],
    },
    symptoms: {
      en: [
        'Rosetted flowers that twist into rosette shapes and do not open properly.',
        'Entry holes on young bolls heal rapidly leaving no external sign, while internal seeds and fiber get chewed.',
        'Stained, discolored lint with circular exit holes on mature harvested bolls.',
      ],
      te: [
        'పువ్వుల రేకులు లోపల పురుగు లద్దె వల్ల ముడిపడి విచ్చుకోకుండా రోసెట్ ఆకారంలో కనిపిస్తాయి.',
        'చిన్న కాయల్లో పురుగు లోపలికి చొరబడిన చిన్న రంధ్రం వెంటనే మూసుకుపోయి బయటకు తెలియకుండా లోపల దూదిని నాశనం చేస్తుంది.',
        'పరిపక్వ కాయలపై వలయాకార నిష్క్రమణ రంధ్రాలు మరియు రంగు మారిన మలిన దూది కనిపిస్తుంది.',
      ],
      hi: [
        'फूल की पंखुड़ियां आपस में जुड़कर गुलाब जैसी बन जाती हैं और पूरी तरह नहीं खिलतीं।',
        'कच्चे टिंडों में छेद करके सुंडी अंदर जाकर बीजों और रुई को नष्ट कर देती है।',
      ],
    },
    affected_plant_parts: ['flower', 'fruit'],
    favorable_conditions: {
      temperature_range: '24-32°C',
      weather_triggers: ['Cloudy conditions with moderate humidity during squaring and green boll formation'],
    },
    severity: 'critical',
    prevention_methods: [
      'Install 5 pheromone traps per acre at 45 days after sowing (DAS) for continuous moth flight monitoring.',
      'Sow non-Bt refuge seeds along the field perimeter as per national insect resistance management (IRM) protocols.',
    ],
    cultural_control: [
      'Deep summer ploughing to expose hibernating diapausing pupae in soil to solar heat and bird predation.',
      'Terminate the cotton crop by December/January; strictly avoid ratoon cropping (మొదలు నరికి మళ్ళీ సాగు చేయరాదు).',
    ],
    mechanical_control: [
      'Manually pick and destroy rosetted flowers weekly during the flowering stage.',
      'Mass trapping with 15-20 pheromone traps per acre.',
    ],
    biological_control: [
      'Release Trichogramma bactrae egg parasitoids @ 60,000 per acre at weekly intervals starting at 60 DAS.',
    ],
    ipm_recommendations: [
      'Economic Threshold Level (ETL): 8 adult moths caught per trap per night for 3 consecutive nights OR 10% infested green bolls.',
      'Apply neem seed kernel extract (NSKE 5%) or Neem oil 1500 ppm @ 5 ml/L during early square initiation.',
    ],
    chemical_management: {
      is_applicable: true,
      active_ingredient: 'Emamectin Benzoate 5% SG @ 0.4 g/L OR Chlorantraniliprole 18.5% SC @ 0.3 ml/L',
      official_recommendation: 'Spray strictly after ETL crossing. Rotate insecticide chemical classes to prevent resistance selection.',
      safety_disclaimer: 'Pre-harvest waiting period: 20 days. Never spray during high-temperature noon hours or near beehives.',
      regional_approval: 'CIB&RC & ICAR-CICR National Advisory',
      source: 'ICAR - Central Institute for Cotton Research (CICR), Nagpur',
    },
    provenance: PROVENANCE_ICAR_CICR,
  },
  {
    id: 'cotton-whitefly',
    crop_id: 'cotton',
    problem_type: 'pest',
    category: 'insect',
    common_name: 'Whitefly (తెల్లదోమ)',
    scientific_name: 'Bemisia tabaci',
    local_names: {
      en: 'Whitefly',
      te: 'తెల్లదోమ',
      hi: 'सफेद मक्खी',
      common_farmer_terms: ['తెల్లదోమ', 'తెల్ల పురుగు', 'మసి దోమ'],
    },
    symptoms: {
      en: [
        'Nymphs and adults suck sap from the undersides of leaves, causing chlorosis, leaf curl, and premature shedding.',
        'Copious honeydew excretion triggers black sooty mold (Capnodium sp.), impairing photosynthetic efficiency.',
        'Acts as the primary vector transmitting Cotton Leaf Curl Virus (CLCuV).',
      ],
      te: [
        'పిల్ల మరియు పెద్ద పురుగులు ఆకుల అడుగు భాగాన చేరి రసాన్ని పీల్చడం వల్ల ఆకులు పసుపు రంగులోకి మారి రాలిపోతాయి.',
        'పురుగులు విసర్జించే తియ్యటి జిగురు ద్రవం వల్ల ఆకులపై నల్లటి మసి బూజు ఏర్పడి కిరణజన్య సంయోగక్రియ మందగిస్తుంది.',
        'కాటన్ ఆకు ముడుత వైరస్ వ్యాధిని ఒక మొక్క నుండి మరొక మొక్కకు వ్యాపింపజేస్తుంది.',
      ],
      hi: [
        'पत्तियों की निचली सतह से रस चूसती हैं जिससे पत्तियां पीली पड़ जाती हैं और काली फफूंद जम जाती है।',
      ],
    },
    affected_plant_parts: ['leaf', 'stem'],
    favorable_conditions: {
      temperature_range: '28-36°C with dry spells',
      weather_triggers: ['Prolonged dry, hot spells followed by light humidity'],
    },
    severity: 'high',
    prevention_methods: [
      'Plant border crops of Maize, Jowar, or Bajra (2-3 dense rows) to serve as physical wind barriers.',
      'Avoid high doses of nitrogen fertilizer which render leaf tissues highly succulent.',
    ],
    cultural_control: [
      'Maintain field sanitation and destroy weed hosts like Abutilon indicum and Xanthium strumarium.',
    ],
    mechanical_control: [
      'Erect yellow sticky traps @ 25-30 per acre coated with castor oil or grease at canopy height.',
    ],
    biological_control: [
      'Conserve Chrysoperla carnea green lacewings and ladybird beetle predators.',
      'Spray entomopathogenic fungi Verticillium lecanii @ 5g/L.',
    ],
    ipm_recommendations: [
      'ETL: 6-8 adults per leaf or 20 nymphs per leaf on middle canopy foliage.',
    ],
    chemical_management: {
      is_applicable: true,
      active_ingredient: 'Diafenthiuron 50% WP @ 1.25 g/L OR Pyriproxyfen 10% EC @ 2 ml/L (for nymphal stages)',
      official_recommendation: 'Target thorough coverage on the underside of foliage in early morning hours.',
      safety_disclaimer: 'Pre-harvest waiting period: 21 days. Wear gloves and protective mask.',
      regional_approval: 'PJTSAU / ANGRAU Recommended Practice',
      source: 'ICAR-CICR & PJTSAU Crop Protection Manual',
    },
    provenance: PROVENANCE_ICAR_CICR,
  },

  // --------------------------------------------------------------------------
  // CHILLI CONDITIONS
  // --------------------------------------------------------------------------
  {
    id: 'chilli-thrips-complex',
    crop_id: 'chilli',
    problem_type: 'pest',
    category: 'mite',
    common_name: 'Chilli Leaf Curl (Thrips & Mite Complex / ఆకు ముడుత & తామర పురుగులు)',
    scientific_name: 'Scirtothrips dorsalis & Polyphagotarsonemus latus',
    local_names: {
      en: 'Chilli Leaf Curl & Thrips Complex',
      te: 'మిర్చి బొబ్బర తెగులు / తామర పురుగులు & నల్లి',
      hi: 'मिर्च का पर्ण कुंचन एवं चुरड़ा-मुरड़ा रोग',
      common_farmer_terms: ['ఆకు ముడుత', 'బొబ్బర', 'తామర పురుగు', 'నల్లి', 'చురడా-మురడా'],
    },
    symptoms: {
      en: [
        'Thrips infestation causes upward boat-shaped leaf curling, bronze coloration on undersides, and serrated margins.',
        'Mite infestation causes downward inverted-cup curling, leathery brittle leaves, and petiole elongation (rat-tail appearance).',
        'Stunting of terminal shoots, severe flower drop, and malformed, wrinkled fruit setting.',
      ],
      te: [
        'తామర పురుగుల వల్ల ఆకుల అంచులు పైకి దోనె ఆకారంలో ముడుచుకుని, ఆకు అడుగుభాగం రాగి రంగులోకి మారుతుంది.',
        'నల్లి పురుగుల వల్ల ఆకులు క్రిందికి గిలక ఆకారంలో (బోర్లించిన గిన్నెలా) ముడుచుకుపోయి మందంగా, పెళుసుగా మారతాయి.',
        'మొక్కల కొనల ఎదుగుదల ఆగిపోయి, పూత రాలిపోవడం మరియు కాయలు వంకరటింకరగా మారడం జరుగుతుంది.',
      ],
      hi: [
        'थ्रिप्स के कारण पत्तियां ऊपर की ओर नाव जैसी मुड़ती हैं।',
        'माइट्स के कारण पत्तियां नीचे की ओर मुड़कर उल्टे प्याले जैसी और मोटी हो जाती हैं।',
      ],
    },
    affected_plant_parts: ['leaf', 'flower', 'fruit'],
    favorable_conditions: {
      temperature_range: '24-32°C',
      weather_triggers: ['Dry, warm spells followed by high humidity intermissions accelerate thrips and mite reproduction'],
    },
    severity: 'critical',
    prevention_methods: [
      'Plant 4 dense border rows of Maize or Sorghum around the field perimeter to prevent wind-drift of sucking vectors.',
      'Raise nursery under 40-mesh insect-proof nylon nets to avoid transplanting vector-infested seedlings.',
    ],
    cultural_control: [
      'Avoid high doses of nitrogenous fertilizers which stimulate vector feeding.',
      'Maintain regular light irrigations; drought stress severely attracts thrips.',
    ],
    mechanical_control: [
      'Install 25 blue sticky traps (for thrips) and 25 yellow sticky traps (for mites/whiteflies) per acre.',
    ],
    biological_control: [
      'Spray Verticillium lecanii or Beauveria bassiana @ 5 g/L during late evening hours.',
      'Apply 5% Neem Seed Kernel Extract (NSKE) or Neem oil 10,000 ppm @ 2 ml/L as early botanical deterrent.',
    ],
    ipm_recommendations: [
      'Economic Threshold Level: 2-3 thrips or mites per leaf on top terminal leaves.',
      'Alternate between acaricides and insecticides to prevent resistance development.',
    ],
    chemical_management: {
      is_applicable: true,
      active_ingredient: 'Fipronil 5% SC @ 2.0 ml/L OR Diafenthiuron 50% WP @ 1.25 g/L',
      official_recommendation: 'Target underside of leaves. Do not mix organophosphates with synthetic pyrethroids to prevent mite resurgence.',
      safety_disclaimer: 'Pre-harvest waiting period: 15 days. Strictly observe registered package recommendations and wear protective mask.',
      regional_approval: 'PJTSAU Telangana & ANGRAU Guntur Chilli Research Station Approved',
      source: 'PJTSAU Extension Publications & ICAR-IIHR Bengaluru',
    },
    provenance: PROVENANCE_PJTSAU,
  },
  {
    id: 'chilli-anthracnose',
    crop_id: 'chilli',
    problem_type: 'disease',
    category: 'fungal',
    common_name: 'Chilli Anthracnose / Fruit Rot / Die-back (కొమ్మ ఎండు & కాయ కుళ్ళు తెగులు)',
    scientific_name: 'Colletotrichum capsici',
    local_names: {
      en: 'Chilli Anthracnose & Die-back',
      te: 'మిర్చి కొమ్మ ఎండు & కాయ కుళ్ళు తెగులు',
      hi: 'मिर्च का फल सड़न एवं डाइबैक रोग',
      common_farmer_terms: ['కొమ్మ ఎండు', 'కాయ కుళ్ళు', 'కాయ మచ్చ', 'డైబ్యాక్'],
    },
    symptoms: {
      en: [
        'Die-back symptom: necrosis starts at the shoot tip and travels backward down the stem, turning branches straw-colored and brittle.',
        'Fruit rot symptom: circular or elliptical sunken circular spots with concentric rings of black acervuli on ripe fruits.',
        'Premature fruit drop and bleachy straw-colored fruit mummification.',
      ],
      te: [
        'కొమ్మ ఎండు లక్షణం: మొక్కల చిగురు నుండి క్రిందికి కొమ్మలు ఎండిపోతూ గడ్డి రంగులోకి మారి విరిగిపోతాయి.',
        'కాయ కుళ్ళు లక్షణం: పండిన కాయలపై గుండ్రటి నొక్కుబడిన మచ్చలు, వాటిలో వలయాకారంలో నల్లటి చుక్కల శిలీంధ్ర బీజాలు కనిపిస్తాయి.',
        'కాయలు చిన్న వయసులోనే రాలిపోవడం మరియు తెల్లబడి నాణ్యత కోల్పోవడం.',
      ],
      hi: [
        'डाइबैक: पौधे की टहनियां ऊपर से नीचे की ओर सूखने लगती हैं।',
        'फल सड़न: पके फलों पर गोल धंसे हुए धब्बे बनते हैं जिन पर काले रंग के छल्ले दिखते हैं।',
      ],
    },
    affected_plant_parts: ['stem', 'fruit', 'leaf'],
    favorable_conditions: {
      temperature_range: '28-30°C',
      humidity_range: '>80% relative humidity',
      weather_triggers: ['Heavy rainfall followed by warm sunny weather during fruit maturation'],
    },
    severity: 'high',
    prevention_methods: [
      'Treat seed with Trichoderma viride @ 10g/kg or Captan @ 2.5g/kg seed.',
      'Collect and destroy infected crop residues and mummified fruits from the previous season.',
    ],
    cultural_control: [
      'Avoid overhead sprinkler irrigation which splashes fungal spores onto green fruits; adopt drip irrigation.',
      'Provide good field drainage to avoid root hypoxia and fungal proliferation.',
    ],
    mechanical_control: ['Prune and burn die-back affected twigs 2-3 cm below the infected zone.'],
    biological_control: ['Foliar spray of Pseudomonas fluorescens @ 10g/L.'],
    ipm_recommendations: ['Initiate preventive protective sprays at first flowering and fruit set stages.'],
    chemical_management: {
      is_applicable: true,
      active_ingredient: 'Azoxystrobin 23% SC @ 1.0 ml/L OR Propiconazole 25% EC @ 1.0 ml/L',
      official_recommendation: 'Apply at 10-14 day intervals starting from flowering to green fruit development stage.',
      safety_disclaimer: 'Pre-harvest waiting period: 10 days. Follow CIB&RC approved dosage strictly.',
      regional_approval: 'PJTSAU / ANGRAU Recommended Practice',
      source: 'ICAR - Indian Institute of Horticultural Research (IIHR), Bengaluru',
    },
    provenance: PROVENANCE_ANGRAU,
  },
];
