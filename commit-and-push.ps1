# Script PowerShell per Commit e Push su GitHub
# Esegui questo script nella directory del progetto

Write-Host "🚀 Starting Git Commit and Push..." -ForegroundColor Green

# Vai nella directory del progetto
Set-Location $PSScriptRoot

# Verifica se Git è installato
$gitPath = $null
$possiblePaths = @(
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\bin\git.exe",
    "git"  # Se è nel PATH
)

foreach ($path in $possiblePaths) {
    if ($path -eq "git") {
        try {
            $null = Get-Command git -ErrorAction Stop
            $gitPath = "git"
            break
        } catch {
            continue
        }
    } else {
        if (Test-Path $path) {
            $gitPath = $path
            break
        }
    }
}

if (-not $gitPath) {
    Write-Host "❌ Git non trovato!" -ForegroundColor Red
    Write-Host "Installa Git da: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Oppure esegui manualmente questi comandi:" -ForegroundColor Yellow
    Write-Host "  git add ." -ForegroundColor Cyan
    Write-Host "  git commit -m 'Migrate from Supabase to PostgreSQL - Ready for Railway'" -ForegroundColor Cyan
    Write-Host "  git push origin main" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ Git trovato: $gitPath" -ForegroundColor Green
Write-Host ""

# Verifica se è una repository git
$isGitRepo = Test-Path ".git"
if (-not $isGitRepo) {
    Write-Host "📦 Inizializzando repository Git..." -ForegroundColor Yellow
    & $gitPath init
    & $gitPath remote add origin https://github.com/AnonymusRi/leo-replica-wizard.git
}

# Aggiungi tutti i file
Write-Host "📝 Aggiungendo file..." -ForegroundColor Yellow
& $gitPath add .

# Mostra lo status
Write-Host ""
Write-Host "📊 Status repository:" -ForegroundColor Cyan
& $gitPath status --short

# Commit
Write-Host ""
Write-Host "💾 Creando commit..." -ForegroundColor Yellow
$commitMessage = @"
Migrate from Supabase to PostgreSQL - Ready for Railway deployment

- Add complete PostgreSQL database schema
- Replace Supabase with PostgreSQL client wrapper  
- Add Railway configuration files
- Add database setup script
- Update documentation
- Maintain backward compatibility
"@

& $gitPath commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit creato con successo!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Nessun cambiamento da committare o errore nel commit" -ForegroundColor Yellow
}

# Push
Write-Host ""
Write-Host "🚀 Eseguendo push su GitHub..." -ForegroundColor Yellow
& $gitPath push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Push completato con successo!" -ForegroundColor Green
    Write-Host "🎉 Repository aggiornata su GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prossimi passi:" -ForegroundColor Cyan
    Write-Host "1. Vai su https://railway.app" -ForegroundColor White
    Write-Host "2. Crea nuovo progetto e collega questa repository" -ForegroundColor White
    Write-Host "3. Aggiungi database PostgreSQL" -ForegroundColor White
    Write-Host "4. Esegui lo schema: railway run npm run setup:db" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Errore durante il push" -ForegroundColor Red
    Write-Host "Verifica:" -ForegroundColor Yellow
    Write-Host "- Che tu abbia i permessi sulla repository" -ForegroundColor White
    Write-Host "- Che il remote 'origin' sia configurato correttamente" -ForegroundColor White
    Write-Host "- Che tu sia autenticato con GitHub" -ForegroundColor White
}

