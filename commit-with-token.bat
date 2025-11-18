@echo off
REM Script per Commit e Push con Token GitHub
REM IMPORTANTE: Esegui questo script da Git Bash o dopo aver riavviato il terminale

echo.
echo ========================================
echo   Git Commit and Push con Token
echo ========================================
echo.

cd /d "%~dp0"

REM Prova a trovare Git
set GIT_CMD=git
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRORE] Git non trovato nel PATH!
    echo.
    echo Prova a:
    echo 1. Riavviare il terminale
    echo 2. Usare Git Bash (clic destro nella cartella -^> Git Bash Here)
    echo 3. Oppure esegui manualmente da Git Bash:
    echo    git add .
    echo    git commit -m "Migrate from Supabase to PostgreSQL"
    echo    git push https://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@github.com/AnonymusRi/leo-replica-wizard.git main
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

REM Push con token
echo.
echo [INFO] Eseguendo push su GitHub con token...
git push https://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@github.com/AnonymusRi/leo-replica-wizard.git main

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
    echo Verifica che il token sia valido e abbia i permessi corretti
    echo.
)

pause

