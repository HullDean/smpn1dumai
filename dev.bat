@echo off
echo ============================================
echo   SMPN 1 Dumai - Local Development Server
echo ============================================
echo.
echo Pastikan PostgreSQL sudah jalan dan .env sudah diisi!
echo.
echo Menjalankan Backend (port 8080)...
start "API Server" cmd /k "cd artifacts\api-server && node --env-file=.env --watch --experimental-transform-types src/index.ts"

timeout /t 3 /nobreak > nul

echo Menjalankan Frontend (port 5173)...
start "Frontend" cmd /k "cd artifacts\smpn1dumai && set PORT=5173 && set BASE_PATH=/ && pnpm run dev"

echo.
echo ============================================
echo  Backend  : http://localhost:8080
echo  Frontend : http://localhost:5173
echo  Admin    : http://localhost:5173/admin
echo ============================================
echo.
pause
