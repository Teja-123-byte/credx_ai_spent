## Day 1 — 2026-05-21

**Hours worked:** 2

**What I did:**  
- Initialized frontend project structure  
- Built initial landing page UI  
- Set up backend server  
- Added health check endpoint  
- Configured Axios instance for frontend API communication  
- Started responsive layout adjustments for the hero section  

**What I learned:**  
Learned how modern SaaS landing pages use spacing, typography hierarchy, and minimal color palettes to create a polished and professional feel. Also understood the importance of setting up backend connectivity early before building core product features.

**Blockers / what I'm stuck on:**  
Faced minor responsive layout issues in the hero section when testing on smaller screen widths. Need to improve mobile spacing and alignment consistency.

**Plan for tomorrow:**  
- Build the full audit input form  
- Add all supported AI tools and plans dynamically  
- Implement form validation  
- Persist form state using localStorage  
- Design reusable form components for scalability  
- Start structuring audit engine input schema

## Day 2 — 2026-05-22
**Hours worked**: 1.5
**What I did**:

Set up complete Next.js 15 + TypeScript + Tailwind project structure with shadcn/ui
Integrated the full premium hero section with animated floating elements, tab cycling overlays, video background, metrics, and star particles (exact design from reference)
Created src/app/page.tsx with clean component structure and proper style jsx global
Updated project to use consistent naming (AISpendAudit)
Fixed TypeScript + CSS module issues in globals.css and tsconfig.json
Reviewed and structured pricingData.ts based on PRICING_DATA.md

**What I learned**:

How to properly handle complex custom CSS animations and style jsx global in Next.js App Router
Importance of performance-friendly animations (using useRef for interval cleanup)
Better understanding of responsive hero sections with floating 3D-like elements using pure CSS

**Blockers / what I'm stuck on**:

None major. Minor styling tweaks needed for mobile responsiveness in hero section tomorrow.

**Plan for tomorrow**:

Build the full Audit Input Form with dynamic tool addition, plan selection, and localStorage persistence
Integrate pricingData.ts into the form
Start building the audit engine logic

## Day 3 — 2026-05-23
**Hours worked**: 1

**What I did**:

Set up of axios instance in client and made a test api endpoint in express to check the problems.

**What I learned**:

How to properly handle the working environment i.e. between developlment and production made the baseURL of client to be dynamic based on the .env file.

**Blockers / what I'm stuck on**:

Nothing for now.

**Plan for tomorrow**:

Build the full Audit Input Form with dynamic tool addition.

## Day 4 — 2026-05-24
**Hours worked**: 1

**What I did**:

Seperated design components from main page.tsx file, fixed routing to Audit.

**What I learned**:

The importance of routing structure.

**Blockers / what I'm stuck on**:

The main audit form.

**Plan for tomorrow**:

Design and implement the Audit form along with api endpoints.
## Day 5 - 2026-05-25

**Hours worked:** 4 hrs

**What I did:**

* Added backend validation middleware
* Updated audit, pricing, and engine backend files
* Organized backend routes and middleware structure
* Tested frontend-backend integration

**What I learned:**

* Learned better backend structuring and validation handling in Node.js

**Blockers:**

* Faced frontend build/CSS issues while running Next.js app

**Plan for tomorrow:**

* Fix frontend issues and complete API integration

## Day 6 - 2026-05-26

**Hours worked:** 3.5 hrs

**What I did:**

- Fixed multiple frontend runtime/build errors:
	- Added missing UI wrapper components: `src/components/ui/card.tsx`, `src/components/ui/button.tsx`, `src/components/ui/badge.tsx` and a barrel `src/components/ui/index.ts`.
	- Updated `src/components/AuditResults.tsx` to import from `./ui` and restored standard Tailwind gradient utility classes (`bg-gradient-to-*`).
	- Converted `src/app/audit/page.tsx` to a Client Component (`"use client"`) so event handlers can be passed to child components.
	- Added minimal Next App Router helper pages: `src/app/error.tsx` and `src/app/not-found.tsx` to remove dev overlay errors.
	- Installed frontend dependencies (`npm install`) and verified `npm run build` completes successfully. Dev server ran and chose port 3002 (if 3000/3001 were occupied).

- Fixed backend issues and started local API:
	- Implemented missing `src/routes/audit.js` (simple in-memory store for POST /audit and GET /audit/:id, GET /audit?company=).
	- Installed backend dependencies and started the dev server with `nodemon` (running at http://localhost:4000).

**What I learned:**

- Next.js App Router enforces server/client boundaries — server components cannot receive event handlers. Converting specific pages to client components is necessary for interactive UI.
- Dev mode requires at least basic `error` and `not-found` components for the dev overlay and static page generation to behave predictably.
- Using a `ui` barrel (index) simplifies imports and avoids path resolution problems in TypeScript/Next projects.

**Blockers / what I fixed:**

- Missing UI component files caused compile-time/type errors — added the files.
- Backend expected `audit.js` route which wasn't present — added a minimal implementation.
- Multiple processes occupied default dev ports (3000/3001) — Next picked an available port (3002). If you expect `localhost:3000`, either stop the other process or open the chosen port.

**Plan for tomorrow / next steps:**

- Wire the frontend audit form to POST to `/audit` and show saved audit IDs.
- Improve and type the UI components, add design tokens and shared props.
- Add persistence for audits (replace in-memory store with a simple DB or file, or connect to Supabase if configured).
- Add basic tests for backend routes and a smoke-test script for frontend build/start.

