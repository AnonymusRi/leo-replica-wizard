# Dockerfile per Railway con PostgreSQL integrato
FROM node:18

# Installa PostgreSQL
RUN apt-get update && \
    apt-get install -y postgresql postgresql-contrib && \
    rm -rf /var/lib/apt/lists/*

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di package
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del codice
COPY . .

# Rendi eseguibile lo script
RUN chmod +x scripts/start-postgres.sh

# Esponi le porte
EXPOSE 5000 5432

# Comando di avvio
CMD ["bash", "-c", "if [ -d \"/var/lib/postgresql/data\" ]; then (bash scripts/start-postgres.sh &) && sleep 10; fi && npm run build && npm run setup:db && node scripts/start-server-with-api.js"]

