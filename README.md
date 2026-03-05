# myAfya-AI — Your AI-Powered Health Companion

A production-grade, full-stack health platform for intelligent medication management, AI health assistance, and adherence analytics.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 18, TailwindCSS, Framer Motion |
| Backend | Next.js API Routes (Node.js) |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js (JWT sessions + bcrypt) |
| AI | Anthropic Claude (claude-sonnet-4-6) |
| Charts | Recharts |
| Forms | React Hook Form + Zod |

---

## Features

- **Medicine Reminder System** — Add medicines with dosage, frequency, times, start/end dates
- **AI Health Assistant** — Claude-powered chat for medication guidance and health questions
- **Medication Dashboard** — Today's schedule, adherence stats, weekly/monthly charts
- **Prescription Scanner** — Upload prescription images for AI-powered OCR extraction
- **Refill Reminders** — Track pill counts, get low-supply alerts
- **Doctor Sharing** — Generate secure share links for medication reports
- **Voice Assistant** — Browser speech recognition for hands-free control
- **Family Mode** — Manage profiles for multiple family members
- **Dark Mode** — Full system-aware dark/light theme
- **Secure Auth** — JWT sessions, bcrypt hashing, protected routes

---

## Getting Started

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database
- Anthropic API key

### 2. Clone & Install

```bash
cd myafya-ai
npm install
```

### 3. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your values:
- `DATABASE_URL` — your PostgreSQL connection string
- `NEXTAUTH_SECRET` — random 32+ char secret
- `ANTHROPIC_API_KEY` — from console.anthropic.com

### 4. Database Setup

```bash
# Push schema to database
npm run db:push

# Seed with demo data
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo credentials:**
- Email: `demo@myafya.ai`
- Password: `Demo@12345`

---

## Project Structure

```
myafya-ai/
├── prisma/
│   ├── schema.prisma        # Full database schema
│   └── seed.ts              # Demo data seeder
├── src/
│   ├── app/
│   │   ├── (auth)/          # Login & Signup pages
│   │   ├── (dashboard)/     # All dashboard pages (protected)
│   │   │   ├── dashboard/   # Main overview
│   │   │   ├── medicines/   # Medicine management
│   │   │   ├── calendar/    # Medication calendar
│   │   │   ├── ai-assistant/ # AI chat
│   │   │   ├── reports/     # Analytics
│   │   │   ├── prescriptions/ # Scanner
│   │   │   ├── family/      # Family profiles
│   │   │   └── settings/    # User settings
│   │   ├── api/             # REST API routes
│   │   │   ├── auth/        # NextAuth + registration
│   │   │   ├── medicines/   # CRUD + status
│   │   │   ├── reminders/   # Take/skip actions
│   │   │   ├── ai-chat/     # Claude integration
│   │   │   └── reports/     # Analytics + sharing
│   │   └── page.tsx         # Landing page
│   ├── components/
│   │   ├── landing/         # Marketing page
│   │   ├── dashboard/       # Sidebar, Header, Shell
│   │   ├── medicines/       # Form, List, Scanner
│   │   ├── ai/              # Chat interface
│   │   ├── ui/              # Reusable UI components
│   │   └── providers/       # Theme + Session providers
│   ├── lib/
│   │   ├── db.ts            # Prisma singleton
│   │   ├── auth.ts          # NextAuth config + utils
│   │   ├── anthropic.ts     # Claude AI client
│   │   └── utils.ts         # Utility functions
│   └── types/
│       └── index.ts         # TypeScript types
└── tailwind.config.js       # Design system
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| GET/POST | `/api/auth/[...nextauth]` | NextAuth handlers |
| GET/POST | `/api/medicines` | List/create medicines |
| GET/PUT/PATCH/DELETE | `/api/medicines/[id]` | Medicine CRUD |
| GET | `/api/reminders` | Get reminders (by date/month) |
| POST | `/api/reminders/[id]/take` | Mark dose as taken |
| POST | `/api/reminders/[id]/skip` | Mark dose as skipped |
| GET/POST | `/api/ai-chat` | AI health chat |
| GET | `/api/ai-chat/insight` | Daily AI health insight |
| GET | `/api/reports` | Adherence analytics |
| POST | `/api/reports/share` | Create doctor share link |

---

## Database Schema

Key models:
- **User** — Account with health profile (allergies, conditions)
- **FamilyProfile** — Family member profiles
- **Medicine** — Medications with dosage, schedule, pill tracking
- **Reminder** — Scheduled medication events (PENDING/TAKEN/SKIPPED/MISSED)
- **AdherenceLog** — Daily adherence tracking history
- **AiChat + AiMessage** — AI conversation history
- **Prescription** — Uploaded prescription records
- **RefillAlert** — Low supply notifications
- **DoctorShare** — Secure report sharing tokens

---

## Production Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

**Environment checklist:**
- [ ] Set strong `NEXTAUTH_SECRET` (min 32 chars)
- [ ] Configure production `DATABASE_URL`
- [ ] Add valid `ANTHROPIC_API_KEY`
- [ ] Set `NEXTAUTH_URL` to your production domain
- [ ] Run database migrations: `npx prisma migrate deploy`

---

Built with ❤️ for better health outcomes.
