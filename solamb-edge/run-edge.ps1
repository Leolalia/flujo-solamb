while ($true) {
  Write-Host "[WATCHDOG] Checking port 7789..."

  $portInUse = Get-NetTCPConnection -LocalPort 7789 -ErrorAction SilentlyContinue

  if ($portInUse) {
    Write-Host "[WATCHDOG] Port 7789 in use. Waiting 5s..."
    Start-Sleep -Seconds 5
    continue
  }

  Write-Host "[WATCHDOG] Starting SOLAMB EDGE..."
  npm start

  Write-Host "[WATCHDOG] Edge stopped. Restarting in 3s..."
  Start-Sleep -Seconds 3
}
