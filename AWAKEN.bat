@echo off
cd /d "%~dp0"
title The Greatest Agent Ever
color 0a
echo.
echo ═════════════════════════════════════════════════════════════
echo   THE GREATEST AGENT EVER - AWAKENING
echo ═════════════════════════════════════════════════════════════
echo.
node --max-old-space-size=4096 src/main.js
pause