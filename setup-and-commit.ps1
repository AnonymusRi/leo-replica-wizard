# Script completo per configurare e committare il repository
# Questo script trova Git automaticamente e configura tutto

Write-Host "Configurazione Completa Repository GitHub" -ForegroundColor Green
Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

# Funzione per trovare Git
function Find-Git {
    $possiblePaths = @(
        "C:\Program Files\Git\bin\git.exe",
        "C:\Program Files (x86)\Git\bin\git.exe",
        "$env:LOCALAPPDATA\Programs\Git\bin\git.exe",
        "$env:ProgramFiles\Git\cmd\git.exe",
        "$env:ProgramFiles(x86)\Git\cmd\git.exe"
    )
    
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            return $path
        }
    }
    
    try {
        $null = Get-Command git -ErrorAction Stop
        return "git"
    } catch {
        # Continua
    }
    
    $searchPaths = @(
        "C:\Program Files",
        "C:\Program Files (x86)",
        "$env:LOCALAPPDATA\Programs"
    )
    
    foreach ($basePath in $searchPaths) {
        if (Test-Path $basePath) {
            $found = Get-ChildItem -Path $basePath -Filter "git.exe" -Recurse -Depth 3 -ErrorAction SilentlyContinue | 
                     Where-Object { $_.FullName -like '*bin\git.exe' -or $_.FullName -like '*cmd\git.exe' } | 
                     Select-Object -First 1
            if ($found) {
                return $found.FullName
            }
        }
    }
    
    return $null
}

# Trova Git
Write-Host "Cercando Git..." -ForegroundColor Yellow
$gitPath = Find-Git

if (-not $gitPath) {
    Write-Host ""
    Write-Host "Git non trovato!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Git sembra non essere installato o non e nel PATH." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opzioni:" -ForegroundColor Cyan
    Write-Host "1. Installa Git da: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "2. Assicurati di selezionare Add Git to PATH durante l installazione" -ForegroundColor White
    Write-Host "3. Riavvia PowerShell dopo l installazione" -ForegroundColor White
    Write-Host ""
    Write-Host "Dopo l installazione, esegui di nuovo questo script." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "Git trovato: $gitPath" -ForegroundColor Green
Write-Host ""

# Verifica versione Git
$gitVersion = & $gitPath --version
Write-Host "Versione: $gitVersion" -ForegroundColor Cyan
Write-Host ""

# Verifica configurazione utente
Write-Host "Verificando configurazione utente..." -ForegroundColor Yellow
$userName = & $gitPath config --global user.name 2>$null
$userEmail = & $gitPath config --global user.email 2>$null

if ($userName) {
    Write-Host "Nome: $userName" -ForegroundColor Green
} else {
    Write-Host "Nome non configurato" -ForegroundColor Yellow
    & $gitPath config --global user.name "Riccardo"
    Write-Host "Nome configurato: Riccardo" -ForegroundColor Green
}

if ($userEmail) {
    Write-Host "Email: $userEmail" -ForegroundColor Green
} else {
    Write-Host "Email non configurata" -ForegroundColor Yellow
    & $gitPath config --global user.email "ilficotrani@gmail.com"
    Write-Host "Email configurata: ilficotrani@gmail.com" -ForegroundColor Green
}

Write-Host ""

# Verifica se e un repository Git
if (-not (Test-Path ".git")) {
    Write-Host "Inizializzando repository Git..." -ForegroundColor Yellow
    & $gitPath init
    Write-Host "Repository inizializzata" -ForegroundColor Green
    Write-Host ""
}

# Verifica e configura remote
Write-Host "Verificando remote GitHub..." -ForegroundColor Yellow
$remoteUrl = & $gitPath remote get-url origin 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "Remote origin gia configurato:" -ForegroundColor Green
    Write-Host "   $remoteUrl" -ForegroundColor Cyan
} else {
    Write-Host "Aggiungendo remote origin..." -ForegroundColor Yellow
    & $gitPath remote add origin https://github.com/AnonymusRi/leo-replica-wizard.git
    Write-Host "Remote origin aggiunto" -ForegroundColor Green
}

# Verifica che il remote sia corretto
$currentRemote = & $gitPath remote get-url origin
if ($currentRemote -ne "https://github.com/AnonymusRi/leo-replica-wizard.git") {
    Write-Host "Aggiornando remote..." -ForegroundColor Yellow
    & $gitPath remote set-url origin https://github.com/AnonymusRi/leo-replica-wizard.git
    Write-Host "Remote aggiornato" -ForegroundColor Green
}

Write-Host ""
Write-Host "Status repository:" -ForegroundColor Cyan
& $gitPath status --short

Write-Host ""
Write-Host "Aggiungendo tutti i file..." -ForegroundColor Yellow
& $gitPath add .

Write-Host ""
Write-Host "Status dopo add:" -ForegroundColor Cyan
& $gitPath status --short

Write-Host ""
Write-Host "Creando commit..." -ForegroundColor Yellow
$commitMessage = "Update repository configuration and documentation"
& $gitPath commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "Commit creato con successo!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Eseguendo push su GitHub..." -ForegroundColor Yellow
    Write-Host "(Potrebbe richiedere autenticazione)" -ForegroundColor Cyan
    Write-Host ""
    
    & $gitPath push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "PUSH COMPLETATO CON SUCCESSO!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Il tuo repository e ora sincronizzato con GitHub!" -ForegroundColor Green
        Write-Host "Repository: https://github.com/AnonymusRi/leo-replica-wizard" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "Push non riuscito. Possibili cause:" -ForegroundColor Yellow
        Write-Host "1. Non sei autenticato con GitHub" -ForegroundColor White
        Write-Host "2. Non hai i permessi sulla repository" -ForegroundColor White
        Write-Host "3. Il branch remoto non esiste ancora" -ForegroundColor White
        Write-Host ""
        Write-Host "Per autenticarti:" -ForegroundColor Cyan
        Write-Host "1. Vai su: https://github.com/settings/tokens" -ForegroundColor White
        Write-Host "2. Crea un Personal Access Token con permessi repo" -ForegroundColor White
        Write-Host "3. Quando Git chiede la password, usa il token" -ForegroundColor White
        Write-Host ""
        Write-Host "Oppure prova:" -ForegroundColor Cyan
        Write-Host "  git push -u origin main" -ForegroundColor White
    }
} else {
    Write-Host ""
    Write-Host "Nessun cambiamento da committare (tutto e gia committato)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Per fare push delle modifiche esistenti:" -ForegroundColor Yellow
    Write-Host "  git push origin main" -ForegroundColor White
}

Write-Host ""
Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host "Configurazione completata!" -ForegroundColor Green
Write-Host ""
Write-Host "Comandi utili:" -ForegroundColor Cyan
Write-Host "  git status          - Vedi lo stato del repository" -ForegroundColor White
Write-Host "  git add .           - Aggiungi tutti i file modificati" -ForegroundColor White
Write-Host "  git commit -m msg   - Crea un commit" -ForegroundColor White
Write-Host "  git push origin main - Invia modifiche a GitHub" -ForegroundColor White
Write-Host "  git pull origin main - Scarica modifiche da GitHub" -ForegroundColor White
Write-Host ""
