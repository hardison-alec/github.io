# OpenIntel (Prototype)

A serious open-source OSINT and global news intelligence platform prototype designed for journalists, analysts, and researchers.

## What is built right now

- Dark-mode, deep-red investigative UI shell
- Modular panel layout (feed, article intelligence, interactive globe, case board)
- Interactive Three.js globe with orbit controls and global markers
- Feed ingestion from local JSON (placeholder for RSS pipeline)
- Case board pinning flow for analyst workflow simulation
- Initial plugin manifest schema + example plugin definition

## Run locally

```bash
python3 -m http.server 4173
```

Then open: <http://localhost:4173>

## Next implementation priorities

1. Replace sample feed JSON with real RSS ingestion worker.
2. Add entity extraction adapters and persistence abstraction.
3. Expand case board to timeline + relationship graph.
4. Integrate Hugging Face summarization/classification provider.
5. Add Tauri wrapper and SQLite adapter.

## Troubleshooting

- If you see `Failed to resolve module specifier "three"`, hard-refresh the page (Ctrl+Shift+R).
- If CSS is missing, make sure `src/styles.css` exists and you are serving from the repo root.
- `favicon.ico` 404 warnings are now suppressed with an inline favicon.
