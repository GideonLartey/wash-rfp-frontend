
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()


## OPENWSH-CONTROL
A comprehensive, full-stack analytics and processing prototype designed for WaterAid (see disclaimer), Water, Sanitation, and Hygiene 
(WASH) initiative. OpenWSH-CONTROL provides technical teams  and directors with autonomous RFP data extraction, macro-indicator context 
fetching, systems strengthening recommendations, a climate prediction engine, and real-time multiplayer system modeling.
## URL: https://www.openwsh-control.xyz


## KEY FEATURES
**Autonomous Data Extraction**
Intelligent RFP Parser: Upload tender PDFs for native backend processing via Google Gemini 2.5 Flash.
Global State Pipeline: Extracted geographical data autonomously routes to downstream analytics engines in the frontend.
The RFP Ingestion module implements an explicit document parsing interface designed for structural metadata review. It abstracts heavy multipart data processing and presents the user with a single, highly unified analytical workspace sheet. This view is engineered around a seamless contextual waterfall: once data is processed, the system completely removes segmented card multi-grids in favor of an integrated, top-to-bottom master results sheet. This layout allows single-click data collection and programmatic clipboard transfers while preserving the detailed hierarchy of raw extracted project goals.

## Climate and Context Analytics
Live Context Engine (The Oracle): Fetches dynamic Water Stress and Governance scores based on target nations, utilizing a low-latency enterprise mock database with algorithmic fallbacks.Monte Carlo Simulator: Probabilistic risk forecasting driven by dynamic climate volatility metrics over a 10-year window. Operating as the analytical core of the system, this interface acts as a local telemetry viewer. It allows users to query macro-indicators for specific jurisdictions to build a technical environment baseline.

## Multiplayer Systems Modeler View
This view provides a shared interactive workspace focusing on institutional assessment across policy, financial, and infrastructural frameworks. It maps dynamic variables to sliders that track technical performance capacity. The view is structurally decoupled to support real-time state synchronization, instantly modifying environmental baselines as soon as adjustments are made to institutional variables.Adjust WASH system building blocks (Policy, Finance, Infra) in real-time alongside team members via secure FastAPI WebSockets.

## Monte Carlo Risk Simulator View
A technical forecasting model designed to simulate project viability under variable climate scenarios. It reads environmental and volatility data directly from the application global state to chart probability curves and output risk assessments based on local water security constraints.

## Master Analysis Report 
The operational finale of the client platform. It aggregates all data inputs, extracted parameters, baseline indicators, and architectural recommendations into a comprehensive corporate layout. Reversing standard concise dashboard trends, this view prints out every detailed operational component, checklist metric, and sub-card data point across the platform to ensure institutional audit readiness.


## GLOBAL ACHITECTURE

## Client-Side Data Pipeline & Global Memory
Data integrity within the client application is maintained via an explicit, one-way state cascade implemented at the root level (`App.tsx`). This acts as an autonomous data pipe or "memory bridge" connecting the different analytical tools. By lifting state to the application root, the system eliminates brittle child-to-child component communication and ensures that a change captured in one view triggers an autonomous lifecycle event across the entire system.
The root pipeline maintains three separate state vectors: `uploadedDocument` (tracks document identity), `liveContext` (maintains active macro-indicators), and `extractedRfp` (preserves structural document parameters). When the extraction module processes a file, it pushes the sanitized geographic data upward into the pipeline using the `setExtractedRfp` modifier. Downstream components, such as the `ClimatePredictor`, listen to this pipeline. When a new country string is detected in the pipeline, the component instantly locks its automated trigger engine and executes an data fetch, populating the user interface with zero manual input.


## Persistent State & Session Cache Architecture
To protect user operations against accidental page refreshes, browser tab switching, or navigation drift, the system utilizes a dual-layered state synchronization pattern combining React operational state hooks with browser `SessionStorage` caching.
Inside components like `RfpParser.tsx` and `ClimatePredictor.tsx`, application memory is continuously mirrored to the browser local cache via isolated lifecycle synchronization routines. Upon rendering, components run an extraction routine that attempts to pull down cached payloads (`rfpParsedData`, `cp_state`). If discovered, the data is decoded and injected back into the active view state. This caching strategy is designed with an explicit, manual reset hook that clears out the view cache on demand without altering the shared global state vectors, giving users absolute flexibility to clear and re-run calculations at will.


## System Requirements
Frontend: Node.js v18+, npm/yarn
Backend: Python v3.9+, pip
API Keys: Google Gemini API access or any AI of your choice(Claude, ChatGPT)
Installation & Setup
This project uses a decoupled architecture. You can create a project that houses both the backend server and the frontend client. 
I deliberately uploaded both files as separate entities. You should ensure both folders are in a master folder(OPENWSH-CONTROL) 
for organization


## FRONTEND INSTALLATION
1. Clone the Repository
Download both the frontend and backend to your local machine:
git clone https://github.com/DeonLondn/wash-rfp-frontend.git

2. Frontend Setup (React / Vite)
Open a second, separate terminal and navigate to the frontend folder:
cd wash-rfp-frontend
npm install
Environment Configuration: Create a “.env.example” file in the wash-rfp-frontend directory:
VITE_API_URL=http://localhost:8000  - Local machine
Run the Client:
npm run dev


## Project Structure
OpenWsh-Control/                       
├── wash-rfp-backend/                   
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── wash-rfp-frontend/ 
│   ├── node_modules/
│   ├── public/
│   │    ├── favicon.svg
│   │    ├── icons.svg                     
│   ├── src/ 
│   │   ├── assets/                        
│   │   ├── components/
│   │   │   ├── Layout.tsx/
│   │   │   ├── DataDrillDown.tsx
│   │   │   ├── GisMapNode.tsx
│   │   ├── pages/
│   │   │   ├── ClimatePredictor.tsx              
│   │   │   ├── ConsortiumMatrix.tsx               
│   │   │   ├── Dashboard.tsx        
│   │   │   ├── EvidenceEngine.tsx          
│   │   │   ├── Login.tsx    
│   │   │   ├── MasterReport.tsx
│   │   │   ├── MonteCarloSimulator.tsx
│   │   │   ├── RfpParser.tsx
│   │   │   ├── SystemsModeler.tsx           
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── LICENSE
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
└── .gitignore

## NOTE: Your ".env.example" goes into your .gitignore file


## Future Enhancements
1. Export Master Report to comprehensive PDFs.
2. PostgreSQL database integration for persistent workspaces.
3. Redis caching layer for frequent country queries.
4. Replace mock dictionary with HTTP calls to live Donor Data APIs.

## License & Authors
Developer: [Gideon Lartey/DeonLondn]
Last Updated: May 2026
MIT License

## DISCLAIMER: 
This is an independent systems prototype for demonstration purposes only, and is not affiliated in any way with 
WaterAid or any organization, interest, or entity affiliated with WaterAid organization.
