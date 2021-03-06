const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

//Accès au chemin du notre système de fichiers
const path = require('path');

const userRoute = require('./routes/user');
const sauceRoute = require('./routes/sauce');

//Définir le nombre de requête par période
const limiter = rateLimit({
  windowMs: 15*60*1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requête par windowMs
});

//Connexion à la BD
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(`mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASSWORD}@cluster0.l3cyi.mongodb.net/Cluster0?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



//Modifier les headers pour accepter les requêtes venant de tous les serveurs
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());
app.use(helmet());

//Enregistrement des routes
app.use('/images',express.static(path.join(__dirname,'images')));

app.use('/api/sauces', sauceRoute);
app.use('/api/auth',limiter, userRoute);


module.exports = app;