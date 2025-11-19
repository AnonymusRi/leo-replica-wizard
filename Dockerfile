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

# Trova la versione di PostgreSQL installata e aggiungi al PATH
RUN PG_VERSION=$(find /usr/lib/postgresql -maxdepth 1 -type d -name "[0-9]*" | sort -V | tail -1 | xargs basename) && \
    echo "Found PostgreSQL version: $PG_VERSION" && \
    echo "export PATH=\"/usr/lib/postgresql/$PG_VERSION/bin:\$PATH\"" >> /etc/profile && \
    echo "export PATH=\"/usr/lib/postgresql/$PG_VERSION/bin:\$PATH\"" >> ~/.bashrc

# Aggiungi PostgreSQL al PATH (usa tutte le versioni possibili)
ENV PATH="/usr/lib/postgresql/15/bin:/usr/lib/postgresql/16/bin:/usr/lib/postgresql/17/bin:/usr/lib/postgresql/14/bin:/usr/bin:${PATH}"

# Verifica che PostgreSQL sia installato e mostra i percorsi
RUN echo "Checking PostgreSQL installation..." && \
    find /usr/lib/postgresql -name "initdb" 2>/dev/null | head -1 && \
    find /usr/lib/postgresql -name "pg_ctl" 2>/dev/null | head -1 && \
    find /usr/lib/postgresql -name "psql" 2>/dev/null | head -1 && \
    find /usr/lib/postgresql -name "pg_isready" 2>/dev/null | head -1 && \
    (which initdb || find /usr/lib/postgresql -name initdb 2>/dev/null | head -1) && \
    (which pg_ctl || find /usr/lib/postgresql -name pg_ctl 2>/dev/null | head -1) && \
    (which psql || find /usr/lib/postgresql -name psql 2>/dev/null | head -1) && \
    (which pg_isready || find /usr/lib/postgresql -name pg_isready 2>/dev/null | head -1) || \
    (echo "PostgreSQL binaries not found - installation may have failed" && exit 1)

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

