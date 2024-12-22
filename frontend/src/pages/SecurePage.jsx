// src/pages/SecurePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundWithStars from '../components/BackgroundWithStars';

const SecurePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container">
      <BackgroundWithStars />
      <div className="secure-page-container">
        <h1>Bienvenue dans la zone sécurisée</h1>
        <p>Vous êtes connecté !</p>
        <button onClick={handleLogout}>Se déconnecter</button>
      </div>
    </div>
  );
};

export default SecurePage;
