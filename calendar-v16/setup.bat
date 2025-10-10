@echo off
echo.
echo ========================================
echo   Calendar Backend Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node -v
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

echo [OK] npm found:
npm -v
echo.

REM Install dependencies
echo [STEP 1] Installing dependencies...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo [OK] Dependencies installed successfully!
) else (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo [STEP 2] Creating .env file...
    copy .env.example .env >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo [OK] .env file created
        echo.
        echo [WARNING] Please edit .env file and add your DATABASE_URL
        echo For local development, you can use Railway's database
        echo Run: railway link ^&^& railway run npm run dev
    ) else (
        echo [WARNING] Could not create .env file automatically
        echo Please copy .env.example to .env manually
    )
) else (
    echo [STEP 2] .env file already exists
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file with your database URL (if using local DB)
echo 2. Run 'npm start' to start the server
echo 3. Or deploy to Railway: push to GitHub and connect in Railway dashboard
echo.
echo Read QUICK-START.md for deployment instructions
echo.
pause


