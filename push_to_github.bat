@echo off
echo Pushing changes to GitHub...

REM Add all changes
git add .

REM Commit changes
set /p commit_message="Enter commit message: "
git commit -m "%commit_message%"

REM Push to GitHub
git push origin main

echo.
echo Push complete. Your changes have been uploaded to GitHub.
echo.

pause