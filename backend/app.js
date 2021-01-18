const express = require('express'); //importation de l'objet express
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://User1:MongoAtlas21@cluster0.l3cyi.mongodb.net/Cluster0?retryWrites=true&w=majority',
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
 
  
  app.use((req, res) => {
     res.json({ message: 'Votre requête a bien été reçue !' }); 
  });
  
module.exports = app; //exporter "app" pour pouvoir l'utiliser dans tous les fichiers