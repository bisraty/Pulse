# Pulse — Real-time Team Analytics Dashboard

## Project Spec for Claude Code

### What we're building
A polished, portfolio-grade analytics dashboard called **Pulse**. It shows live-updating business metrics for a fictional SaaS company. The demo must feel *alive* the moment someone opens it — numbers ticking, charts updating, activity feed scrolling — with zero interaction required. Target audience: recruiters and hiring managers who will spend 60 seconds on it.

### Tech stack
- **Next.js 14+ (App Router)** with **TypeScript** (strict mode)
- **Tailwind CSS** for styling
- **Recharts** for charts
- **Zustand** for client state (theme, filters)
- **Vitest + React Testing Library** for tests
- Data: **simulated real-time stream** (no external backend needed — see Data section). Architect it so a Supabase Realtime adapter could be swapped in later.
- Deployed to **Vercel**

### Pages / routes
1. `/` — **Overview dashboard** (the main page, most effort here)
2. `/analytics` — deeper charts view (traffic sources, conversion funnel)
3. `/team` — team activity page (presence, activity log)
4. `/settings` — simple settings page (theme, notification toggles) — mostly to show form UI skills

Use a persistent sidebar layout with the four nav items, a topbar with search input (non-functional is fine), theme toggle, and a fake user avatar menu.

### Overview page — required components
1. **4 KPI cards** across the top: Revenue (MRR), Active Users, Requests/min, Error Rate.
   - Each card: current value, sparkline, % change vs yesterday (green/red with arrow icon)
   - Values update every 2–4 seconds with smooth number animation (count-up/down transitions)
2. **Main line/area chart** — "Active users over time", rolling window that shifts as new data points stream in. Time-range toggle: 1H / 24H / 7D / 30D.
3. **Bar chart** — revenue by plan tier (Free, Pro, Enterprise)
4. **Donut chart** — traffic by device (Desktop, Mobile, Tablet)
5. **Live activity feed** (right column or bottom): new events slide in every few seconds ("Abebe K. upgraded to Pro", "New signup from Germany", "Payment failed — retrying"). Cap at ~20 visible items.
6. **Online team members strip**: 5–6 fake avatars with green presence dots; one goes offline/online occasionally.

### Analytics page
- Conversion funnel visualization (Visitors → Signups → Trials → Paid)
- Traffic sources table (sortable columns: source, visitors, conversion %, trend sparkline)
- Geographic breakdown — simple list or bar chart by country is fine, no map library needed

### Team page
- Grid of team member cards (avatar, name, role, online status, last active)
- Activity timeline (same event stream as the feed, grouped by day)

### Data layer (important — do this well)
- Create a `lib/dataStream.ts` module that simulates a realtime backend:
  - Generates realistic seeded data on load (last 30 days of history so charts are full immediately)
  - Emits new data points on an interval (2–4s) via a subscribe/unsubscribe API
  - Uses believable numbers with small random walks (no wild jumps), occasional "spikes" for visual interest
- Wrap it in a `useLiveData()` hook. Components consume the hook; nothing talks to the stream directly.
- Add a comment block explaining how to swap this for Supabase Realtime — shows architectural thinking.

### Design requirements
- Modern SaaS dashboard aesthetic: dark mode **default**, light mode toggle, persisted in localStorage via a class on `<html>` (note: this runs in the user's own Next.js app, so localStorage is fine)
- One accent color used consistently (suggest a violet or teal), neutral grays elsewhere
- Subtle transitions: cards fade in on load (staggered), numbers animate, feed items slide in
- Rounded-xl cards, soft borders, no heavy shadows
- Fully responsive: sidebar collapses to a bottom bar or hamburger on mobile; charts stay legible
- Empty/loading states: skeleton loaders on first paint

### Accessibility (non-negotiable — this backs my CV)
- Semantic landmarks (`nav`, `main`, `aside`), skip-to-content link
- All interactive elements keyboard-reachable with visible focus rings
- Charts get `aria-label` descriptions; live feed uses `aria-live="polite"`
- Color contrast meets WCAG 2.1 AA in both themes
- Respect `prefers-reduced-motion`: disable count-up and slide animations when set

### Testing
- Vitest + React Testing Library
- Minimum: tests for the KPI card (renders value, shows correct trend direction), the data stream (emits points, unsubscribe works), and the theme toggle
- Add a `test` script to package.json and make sure CI-ready (`npm test` passes)

### Code quality
- Strict TypeScript, no `any`
- Organize: `components/` (ui/ for primitives, dashboard/ for feature components), `lib/`, `hooks/`, `types/`
- Small, focused components; extract shared card wrapper
- ESLint + Prettier configured

### README (write this last, make it good)
- Hero screenshot (dark mode) at the top
- One-paragraph pitch, live demo link placeholder
- Features list, tech stack badges
- "Architecture decisions" section: why simulated stream + how to swap in Supabase, state management choices, accessibility approach
- How to run locally

### Build order
1. Scaffold Next.js + Tailwind + layout shell (sidebar, topbar, theme toggle)
2. Data stream module + useLiveData hook + tests
3. Overview page: KPI cards → main chart → secondary charts → activity feed
4. Analytics + Team pages
5. Settings page, responsive pass, accessibility pass, reduced-motion
6. Tests, README, deploy to Vercel

### Definition of done
- Opening the deployed URL shows a full, moving dashboard within 2 seconds
- Works on mobile
- Keyboard-only navigation works end to end
- `npm test` passes
- Lighthouse: 90+ on Performance and Accessibility
