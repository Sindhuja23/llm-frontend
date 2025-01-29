// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, CircularProgress, Typography } from '@mui/material';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Both email and password are required');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/login', { email, password });
      onLoginSuccess(response.data.user);
    } catch (err) {
      console.error('Login failed', err);
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 3,
        maxWidth: 400,
        margin: 'auto',
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: 3,
        paddingTop: 4,
        marginTop: 8
      }}
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>

      <TextField
        label="Email"
        variant="outlined"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
        sx={{ marginBottom: 2 }}
      />

      <TextField
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
        sx={{ marginBottom: 2 }}
      />

      {error && (
        <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        onClick={handleLogin}
        sx={{ marginTop: 2 }}
        fullWidth
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Login'}
      </Button>
    </Box>
  );
};

export default Login;
