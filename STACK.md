# NeoDish – Stack Dokumentation

## Übersicht
NeoDish ist ein persönlicher Mahlzeiten-Wochenplaner mit Rezeptverwaltung, Wochenplanung und automatischer Einkaufsliste.

**Live:** https://essen.neo457.ch
**Repo:** https://github.com/bref457/NeoDish

---

## Technologien

| Bereich | Technologie | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.6 |
| Sprache | TypeScript | ^5 |
| UI | React | 19.2.3 |
| Styling | Tailwind CSS v4 | latest |
| Komponenten | shadcn/ui | latest |
| Datenbank | Supabase (PostgreSQL) | latest |
| Auth | Supabase Auth (mit E-Mail-Bestätigung) | latest |

---

## Architektur

```
app/
├── (app)/              → Geschützte Seiten (nach Login)
│   ├── planer/         → Wochenplaner
│   ├── rezepte/        → Rezeptverwaltung
│   └── einkaufsliste/  → Automatische Einkaufsliste
├── login/              → Login
├── register/           → Registrierung
├── forgot-password/    → Passwort vergessen
├── reset-password/     → Passwort zurücksetzen
└── page.tsx            → Landing Page (öffentlich)
```

### Datenbankschema (Supabase)
- **rezepte** – Rezepte mit Zutaten und Anleitung
- **wochenplan** – Geplante Mahlzeiten pro Wochentag
- **einkaufsliste** – Generierte Einkaufsliste

### Auth-Redirect
Middleware in `proxy.ts` (nicht `middleware.ts`) — steuert Auth-Redirects.
Landing Page `/` ist öffentlich, `/planer` und weitere Seiten nur nach Login.

---

## Deployment

**Platform:** Docker auf VPS (Hetzner CX32)
**Domain:** `essen.neo457.ch` (nginx Reverse Proxy, Port 3001)

```bash
ssh -i ~/.ssh/aria_vps root@162.55.209.62 "cd /opt/dishboard && git pull && docker compose up -d --build"
```

---

## Supabase

- **Projekt-ID:** `xujsgseuupsbfjqiuugq`
- **Region:** EU
- **Auth:** E-Mail + Passwort, E-Mail-Bestätigung aktiv

---

## Lokale Entwicklung

```bash
git clone https://github.com/bref457/NeoDish.git
cd NeoDish
npm install
cp .env.example .env.local
# .env.local mit Supabase-Keys füllen
npm run dev
```

### Benötigte Umgebungsvariablen
Siehe `.env.example` im Repo.
