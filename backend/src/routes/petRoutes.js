const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const upload = require('../middlewares/uploadMiddleware');

const petUploads = upload.fields([
    { name: 'foto', maxCount: 1 },
    { name: 'vacunacion', maxCount: 1 },
    { name: 'desparasitacion', maxCount: 1 }
]); 

router.post('/registrer', petUploads, petController.registrerPet);

module.exports = router;