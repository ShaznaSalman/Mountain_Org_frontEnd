import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/dashboard');
  };


  return (
    <div style={styles.container}>
      <div style={styles.welcomeBox}>
        <h1>Welcome to Juices Inc.</h1>
        <p>Get ready to explore our delicious offerings!</p>
        <button onClick={handleStart} style={styles.button}>
          Get Started
        </button>
      </div>
    </div>
  );
};
  

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'white',
    backgroundImage: 'url(src/assets/bg.jpg)', 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  welcomeBox: {
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#FFFFE0',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    textAlign: 'center' as const,
    heading: {
      fontWeight: 'bold', 
    },
    width: '300px',
  },
  button: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#f17368',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default Login;