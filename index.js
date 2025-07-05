const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const youtubeRouter = require('./app/routers/youtube.router');

const app = express();

// Liste des origines autorisées
/* const allowedOrigins = ['http://localhost:4200', 'https://agenda-bf245.web.app'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions)); */

//ajout de CORS pour permettre à l'application front en local de consomme l'API
app.use(cors());

const headers = {
  'Access-Control-Allow-Headers': 'x-access-token, Origin, Content-Type, Accept'
};

app.use(function (req, res, next) {
  res.header(headers);
  next();
});
app.use(bodyParser.json()); // ajouter bodyParser comme middleware
app.use('/youtube', youtubeRouter);

app.listen(process.env.PORT || 8080);
