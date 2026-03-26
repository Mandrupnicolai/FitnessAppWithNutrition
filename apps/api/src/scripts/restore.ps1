param(
  [Parameter(Mandatory=$true)][string]$ArchivePath
)

if (!(Test-Path $ArchivePath)) { throw "Archive not found: $ArchivePath" }

$mongoContainer = docker ps -q --filter "ancestor=mongo:7" | Select-Object -First 1
if (-not $mongoContainer) { throw "No running mongo:7 container found. Start it with: docker compose up -d" }

Get-Content -Encoding Byte $ArchivePath | docker exec -i $mongoContainer mongorestore --drop --archive
Write-Host "Restore complete from $ArchivePath"

