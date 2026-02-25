@echo off
title CHIRON USB Interface
echo Launching The Wounded Healer Interface...
echo Warning: Local Storage APIs rely on the browser's execution context.
echo Ensuring default local execution policy is respected...
cd /d "%~dp0"
start "" "index.html"
exit
