@echo off
echo Starting Test WebSocket Server...
echo.
cd /d "%~dp0"
cmd /c "node test-server.js"
pause