const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/solicitudes', adminController.getPendigApplications);
router.put('/solicitudes/:solicitudId', adminController.reviewApplication);

module.exports = router;