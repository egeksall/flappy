@echo off
title Fire Dragon Launcher
echo ==============================================
echo   Starting Fire Dragon (Free Flight & Evolution)...
echo ==============================================
cd /d "%~dp0"

:: Open the browser to the game
start http://localhost:8080

:: Start the local web server
python serve.py
pause
