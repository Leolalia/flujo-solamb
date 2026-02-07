param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

Set-Location $RepoRoot

New-Item -ItemType Directory -Force ".\docs\_handoff" | Out-Null

# Commit + branch (si no hay git, queda vacío)
$branch    = (git rev-parse --abbrev-ref HEAD) 2>$null
$commit    = (git rev-parse HEAD) 2>$null
$commitMsg = (git log -1 --pretty=%B) 2>$null

# Tree (duro)
git ls-tree -r --name-only HEAD | Set-Content ".\docs\_handoff\TREE.txt" -Encoding UTF8

# Endpoints Edge (búsqueda estática sin pipes colgando)
$edgePath = Join-Path $RepoRoot "solamb-edge"
$edgeOut  = Join-Path $RepoRoot "docs\_handoff\ENDPOINTS_EDGE.txt"
if (Test-Path $edgePath) {
  Set-Location $edgePath
  $hits = Select-String -Path ".\src\**\*.ts*" -Pattern "app\.(get|post|put|delete)\(|router\.(get|post|put|delete)\(|listen\(" -ErrorAction SilentlyContinue
  ($hits | ForEach-Object { $_.Line }) | Set-Content $edgeOut -Encoding UTF8
} else {
  "MISSING: solamb-edge not found at $edgePath" | Set-Content $edgeOut -Encoding UTF8
}

# Endpoints UI (búsqueda estática)
$uiPath = Join-Path $RepoRoot "admin-ui"
$uiOut  = Join-Path $RepoRoot "docs\_handoff\ENDPOINTS_UI.txt"
if (Test-Path $uiPath) {
  Set-Location $uiPath
  $hits2 = Select-String -Path ".\src\**\*.ts*" -Pattern "/health|/snapshots|/simulations|/audit|/ledger|/status|http://localhost:7789" -ErrorAction SilentlyContinue
  ($hits2 | ForEach-Object { $_.Line }) | Set-Content $uiOut -Encoding UTF8
} else {
  "MISSING: admin-ui not found at $uiPath" | Set-Content $uiOut -Encoding UTF8
}

# STATE.json
Set-Location $RepoRoot
$state = [ordered]@{
  generated_at   = (Get-Date).ToString("s")
  repo           = "https://github.com/Leolalia/flujo-solamb"
  branch         = $branch
  head           = $commit
  head_message   = ($commitMsg | Out-String).Trim()
  root_expected  = @("admin-ui","solamb-edge","network-sim-proxy","central-receiver","docs","tools")
  phase_active   = "FASE 6 — Admin UI local (Electron + React) para pruebas de campo"
  edge_local_url = "http://localhost:7789"
  admin_local_url= "http://localhost:5173"
  field_assumptions = [ordered]@{
    single_pc                  = $true
    single_operator            = $true
    modular_device_tests       = $true
    anpr_cameras               = 2
    ocr_camera                 = 1
    barrier_separate_from_scale= $true
    must_support_manual_fallback= $true
  }
}

($state | ConvertTo-Json -Depth 10) | Set-Content ".\docs\_handoff\STATE.json" -Encoding UTF8

Write-Host "[handoff] OK -> docs/_handoff/STATE.json + TREE.txt + ENDPOINTS_EDGE.txt + ENDPOINTS_UI.txt"
