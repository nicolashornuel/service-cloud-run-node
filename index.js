const express = require('express');
const fs = require('fs');
const cors = require("cors");
const youtubedl = require('youtube-dl-exec');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

var corsOptions = {
  origin: 'http://localhost:4200'
};

//ajout de CORS pour permettre à l'application front en local de consomme l'API
app.use(cors(corsOptions));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
  next();
});
app.use(bodyParser.json()); // ajouter bodyParser comme middleware

app.post('/convert', async (req, res) => {
  try {
    this.saveCookies(req.body.cookie);
    await this.convert(req.body.url);
    this.download(res);
  } catch (err) {
    this.handleError(err);
  }
});

exports.saveCookies = (cookiesText) =>{
  const filePath = path.join(__dirname, 'cookies.txt');
  fs.writeFileSync(filePath, cookiesText, 'utf-8');
}

exports.convert = async (videoId) => {
  console.log('Conversion en cours...');
  // Supprimer l'ancien fichier s’il existe
  if (fs.existsSync(this.outputPath)) fs.unlinkSync(this.outputPath);
  await youtubedl(`https://www.youtube.com/watch?v=${videoId}`, {
    extractAudio: true,
    audioFormat: 'mp3',
    output: this.outputPath,
    ffmpegLocation: '/usr/bin/ffmpeg', // facultatif
    cookies: path.resolve(__dirname, 'cookies.txt'), // 🔑 fichier cookies
  });
}

exports.download = (res) => {
  console.log('Téléchargement terminé, envoi du fichier...');
  res.download(this.outputPath, 'video.mp3', err => {
    if (err) console.error('Erreur d\'envoi du fichier :', err);
    else fs.unlinkSync(this.outputPath); // Nettoyage après téléchargement
  });
}

exports.outputPath = path.resolve(__dirname, 'output.mp3');

exports.handleError = (error) => {
  console.error('youtube-dl-exec error:', error.stderr || error.message);

  // 🔍 Gestion personnalisée selon le message d’erreur
  if (/cookies/i.test(error.stderr || '')) {
    return res.status(401).json({ error: 'Cookies invalides ou expirés. Veuillez les recharger.' });
  }

  if (/This video is unavailable|Sign in to confirm/i.test(error.stderr || '')) {
    return res.status(403).json({ error: 'Vidéo protégée ou non accessible sans connexion.' });
  }

  res.status(500).json({ error: 'Erreur lors de l\'extraction de la vidéo.' });
}

app.listen(process.env.PORT || 8080, () => {
  console.log('Serveur démarré');
});
