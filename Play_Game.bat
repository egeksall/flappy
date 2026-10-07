@echo off
title Flappy Bird Ultra Launcher
echo ==============================================
echo   Starting Flappy Bird Ultra...
echo ==============================================
cd /d "%~dp0"

:: Open the browser to the game
start http://localhost:8080

:: Start the local web server
python serve.py
pause
