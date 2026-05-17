# Industrial Predictive Maintenance & Safety AI Platform

Production-grade Saudi-focused SaaS platform for industrial predictive maintenance, explainable AI scoring, maintenance operations, and safety intelligence.

This platform is designed with a strong enterprise security posture and scalable multi-tenant architecture. No serious system can honestly promise to be "unhackable", but this codebase is structured to minimize risk through secure defaults, access controls, tenant isolation, auditability, and deployment hardening.

## Overview

This repository contains:

- `apps/web`: Next.js enterprise frontend with English/Arabic localization architecture and RTL support.
- `backend`: FastAPI backend with JWT auth, multi-tenant industrial domain modules, explainable AI services, and seed/demo data.
- `docs`: Technical documentation covering architecture, API design, database schema, and AI modules.
- `infra`: Local infrastructure helpers such as Nginx reverse proxy configuration.
- `seed-data`: Synthetic industrial sample data for local demos and future ingestion tests.

## Product Capabilities

- Multi-tenant industrial asset registry
- Machine health scoring and anomaly monitoring
- Predictive maintenance recommendations and remaining useful life estimates
- Work order and maintenance plan management
- Incident management and AI-assisted root-cause analysis
- Safety alerts and operational risk correlation
- Executive dashboards with plant-wide KPIs
- Localization-ready UX for Saudi B2B deployment
- Security-first architecture for sensitive industrial operational data
- Compatible with small factories, multi-plant enterprises, and industrial groups

## Architecture

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, modular UI components
- Backend: FastAPI, SQLAlchemy, Pydantic, JWT auth, Celery-ready jobs
- Data: PostgreSQL, Redis
- AI v1: explainable heuristics + statistical scoring for anomaly, failure risk, urgency, RCA, and safety severity
- Delivery: Docker Compose, `.env.example`, seed data, tests, docs
- Scale profile: suitable for single-site SMEs, regional manufacturers, and large industrial groups through tenant > factory > plant > production line > asset hierarchy

See [docs/architecture.md](/Users/mostafaelboghdady/Documents/Codex/2026-04-22-you-are-a-principal-software-architect/docs/architecture.md) for the full system design.

## Local Setup

### 1. Environment

Copy the example environment files:

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp backend/.env.example backend/.env
```

### 2. Start with Docker

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

### 3. Demo Credentials

- Email: `admin@najd-industries.sa`
- Password: `ChangeMe123!`

## Module Overview

- Auth and RBAC
- Asset registry
- Sensor and historical data ingestion
- AI analytics and predictions
- Maintenance plans and work orders
- Incident and RCA workflow
- Safety intelligence
- Dashboards and reports
- Notifications and admin settings

## AI Agent API

The backend now exposes an agent-ready API surface for orchestration tools, copilots, or external AI workers that need structured plant insight without scraping dashboards.

- Base path: `/api/v1/agent`
- Auth: `X-Agent-Key: <AGENT_API_KEY>` or `Authorization: Bearer <AGENT_API_KEY>`
- Capability discovery: `GET /api/v1/agent/capabilities`
- Structured execution: `POST /api/v1/agent/query`

Supported actions:

- `fleet_overview`
- `asset_diagnosis`
- `maintenance_planning`
- `incident_rca`
- `safety_triage`

Example:

```bash
curl -X POST http://localhost:8000/api/v1/agent/query \
  -H "Content-Type: application/json" \
  -H "X-Agent-Key: kashef-agent-demo-key" \
  -d '{
    "action": "asset_diagnosis",
    "asset_id": 101,
    "include_evidence": true,
    "context": {
      "locale": "en",
      "timezone": "Asia/Riyadh",
      "requesting_role": "reliability_engineer"
    }
  }'
```

The response includes a normalized summary, risk level, confidence score, recommendations, evidence, citations, and structured data payloads that can be passed directly into an AI agent workflow.

## OpenAI-Compatible Agent Adapter

An OpenAI-compatible adapter now sits on top of the internal agent API so you can plug Kashef Ai into the OpenAI Responses API with function tools instead of custom route glue.

- Catalog: `GET /api/v1/openai-agent/catalog`
- Request template builder: `POST /api/v1/openai-agent/request-template`
- Local tool execution bridge: `POST /api/v1/openai-agent/tool-call`

The adapter publishes OpenAI-style function tools for:

- `get_fleet_overview`
- `diagnose_asset`
- `plan_maintenance_action`
- `analyze_incident_rca`
- `triage_safety_alerts`

Example adapter bootstrap:

```bash
curl http://localhost:8000/api/v1/openai-agent/catalog \
  -H "X-Agent-Key: kashef-agent-demo-key"
```

Example request-template build:

```bash
curl -X POST http://localhost:8000/api/v1/openai-agent/request-template \
  -H "Content-Type: application/json" \
  -H "X-Agent-Key: kashef-agent-demo-key" \
  -d '{
    "user_message": "Review the highest-risk compressor and recommend the next maintenance action.",
    "context": {
      "locale": "en",
      "timezone": "Asia/Riyadh",
      "requesting_role": "maintenance_manager"
    }
  }'
```

Use `OPENAI_MODEL` to choose the target OpenAI model. OpenAI’s current model docs say models are available through the Responses API and support tools/function calling; if you are unsure where to start, their current recommendation is `gpt-5.5`: [Models](https://developers.openai.com/api/docs/models), [Compare models](https://developers.openai.com/api/docs/models/compare).

A ready-to-copy Python loop example is included at [backend/examples/openai_responses_agent_loop.py](/Users/mostafaelboghdady/Documents/Codex/2026-04-22-you-are-a-principal-software-architect/backend/examples/openai_responses_agent_loop.py). It fetches the Kashef Ai tool catalog, sends the request to OpenAI, executes tool calls locally, and feeds `function_call_output` items back until the model returns a final answer.

Install the official SDK before running the example:

```bash
pip install openai
```

## Security Posture

- Tenant-aware data model to keep company data isolated
- Role-based access control for executives, engineers, technicians, and auditors
- Password hashing and JWT-based API authentication
- Configurable CORS and trusted host restrictions
- Security response headers and HTTPS-ready deployment settings
- Audit-log model for sensitive operational actions
- Clear path for production upgrades such as SSO, MFA, secrets rotation, WAF, SIEM, and encrypted backups

See [docs/security.md](/Users/mostafaelboghdady/Documents/Codex/2026-04-22-you-are-a-principal-software-architect/docs/security.md) for the high-level security model.

## AI Logic Overview

V1 intelligence is intentionally explainable:

- Health score blends sensor deviations, open incidents, overdue maintenance, and alert severity.
- Failure risk score combines anomaly strength, criticality, maintenance history, and recent operating conditions.
- Maintenance urgency score prioritizes operational impact and risk.
- Safety severity score correlates asset degradation with unsafe operating patterns.
- RCA suggestions use event correlation across incidents, notes, sensor shifts, and part replacement history.

Detailed explanations live in [docs/ai-modules.md](/Users/mostafaelboghdady/Documents/Codex/2026-04-22-you-are-a-principal-software-architect/docs/ai-modules.md).

## Tests

- Backend unit and integration-oriented tests are under `backend/tests`
- Frontend critical logic tests are under `apps/web/tests`

## Future Enhancements

- Streaming ingestion via MQTT / Kafka
- Advanced ML pipelines and model registry
- CMMS / ERP integrations
- Arabic localization content completion
- Real notification delivery channels and SSO
- MFA, SSO with enterprise IdPs, secret rotation, field-level encryption, and managed SOC/SIEM integrations
