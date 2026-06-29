# Portfolio Website Management System

This repository contains the source code for the public Portfolio Website, the Admin Dashboard management panel, and the secure Express backend server.

---

## 1. Project Architecture

The workspace is organized as follows:
*   [client/](file:///c:/MEGA-NEW/Projects/Portfolio%20Website/client): The public-facing portfolio website built with React, Vite, TypeScript, and Tailwind CSS.
*   [admin/](file:///c:/MEGA-NEW/Projects/Portfolio%20Website/admin): The administrative dashboard panel built with React, Vite, TypeScript, and Tailwind CSS v3.
*   [server/](file:///c:/MEGA-NEW/Projects/Portfolio%20Website/server): The secure Express backend API built with TypeScript and Mongoose.
*   [docs/](file:///c:/MEGA-NEW/Projects/Portfolio%20Website/docs): Design specifications and UI/UX documentation.
*   [.agents/](file:///c:/MEGA-NEW/Projects/Portfolio%20Website/.agents): Workspace agent engineering guidelines and rules.

---

## 2. Features

### 2.1 Backend Server (`server/`)
*   **Database Management**: Connects to MongoDB, executing automated seeding on first start to load initial data profiles (projects, experiences, skills, education, currently learning, settings, taglines, links, and stats) if the collections are empty.
*   **API Routes**: Exposes REST endpoints for CRUD operations on projects, experiences, skills, education, currently learning, settings, taglines, links, and stats (figures).
*   **Thumbnail Storage**: Integrates a `multipart/form-data` upload endpoint (`/api/projects/upload`) using `multer` that saves project thumbnails locally on disk in `server/project_thumbnails/`. Automatically cleans up old or deleted thumbnail files from the filesystem.
*   **AI Chat Assistant**: Handles AI queries at `/api/chat` with secure HTTP-only cookie-based session tracking, daily token limits, anti-tampering verification (comparing cookie session IDs against client payloads to block tampering), and database limit validation, plus logging `/api/chat/logs` and stats `/api/chat/stats`.
*   **CV Document Upload**: Exposes a secure endpoint to upload PDF documents as base64 strings (`/api/cv/upload`) and stream downloads (`/api/cv/download`) to authorized users and visitors.
*   **Security Layers**:
    *   **Rate Limiting**: Restricts general traffic (100 requests per 15 mins) and brute-force login attempts (10 requests per 15 mins).
    *   **DDoS Prevention**: Implements payload size limits (10kb) on incoming JSON and URL-encoded bodies, with a specific exception of 5MB for CV document uploads.
    *   **NoSQL Injection Defense**: Uses `express-mongo-sanitize` to strip query operators from input keys.
    *   **XSS Protection**: Cleans inputs recursively using the `xss` library, and sets secure headers via `helmet`.
*   **Authentication & Sessions**: Issues JWT tokens delivered as HTTP-only, secure, strict SameSite cookies (`__pw_admin_token`), with session validation (`/api/auth/verify`) and logout handlers.

### 2.2 Admin Dashboard (`admin/`)
*   **Authentication Portal**: Monospace developer terminal login prompt validating credentials against backend server configurations.
*   **Management Panel**:
    *   **Responsive Sidebar**: Professional collapsible navigation sidebar for desktop and mobile devices, with active item highlight and tab persistence (`__pw_admin_active_tab`) across page refreshes.
    *   **CRUD Actions**: Direct interfaces to Add, Edit, and Delete records. Includes full options to customize active color palette, select logo text, write subheadings, update open-to-work statuses, edit tagline typing lines, and place external links dynamically. Supports tagging projects as private (hiding GitHub inputs).
    *   **Thumbnail Uploads**: File selector with image previews and validation (PNG/JPEG/WEBP under 5MB) integrated directly into the project form, automatically synchronizing with backend disk storage.
    *   **CV Upload Dropzone**: Interactive drag-and-drop file uploader supporting dragover neon border glows, file constraints validation (PDF, <5MB), and immediate backend synchronization.
    *   **AI Chat Dashboard Analytics**: Rich analytics showing today's and all-time token and request usage, active vs inactive session ratios, and cumulative session growth charts. Includes a searchable and sortable session breakdown usage table.
    *   **Custom Delete Dialogue**: CLI terminal-themed warning confirmation dialog (`rm -rf ./{type}/{item}`).
    *   **Transactional Toasts**: Active operation states reported via `sonner` toasts.
    *   **verbatimModuleSyntax Support**: Employs strict type-only imports (`import type`) for interfaces and definitions and adheres to strict compiler rules (eliminating unused variables and mapping chart data keys dynamically) to guarantee smooth compilation under verbatim module syntax rules.

### 2.3 Public Client Portfolio (`client/`)
*   Fetches real-time projects, experiences, skills, education, currently learning, settings, taglines, links, and stats from the MongoDB database, replacing static data configurations.
*   **Redesigned Projects Grid**: Showcases projects inside a responsive grid layout using cover cards, aspect-ratio matching, image lazy-loading, and interactive zoom and border highlights.
*   **Centered Project Modal**: Displays complete details (large thumbnail image, description parsed as Markdown, tags list, live demo, and source links) in a professional dialog that closes via Escape key or backdrop clicks. Supports displaying custom contacting details for private repositories and a "See Full Image" click action.
*   **Consistent Preview Images**: Standardizes missing project thumbnails to display Vite fallback placeholder graphics.
*   **Dynamic Layout & Placements**: Displays custom-placed links on the Hero, Footer, or Contact section dynamically. Typing animations render tagline punch lines dynamically.
*   **Dynamic Stats/Figures Grid**: Renders real-time statistics (labels, values, custom tooltips) sorted by rank Order.
*   **Dynamic CV Download**: Queries current upload status and enables direct attachment downloads with standard target `_blank` browser behaviors, showing a styled, disabled state when missing.
*   **AI Chat Assistant**: Fixed bottom-right chatbot widget offering suggested questions, real-time developer info lookup, and error status representation.
*   **Color Vibrancy Themes**: Applies one of 5 select vibes (`matrix`, `dracula`, `nordic`, `sunset`, `amber`) dynamically as HSL CSS variables throughout background colors, buttons, hover states, and animations.


---

## 3. Getting Started

### 3.1 Prerequisites
*   Node.js (v22 recommended)
*   npm

### 3.2 Environment Setup

#### Backend Server:
Create a file at `server/env/env.development` (configured in gitignore) based on the contract specified in `server/env/env.example`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

#### Client Website:
Create a file at `client/env/.env.development` (configured in gitignore) based on `client/env/.env.example`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

#### Admin Dashboard:
Create a file at `admin/env/.env.development` (configured in gitignore) based on `admin/env/.env.example`:
```env
VITE_API_BASE_URL=http://localhost:5000
```


### 3.3 Running Locally

#### Run the Backend Server:
```bash
cd server
npm install
npm run dev
```

#### Run the Admin Dashboard:
```bash
cd admin
npm install
npm run dev
```

#### Run the Client Website:
```bash
cd client
npm install
npm run dev
```
