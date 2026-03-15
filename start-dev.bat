@echo off
REM Start PathShala AI - Frontend and Backend
REM Windows batch script for starting both servers

echo.
echo =====================================
echo    PathShala AI - Development Setup
echo =====================================
echo.

REM Check if backend .env exists
if not exist "backend\.env" (
    echo [ERROR] backend\.env not found!
    echo Please create backend\.env with required credentials.
    pause
    exit /b 1
)

REM Check if frontend .env.local exists
if not exist "frontend\.env.local" (
    echo [WARNING] frontend\.env.local not found. Creating default...
    (
        echo # Frontend Environment Configuration
        echo VITE_API_BASE_URL=http://localhost:8000
        echo VITE_DEFAULT_CLASS_LEVEL=10
    ) > "frontend\.env.local"
    echo [OK] Created frontend\.env.local
)

echo.
echo [1/3] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Please install Python 3.9+
    pause
    exit /b 1
)
echo [OK] Python found

echo.
echo [2/3] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js 16+
    pause
    exit /b 1
)
echo [OK] Node.js found

echo.
echo [3/3] Starting servers...
echo.
echo Starting Backend (Flask) on http://localhost:8000
echo Starting Frontend (Vite) on http://localhost:5173
echo.
echo [Press Ctrl+C in each window to stop servers]
echo.

REM Start backend in new window
cd backend
start "PathShala Backend" cmd /K "python app.py"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start frontend in new window
cd ..\frontend
start "PathShala Frontend" cmd /K "npm run dev"

cd ..

echo.
echo [OK] Both servers are starting...
echo.
echo Open your browser to: http://localhost:5173
echo.
echo To stop:
echo   - Close the Backend window
echo   - Close the Frontend window
echo.
pause
