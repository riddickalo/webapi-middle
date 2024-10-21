@echo off
setlocal enabledelayedexpansion
:: Load environment variables from env-demo.txt
for /f "tokens=1,2 delims==" %%a in (env-demo.txt) do (
    set "%%a=%%b"
)

:: Print all environment variables
:: echo All Environment Variables:
:: set

:: Run the service
.\build\webapi-middle-win.exe

endlocal