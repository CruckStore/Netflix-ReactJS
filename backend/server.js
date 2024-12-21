const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 5000;

// Chemins des fichiers
const usersFilePath = './users.json';

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use((err, req, res, next) => {
    console.error('Erreur non gérée :', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  });  

// Fonction pour lire un fichier JSON en toute sécurité
const readJSONFile = (filePath, res) => {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return data ? JSON.parse(data) : []; // Si le fichier est vide, renvoyer un tableau vide
    } catch (err) {
      console.error(`Erreur lors de la lecture du fichier ${filePath}:`, err);
      if (err instanceof SyntaxError) {
        // Si le fichier est corrompu, réinitialiser avec un tableau vide
        fs.writeFileSync(filePath, JSON.stringify([]));
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

  res.json({ message: 'Connexion réussie', email: user.email });
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
  
      console.log('Utilisateur ajouté et connecté avec succès');
      res.json({
        message: 'Utilisateur créé et connecté avec succès',
        user: { email },
      });
    } catch (err) {
      console.error('Erreur lors de l\'hachage ou de l\'écriture dans le fichier :', err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
   

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
