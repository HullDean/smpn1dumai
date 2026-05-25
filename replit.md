# SMPN 1 Dumai — School Website

A full-stack school website for SMP Negeri 1 Dumai, Riau.

## Architecture

**Monorepo** managed by pnpm. Three main artifacts:
- `artifacts/smpn1dumai` — React+Vite frontend (port 22355, previewPath `/`)
- `artifacts/api-server` — Express 5 backend (port 8080, path `/api`)
- `artifacts/mockup-sandbox` — Component preview server (design use)

**Shared Libraries:**
- `lib/db` — Drizzle ORM schema + PostgreSQL connection
- `lib/api-spec` — OpenAPI 3.0 specification with 40+ endpoints
- `lib/api-client-react` — Generated TanStack Query hooks (via Orval)
- `lib/api-zod` — Generated Zod validators

## Tech Stack

- **Frontend:** React 18, Vite 7, Wouter (routing), TanStack Query, Framer Motion, shadcn/ui, Tailwind CSS
- **Backend:** Express 5, Drizzle ORM, Zod validation, Pino logging
- **Database:** PostgreSQL (Replit managed)
- **Auth:** Simple token-based admin auth (sha256 hash, Bearer token via localStorage)

## Database Tables

| Table | Description |
|-------|-------------|
| `berita` | News articles with slug, category, publish status |
| `guru` | Teachers/staff directory |
| `galeri` | Photo gallery |
| `pengumuman` | Announcements with priority levels |
| `prestasi` | Student achievements |
| `ekskul` | Extracurricular activities |
| `profil` | School profile (vision/mission/history/principal) |
| `slider` | Homepage hero slider |
| `spmb` | New student admission info |
| `statistik` | Student/teacher counts + visitor tracking |
| `pengunjung_harian` | Daily visitor log |
| `admin` | Admin users |

## API Endpoints

All prefixed with `/api`. Full spec at `lib/api-spec/openapi.yaml`.

Key domains: berita, guru, galeri, pengumuman, prestasi, ekskul, profil, slider, spmb, statistik, admin.

## Frontend Pages

### Public
- `/` — Homepage (hero slider, stats, berita, prestasi, ekskul, galeri, CTA)
- `/profil` — School profile (vision/mission/history/principal)
- `/direktori/guru` — Teacher directory (searchable/filterable)
- `/berita` — News list with search and category filter
- `/berita/:id` — News detail
- `/galeri` — Photo gallery with lightbox
- `/prestasi` — Student achievements grouped by level
- `/ekskul` — Extracurricular activities
- `/pengumuman` — Official announcements
- `/spmb` — New student admission info
- `/kontak` — School contact info

### Admin (protected at `/admin/*`)
- `/admin` — Login
- `/admin/dashboard` — Stats + quick actions
- `/admin/berita` — CRUD news articles
- `/admin/guru` — CRUD teachers
- `/admin/galeri` — CRUD gallery photos
- `/admin/pengumuman` — CRUD announcements
- `/admin/prestasi` — CRUD achievements
- `/admin/ekskul` — CRUD extracurricular
- `/admin/slider` — CRUD homepage slides
- `/admin/profil` — Edit school profile
- `/admin/spmb` — Edit admission info

## Admin Credentials

- Username: `admin`
- Password: `admin123`

## Design

- Primary: Navy blue (#1e3a5f)
- Accent: Gold (#c9a84c)
- Running ticker at top showing active announcements
- Sticky navbar with backdrop blur and dropdown menus
- Framer Motion animations on scroll
- Hero slider with auto-play and manual controls
- Animated stat counters on homepage

## Development

```bash
# Start all services
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/smpn1dumai run dev

# Push DB schema
pnpm --filter @workspace/db run push

# Regenerate API client
pnpm --filter @workspace/api-spec run codegen

# Typecheck
pnpm run typecheck
```
