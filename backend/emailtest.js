const nodemailer = require('nodemailer');
require('dotenv').config();

const sendTestEmail = async () => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // False pour Gmail avec TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'teamreglisse1@gmail.com', // Adresse email de destination
    subject: 'Test Email NodeMailer',
    text: 'Ceci est un test pour vérifier la configuration SMTP avec Gmail.',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé :', info.response);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email :', error);
  }
};

sendTestEmail();
