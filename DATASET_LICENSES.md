# 📜 Agricultural Dataset Licensing, Provenance & Legal Registry

This document establishes the binding legal and compliance criteria for ingesting, managing, and training models on agricultural datasets in the **AgriAI Doctor** platform, adhering to **Sections 3, 4, 5, 6, and 14** of the Master Specification.

---

## 1. Zero-Scraping & Legal Compliance Rule (§3, §6)

- **NEVER** scrape proprietary, paywalled, or copyrighted websites.
- **NEVER** blindly download unauthorized random imagery from general search engines.
- **NEVER** claim or imply that the system possesses "every plant or disease in existence."
- Ingestion is restricted to authoritative agricultural institutions that grant public advisory or research distribution rights.

---

## 2. Permitted Agricultural Data Licenses

| License Classification | Permitted Use | Commercial / Advisory Permission | Attribution Mandate | Typical Sources |
|---|---|---|---|---|
| **OGDL - India** (Open Government Data License) | Direct Integration | Permitted for Public Decision-Support | Mandatory Government Attribution | ICAR, National Rice Research Institute, Ministry of Agriculture |
| **State Extension Circulars** | Advisory & Education | Permitted for Farmer Extension Services | Mandatory University Attribution | PJTSAU (Telangana), ANGRAU (Andhra Pradesh) |
| **Creative Commons Attribution 4.0 (CC-BY 4.0)** | Model Training & RAG | Permitted with Attribution | Mandatory Author Citation | Peer-reviewed journals, Public Plant Pathology Repositories |
| **Public Domain (CC0)** | Full Unrestricted | Permitted | Recommended Citation | USDA Open Agronomy Repositories |

---

## 3. Forbidden & Restricted Licenses

| License Classification | Risk Factor | Platform Action |
|---|---|---|
| **Commercial All Rights Reserved** | Copyright Infringement Risk | **STRICTLY REJECTED** at Pipeline Stage 1 (`LICENSE_CHECK`). |
| **CC-BY-NC (Non-Commercial)** | Blocks production commercial deployments | **FLAGGED FOR LEGAL REVIEW** before ingestion. |
| **Unattributed Web Scrapes** | Zero Provenance & Potential Misinformation | **PURGED IMMEDIATELY**. |

---

## 4. Mandatory Provenance Record Template (§4, §5)

Every agricultural record must persist the following immutable schema:

```json
{
  "source_name": "ICAR - National Rice Research Institute",
  "source_url": "https://icar-nrri.gov.in",
  "source_type": "icar",
  "license": "Government Open Data / Public Agricultural Advisory",
  "copyright_information": "ICAR - All Rights for Official Advisory Reserved",
  "publication_date": "2026-01-15",
  "retrieval_date": "2026-10-08",
  "dataset_version": "v2026.2",
  "region": ["Telangana", "Andhra Pradesh"],
  "language": "English, Telugu, Hindi",
  "verification_status": "verified",
  "last_verified": "2026-10-01"
}
```

If a source cannot be traced to a recognized university, ICAR institute, or peer-reviewed publication, its status is marked:
```text
UNVERIFIED
```
and it is **strictly barred from generating high-risk treatment recommendations**.

---

## 5. Field-Aware Data Leakage Prevention Protocol (§14)

```
RAW CAPTURES
   ↓
Group by Field Group ID (farmer_id + field_id + session_id)
   ↓
Train Partition (70% Groups)  |  Validation (15% Groups)  |  Test (15% Groups)
```

- Images captured from the same plant, field parcel, camera sensor burst, or date sequence are strictly isolated into a single partition.
- Test datasets contain strictly unseen farm fields, guaranteeing real-world validation integrity.
