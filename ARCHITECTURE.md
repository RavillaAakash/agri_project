# 🌾 AgriAI Doctor — System Architecture & Design Specification

## 1. High-Level Architecture

The platform bridges Computer Vision, Verified Agronomic RAG, and Farmer Field Telemetry:

```
                            AI AGRICULTURE PLATFORM (AGRI DOCTOR)
                                             +
                       ┌─────────────────────┼─────────────────────┐
                       ↓                     ↓                     ↓
               COMPUTER VISION       AGRICULTURAL          FARM DATA &
              (MULTI-IMAGE CNN)       KNOWLEDGE (RAG)       WEATHER RISK
                       ↓                     ↓                     ↓
                       └─────────────────────┼─────────────────────┘
                                             ↓
                                          AgriAI
                         (Evidence-Grounded Recommendation Engine)
                                             ↓
                                  FARMER DECISION SUPPORT
                               (Telugu / English / Hindi)
```

---

## 2. Multimodal Diagnostic Flow (§17 & §18)

1. **Farmer Input**:
   - Primary close-up leaf lesion / insect photo.
   - Secondary whole-plant context photo.
   - Crop selection (Paddy, Cotton, Chilli).
   - Crop growth stage (Nursery, Tillering, Flowering, Boll/Pod formation).
   - Region / District (Telangana / Andhra Pradesh).

2. **Inference & Decision Logic**:
   - Vision analysis extracts symptom morphology and discoloration patterns.
   - If confidence $\ge$ 80%: High confidence advisory rendered.
   - If confidence between 50% - 79%: Moderate confidence advisory with request for additional angles.
   - If confidence < 50%: Triggers **Human Expert Escalation** ticket (§51).

3. **Grounding Rule (§21 & §22)**:
   - Zero hallucinated chemicals or product dosages.
   - All management guidance strictly extracted from verified ICAR/State University agricultural databases.
   - Cultural and Mechanical control listed first; IPM biological control listed second; approved chemical management provided with statutory labels and waiting periods.

---

## 3. Technology Stack (§39)

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui patterns.
- **Micro-Interactions**: `metal-fx` (chromatic buttons & badges with CSS fallback), `thinking-orbs` (AI reasoning states).
- **3D Agronomic Experience**: Three.js procedural undulating farmland & bio-pollen particle simulation with WebGL2 fallback.
- **Internationalization**: `i18next` with decoupled locale dictionaries (`locales/en.json`, `locales/te.json`, `locales/hi.json`).
- **Backend**: Supabase PostgreSQL with mandatory Row-Level Security (RLS) and storage signed URLs.
