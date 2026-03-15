# NeoDish

Wochenplaner für Mahlzeiten mit Rezeptverwaltung, Einkaufsliste und Planerübersicht.

**Live:** [essen.neo457.ch](https://essen.neo457.ch)

## Stack

- Next.js 16 App Router + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Supabase (Auth + Postgres)
- Docker auf VPS (Port 3001)

## Features

- **Wochenplaner** – Mahlzeiten pro Tag planen
- **Rezepte** – Eigene Rezepte erstellen, bearbeiten und verwalten
- **Einkaufsliste** – Automatisch aus dem Wochenplan generieren

## Lokale Entwicklung

```bash
npm install
npm run dev
```

`.env.local` benötigt:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Deploy

```bash
ssh -i ~/.ssh/aria_vps root@162.55.209.62 "cd /opt/dishboard && git pull && docker compose up -d --build"
```
