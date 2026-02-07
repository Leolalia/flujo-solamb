param(
  [string]$OutDir = "docs/_audit"
)

$ErrorActionPreference = "Stop"

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

"timestamp_utc: $([DateTime]::UtcNow.ToString('o'))" | Set-Content -Encoding UTF8 "$OutDir/meta.txt"
"pwd: $(Get-Location)" | Add-Content -Encoding UTF8 "$OutDir/meta.txt"
"git_head: $(git rev-parse HEAD)" | Add-Content -Encoding UTF8 "$OutDir/meta.txt"
"git_branch: $(git rev-parse --abbrev-ref HEAD)" | Add-Content -Encoding UTF8 "$OutDir/meta.txt"

# Lista completa de archivos versionados (fuente de verdad)
git ls-tree -r --name-only HEAD | Set-Content -Encoding UTF8 "$OutDir/tree.txt"

# Hashes SHA256 de cada archivo versionado (para auditoría / continuidad)
$files = Get-Content "$OutDir/tree.txt"
$hashLines = New-Object System.Collections.Generic.List[string]

foreach ($f in $files) {
  if (Test-Path $f) {
    $h = (Get-FileHash -Algorithm SHA256 $f).Hash.ToLower()
    $hashLines.Add("$h  $f")
  } else {
    $hashLines.Add("MISSING  $f")
  }
}

$hashLines | Set-Content -Encoding UTF8 "$OutDir/hashes.sha256"

# Señales de riesgo típicas (no bloquea, solo lista)
$patterns = @(
  "node_modules",
  "\.db$",
  "\.db-wal$",
  "\.db-shm$",
  "dist/",
  "build/"
)

$hits = New-Object System.Collections.Generic.List[string]
foreach ($p in $patterns) {
  $m = Select-String -Path "$OutDir/tree.txt" -Pattern $p -SimpleMatch -ErrorAction SilentlyContinue
  if ($m) { $hits.Add("HIT: $p") }
}
if ($hits.Count -eq 0) { $hits.Add("OK: no obvious binary/runtime artifacts in tree list") }
$hits | Set-Content -Encoding UTF8 "$OutDir/risk-signals.txt"

Write-Host "AUDIT_OK -> $OutDir"
