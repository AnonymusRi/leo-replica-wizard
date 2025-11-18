# Script per configurare Git remote e collegare la repository
# Esegui questo script in PowerShell o Git Bash

Write-Host "🔗 Configurazione Git Remote per Cursor" -ForegroundColor Green
Write-Host ""

Set-Location $PSScriptRoot

# Trova Git
$gitPath = $null
$possiblePaths = @(
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\bin\git.exe"
)

foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $gitPath = $path
        break
    }
}

# Prova anche se è nel PATH
if (-not $gitPath) {
    try {
        $null = Get-Command git -ErrorAction Stop
        $gitPath = "git"
    } catch {
        Write-Host "❌ Git non trovato!" -ForegroundColor Red
        Write-Host "Installa Git da: https://git-scm.com/download/win" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "✅ Git trovato: $gitPath" -ForegroundColor Green
Write-Host ""

# Inizializza git se non esiste
if (-not (Test-Path ".git")) {
    Write-Host "📦 Inizializzando repository Git..." -ForegroundColor Yellow
    & $gitPath init
    Write-Host "✅ Repository inizializzata" -ForegroundColor Green
    Write-Host ""
}

# Configura user se non configurato
$userName = & $gitPath config --global user.name
$userEmail = & $gitPath config --global user.email

if (-not $userName) {
    Write-Host "⚠️  Git user.name non configurato" -ForegroundColor Yellow
    Write-Host "Configura con: git config --global user.name 'Il Tuo Nome'" -ForegroundColor Cyan
}

if (-not $userEmail) {
    Write-Host "⚠️  Git user.email non configurato" -ForegroundColor Yellow
    Write-Host "Configura con: git config --global user.email 'tua-email@example.com'" -ForegroundColor Cyan
}

Write-Host ""

# Verifica remote esistente
$remoteUrl = & $gitPath remote get-url origin 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "📡 Remote 'origin' già configurato:" -ForegroundColor Cyan
    Write-Host "   $remoteUrl" -ForegroundColor White
    Write-Host ""
    Write-Host "Vuoi aggiornarlo? (S/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq "S" -or $response -eq "s" -or $response -eq "Y" -or $response -eq "y") {
        & $gitPath remote set-url origin https://github.com/AnonymusRi/leo-replica-wizard.git
        Write-Host "✅ Remote aggiornato" -ForegroundColor Green
    }
} else {
    Write-Host "📡 Aggiungendo remote 'origin'..." -ForegroundColor Yellow
    & $gitPath remote add origin https://github.com/AnonymusRi/leo-replica-wizard.git
    Write-Host "✅ Remote 'origin' aggiunto" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔍 Verifica configurazione:" -ForegroundColor Cyan
& $gitPath remote -v

Write-Host ""
Write-Host "✅ Repository collegata!" -ForegroundColor Green
Write-Host ""
Write-Host "Ora puoi:" -ForegroundColor Cyan
Write-Host "1. Fare commit: git add . && git commit -m 'messaggio'" -ForegroundColor White
Write-Host "2. Fare push: git push origin main" -ForegroundColor White
Write-Host "3. Cursor dovrebbe rilevare automaticamente la repository Git" -ForegroundColor White
Write-Host ""

