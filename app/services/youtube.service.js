const fs = require('fs');
const youtubedl = require('youtube-dl-exec');
const path = require('path');

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
    format: "best",
    "js-runtime": "node"
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

exports.handleError = (error, res) => {
  console.error('youtube-dl-exec error:', error.stderr || error.message);

  // 🔍 Gestion personnalisée selon le message d’erreur
  if (/cookies/i.test(error.stderr || '')) {
    console.error(401, 'Cookies invalides ou expirés.');
    return res.status(401).json({ error: 'Cookies invalides ou expirés. Veuillez les recharger.' });
  }

  if (/This video is unavailable|Sign in to confirm/i.test(error.stderr || '')) {
    console.error(403, 'Vidéo protégée ou non accessible sans connexion.');
    return res.status(403).json({ error: 'Vidéo protégée ou non accessible sans connexion.' });
  }
  console.error(500, 'Erreur lors de l\'extraction de la vidéo.')

  res.status(500).json({ error: 'Erreur lors de l\'extraction de la vidéo.' });
}