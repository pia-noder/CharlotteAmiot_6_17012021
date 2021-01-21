const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauce');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, sauceController.createSauce);
router.post('/:id/like',auth, sauceController.likeOrDislike);
router.get('/',auth, sauceController.getAllSauce);
router.get('/:id',auth, sauceController.getOneSauce);
router.put('/:id', auth, sauceController.modifyOneSauce);
router.delete('/:id',auth, sauceController.deleteOneSauce);


module.exports = router;