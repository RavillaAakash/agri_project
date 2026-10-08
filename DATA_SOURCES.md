# 📚 Agricultural Data Sources, Provenance & Licensing Registry

The AgriAI Doctor platform strictly forbids random internet scraping or unverified information generation. Every agronomic advisory record must carry traceable scientific provenance.

---

## 1. Primary Authoritative Research Institutions

| Source Code | Institution | Region / Jurisdiction | Advisory Focus | Verification Status |
|---|---|---|---|---|
| `ICAR-NRRI` | ICAR - National Rice Research Institute, Cuttack | Pan-India | Rice Blast, Brown Planthopper, Sheath Blight | **VERIFIED** |
| `ICAR-CICR` | ICAR - Central Institute for Cotton Research, Nagpur | Pan-India / South Zone | Pink Bollworm, Whitefly, Bacterial Blight | **VERIFIED** |
| `PJTSAU` | Prof. Jayashankar Telangana State Agricultural University | Telangana State | Package of Practices for Paddy, Cotton, Chilli | **VERIFIED** |
| `ANGRAU` | Acharya N. G. Ranga Agricultural University | Andhra Pradesh State | Guntur Chilli Thrips & Mites, Coastal Blight | **VERIFIED** |
| `CIBRC` | Central Insecticide Board & Registration Committee | National Statutory Authority | Legal Pesticide Registrations & Waiting Periods | **VERIFIED** |

---

## 2. Scientific Data Provenance Schema (§5 & §6)

For every external data entity, the platform records:

```json
{
  "source_name": "ICAR - National Rice Research Institute",
  "source_url": "https://icar-nrri.gov.in",
  "source_type": "icar",
  "license": "Government Open Data / Public Agricultural Advisory",
  "publication_date": "2026-01-15",
  "retrieval_date": "2026-10-08",
  "dataset_version": "v2026.2",
  "region": ["Telangana", "Andhra Pradesh"],
  "language": "English, Telugu, Hindi",
  "verification_status": "verified",
  "last_verified": "2026-10-01"
}
```

---

## 3. Mandatory Chemical Safety Standard (§22)

- The LLM recommendation engine is strictly prohibited from generating dosage calculations or chemical combinations from memory.
- If chemical control is displayed:
  - Active ingredient must be recognized by CIB&RC.
  - Waiting period (days between spray and harvest) must be explicitly shown.
  - Mandatory warning: "Follow the current official product label and regional agricultural officer guidelines."
  - Banned or unapproved agrochemicals are strictly flagged and omitted.
