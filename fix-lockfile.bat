@echo off
REM Script per aggiornare il lockfile e fare commit/push

echo.
echo ========================================
echo   Fix Lockfile e Push
echo ========================================
echo.

cd /d "%~dp0"

REM Prova a trovare npm o bun
where npm >nul 2>&1
if %errorlevel% equ 0 (
    set PKG_MGR=npm
    set PKG_CMD=npm
) else (
    where bun >nul 2>&1
    if %errorlevel% equ 0 (
        set PKG_MGR=bun
        set PKG_CMD=bun
    ) else (
        echo [ERRORE] npm o bun non trovato!
        echo Installa Node.js da: https://nodejs.org
        pause
        exit /b 1
    )
)

echo [OK] Trovato: %PKG_MGR%
echo.

REM Aggiorna il lockfile
echo [INFO] Aggiornando lockfile...
%PKG_CMD% install

if %errorlevel% neq 0 (
    echo [ERRORE] Errore durante l'installazione
    pause
    exit /b 1
)

echo [OK] Lockfile aggiornato
echo.

REM Aggiungi il lockfile aggiornato
echo [INFO] Aggiungendo lockfile al git...
git add bun.lockb package-lock.json package.json

REM Commit
echo [INFO] Creando commit...
git commit -m "Update lockfile for Railway deployment"

REM Push
echo [INFO] Eseguendo push...
git push https://YOUR_GITHUB_TOKEN@github.com/AnonymusRi/leo-replica-wizard.git main

if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] Push completato!
    echo Railway dovrebbe ora rilevare il lockfile aggiornato.
) else (
    echo.
    echo [ERRORE] Errore durante il push
)

pause

