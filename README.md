# OpenIntel

OpenIntel is an OSINT mission platform scaffold combining a SvelteKit frontend, a Tauri desktop shell, and a deep-red operations interface with a Three.js globe.

## Current architecture

- **Frontend:** SvelteKit + Vite
- **Desktop shell:** Tauri v2 (Rust)
- **3D visualization:** Three.js globe embedded in `src/App.svelte`
- **Routing shell:** `src/routes/+layout.svelte` + `src/routes/+page.svelte`

## Project layout

- `src/App.svelte` – mission-control UI and Three.js globe scene
- `src/styles.css` – deep-red tactical visual design
- `src/app.html` – SvelteKit HTML template
- `src-tauri/` – Tauri desktop configuration and Rust entrypoint
- `index.html` – professional repository landing page

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Tauri desktop mode

```bash
npm run tauri dev
```

## Build

```bash
npm run build
```
