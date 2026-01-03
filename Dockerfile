FROM node:20-slim

# Installer ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Créer le dossier de l'application
WORKDIR /app

# Copier les fichiers
COPY package*.json ./
RUN npm install
COPY . .

# Exposer le port Cloud Run
ENV PORT=8080
EXPOSE 8080

# Démarrer l'application
CMD [ "node", "index.js" ]
