import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { CiLogin } from 'react-icons/ci';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Make an API call to your server to check the username and password
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Authentication successful
        // Redirect or perform any other action you need
        console.log('Login successful');
      } else {
        // Authentication failed
        setError(data.error || 'Authentication failed');
        alert('incorrect username or password')
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred during login');
    }
  };

  return (
    <div>
      <Container>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <label>Username</label>
          <br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <br />
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <br />
          <Button variant="primary" type="submit">
            <CiLogin /> Login
          </Button>
        </form>
      </Container>
    </div>
  );
}

export default Login;
