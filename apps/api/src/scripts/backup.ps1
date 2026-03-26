param(
  [string]$OutDir = ".\\backups"
)

New-Item -ItemType Directory -Path $OutDir -Force | Out-Null

$mongoContainer = docker ps -q --filter "ancestor=mongo:7" | Select-Object -First 1
if (-not $mongoContainer) { throw "No running mongo:7 container found. Start it with: docker compose up -d" }

docker exec -i $mongoContainer mongodump --archive |
  Set-Content -Encoding Byte (Join-Path $OutDir ("backup-" + (Get-Date -Format "yyyyMMdd-HHmmss") + ".archive"))

Write-Host "Backup written to $OutDir"

