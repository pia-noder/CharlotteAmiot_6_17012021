const fs = require('fs');

const Sauce = require('../models/sauce');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({message: 'Sauce enregistrée !'}))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
        .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
 Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.likeOrDislikeSauce = (req, res, next) => {

  const userId = req.body.userId

  Sauce.findOne({ _id: req.params.id }) 
    .then((sauce) => { 
      const alreadyLiked = sauce.usersLiked.includes(userId);
      const alreadyDisliked = sauce.usersDisliked.includes(userId);

      const wantToLike = !alreadyDisliked && req.body.like == 1;
      const wantToDislike = !alreadyLiked && req.body.like == -1;

      if (wantToLike) {
          sauce.usersLiked.push(userId) 
          sauce.likes++
      } else if (wantToDislike) {
          sauce.usersDisliked.push(userId) 
          sauce.dislikes++
      } else if (req.body.like == 0 && alreadyLiked) { 
          sauce.likes--
          sauce.usersLiked.pull(userId) 
      } else if (req.body.like == 0 && alreadyDisliked) {
          sauce.dislikes--
          sauce.usersDisliked.pull(userId)
      }
      Sauce.updateOne({ _id: req.params.id }, { usersLiked: sauce.usersLiked, usersDisliked: sauce.usersDisliked, dislikes: sauce.dislikes, likes: sauce.likes, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modifiée !' })) 
          .catch(error => res.status(400).json({ error })); 
    })
    .catch(error => res.status(400).json({ error })); 
}  
 