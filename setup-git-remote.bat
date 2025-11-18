@echo off
REM Script per configurare Git remote e collegare la repository
REM Esegui questo script per collegare la repository a Cursor

echo.
echo ========================================
echo   Configurazione Git Remote
echo ========================================
echo.

cd /d "%~dp0"

REM Trova Git
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRORE] Git non trovato!
    echo Installa Git da: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [OK] Git trovato
echo.

REM Inizializza git se non esiste
if not exist ".git" (
    echo [INFO] Inizializzando repository Git...
    git init
    echo [OK] Repository inizializzata
    echo.
)

REM Verifica remote esistente
git remote get-url origin >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Remote 'origin' già configurato:
    git remote get-url origin
    echo.
    echo Vuoi aggiornarlo? (S/N)
    set /p response=
    if /i "%response%"=="S" (
        git remote set-url origin https://github.com/AnonymusRi/leo-replica-wizard.git
        echo [OK] Remote aggiornato
    )
) else (
    echo [INFO] Aggiungendo remote 'origin'...
    git remote add origin https://github.com/AnonymusRi/leo-replica-wizard.git
    echo [OK] Remote 'origin' aggiunto
)

echo.
echo [INFO] Verifica configurazione:
git remote -v

echo.
echo [SUCCESS] Repository collegata!
echo.
echo Ora puoi:
echo 1. Fare commit: git add . ^&^& git commit -m "messaggio"
echo 2. Fare push: git push origin main
echo 3. Cursor dovrebbe rilevare automaticamente la repository Git
echo.

pause

