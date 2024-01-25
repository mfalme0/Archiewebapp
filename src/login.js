import React, { useState } from 'react';
import { BsFillSendFill } from "react-icons/bs";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import 'firebase/auth';
import Admin from './admin';

function Ndikwara() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false); // New state for login status

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        console.log('User signed in successfully!');
        setLoggedIn(true); // Set login status to true
        // You can redirect the user or perform other actions upon successful login.
      } else {
        console.error('Error signing in:', response.statusText);
        alert('Wrong email or password');
        // Handle the error condition, e.g., display an error message to the user.
      }
    } catch (error) {
      console.error('Error signing in:', error.message);
      // Handle the error condition, e.g., display an error message to the user.
    }
  };

  return (
    <Container>
      <Container className={loggedIn ? "admin" : "login"}>
        {!loggedIn ? (
          <Row>
            <Col>
              <h1 className="project-heading">
                Admin <strong className="purple">Login </strong> <MdOutlineAdminPanelSettings />
              </h1>
              <p style={{ color: "white" }}>
                Please input your credentials
              </p>
              <div className="login-container" fluid>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={handleEmailChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                    />
                  </Form.Group>
                  <br />
                  <Button variant="primary" type="submit">
                    Submit <BsFillSendFill />
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        ) : (
          <Admin />
        )}
      </Container>
    </Container>
  );
}
export default Ndikwara

