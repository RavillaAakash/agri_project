# 🗄️ Supabase PostgreSQL Database Architecture & Schema Specification

This document details the complete production database structure for the AgriAI Doctor platform, adhering to **Sections 7, 8, 33, 34, 35, 36, and 38** of the Master Prompt.

---

## 1. Entity Groups Overview

```
┌─────────────────────────────────┐      ┌─────────────────────────────────┐
│     AUTHENTICATION & FARMS      │      │       BOTANICAL TAXONOMY        │
├─────────────────────────────────┤      ├─────────────────────────────────┤
│ • profiles                      │      │ • crops                         │
│ • farms                         │      │ • crop_varieties                │
│ • fields                        │      │ • crop_stages                   │
└─────────────────────────────────┘      └─────────────────────────────────┘
                 │                                        │
                 ▼                                        ▼
┌─────────────────────────────────┐      ┌─────────────────────────────────┐
│       DISEASES & PESTS          │      │   IPM, CONTROLS & TREATMENTS    │
├─────────────────────────────────┤      ├─────────────────────────────────┤
│ • diseases / disease_categories │      │ • prevention_methods            │
│ • pests / pest_categories       │      │ • cultural_controls             │
│ • insects / mites / nematodes   │      │ • mechanical_controls           │
│ • nutrient_deficiencies         │      │ • biological_controls           │
│ • abiotic_stresses              │      │ • treatments (chemical + label) │
└─────────────────────────────────┘      └─────────────────────────────────┘
                 │                                        │
                 ▼                                        ▼
┌─────────────────────────────────┐      ┌─────────────────────────────────┐
│     DIAGNOSTICS & TELEMETRY     │      │     PROVENANCE & AUDIT TRAIL    │
├─────────────────────────────────┤      ├─────────────────────────────────┤
│ • diagnosis_sessions            │      │ • agricultural_sources          │
│ • diagnosis_images              │      │ • dataset_sources               │
│ • diagnosis_results             │      │ • model_versions                │
│ • chat_sessions / chat_messages │      │ • audit_logs                    │
│ • expert_requests / responses   │      │ • farmer_feedback               │
└─────────────────────────────────┘      └─────────────────────────────────┘
```

---

## 2. Table Catalog (45 Structured Entities)

### A. Profiles & Farms
* `profiles`: Extends `auth.users` with `preferred_language` (`en`, `te`, `hi`), location (`state`, `district`, `mandal`, `village`), and `role` (`farmer`, `expert`, `admin`).
* `farms`: Agricultural holdings with acreage, district, mandal, and village.
* `fields`: Individual parcels with crop name, variety, planting date, stage, soil, and real-time `health_status` (`good`, `moderate`, `at_risk`).

### B. Crops & Plant Pathology
* `crops`: Core crop catalog (Paddy, Cotton, Chilli, etc.) with Telugu/Hindi local names and favorable climatic windows.
* `crop_varieties`: Registered varieties (e.g., BPT 5204, RCH-659, Teja S17) with duration and disease resistance traits.
* `crop_stages`: Phenological stages (Nursery, Tillering, Panicle Initiation, Boll Development, etc.).
* `diseases`: Categorized pathological infections (fungal, bacterial, viral, oomycete) linked to verified sources.
* `pests`, `insects`, `mites`, `nematodes`, `weeds`: Entomological species with Economic Threshold Levels (ETL) and spread characteristics.
* `nutrient_deficiencies`, `abiotic_stresses`, `physiological_disorders`: Non-infectious stresses and mineral corrections.

### C. Evidence-Based IPM & Statutory Chemical Controls
* `prevention_methods`: Stage-specific cultural prevention protocols.
* `cultural_controls`: Field sanitation, spacing, crop rotation, trap crops.
* `mechanical_controls`: Sticky traps, pheromone traps, light traps, hand rogueing.
* `biological_controls`: Entomopathogens (*Trichoderma*, *Pseudomonas*, *Verticillium*) and parasitoids (*Trichogramma*).
* `treatments`: CIB&RC approved chemical interventions with explicit active ingredients, mandatory waiting periods (pre-harvest interval), and statutory safety disclaimers.

### D. Scientific Provenance & Governance
* `dataset_sources`: Registry of external datasets with licenses, versions, and retrieval dates.
* `agricultural_sources`: Granular institutional citations (ICAR, PJTSAU, ANGRAU) with verification status (`verified`, `unverified`, `pending_review`).
* `model_versions`: Registry of deployed AI vision and RAG models with evaluation metrics (precision, recall, F1, hallucination rate).
* `audit_logs`: Immutable security audit logs recording administrative and critical actions.

---

## 3. Storage Buckets & Policies (§36)

| Bucket Name | Access | File Limit | Allowed MIME Types | Purpose |
|---|---|---|---|---|
| `plant-images` | Private (Signed URLs) | 10 MB | JPEG, PNG, WebP | Field leaf & whole-plant upload artifacts |
| `dataset-images` | Private (Signed URLs) | 10 MB | JPEG, PNG, WebP | Verified training & reference dataset repository |
| `profile-images` | Public CDN | 2 MB | JPEG, PNG, WebP | Farmer & agricultural expert avatars |
| `expert-attachments`| Private (Signed URLs) | 10 MB | JPEG, PNG, WebP, PDF | Lab reports, extension circulars & expert responses |

---

## 4. Row Level Security (RLS) Architecture (§35)

1. **Farmer Data Isolation**:
   - `auth.uid() = farmer_id`: Farmers can read and mutate only their own farms, fields, diagnoses, images, and chat sessions.
2. **Public Read-Only References**:
   - All botanical, disease, pest, symptom, IPM, and source data have `SELECT` open to all, while `INSERT/UPDATE/DELETE` is restricted to authorized platform administrators.
3. **Expert & Admin Protection**:
   - Only users with `role = 'expert'` or `role = 'admin'` can access unassigned expert escalation queues or modify dataset verification statuses.
