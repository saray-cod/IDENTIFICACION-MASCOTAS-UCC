const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const upload = require('../middlewares/uploadMiddleware');

router.post = ('/register', upload.fields([
    { name: 'foto', maxCount: 1 },
    { name: 'vacunacion', maxCount: 1 },
    { name: 'desparasitacion', maxCount: 1 }
]), petController.registerPet);

router.get('/:mascotaId/carnet', petController.getPetCard);
router.get('/publica/:mascotaId', petController.getPublicPetInfo);

module.exports = router;