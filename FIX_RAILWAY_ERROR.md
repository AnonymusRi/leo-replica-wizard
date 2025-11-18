# 🔧 Fix Errore Railway - Lockfile

## ❌ Problema

Railway sta usando Bun e il lockfile (`bun.lockb`) ha cambiamenti non committati. L'errore è:

```
error: lockfile had changes, but lockfile is frozen
```

## ✅ Soluzione

### Opzione 1: Aggiorna e Committa il Lockfile (CONSIGLIATO)

**Usa Git Bash:**

```bash
cd /c/Users/Riccardo/leo-replica-wizard

# Aggiorna il lockfile
npm install
# oppure se hai bun:
# bun install

# Aggiungi il lockfile aggiornato
git add bun.lockb package-lock.json package.json

# Commit
git commit -m "Update lockfile for Railway deployment"

# Push
git push https://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@github.com/AnonymusRi/leo-replica-wizard.git main
```

**Oppure usa lo script:**
- Fai doppio click su `fix-lockfile.bat`

### Opzione 2: Configura Railway per usare npm invece di bun

1. Vai su Railway Dashboard
2. Settings → Variables
3. Aggiungi variabile:
   - **Nome**: `NIXPACKS_PKG_MGR`
   - **Valore**: `npm`
4. Redeploy

### Opzione 3: Rimuovi bun.lockb e usa solo package-lock.json

Se preferisci usare solo npm:

```bash
# Rimuovi bun.lockb
git rm bun.lockb

# Assicurati che package-lock.json sia aggiornato
npm install

# Commit
git add package-lock.json
git commit -m "Remove bun.lockb, use npm only"
git push https://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@github.com/AnonymusRi/leo-replica-wizard.git main
```

Poi in Railway, aggiungi la variabile `NIXPACKS_PKG_MGR=npm`

## 🎯 Soluzione Rapida (1 minuto)

1. **Apri Git Bash** nella cartella del progetto
2. **Esegui:**
   ```bash
   npm install
   git add bun.lockb package-lock.json
   git commit -m "Update lockfile"
   git push https://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@github.com/AnonymusRi/leo-replica-wizard.git main
   ```
3. **Ritorna su Railway** e fai "Redeploy"

## ✅ Verifica

Dopo il push:
1. Vai su GitHub e verifica che `bun.lockb` e/o `package-lock.json` siano aggiornati
2. Su Railway, fai "Redeploy"
3. Il build dovrebbe completarsi senza errori

## 📝 Nota

Railway rileva automaticamente il package manager. Se hai sia `bun.lockb` che `package-lock.json`, Railway preferisce Bun. Per forzare npm, aggiungi la variabile d'ambiente `NIXPACKS_PKG_MGR=npm` in Railway.

