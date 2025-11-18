@echo off
REM Script Batch per Commit e Push su GitHub
REM Esegui questo file facendo doppio click

echo.
echo ========================================
echo   Git Commit and Push Script
echo ========================================
echo.

cd /d "%~dp0"

REM Verifica se Git è installato
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRORE] Git non trovato!
    echo.
    echo Installa Git da: https://git-scm.com/download/win
    echo.
    echo Oppure esegui manualmente questi comandi:
    echo   git add .
    echo   git commit -m "Migrate from Supabase to PostgreSQL"
    echo   git push origin main
    echo.
    pause
    exit /b 1
)

echo [OK] Git trovato
echo.

REM Verifica se è una repository git
if not exist ".git" (
    echo [INFO] Inizializzando repository Git...
    git init
    git remote add origin https://github.com/AnonymusRi/leo-replica-wizard.git
    echo.
)

REM Aggiungi tutti i file
echo [INFO] Aggiungendo file...
git add .
echo.

REM Mostra status
echo [INFO] Status repository:
git status --short
echo.

REM Commit
echo [INFO] Creando commit...
git commit -m "Migrate from Supabase to PostgreSQL - Ready for Railway deployment" -m "- Add complete PostgreSQL database schema" -m "- Replace Supabase with PostgreSQL client wrapper" -m "- Add Railway configuration files" -m "- Add database setup script" -m "- Update documentation" -m "- Maintain backward compatibility"

if %errorlevel% neq 0 (
    echo [WARN] Nessun cambiamento da committare o errore nel commit
    echo.
)

REM Push
echo.
echo [INFO] Eseguendo push su GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] Push completato con successo!
    echo [SUCCESS] Repository aggiornata su GitHub!
    echo.
    echo Prossimi passi:
    echo 1. Vai su https://railway.app
    echo 2. Crea nuovo progetto e collega questa repository
    echo 3. Aggiungi database PostgreSQL
    echo 4. Esegui lo schema: railway run npm run setup:db
    echo.
) else (
    echo.
    echo [ERRORE] Errore durante il push
    echo.
    echo Verifica:
    echo - Che tu abbia i permessi sulla repository
    echo - Che il remote 'origin' sia configurato correttamente
    echo - Che tu sia autenticato con GitHub
    echo.
)

pause

