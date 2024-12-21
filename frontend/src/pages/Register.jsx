// src/pages/Register.jsx
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

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
      setMessage(data.message);
  
      // Simulez une connexion en stockant les informations de l'utilisateur
      localStorage.setItem('user', JSON.stringify(data.user)); // Vous pouvez utiliser un contexte Auth ici
      console.log('Utilisateur connecté :', data.user);
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription'
      );
    }
  };
  

  return (
    <div className="register-container">
      <div className="canvas-container">
        <Canvas>
          <OrbitControls enableZoom={false} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 5, 2]} />
          <Sphere visible args={[1, 100, 200]} scale={2.5}>
            <MeshDistortMaterial
              color="#8352FD"
              attach="material"
              distort={0.6}
              speed={2}
            />
          </Sphere>
        </Canvas>
      </div>
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
      </div>
    </div>
  );
};

export default Register;
