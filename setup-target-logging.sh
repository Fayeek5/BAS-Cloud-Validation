#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

apt-get update -y
apt-get install -y --no-install-recommends auditd audispd-plugins

mkdir -p /var/log/audit

service auditd start >/dev/null 2>&1 || systemctl start auditd >/dev/null 2>&1 || true

cat >> /etc/audit/rules.d/audit.rules <<'EOF'

## Process execution monitoring
-a always,exit -F arch=b64 -S execve -k process_exec

## Identity modification monitoring
-w /etc/passwd -p wa -k identity_modification

## Outbound network command monitoring
-a always,exit -F arch=b64 -S execve -F exe=/usr/bin/curl -k outbound_curl
-a always,exit -F arch=b64 -S execve -F exe=/usr/bin/wget -k outbound_wget
-a always,exit -F arch=b64 -S execve -F exe=/usr/bin/nc -k outbound_nc
EOF

augenrules --load

echo "Audit control baseline installed and rules loaded."
