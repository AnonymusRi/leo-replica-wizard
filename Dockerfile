# Dockerfile per Railway Application
# PostgreSQL è un servizio separato, non serve installarlo qui
FROM node:18

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di package
COPY package*.json ./

# Installa le dipendenze (usa --legacy-peer-deps per risolvere conflitti)
RUN npm install --legacy-peer-deps

# Copia il resto del codice
COPY . .

# Build dell'applicazione (Vite)
RUN npm run build

# Esponi la porta
EXPOSE 5000

# Comando di avvio (PostgreSQL è un servizio separato)
# Build è già fatto, quindi eseguiamo solo setup:db e start
CMD ["bash", "-c", "npm run setup:db && node scripts/start-server-with-api.js"]

