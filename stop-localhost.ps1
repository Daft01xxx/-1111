$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$pidFile = Join-Path $root ".server.pid"

if (-not (Test-Path $pidFile)) {
  Write-Output "No saved localhost PID was found."
  exit 0
}

$processId = Get-Content $pidFile -ErrorAction SilentlyContinue
if (-not $processId) {
  Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
  Write-Output "PID file was empty."
  exit 0
}

$process = Get-Process -Id $processId -ErrorAction SilentlyContinue
if ($process) {
  Stop-Process -Id $processId -Force
  Write-Output "Stopped NaPiwas scratch localhost server (PID $processId)."
} else {
  Write-Output "Process $processId was not running."
}

Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
