$ErrorActionPreference = "Stop"
Set-Location "C:\Users\User\OneDrive\Documents\PROFIT BRAIN\SCRIBE\mega-kernel"

Write-Host "Starting The Greatest Agent Ever..." -ForegroundColor Cyan

$process = Start-Process -FilePath "node" -ArgumentList "--max-old-space-size=4096","src/main.js" -NoNewWindow -PassThru -RedirectStandardInput "input.txt" -RedirectStandardOutput "output.txt" -RedirectStandardError "error.txt"

Start-Sleep -Seconds 8

"wake up neo" | Set-Content "input.txt" -NoNewline

Start-Sleep -Seconds 30

if (!$process.HasExited) {
    Stop-Process -Id $process.Id -Force
}

Write-Host "`n=== OUTPUT ===" -ForegroundColor Yellow
Get-Content "output.txt" | Select-Object -Last 60