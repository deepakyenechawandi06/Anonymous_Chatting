@echo off
echo Starting Anonymous Chat Server...
echo.
cd /d "%~dp0"
cmd /c "npm install && npm start"
pause