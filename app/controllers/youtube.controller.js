const youtubeService = require("../services/youtube.service");

exports.convert = async (req, res) => {
    try {
        youtubeService.saveCookies(req.body.cookie);
        await youtubeService.convert(req.body.url);
        youtubeService.download(res);
      } catch (err) {
        youtubeService.handleError(err, res);
      }
}