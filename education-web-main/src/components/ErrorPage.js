// src/components/ErrorPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.code}>Something went wrong</h1>
      <p style={styles.text}>We're working on it. Please try again.</p>
      <pre style={styles.error}>{error?.message}</pre>
      <div style={styles.buttons}>
        <button style={styles.button} onClick={resetErrorBoundary}>Try Again</button>
        <button style={{ ...styles.button, backgroundColor: '#555' }} onClick={() => navigate('/')}>
          Go Home
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: 30,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
  },
  code: {
    fontSize: '2rem',
    color: '#4ab749',
    marginBottom: '0.5rem',
  },
  text: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '1rem',
  },
  error: {
    backgroundColor: '#eee',
    color: '#c00',
    padding: '10px 15px',
    borderRadius: 5,
    maxWidth: '80%',
    overflowX: 'auto',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  buttons: {
    display: 'flex',
    gap: 10,
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4ab749',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default ErrorPage;
