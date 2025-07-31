const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Ruta POST para registrar un nuevo usuario
router.post('/register', authController.registrarUsuario);

module.exports = router;
