const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const youtubeRouter = require('./app/routers/youtube.router');

const app = express();

const corsOptions = {
  origin: 'http://localhost:4200'
};
const headers = {
  'Access-Control-Allow-Origin': 'http://localhost:4200',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'x-access-token, Origin, Content-Type, Accept'
};

//ajout de CORS pour permettre à l'application front en local de consomme l'API
app.use(cors(corsOptions));
app.use(function (req, res, next) {
  res.header(headers);
  next();
});
app.use(bodyParser.json()); // ajouter bodyParser comme middleware
app.use('/youtube', youtubeRouter);

app.listen(process.env.PORT || 8080);
