const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

exports.signup = (req,res,next) => {
  let regExp = /^[A-zÀ-ú]+(([',. -][A-zÀ-ú ])?[A-zÀ-ú]*)*$/;

  if(req.body.email == null || req.body.password){
    return rep.status(200).json({message: "Remplir tous les champs du formulaire !"})
    
  }else if  (!regExp.test(req.body.email)){
    return res.status(400).json({message: "Rentrez un format d'email valide !"})
  }
    bcrypt.hash(req.body.password,10)
    .then(
      hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
        .then( () => res.status(201).json({message: 'Nouvel utilisateur'}))
        .catch( 
          error => res.status(400).json({error})
          );
      }
    ).catch(
      error => res.status(500).json({error})
    );
};

// Connexion à son compte
exports.login = (req,res,next) => {
  User.findOne({ email: req.body.email })
  .then(
    user => {
      if(!user){
        return res.status(401).json({error: 'Utilisateur non trouvé !'});
      }
        bcrypt.compare(req.body.password, user.password)
        .then( 
          valid => {
            if(!valid){
                return res.status(401).json({ error: 'Mot de passe incorrect !'});
            }
              res.status(200).json({ 
                userId: user._id,
                token: jwt.sign(
                  {userId: user._id},//pour être sûr que la requête correspond bien à cet userId
                  process.env.TOKEN,
                  {expiresIn: '1h'}
                )
              });
          })
        .catch(error => res.status(500).json({error}));
      }
  )
  .catch( error => res.status(500).json({error}));
}