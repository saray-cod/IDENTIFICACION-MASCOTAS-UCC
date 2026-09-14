const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/registrer', authController.registrer);
module.exports = router;