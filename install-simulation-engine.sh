#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

ARCH="$(dpkg --print-architecture)"

curl -sSL -o /tmp/powershell.tar.gz \
  "https://github.com/PowerShell/PowerShell/releases/download/v7.4.1/powershell-7.4.1-linux-${ARCH}.tar.gz"

mkdir -p /opt/microsoft/powershell
tar -xzf /tmp/powershell.tar.gz -C /opt/microsoft/powershell
chmod 0755 /opt/microsoft/powershell/pwsh
ln -sf /opt/microsoft/powershell/pwsh /usr/local/bin/pwsh
rm -f /tmp/powershell.tar.gz

pwsh -NoProfile -Command "Install-Module -Name invoke-atomicredteam,powershell-yaml -Scope CurrentUser -Force"

pwsh -NoProfile -Command '$PSDefaultParameterValues = @{ "Invoke-AtomicTest:PathToAtomicsFolder" = "/opt/atomicredteam/atomics" }'

mkdir -p /opt/atomicredteam/atomics

pwsh -NoProfile -Command "Invoke-AtomicTest T1059.002 -TestNumbers 1"
pwsh -NoProfile -Command "Invoke-AtomicTest T1033.001 -TestNumbers 1"
