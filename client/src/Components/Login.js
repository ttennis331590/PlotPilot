import React, { useState } from 'react';
import { Box, Columns, Form, Button, Image } from "react-bulma-components";
import art from '../Images/2x/art1.png';
import { useUser } from "./UserContext";
const { Input, Field, Control, Label, Checkbox } = Form;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data);
  
      // Check if the login was successful
      if (data.token) {
        setUser({
          id: data.userId,
          token: data.token,
        });
      } else {
        // Handle login failure, e.g. show an error message
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
  <Columns className="signup-login-container is-vcentered is-centered">
      <Columns.Column className="login-section is-6" id="login">
        <Box className="login-box">
          <h2 className="is-size-4 has-text-centered">Log In</h2>
          <form onSubmit={handleSubmit}>
            <Field>
              <Label>Email</Label>
              <Control>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Control>
            </Field>
            <Field>
              <Label>Password</Label>
              <Control>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Control>
            </Field>
            <Field>
              <Label className="checkbox">
              <Checkbox></Checkbox> Remember me
              </Label>
            </Field>
            <Button className="fullwidth-button" type="submit">
              Login
            </Button>
          </form>
        </Box>
      </Columns.Column>

    </Columns>
  );
}

export default Login;
