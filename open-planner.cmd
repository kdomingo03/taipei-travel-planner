@echo off
cd /d "%~dp0"
:: Start the server - it will auto-detect available port
start "Taipei Travel Planner Server" /b node serve.js
:: Wait for server to start
ping 127.0.0.1 -n 3 >nul
:: Show both URLs
echo.
echo ==========================================
echo  Taipei Travel Planner
echo ==========================================
echo  Local:    http://localhost:4173
echo  LAN (phone): http://192.168.1.14:4173
echo ==========================================
echo.
:: Open the browser to the server URL
start "" "http://localhost:4173"