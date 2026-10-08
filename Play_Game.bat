@echo off
title Angry Flappy Launcher
echo ==============================================
echo   Starting Angry Flappy (Flappy + Angry Birds)...
echo ==============================================
cd /d "%~dp0"

:: Open the browser to the game
start http://localhost:8080

:: Start the local web server
python serve.py
pause
