# 🔧 Fix Deploy Railway - Deploy si Ferma dopo Build

## ❌ Problema

Il deploy si ferma dopo il build e rimane in stato "Connected" senza avviare il server.

## 🔍 Causa

Railway esegue il build nel Dockerfile, ma poi non esegue correttamente lo `startCommand` dal `railway.toml`.

## ✅ Soluzione

### 1. Verifica l'Ambiente

Railway deve essere configurato per usare l'ambiente **production** per applicare `[environments.production.deploy.startCommand]`.

**Come verificare**:
1. Vai su Railway Dashboard → Il tuo progetto → Servizio Application
2. Vai su **Settings** → **Environment**
3. Verifica che sia selezionato **Production** (non "Development" o altro)

### 2. Verifica il Dockerfile

Il Dockerfile deve fare il build durante il build step, non nel CMD:

```dockerfile
# Build è fatto durante il build step (se necessario)
# CMD esegue solo setup:db e start server
CMD ["bash", "-c", "npm run setup:db && node scripts/start-server-with-api.js"]
```

### 3. Verifica railway.toml

Il `railway.toml` deve avere lo `startCommand` corretto per production:

```toml
[environments.production]
[environments.production.deploy]
startCommand = "npm run setup:db && node scripts/start-server-with-api.js"
```

### 4. Alternativa: Usa il CMD del Dockerfile

Se Railway non rispetta lo `startCommand` dal `railway.toml`, puoi usare direttamente il CMD del Dockerfile.

**Dockerfile**:
```dockerfile
CMD ["bash", "-c", "npm run setup:db && node scripts/start-server-with-api.js"]
```

**railway.toml**:
```toml
[environments.production]
[environments.production.deploy]
# Non specificare startCommand, usa il CMD del Dockerfile
```

## 🔍 Debug

### Verifica i Log

1. Vai su Railway Dashboard → Il tuo progetto → Servizio Application
2. Vai su **Deployments** → Clicca sull'ultimo deploy
3. Controlla i log per vedere:
   - Se il build è completato
   - Se `setup:db` è stato eseguito
   - Se il server è stato avviato

### Log Attesi

Dopo il build, dovresti vedere:
```
✓ built in 22.99s
📦 Setting up database schema...
✅ Database schema setup completed!
🚀 Starting server...
✅ Server running on http://0.0.0.0:5000
```

### Se Non Vedi i Log di Setup/Start

**Possibili cause**:
1. Railway non sta usando l'ambiente production
2. Lo `startCommand` non è configurato correttamente
3. Il CMD del Dockerfile non è eseguito

**Soluzione**:
1. Verifica l'ambiente in Railway Settings
2. Verifica che il `railway.toml` sia committato e pushato
3. Prova a rimuovere lo `startCommand` dal `railway.toml` e usa solo il CMD del Dockerfile

## 🎯 Configurazione Finale

### Dockerfile
```dockerfile
# Build è fatto durante il build step
# CMD esegue solo setup:db e start
CMD ["bash", "-c", "npm run setup:db && node scripts/start-server-with-api.js"]
```

### railway.toml
```toml
[environments.production]
[environments.production.deploy]
startCommand = "npm run setup:db && node scripts/start-server-with-api.js"
```

### Railway Settings
- **Environment**: Production
- **Start Command**: (lasciare vuoto o usare quello dal railway.toml)

## ⚠️ Note

- Il build è fatto durante il build step del Dockerfile (se necessario)
- Non serve rifare il build nello `startCommand`
- Se il build è già fatto, esegui solo `setup:db` e `start-server-with-api.js`

