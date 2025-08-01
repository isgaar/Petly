const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Ruta POST para registrar un nuevo usuario
router.post('/register', authController.registrarUsuario);
// Ruta POST para iniciar sesión
router.post('/login', authController.iniciarSesion);
//Ruta POST para verificar el código de verificación
router.post('/verificar-codigo', authController.verificarCodigo);
// Ruta POST para enviar el código de verificación por correo
router.post('/reenviar-codigo', authController.reenviarCodigo);
module.exports = router;
