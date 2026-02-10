@echo off
echo Setting up CORS for Firebase Storage...
echo.
echo NOTE: You must have 'gsutil' installed (part of Google Cloud SDK).
echo If you do not have it, please install it or apply the CORS config manually in the Firebase Console.
echo.

call gsutil cors set cors.json gs://kindcents.firebasestorage.app
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to set CORS.
    echo ensure you have permissions and gsutil installed.
    echo.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [SUCCESS] CORS configuration applied!
pause
