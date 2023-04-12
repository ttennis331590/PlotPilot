import React, { useState } from "react";
import { Box, Columns, Form, Button, Image } from "react-bulma-components";
import { Link } from "react-router-dom";
import coverArt from "../Images/2x/art1.png";
const { Input, Field, Control, Label } = Form;

function SignUpLogin() {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");

  const emailValidationPattern = /^\S+@\S+\.\S+$/;


  const handleEmailBlur = () => {
    const isValid = emailValidationPattern.test(email);
    setIsEmailValid(isValid);
    console.log(isEmailValid);
  };

  const isValidPassword = (password) => {
    const minLength = 6;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*]/;
    const hasLetter = /[a-zA-Z]/;

    return (
      password.length >= minLength &&
      hasNumber.test(password) &&
      hasSpecialChar.test(password) &&
      hasLetter.test(password)
    );
  };
  const passwordRequirements = [
    {
      text: "At least 6 characters long",
      check: (password) => password.length >= 6,
    },
    {
      text: "At least one letter",
      check: (password) => /[a-zA-Z]/.test(password),
    },
    {
      text: "At least one number",
      check: (password) => /\d/.test(password),
    },
    {
      text: "At least one special character",
      check: (password) => /[!@#$%^&*]/.test(password),
    },
    {
      text: "Passwords must match",
      check: (password, confirmPassword) => password === confirmPassword,
    },
  ];

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    const requestBody ={ username, email, password };
    console.log(requestBody);
    try {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({requestBody})
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  // const handleSignUpSubmit = (e) => {
  //   e.preventDefault();
  //   if (password !== confirmPassword) {
  //     alert("Passwords do not match.");
  //     return;
  //   }

  //   if (!isValidPassword(password)) {
  //     alert(
  //       "Password must be at least 6 characters long, contain at least one letter, one number, and one special character."
  //     );
  //     return;
  //   }

  //   // Add your code to handle successful sign up here
  //   console.log("Sign up successful.");
  // };

  const allRequirementsMet = passwordRequirements.every((req) =>
    req.check(password, confirmPassword)
  );


  
  return (
    <Columns className="signup-login-container is-vcentered is-centered">
      <Columns.Column className="signup-section is-6" id="signup">
        <Box className="signup-box">
          <Columns>
            <Columns.Column className="pb-0">
              <h2 className="is-size-4 has-text-centered">Sign Up</h2>
              <form onSubmit={handleSignUpSubmit}>
                <Field>
                  <Label>Email</Label>
                  <Control>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={handleEmailBlur}
                      required
                    />
                  </Control>
  {!isEmailValid ? (
    <p className="help is-danger">Invalid email</p>
  ) : null}
                </Field>

                <Field>
                  <Label>Username</Label>
                  <Control>
                    <Input 
                      type="text" 
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Control>
                </Field>
                <Field>
                  <Label>Confirm Password</Label>
                  <Control>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Control>
                </Field>
                <ul className="password-requirements">
                  {passwordRequirements.map((req, index) => (
                    <li
                      key={index}
                      style={{
                        color: req.check(password, confirmPassword)
                          ? "green"
                          : "red",
                      }}
                    >
                      {req.text}
                    </li>
                  ))}
                </ul>
                <Button
                  className="fullwidth-button"
                  type="submit"
                  disabled={!allRequirementsMet}
                >
                  Sign Up
                </Button>
              </form>
              <Link to="/login">Already a member? Log In</Link>
            </Columns.Column>
          </Columns>
        </Box>
      </Columns.Column>
    </Columns>
  );
}

export default SignUpLogin;
