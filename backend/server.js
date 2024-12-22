const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Charge les variables d'environnement depuis .env

const app = express();
const PORT = 5000;

const resetTokens = {};
const usersFilePath = './users.json';

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

// Fonction pour lire un fichier JSON en toute sécurité
const readJSONFile = (filePath, res) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return data ? JSON.parse(data) : []; // Si le fichier est vide, renvoyer un tableau vide
  } catch (err) {
    console.error(`Erreur lors de la lecture du fichier ${filePath}:`, err);
    if (err instanceof SyntaxError) {
      fs.writeFileSync(filePath, JSON.stringify([])); // Réinitialiser le fichier en cas de corruption
      return [];
    }
    res.status(500).json({ message: 'Erreur serveur' });
    return null;
  }
};

// Fonction pour écrire dans un fichier JSON en toute sécurité
const writeJSONFile = (filePath, data, res) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Erreur lors de l'écriture dans le fichier ${filePath}:`, err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Fonction pour envoyer un email
const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email envoyé :', info.response);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email :', error);
      throw error;
    }
  };
  

// Route pour mot de passe oublié
app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    const users = readJSONFile(usersFilePath, res);
    if (!users) return;
  
    const user = users.find((u) => u.email === email);
    if (!user) {
      console.log('Utilisateur non trouvé:', email);
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }
  
    const token = crypto.randomBytes(20).toString('hex');
    resetTokens[token] = email;
  
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    console.log('Lien de réinitialisation généré:', resetLink);
  
    try {
      await sendEmail(
        email,
        'Réinitialisation de votre mot de passe',
        `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`
      );
      console.log('Email envoyé avec succès à:', email);
      res.json({ message: 'Lien de réinitialisation envoyé à votre email.' });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email :', error);
      res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email.' });
    }
  });
  


// Route pour réinitialisation du mot de passe
app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  const email = resetTokens[token];
  if (!email) {
    return res.status(400).json({ message: 'Token invalide ou expiré' });
  }

  const users = readJSONFile(usersFilePath, res);
  if (!users) return;

  const userIndex = users.findIndex((u) => u.email === email);
  if (userIndex === -1) {
    return res.status(400).json({ message: 'Utilisateur non trouvé' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    users[userIndex].password = hashedPassword;

    writeJSONFile(usersFilePath, users, res);
    delete resetTokens[token]; // Supprimez le token après utilisation

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la réinitialisation :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour le login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const users = readJSONFile(usersFilePath, res);
  if (!users) return;

  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(400).json({ message: 'Utilisateur non trouvé' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({ message: 'Mot de passe incorrect' });
  }

  res.json({
    message: 'Connexion réussie',
    user: { email: user.email },
  });
});

// Route pour le register
app.post('/api/register', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
  }

  const users = readJSONFile(usersFilePath, res);
  if (!users) return;

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: 'Utilisateur déjà existant' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { email, password: hashedPassword };

    users.push(newUser);
    writeJSONFile(usersFilePath, users, res);

    res.json({
      message: 'Utilisateur créé et connecté avec succès',
      user: { email },
    });
  } catch (err) {
    console.error('Erreur lors du hachage ou de l\'écriture dans le fichier :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
