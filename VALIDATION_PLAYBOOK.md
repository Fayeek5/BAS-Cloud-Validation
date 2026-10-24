# Local BAS Validation Playbook

## Purpose

This playbook documents three controlled simulation scenarios executed against
the `security-target-endpoint` container. Each scenario validates that the
deployed audit controls generate actionable telemetry and that the SIEM
pipeline surfaces the expected records in Kibana Discover.

## Prerequisites

- `docker compose up -d` completed successfully.
- Audit baseline installed on the target (`setup-target-logging.sh`).
- Simulation engine installed on the target (`install-simulation-engine.sh`).

---

## Case 1 - Encoded Command Execution

### Technique

T1059 - Command and Scripting Interpreter Execution

### Objective

Validate that process execution events are captured by the audit baseline when
a command is passed through an encoded representation and executed locally.

### Procedure

Execute an encoded command string inside the target container:

```bash
docker exec -it security-target-endpoint bash -c 'echo "SGVsbG8gd29ybGQ=" | base64 -d | bash'
```

The decoded payload is passed to the interpreter and executed as a child
process, which should produce an `execve` audit record under the
`process_exec` key.

### SIEM Validation

Open Kibana Discover and run the following KQL query to confirm that the
execution telemetry reached the SIEM:

```
auditd.key: "process_exec"
```

---

## Case 2 - Local Enumeration

### Technique

T1033 - System Owner / User Discovery

### Objective

Validate that access changes to the identity database are audited and that
local enumeration activity generates the expected audit record.

### Procedure

Run a local enumeration command inside the target container:

```bash
docker exec -it security-target-endpoint bash -c 'id; cat /etc/passwd'
```

Reading the account database should produce an audit record under the
`identity_modification` key.

### SIEM Validation

Open Kibana Discover and run the following KQL query to confirm that the
identity telemetry reached the SIEM:

```
auditd.key: "identity_modification"
```

---

## Case 3 - Outbound Command Trigger

### Technique

T1071 - Application Layer Protocol Tunneling (outbound command class)

### Objective

Validate that outbound activity initiated through common command line tooling
is captured by the audit baseline.

### Procedure

Trigger an outbound command inside the target container:

```bash
docker exec -it security-target-endpoint bash -c 'curl -s -o /dev/null --max-time 5 http://example.com'
```

The outbound session should produce an audit record under the outbound command
key.

### SIEM Validation

Open Kibana Discover and run the following KQL query to confirm that the
outbound telemetry reached the SIEM:

```
auditd.key: "outbound_curl"
```

---

## Troubleshooting

- Confirm the audit daemon is running: `docker exec security-target-endpoint ps aux | grep auditd`
- Confirm rules are loaded: `auditctl -l`
- Confirm the SIEM index pattern exists in Kibana.
- Re-run the stack with `docker compose up -d --force-recreate` when rules or
  images change.

## Cleanup

```bash
docker compose down
```
