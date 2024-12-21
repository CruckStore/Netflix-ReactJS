// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Bienvenue sur Netflix Clone</h1>
      <p>Veuillez vous connecter ou vous inscrire pour continuer.</p>
      <Link to="/login">Se connecter</Link>
      <Link to="/register">S'inscrire</Link>
    </div>
  );
};

export default Home;
