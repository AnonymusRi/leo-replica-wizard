# Dockerfile per Railway con PostgreSQL integrato
FROM node:18

# Installa PostgreSQL e dipendenze
RUN apt-get update && \
    apt-get install -y postgresql postgresql-contrib sudo && \
    rm -rf /var/lib/apt/lists/*

# Crea utente postgres se non esiste e configura
RUN if ! id -u postgres > /dev/null 2>&1; then \
        useradd -r -s /bin/bash postgres; \
    fi

# Aggiungi PostgreSQL al PATH
ENV PATH="/usr/lib/postgresql/15/bin:/usr/lib/postgresql/16/bin:/usr/lib/postgresql/17/bin:${PATH}"

# Verifica che PostgreSQL sia installato
RUN which initdb && which pg_ctl && which psql && which pg_isready || (echo "PostgreSQL binaries not found" && exit 1)

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di package
COPY package*.json ./

# Installa le dipendenze (usa --legacy-peer-deps per risolvere conflitti)
RUN npm install --legacy-peer-deps

# Copia il resto del codice
COPY . .

# Rendi eseguibile lo script e imposta i permessi
RUN chmod +x scripts/start-postgres.sh && \
    chown -R postgres:postgres /var/lib/postgresql 2>/dev/null || true

# Esponi le porte
EXPOSE 5000 5432

# Comando di avvio
CMD ["bash", "-c", "if [ -d \"/var/lib/postgresql/data\" ]; then bash scripts/start-postgres.sh & sleep 15; fi && npm run build && npm run setup:db && node scripts/start-server-with-api.js"]

