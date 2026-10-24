# Local BAS Control Validation Pipeline

## Overview

The Local BAS Control Validation Pipeline is a self-contained security
engineering environment for exercising local Breach and Attack Simulation (BAS)
checks against an isolated Linux endpoint and verifying that the expected
telemetry reaches the security monitoring layer.

The environment is built around three components:

- **Elasticsearch 8.12.0** - single-node log storage engine, sized for local
  resource consumption (`ES_JAVA_OPTS=-Xms512m -Xmx512m`, security hardened off
  for lab use).
- **Kibana 8.12.0** - visualization and search front end, bound natively to the
  local Elasticsearch endpoint and published on port `5601`.
- **security-target-endpoint** - Ubuntu 22.04 container that acts as the
  simulated adversary host, running the Linux Audit Framework and the Atomic
  Red Team execution engine.

All containers are attached to the software-defined `security-lab-net` bridge
network, keeping the simulated activity isolated from the host and from other
local containers.

## Architecture

```
+-----------------------+       +----------------------+       +---------------------------+
|   security-elasticsearch |<------>|      security-kibana      |<------| security-target-endpoint   |
|        (single node)    |       |         (port 5601)      |       |        (Ubuntu 22.04)       |
+-----------------------+       +----------------------+       +---------------------------+
                                                                     |
                                                          auditd / audispd
                                                          Invoke-AtomicRedTeam
```

1. The target endpoint writes audit records through the Linux Audit Framework.
2. The audit records are made available to the SIEM backend.
3. Analysts review the records in Kibana Discover using KQL queries documented
   in the validation playbook.

## Repository Layout

```
.
├── docker-compose.yml            # Local SIEM and simulation target stack
├── setup-target-logging.sh       # Audit framework baseline for the target
├── install-simulation-engine.sh  # PowerShell and Atomic Red Team setup
├── README.md
└── VALIDATION_PLAYBOOK.md
```

## Prerequisites

- Docker Engine 24.x or later
- Docker Compose v2 (`docker compose`)
- Outbound network access from the host for container image pulls and package
  downloads

## Installation

Start the full stack:

```bash
docker compose up -d
```

Wait for the Elasticsearch cluster health check to pass before continuing.

### Configure the audit target

Copy the logging setup script into the running target container and execute it:

```bash
docker cp setup-target-logging.sh security-target-endpoint:/tmp/setup-target-logging.sh
docker exec -it security-target-endpoint bash /tmp/setup-target-logging.sh
```

### Install the simulation engine

Copy the simulation engine installer into the running target container and
execute it:

```bash
docker cp install-simulation-engine.sh security-target-endpoint:/tmp/install-simulation-engine.sh
docker exec -it security-target-endpoint bash /tmp/install-simulation-engine.sh
```

## Validation Workflow

1. Start the stack with `docker compose up -d`.
2. Configure the audit baseline on the target.
3. Install the simulation engine on the target.
4. Execute the scenario documented in `VALIDATION_PLAYBOOK.md` through
   `docker exec` against the `security-target-endpoint` container.
5. Confirm the expected records appear in Kibana Discover and correlate against
   the configured audit keys.

## Resource Footprint

The local deployment is intentionally constrained:

- Elasticsearch heap is capped at 512 MB.
- The cluster runs as a single node.
- Security features are disabled because the lab does not process real data.

## Teardown

```bash
docker compose down
```

Add `-v` only when a full reset of the default network and volumes is required.

## License

This repository is released for defensive security validation and research use.
