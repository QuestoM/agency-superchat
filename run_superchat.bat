@echo off
echo Starting SuperChat setup...
echo.

REM Create a log file
echo %date% %time% - Script started > superchat_setup.log

REM Check if we're in the correct directory
if not exist run_superchat.bat (
    echo Error: run_superchat.bat not found in current directory.
    echo Please run this script from the project root directory.
    echo %date% %time% - Error: Wrong directory >> superchat_setup.log
    pause
    exit /b
)

echo Checking directories...
echo %date% %time% - Checking directories >> superchat_setup.log

REM Create necessary directories if they don't exist
if not exist client mkdir client
if not exist client\src mkdir client\src
if not exist client\public mkdir client\public
if not exist server mkdir server

echo Directories checked/created.
echo %date% %time% - Directories checked/created >> superchat_setup.log

echo.
echo Checking Node.js installation...
echo %date% %time% - Checking Node.js installation >> superchat_setup.log

REM Check if Node.js is installed
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH.
    echo Please install Node.js and try again.
    echo %date% %time% - Error: Node.js not installed >> superchat_setup.log
    pause
    exit /b
)

echo Node.js is installed.
echo %date% %time% - Node.js is installed >> superchat_setup.log

echo.
echo Setting up client...
echo %date% %time% - Setting up client >> superchat_setup.log

cd client
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install client dependencies.
    echo %date% %time% - Error: Client setup failed >> ..\superchat_setup.log
    cd ..
    pause
    exit /b
)

echo Client setup completed.
echo %date% %time% - Client setup completed >> ..\superchat_setup.log

echo.
echo Starting client...
echo %date% %time% - Starting client >> ..\superchat_setup.log

start cmd /k npm start

cd ..

echo.
echo Setup process completed.
echo %date% %time% - Setup process completed >> superchat_setup.log

pause