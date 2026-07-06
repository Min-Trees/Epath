<#
.SYNOPSIS
  Expose localhost:<Port> to the public internet via ngrok and print
  the URL. Useful for Zalo webhook testing.
.DESCRIPTION
  Requires `ngrok` on PATH and a saved authtoken (run `ngrok config
  add-authtoken <token>` once). The tunnel URL is printed to stdout
  and also copied to clipboard so it can be pasted into Zalo OA
  webhook settings.
.PARAMETER Port
  Local port to forward (default 3000).
.PARAMETER Region
  ngrok region (default us). Use 'ap' for Vietnam-adjacent latency.
.EXAMPLE
  .\start-tunnel.ps1
  .\start-tunnel.ps1 -Port 3001 -Region ap
#>
param(
    [int]$Port = 3000,
    [string]$Region = 'us'
)

$ErrorActionPreference = 'Stop'
$ngrok = Get-Command ngrok -ErrorAction SilentlyContinue
if (-not $ngrok) {
    Write-Error "ngrok not found on PATH. Install it from https://ngrok.com/download and run 'ngrok config add-authtoken <token>'."
}

Write-Host "[tunnel] Forwarding https://*.ngrok-free.app -> http://localhost:$Port" -ForegroundColor Cyan
Write-Host "[tunnel] Copy the https URL it prints into Zalo OA -> Webhook URL." -ForegroundColor Yellow
Write-Host "[tunnel] Add '/api/chatbot/zalo-webhook' to the end of the URL." -ForegroundColor Yellow

ngrok http $Port --region $Region