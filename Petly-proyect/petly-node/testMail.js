const { enviarCodigoVerificacion } = require('./emailService');

const destinatario = 'jesusricardo6804@gmail.com';
const codigo = Math.floor(100000 + Math.random() * 900000); // Ej: 6 dígitos

enviarCodigoVerificacion(destinatario, codigo)
  .then(() => {
    console.log('Correo enviado exitosamente ✅');
  })
  .catch((error) => {
    console.error('Error al enviar correo ❌:', error);
  });
