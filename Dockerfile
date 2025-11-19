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

# Esponi la porta
EXPOSE 5000

# Comando di avvio (PostgreSQL è un servizio separato)
CMD ["bash", "-c", "npm run build && npm run setup:db && node scripts/start-server-with-api.js"]

