# Software Requirements Specification — BAS Cloud Validation

## 1. Purpose

The Local Breach and Attack Simulation (BAS) Control Validation Pipeline establishes a
controlled environment for exercising breach and attack simulation techniques against an
isolated endpoint and verifying that the expected telemetry reaches the security monitoring
layer.

The BAS Cloud Validation web application provides the analyst-facing surface for observing,
querying, and initiating validation activity against that pipeline.

This document defines the functional and non-functional requirements for the delivered
system, including the local validation pipeline, the web application, and the cloud
deployment version.

## 2. Scope

### 2.1 In Scope

- Local stack delivering Elasticsearch 8.12.0, Kibana 8.12.0, Linux Audit Framework based
  telemetry collection, and Invoke-AtomicRedTeam execution.
- Web application providing authentication, routed dashboard panels, telemetry overview,
  technique detail, log exploration, export, Atomic Red Team launcher, and live event stream.
- Cloud deployment version packaging the dashboard for containerized hosting.

### 2.2 Out of Scope

- Production SIEM integration.
- Real-world endpoint telemetry beyond the isolated lab scope.

## 3. Stakeholders and Users

- Security operations engineers performing detection validation.
- Detection engineering teams tuning SIEM rules.
- Red and blue team practitioners running technique simulations.
- DevSecOps and platform engineers owning the local validation environment.

## 4. Definitions

- BAS: Breach and Attack Simulation.
- ART: Atomic Red Team.
- KQL: Kibana Query Language.
- Audit key: Named Linux Audit Framework rule identifier used for telemetry filtering.

## 5. References

- `VALIDATION_PLAYBOOK.md`
- `docker-compose.yml`
- `web/`
- `setup-target-logging.sh`
- `install-simulation-engine.sh`

## 6. Functional Requirements

### FR-001 — Local validation pipeline
The system shall provide a dockerized local stack comprising Elasticsearch, Kibana, an
isolated Ubuntu 22.04 target endpoint, Linux Audit Framework baseline, and Atomic Red Team
execution engine.

### FR-002 — Dashboard authentication
The web application shall require authentication before granting access to the dashboard.

### FR-003 — Telemetry overview
The dashboard shall display Elasticsearch cluster health and related status information.

### FR-004 — Technique detail and queries
The dashboard shall expose technique details and permit execution of technique-scoped
queries against configured audit keys.

### FR-005 — Log explorer and export
The dashboard shall support log exploration through KQL, index listing, and JSON export of
query results.

### FR-006 — Detection coverage
The dashboard shall support mapping simulated techniques to audit rules and running coverage
checks.

### FR-007 — Atomic Red Team launcher
The dashboard shall expose Atomic Red Team launch controls for supported techniques.

### FR-008 — Live event stream
The dashboard shall stream recent events from Elasticsearch at a periodic interval.

### FR-009 — Interface behavior
The interface shall provide futuristic rendering elements, including cursor glow, particle
field, scan reticle, and text glitch effects, without degrading core functionality.

## 7. Non-Functional Requirements

### NFR-001 — Performance
The dashboard shall lazy-load panels after initial render to minimize startup latency.

### NFR-002 — Resilience
The dashboard shall degrade gracefully when the backend is unavailable, presenting status and
error states without failure of the interface shell.

### NFR-003 — Security
Authentication shall gate access to the dashboard; interface shall not expose operational
secrets.

## 8. User Stories

- As a SOC analyst, I want to view cluster health so that I can confirm telemetry ingestion.
- As a detection engineer, I want to run technique queries so that I can validate coverage.
- As a red team operator, I want to launch Atomic Red Team tests so that simulated activity
  produces telemetry.
- As an analyst, I want to export query results so that evidence can be preserved.

## 9. Acceptance Criteria

- Local stack builds and starts with docker compose.
- Dashboard authenticates and renders all panels.
- Technique queries and exports function against a running Elasticsearch.
- Cloud deployment version builds and deploys.

## 10. Open Items

- Full-stack cloud deployment execution pending Fly CLI authentication and deployment.
- Custom domain activation pending DNS configuration for `baslab.io`.
