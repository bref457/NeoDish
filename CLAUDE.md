# Dishboard – Claude Code Kontext

## Was ist Dishboard?
Meal-Planner Web-App – Wochenplanung für Mahlzeiten mit Rezepten, Einkaufsliste etc.

## Stack
- Next.js (App Router), TypeScript, Tailwind CSS
- Supabase (Auth + DB)
- Docker + nginx für Deployment

## Repo & Deploy
- Lokal: `C:/Dev/Essenswochenplaner/`
- Live: `essen.neo457.ch`
- Deploy: Docker auf VPS (`162.55.209.62`)

## Struktur
```
app/              – Next.js App Router Pages
components/       – React Komponenten
lib/              – Supabase Client, Utilities
supabase/         – Supabase Migrations/Config
docker-compose.yml – Docker Setup
Dockerfile        – Next.js Build
```

## Supabase
- Supabase MCP ist aktiv in Claude Code (global konfiguriert)
- Projekt: Dishboard Supabase Projekt (via MCP zugreifbar)

## Lokale Entwicklung
```bash
cd C:/Dev/Essenswochenplaner
npm run dev  # → http://localhost:3000
```

## VPS Deploy
```bash
ssh -i ~/.ssh/aria_vps root@162.55.209.62
cd /opt/dishboard && docker compose pull && docker compose up -d
```
