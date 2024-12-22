// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import BackgroundWithStars from '../components/BackgroundWithStars';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="container">
      <BackgroundWithStars />
      <div className="form-container">
        <h2>Mot de passe oublié</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Envoyer un lien de réinitialisation</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
