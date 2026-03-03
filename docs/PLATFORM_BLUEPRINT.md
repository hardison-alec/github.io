# Open-Source OSINT & Global News Intelligence Platform Blueprint

## 1) Refined Architecture

### High-level targets
- **Dual runtime:** one codebase for web (GitHub Pages static) and desktop (Tauri).
- **Separation of concerns:** UI shell, domain services, data pipelines, plugin runtime.
- **Offline-first:** local persistence and queued synchronization for feeds and analysis artifacts.
- **Auditable intelligence workflows:** clear provenance and explainability for every derived insight.

### Recommended stack
- **Frontend:** SvelteKit + TypeScript (adapter-static for GitHub Pages, excellent reactivity for panel-heavy UIs).
- **Desktop wrapper:** Tauri v2 with Rust sidecar services for CPU-heavy parsing/enrichment.
- **3D globe:** Three.js rendered in a dedicated visualization panel.
- **Storage abstraction:** repository interface with:
  - IndexedDB implementation for browser
  - SQLite implementation for Tauri
- **AI services:** Hugging Face Inference API initially, with optional local model runners as plugins later.

### Layered architecture
1. **Presentation layer**
   - Modular panel grid/workspace manager (Wave-like layout behavior)
   - Theme system (dark + deep red palette + subtle motion)
   - Feature panels: Feed, Entity Explorer, Globe, Timeline, Graph, Case Board
2. **Application layer**
   - Use-case orchestration (ingest feed, extract entities, summarize article, attach to case)
   - Event bus for cross-panel updates (e.g., selecting entity highlights map + graph)
3. **Domain layer**
   - Core models: `Article`, `Entity`, `GeoPoint`, `Case`, `Relationship`, `TimelineEvent`, `Source`
   - Intelligence primitives: confidence score, source reliability, provenance chain
4. **Infrastructure layer**
   - RSS ingestion/parsing
   - NLP/entity extraction provider adapters
   - AI summarization/classification adapters
   - Data stores (IndexedDB/SQLite)
   - Plugin runtime and permission sandbox

### Deployment topology
- **Web:** static bundle to GitHub Pages, browser-only storage and API calls.
- **Desktop:** same UI bundled by Tauri, Rust commands for optimized jobs and local SQLite.
- **Config profiles:** `web`, `desktop`, `dev-local`, selected at build-time with runtime capability checks.

---

## 2) MVP Scope (first shippable release)

### Must-have (MVP)
1. RSS ingest from curated source lists + custom source input
2. Article list/detail view with tagging and source metadata
3. Entity extraction (person/org/location) from article text
4. Basic geo-plotting of location entities on globe/map
5. AI summary + topic/category classification
6. Case board with save, pin, and link evidence items
7. Timeline view of saved case events
8. Local persistence and export (JSON/Markdown report)

### Should-have (post-MVP but near-term)
- Relationship graph between entities/events
- Workspace presets and panel templates
- Rule-based alerts (keyword/entity/source triggers)
- Collaboration-ready export bundles

### Explicitly out-of-scope for MVP
- Full social media crawling
- Automated attribution/risk scoring from non-verifiable data
- Multi-user real-time collaboration
- Custom model training pipeline

---

## 3) Suggested Folder Structure

```text
platform/
  apps/
    web/                      # SvelteKit app (adapter-static for GitHub Pages)
    desktop/                  # Tauri wrapper + Rust commands
  packages/
    ui/                       # shared UI components, theme tokens, panel shell
    domain/                   # core types, validation, scoring rules
    application/              # use-cases, orchestration, event bus contracts
    data/                     # repositories + storage adapters (indexeddb/sqlite)
    ingestion/                # RSS pipelines, source health checks
    nlp/                      # entity extraction + classification adapters
    viz/                      # globe, timeline, graph reusable modules
    plugins/                  # plugin SDK, manifests, capability registry
    config/                   # environment profiles + feature flags
  docs/
    architecture/
    product/
    security/
  scripts/
    dev/
    ci/
```

### Notes
- Keep panel modules under feature boundaries, not by framework artifact type.
- Shared contracts live in `packages/domain` to avoid drift between web and desktop.
- Every adapter (HF, local model, parser, geocoder) implements an interface in domain/application.

---

## 4) 90-day Build Roadmap

### Days 1–30: Foundation + first vertical slice
- Finalize data model and interface contracts
- Bootstrap monorepo with web + desktop targets
- Implement RSS source management and ingestion worker
- Build feed panel + article detail panel
- Add entity extraction pipeline (provider abstraction + one implementation)
- Add local persistence (IndexedDB first, SQLite parity baseline)

**Exit criteria:** ingest -> parse -> entity extraction -> persisted article visible in UI.

### Days 31–60: Intelligence workflows
- Add AI summarization + classification with caching
- Build case board (create case, pin article/entity, add notes)
- Build timeline panel for case artifacts
- Add globe panel with location plotting + filter by case/entity
- Improve provenance UX (show which source generated each insight)

**Exit criteria:** analyst can build a case from feeds and produce a coherent timeline.

### Days 61–90: Hardening + launch prep
- Plugin SDK v0 (manifest + lifecycle + capability permissions)
- Baseline relationship graph panel
- Export/report generation (Markdown + JSON package)
- Performance pass (ingestion batching, UI virtualization, memoized selectors)
- Security/legal review (public-data-only guardrails + policy text)
- Docs: quickstart, architecture, ethics statement, contribution guide

**Exit criteria:** public beta with installable desktop app and GitHub Pages web deployment.

---

## 5) License Recommendation

### Recommended default
- **AGPL-3.0** for core platform if you want improvements to remain open, including network-served modifications.

### Alternative paths
- **MPL-2.0** if you want a middle ground (file-level copyleft, more business-friendly integration).
- **Apache-2.0** if maximum adoption/ecosystem embedding is top priority.

### Startup-grade strategy
- Core under AGPL or MPL, plugins under permissive licenses where needed.
- Add a clear CLA policy only if you plan dual-licensing later.

---

## 6) Plugin System Design (scalable)

### Plugin goals
- Allow third parties to add ingest connectors, analyzers, and visual modules.
- Keep security boundaries strict (especially for desktop runtime).
- Maintain deterministic, auditable outputs.

### Plugin model
- **Manifest-driven** plugin registration (`plugin.json`)
  - id, version, author, capabilities, required permissions, UI contributions
- **Capability-based API**
  - `ingestion.source`
  - `analysis.entityExtractor`
  - `analysis.classifier`
  - `visual.panel`
  - `export.formatter`
- **Lifecycle hooks**
  - `onInstall`, `onEnable`, `onDisable`, `onUninstall`
- **Execution modes**
  - Web-safe sandbox (limited API surface)
  - Desktop extended mode (Tauri-scoped permissions)

### Trust and safety controls
- Permission prompts for sensitive capabilities (network/file access)
- Signed plugin packages (future milestone)
- Runtime isolation + timeout/resource limits
- Provenance stamping: plugin ID/version attached to every artifact it creates

### Versioning strategy
- Semantic versioning for plugin SDK
- Compatibility table in core app for supported plugin API ranges
- Soft-fail behavior: incompatible plugins auto-disabled with actionable diagnostics

---

## 7) Immediate Next Steps (1 week)

1. Decide frontend framework (SvelteKit strongly recommended for this use case).
2. Lock license choice and contribution policy.
3. Create monorepo skeleton exactly as above.
4. Implement one end-to-end vertical slice:
   - RSS source -> Article -> Entity extraction -> Case pin -> Timeline entry.
5. Define plugin manifest schema and validate it in CI from day one.

