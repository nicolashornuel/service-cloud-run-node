const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtube.controller');

router.post('/convert', youtubeController.convert);

module.exports = router;