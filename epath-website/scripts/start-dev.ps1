<#
.SYNOPSIS
  Start the Next.js dev server with env loaded from .env.local.
.DESCRIPTION
  Loads every key from .env.local into the current process so Next.js
  picks them up, then starts `npm run dev`. Captures output to
  dev.log so logs survive this terminal closing.
.PARAMETER Port
  Port to run Next.js on (default 3000).
.EXAMPLE
  .\start-dev.ps1
  .\start-dev.ps1 -Port 3001
#>
param(
    [int]$Port = 3000
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $ProjectRoot

$envFile = Join-Path $ProjectRoot '.env.local'
if (Test-Path $envFile) {
    Write-Host "[start-dev] Loading env from .env.local..." -ForegroundColor Cyan
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith('#') -and $line.Contains('=')) {
            $parts = $line.Split('=', 2)
            $name = $parts[0].Trim()
            $value = $parts[1].Trim()
            # Strip surrounding quotes if present.
            if ($value.StartsWith('"') -and $value.EndsWith('"')) {
                $value = $value.Substring(1, $value.Length - 2)
            }
            Set-Item -Path "Env:$name" -Value $value
        }
    }
}
else {
    Write-Host "[start-dev] .env.local not found, using existing process env." -ForegroundColor Yellow
}

$env:PORT = $Port
$logFile = Join-Path $env:TEMP "epath-dev-$Port.log"

Write-Host "[start-dev] Starting Next.js on port $Port (log: $logFile)" -ForegroundColor Green
Write-Host "[start-dev] Press Ctrl+C to stop." -ForegroundColor DarkGray

npm run dev 2>&1 | Tee-Object -FilePath $logFile