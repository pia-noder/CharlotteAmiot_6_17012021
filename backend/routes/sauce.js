const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauce');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, sauceController.createSauce);
router.get('/:id',auth, sauceController.getOneSauce);
router.put('/:id', auth,multer, sauceController.modifyOneSauce);
router.delete('/:id',auth, sauceController.deleteOneSauce);
router.get('/',auth, sauceController.getAllSauce);
router.post('/:id/like',auth, sauceController.likeOrDislike);

module.exports = router;