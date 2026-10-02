const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.get('/solicitudes', adminController.getPendigApplications);
router.put('/solicitudes/:solicitudId', adminController.reviewApplication);

module.exports = router;

router.post('/crear-usuario', 
    authMiddleware, 
    roleMiddleware(['ADMINISTRADOR']),
    adminController.crearUsuario
);

module.exports = router;