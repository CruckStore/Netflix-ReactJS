// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import BackgroundWithStars from '../components/BackgroundWithStars';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        email,
        password,
        confirmPassword,
      });

      const data = response.data;
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/secure-page');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription'
      );
    }
  };

  return (
    <div className="container">
      <BackgroundWithStars />
      <div className="form-container">
        <h2>Inscription</h2>
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
          <input
            type="password"
            placeholder="Confirmez le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit">S'inscrire</button>
        </form>
        <div className="links">
          <Link to="/login">Vous avez déjà un compte ? Connectez-vous</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
