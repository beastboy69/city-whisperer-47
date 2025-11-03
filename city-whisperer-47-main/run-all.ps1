Write-Host "🔍 Checking for processes on ports 4000, 5173, and 8081..."

function Stop-Port {
    param([int]$Port)
    try {
        $conns = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        if ($conns) {
            $pids = $conns | Select-Object -ExpandProperty OwningProcess | Sort-Object -Unique
            foreach ($pid in $pids) {
                Write-Host ("🧹 Killing process on port {0} (PID: {1})" -f $Port, $pid)
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            }
        }
    } catch {
        Write-Host ("⚠️ Unable to query/stop processes on port {0}: {1}" -f $Port, $_.Exception.Message)
    }
}

foreach ($p in @(4000,5173,8081)) { Stop-Port -Port $p }

Write-Host "⚙️ Starting backend..."
$backend = "cd `"$PSScriptRoot\backend`"; npm run dev"
Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command", $backend -WindowStyle Normal

Write-Host "🕒 Waiting for backend to start..."
Start-Sleep -Seconds 5

Write-Host "🌐 Starting frontend..."
$frontend = "cd `"$PSScriptRoot\frontend`"; npm run dev"
Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command", $frontend -WindowStyle Normal

Write-Host "✅ Both frontend and backend are running!"
Write-Host "📦 Backend: http://localhost:4000"
Write-Host "💻 Frontend: http://localhost:5173 or http://localhost:8081"


