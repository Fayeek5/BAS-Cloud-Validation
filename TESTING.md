# Testing Guide — BAS Cloud Validation

## 1. Purpose

This document defines how the BAS Cloud Validation web application and the underlying
local validation pipeline are tested, verified, and validated.

## 2. Scope

- Web application build and runtime behavior.
- Dashboard functional flows.
- Elasticsearch-backed query paths.
- Deployment artifacts.

## 3. Test Types

### 3.1 Build Validation

```bash
cd web
npm run build
```

The build must complete without errors and produce static assets under `web/dist`.

### 3.2 Smoke Validation (Local Dev)

```bash
cd web
npm run dev
```

Verify:

1. Application loads at `http://localhost:5173/`.
2. Login route renders.
3. Authentication gates the dashboard.
4. Sign-in flow navigates to the dashboard.

### 3.3 Dashboard Functional Validation

Once authenticated, validate each panel:

1. **Overview** — cluster status renders; unreachable state handled when backend is down.
2. **Detection Coverage** — run coverage check renders results or handles empty state.
3. **Technique Detail** — technique detail and run query actions render.
4. **Log Explorer** — run query, list indices, and export JSON (export disabled until results exist).
5. **Atomic Red Team Launcher** — launcher controls render.
6. **Live Event Stream** — event polling renders; error state handled when backend is down.

### 3.4 Backend Validation

With the local stack running:

```bash
docker compose up -d
```

- Wait for Elasticsearch cluster health to become green.
- Execute technique query (for example `T1059` with audit key `process_exec`).
- Execute log query and export.

## 4. Expected Behavior

- Interface remains functional when backend is unavailable; status and error states are surfaced.
- No critical console errors during normal rendering.
- Lazy-loaded panels resolve without blocking the shell.

## 5. Acceptance Criteria

- Build passes.
- Login gates dashboard.
- Dashboard panels render.
- Queries succeed against a running Elasticsearch.
- Deployed build serves correctly.

## 6. Open Items

- Automated end-to-end test suite.
- Continuous deployment validation beyond single deploy run.
