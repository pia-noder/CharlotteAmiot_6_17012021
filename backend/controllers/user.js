const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.signup = (req,res,next) => {
    bcrypt.hash(req.body.password,10)
    .then(
      hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
        .then( () => {
          res.status(201).json({message: 'Nouvel utilisateur créé !'});
        })
        .catch( 
          error => res.status(400).json({error})
          );
      }
    ).catch(
      error => res.status(500).json({error})
    );
};

exports.login = (req,re,next) => {
  User.findOne({email: req.body.email})
  .then(
    user => {
      if(!user){
        return res.status(401).json({message: 'Utilisateur non trouvé !'});
      }
    }
  )
  .catch( error => res.status(500).json({error}));
};