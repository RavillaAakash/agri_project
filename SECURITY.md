# 🛡️ SECURITY & ZERO-KNOWLEDGE ARCHITECTURE — AI AGRI DOCTOR

**Platform:** AI Agri Doctor (AgriAI)  
**Security Classification:** Agricultural Decision Support System — High Integrity  
**Applicable Regulations:** CIB&RC (Insecticides Act 1968), Digital Personal Data Protection Act (DPDPA 2023), OWASP Top 10 for LLM Applications  
**Last Audited:** October 2026  

---

## 1. Executive Summary & Threat Model

The AI Agri Doctor platform provides critical agricultural diagnostics, microclimate risk modeling, and pest management advisory for rural farmers and agronomists across Telangana, Andhra Pradesh, and India. The platform's threat model identifies five severe threat categories:

1. **Adversarial Prompt Injection & Jailbreaking (OWASP LLM01)**: Malicious actors attempting to force the AI to recommend banned chemicals, toxic tank mixtures, or disclose internal database credentials.
2. **Credential Exfiltration & Supabase Bypass**: Unauthorized extraction of `service_role` secrets or tampering with Row Level Security (RLS) to modify diagnosis records or farm holdings.
3. **Pesticide Hallucination & Dosage Lethality**: Unverified AI hallucination of unregistered chemicals, dangerous dosages, or omitted Pre-Harvest Intervals (PHI) risking human and pollinator safety.
4. **Storage Traversal & Unauthorized Image Access**: Interception or manipulation of private crop leaf photos or field coordinate metadata.
5. **Denial-of-Service & API Exhaustion**: Bot-driven query flooding draining compute or blocking rural farmers during critical pest outbreaks.

---

## 2. Threat Vector Mitigations

### 2.1 Adversarial Prompt Injection Defense (OWASP LLM01)
- **Input Sanitization (`sanitizeUserInput`)**: Every incoming query is sanitized before reaching the recommendation engine or intent parser.
- **Pattern Interception**: Queries matching adversarial patterns are immediately intercepted:
  ```typescript
  const INJECTION_PATTERNS = [
    /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
    /system\s+prompt/i,
    /you\s+are\s+now\s+a/i,
    /reveal\s+(api\s+key|token|secret|password|database)/i,
    /bypass\s+(rls|security|filters)/i,
    /act\s+as\s+(dan|unrestricted|developer\s+mode)/i,
    /drop\s+table/i,
    /select\s+.*\s+from/i,
    /<script/i,
  ];
  ```
- **Boundary Truncation**: All user inputs are strictly capped at 500 characters, stripping HTML/script entities to prevent buffer and XSS attacks.
- **Security Intercept Response**: Instead of executing or erroring out, flagged queries return a structured educational alert detailing that prompt alteration is blocked by agricultural safety filters.

---

### 2.2 Database Row Level Security (RLS) & Zero Service-Role Exposure
- **Zero Service-Role Secrets in Client**: The client bundle contains **ONLY** the public `VITE_SUPABASE_ANON_KEY`. Under no circumstances is the `SUPABASE_SERVICE_ROLE_KEY` embedded or exposed to the browser.
- **Strict PostgreSQL RLS Policies**:
  - `profiles`: Users can only read and update their own identity records (`auth.uid() = id`).
  - `farms` & `fields`: Farmers can only manage their own field holdings (`auth.uid() = farmer_id`).
  - `diagnosis_sessions`: Authenticated farmers access their own diagnostic sessions; unauthenticated demo users access session logs restricted to ephemeral identifiers.
  - `escalation_tickets`: Farmers can view only tickets originating from their phone/account; registered agronomists (`role = 'expert'`) can access tickets in their assigned jurisdiction.
  - `agricultural_sources` & `diseases`: Publicly readable (`SELECT true`), but strictly read-only for client keys (`INSERT/UPDATE/DELETE` restricted to verified university migration scripts).

---

### 2.3 Storage Security & Private Signed URLs
- **Private Buckets Only**: The `crop-images` Supabase storage bucket is private. Direct unauthenticated public read access is permanently disabled.
- **Short-Lived Signed URLs**: Plant foliage images are retrieved exclusively using cryptographically signed URLs with a **15-minute Time-To-Live (TTL)**.
- **Strict File Upload Validation**:
  - **MIME Type Allowlist**: Restricted strictly to `image/jpeg`, `image/png`, and `image/webp`. Executable files, SVG scripts, or archives are rejected immediately.
  - **Size Cap**: Maximum file size is strictly capped at **10 MB** per image.
  - **Path Traversal Sanitization (`sanitizePath`)**: Replaces directory traversal attempts (`../`, `..\\`) and illegal characters with sanitized UUID tokens.

---

### 2.4 Zero Hallucinated Chemical Advisory Guarantee (§21, §23)
- **Hierarchical IPM Strict Priority**: Chemical controls can **NEVER** be suggested as a primary or standalone solution. The advice strictly follows:
  1. *Cultural & Agronomic Methods* (drainage, spacing, rogueing).
  2. *Mechanical & Physical Methods* (sticky traps, light traps, barrier crops).
  3. *Biological Controls & Biopesticides* (*Pseudomonas fluorescens*, *Trichoderma viride*, NSKE Neem).
  4. *Chemical Controls (Strict Last Resort)*:
     - Must match an active ingredient registered with the **Central Insecticides Board & Registration Committee (CIB&RC)** under the Insecticides Act, 1968.
     - Must provide the exact approved dilution dosage per liter or acre.
     - Must specify the mandatory **Pre-Harvest Interval (PHI / Waiting Period in days)**.
     - Must attach the statutory Personal Protective Equipment (PPE) warning.
- **Deterministic Knowledge Grounding**: AI never synthesizes chemical formulas freely; all chemical recommendations are retrieved deterministically from verified university extension packages.

---

### 2.5 Data Provenance, Licensing & Zero Data Leakage (§3, §4, §5)
- **Authoritative Provenance Citations**: Every diagnostic condition is cited to verified public records:
  - **ICAR-NRRI**: National Rice Research Institute, Cuttack.
  - **ICAR-CICR**: Central Institute for Cotton Research, Nagpur.
  - **PJTSAU**: Prof. Jayashankar Telangana State Agricultural University, Hyderabad.
  - **ANGRAU**: Acharya N. G. Ranga Agricultural University, Guntur.
- **Strict Licensing Compliance**: All ingested images and text data are verified for government open agricultural distribution licensing (`DATASET_LICENSES.md`).
- **Field-Aware Data Split (0.00% Leakage)**: Training and evaluation pipelines implement `fieldAwareGroupSplit`, ensuring all images from a specific field or session remain together, guaranteeing zero data leakage.

---

### 2.6 Client Rate Limiting & Anti-Abuse (`rateLimiter.ts`)
- Implements a client-side sliding-window rate limiter allowing a maximum of **20 queries or diagnostic inferences per minute**.
- Prevents script-based scraping, rapid bot requests, and denial-of-service on local and remote inferencing engines.

---

## 3. Statutory Safety Disclaimer

> [!CAUTION]
> **Statutory Agricultural Notice**: AI Agri Doctor is an evidence-backed decision support aid designed to assist farmers and agronomists. It does not replace field physical inspection by a certified agricultural officer. Farmers must verify chemical container labels approved by the CIB&RC and consult their local Mandal Agricultural Officer (MAO) or Rythu Vedika representative prior to high-volume chemical applications.

---

## 4. Vulnerability Disclosure Protocol
If a security vulnerability, prompt bypass, or data integrity issue is identified, please report it to `security@agriai.telangana-rythu.org`. Reports receive an initial assessment within 24 hours.
