const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoute = require('./routes/user');

//Lier la BD à l'API
mongoose.connect('mongodb+srv://User1:MongoAtlas21@cluster0.l3cyi.mongodb.net/Cluster0?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

//Modifier les headers pour accepter les requêtes venant de tous les serveurs
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
 
app.use(bodyParser.json());

//Enregistrement des routes
app.use('/api/auth',userRoute);

module.exports = app;