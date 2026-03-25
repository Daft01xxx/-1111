$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = if ($env:PORT) { $env:PORT } else { "8080" }
$hostAddress = if ($env:HOST) { $env:HOST } else { "127.0.0.1" }
$pidFile = Join-Path $root ".server.pid"
$logFile = Join-Path $root "server.log"
$errFile = Join-Path $root "server.err.log"
$nodePath = (Get-Command node -ErrorAction Stop).Source

if (Test-Path $pidFile) {
  $existingPid = Get-Content $pidFile -ErrorAction SilentlyContinue
  if ($existingPid) {
    $existingProcess = Get-Process -Id $existingPid -ErrorAction SilentlyContinue
    if ($existingProcess) {
      Write-Output "NaPiwas scratch build is already running at http://$hostAddress`:$port (PID $existingPid)"
      exit 0
    }
  }
  Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
}

if (Test-Path $logFile) { Remove-Item $logFile -Force }
if (Test-Path $errFile) { Remove-Item $errFile -Force }

$process = Start-Process `
  -FilePath $nodePath `
  -ArgumentList "server.mjs" `
  -WorkingDirectory $root `
  -RedirectStandardOutput $logFile `
  -RedirectStandardError $errFile `
  -PassThru

Set-Content -Path $pidFile -Value $process.Id
Write-Output "NaPiwas scratch build is live at http://$hostAddress`:$port (PID $($process.Id))"
