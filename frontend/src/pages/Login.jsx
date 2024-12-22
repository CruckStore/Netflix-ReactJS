// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import BackgroundWithStars from '../components/BackgroundWithStars';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      const data = response.data;

      if (data && data.user && data.user.email) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/secure-page');
      } else {
        setMessage('Erreur : données utilisateur manquantes');
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Une erreur est survenue lors de la connexion'
      );
    }
  };

  return (
    <div className="container">
      <BackgroundWithStars />
      <div className="form-container">
        <h2>Connexion</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Se connecter</button>
        </form>
        <div className="links">
          <Link to="/forgot-password">Mot de passe oublié ?</Link>
          <Link to="/register">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
