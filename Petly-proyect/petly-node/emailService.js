// emailService.js
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function enviarCodigoVerificacion(destinatario, codigo) {
  const msg = {
    to: destinatario,
    from: process.env.EMAIL_FROM,
    subject: 'Código de verificación - Petly 🐾',
    html: `
      <h2>Verifica tu cuenta</h2>
      <p>Tu código de verificación es:</p>
      <h3 style="color: #4CAF50;">${codigo}</h3>
      <p>Si no solicitaste esta cuenta, puedes ignorar este mensaje.</p>
    `
  };

  return sgMail.send(msg);
}

module.exports = { enviarCodigoVerificacion };
