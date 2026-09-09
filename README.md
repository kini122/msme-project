# MSME & Government Scheme Intelligence Platform

> **CA Rangamani Associates** • Sovereign MSME Statutory & Government Scheme Intelligence System

An enterprise Next.js 14 platform for verifying MSME Udyam credentials, analyzing enterprise profiles, and executing deterministic statutory scheme eligibility matching across 4,700+ Indian central and state government schemes.

---

## ⚡ Key Capabilities

1. **Company Master List & Filters:**
   - Multi-facet cascading filters by Classification (Micro / Small / Medium), Industrial Sector, State, and District.
   - Live batch generator & gateway integration.

2. **Live Udyam Verification Terminal:**
   - Real-time statutory lookup powered by the Government Udyam / Aadhaar verification gateway (`udyam-aadhaar-verification.p.rapidapi.com`).
   - Retrieves authentic corporate email, phone, plant address, DIC authority, and classification.
   - Clean single-click **"Add to Database"** functionality to commit newly verified entities to the unified database.

3. **Deterministic Scheme Intelligence Engine:**
   - Evaluates enterprises against Central and State policies (PM-KISAN, Stand Up India, CGTMSE, PMEGP, PLI Schemes, Technology Upgradation Fund, etc.).
   - Provides clear statutory rule breakdown (Eligible criteria met vs. unmet).

4. **Scheme Explorer:**
   - Complete directory connected to the 4,700+ Indian government schemes database (`myScheme.gov.in` mirror).
   - Faceted search by jurisdiction (Central vs. State), ministry, and category.

---

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Vanilla CSS Design Tokens
- **Icons:** Lucide React
- **Charts:** Recharts
- **Database / Storage:** Zero external SQL/DB required — Unified reactive in-memory & local persistent store (`AppDataProvider`).
- **Deployment:** Vercel Optimized (Zero serverless cold-start bottlenecks).

---

## 🛠️ Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 🌐 Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Configure the following Environment Variables (optional; automatic fallback is provided):

| Environment Variable | Description |
|---|---|
| `RAPIDAPI_KEY` | RapidAPI Gateway Key for Udyam verification |
| `RAPIDAPI_HOST` | `udyam-aadhaar-verification.p.rapidapi.com` |
| `RAPIDAPI_BASE_URL` | `https://udyam-aadhaar-verification.p.rapidapi.com/v3/tasks/async/verify_with_source/udyam_aadhaar` |
| `SCHEMES_API_BASE_URL` | `https://api.apimitra.in` |

4. Click **Deploy**.
