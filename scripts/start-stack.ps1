<#
.SYNOPSIS
  Start Next.js dev server AND an ngrok tunnel in the same window.
  Useful for Zalo webhook development when you don't want to manage
  two terminals.
.DESCRIPTION
  Opens a second PowerShell window for the tunnel so logs from each
  stay separate. Both are killed when you close this script.
#>
param(
    [int]$Port = 3000,
    [string]$Region = 'us'
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')

# Start tunnel in a separate window so its log output is independent.
$tunnelScript = Join-Path $PSScriptRoot 'start-tunnel.ps1'
Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-File', $tunnelScript,
    '-Port', $Port,
    '-Region', $Region
) | Out-Null

Write-Host "[stack] Tunnel window opened. Starting dev server..." -ForegroundColor Cyan

# Run dev server in this window.
& (Join-Path $PSScriptRoot 'start-dev.ps1') -Port $Port