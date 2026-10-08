# 🌾 AgriAI Doctor — Intelligent Crop Health, Pest & Farm Advisory Platform

[![Production Standard](https://img.shields.io/badge/Standard-ICAR%20Aligned-10b981.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](#)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](#)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](#)
[![Languages](https://img.shields.io/badge/Languages-English%20%7C%20%E0%B0%A4%E0%B1%86%E0%B0%B2%E0%B1%81%E0%B0%97%E0%B1%81%20%7C%20%E0%A4%B9%E0%A4%BF%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%80-orange.svg)](#)

A production-quality, secure, scalable agricultural decision-support platform designed for Indian farmers (with primary focus on Telangana and Andhra Pradesh), built to expand globally.

---

## 🌟 Key Capabilities

1. **Multimodal AI Crop Diagnosis**:
   - Multi-angle plant image analysis (leaf close-up, whole plant context, stem/fruit).
   - Calibrated confidence scoring (High $\ge 80\%$, Moderate $50\text{--}79\%$, Low $<50\%$).
   - Explicit uncertainty communication & fallback.
2. **Authoritative Agricultural Knowledge Base (RAG)**:
   - Grounded in official protocols from **ICAR**, **PJTSAU** (Telangana), and **ANGRAU** (Andhra Pradesh).
   - **Zero Hallucinated Chemicals**: Active ingredients, waiting periods, and safety warnings strictly verified.
   - **Integrated Pest Management (IPM)**: Cultural and mechanical controls prioritized before chemical intervention.
3. **AgriAI Multilingual Agricultural Chatbot**:
   - Native support for **English**, **Telugu (తెలుగు)**, and **Hindi (हिन्दी)**.
   - Natural understanding of mixed farmer vernacular (e.g. *"My chilli leaves yellow ga unnayi"*).
   - Real-time animated **Thinking Orb** reasoning states (`listening`, `searching`, `solving`, `composing`, `breathing`).
4. **Weather-Aware Microclimate Risk Engine**:
   - Correlates ambient temperature, relative humidity, and precipitation with fungal spore germination triggers.
5. **Farm & Field Management**:
   - Multi-field health tracking, variety tracking, and chronological diagnosis audit trails.
6. **Agronomist & Expert Escalation**:
   - Automated routing of low-confidence or complex necrotic cases to human agricultural specialists.
7. **Original Agricultural 3D Experience**:
   - Three.js procedural undulating farmland furrows with ambient bio-pollen particle movement and WebGL2 fallback.
8. **Premium Micro-Interactions**:
   - `metal-fx` chromatic buttons and badges with graceful CSS fallbacks.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js `v20+` or `v24+`
- npm `v10+`

### 2. Installation
```bash
git clone <repo-url>
cd agri
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Configure your Supabase URL and Anon Key when connecting to your live Supabase backend.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 🏗️ Directory Architecture

```text
src/
├── app/                    # Primary application providers & configuration
├── components/
│   ├── common/             # Header, Footer, LanguageSwitcher
│   ├── ui/                 # MetalButton, ThinkingOrbWrapper, badges
│   └── visual/             # AgriCanvas3D (Three.js terrain simulation)
├── pages/                  # Top-level page routes (Home, Diagnose, Chat, Library, etc.)
├── features/               # Domain feature modules (diagnosis, chatbot, crops, farm, weather)
├── services/               # Supabase client, AI inference client, Weather provider
├── locales/                # Internationalization dictionaries (en.json, te.json, hi.json)
├── types/                  # Strict TypeScript domain interfaces
├── lib/                    # i18n initialization, utilities
└── styles/                 # Global styles
supabase/
└── migrations/             # Idempotent PostgreSQL DDL with RLS policies
```

---

## 🔒 Security & Provenance Standards

- **Row Level Security (RLS)**: Mandatory PostgreSQL RLS on all farmer-specific records.
- **Traceable Provenance**: Every condition stores `source_name`, `source_url`, `license`, `retrieved_at`, and `verification_status`.
- **Statutory Warning**: All agricultural outputs include farmer safety notices to ensure compliance with official product labels.
