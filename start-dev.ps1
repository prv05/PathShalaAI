# Start PathShala AI - Frontend and Backend
# PowerShell script for starting development servers

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   PathShala AI - Development Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if backend .env exists
if (-not (Test-Path "backend\.env")) {
    Write-Host "[ERROR] backend\.env not found!" -ForegroundColor Red
    Write-Host "Please create backend\.env with required credentials." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if frontend .env.local exists
if (-not (Test-Path "frontend\.env.local")) {
    Write-Host "[WARNING] frontend\.env.local not found. Creating default..." -ForegroundColor Yellow
    $envContent = @"
# Frontend Environment Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_DEFAULT_CLASS_LEVEL=10
"@
    $envContent | Out-File -FilePath "frontend\.env.local" -Encoding UTF8
    Write-Host "[OK] Created frontend\.env.local" -ForegroundColor Green
}

Write-Host ""
Write-Host "[1/3] Checking Python installation..." -ForegroundColor Cyan
$pythonCheck = python --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Python not found. Please install Python 3.9+" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Python found: $pythonCheck" -ForegroundColor Green

Write-Host ""
Write-Host "[2/3] Checking Node.js installation..." -ForegroundColor Cyan
$nodeCheck = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Node.js not found. Please install Node.js 16+" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Node.js found: $nodeCheck" -ForegroundColor Green

Write-Host ""
Write-Host "[3/3] Starting servers..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting Backend (Flask) on http://localhost:8000" -ForegroundColor Yellow
Write-Host "Starting Frontend (Vite) on http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "[Note] Close terminal windows to stop servers" -ForegroundColor Cyan
Write-Host ""

# Start backend in new PowerShell window
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; python app.py" `
    -WindowStyle Normal

# Wait for backend to start
Start-Sleep -Seconds 3

# Start frontend in new PowerShell window
$frontendPath = Join-Path $PSScriptRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev" `
    -WindowStyle Normal

Write-Host ""
Write-Host "[OK] Both servers are starting..." -ForegroundColor Green
Write-Host ""
Write-Host "✓ Backend API: http://localhost:8000" -ForegroundColor Green
Write-Host "✓ Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Open: http://localhost:5173 in your browser" -ForegroundColor Cyan
Write-Host ""
Write-Host "Health check: curl http://localhost:8000/health" -ForegroundColor Gray
Write-Host ""
