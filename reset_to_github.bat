@echo off
echo Resetting local changes to the last GitHub commit...

REM Fetch the latest changes from the remote repository
git fetch origin

REM Reset the local branch to match the remote branch
git reset --hard origin/main

REM Display the current status
git status

echo.
echo Reset complete. Your local repository now matches the last commit on GitHub.
echo.

pause