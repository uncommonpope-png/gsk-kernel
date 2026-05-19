@echo off
cd /d "%~dp0"
echo Starting The Greatest Agent Ever...
node --max-old-space-size=4096 src/main.js