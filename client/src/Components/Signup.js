import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

function SignUp() {
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const plainTextPassword = password;
    const plainTextEmail = email;
    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, plainTextEmail, plainTextPassword }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const passwordsMatch = password === confirmPassword;
  useEffect(() => {
    console.log(location)
  }, [location])
  return (
    <div className="columns is-centered">
      <div className="column is-4">
        <form className="box login-box" onSubmit={handleSubmit}>
        <h2 className="title has-text-centered">Sign Up</h2>
          <div className="field">
            <label className="label">Username</label>
            <div className="control">
              <input
                className="input"
                type="username"
                placeholder="Enter username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input
                className="input"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input
                className="input"
                type="password"
                placeholder="Enter password"
                autoComplete="new-password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Confirm Password</label>
            <div className="control">
              <input
                className="input"
                type="password"
                placeholder="Confirm password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </div>
            {!passwordsMatch && (
              <p className="help is-danger">Passwords do not match</p>
            )}
          </div>
          <div className="field">
            <div className="control">
              <button
                className="button is-primary is-fullwidth"
                type="submit"
                disabled={!passwordsMatch}
              >
                Signup
              </button>
              <p className="has-text-centered">
            <Link to={{ pathname:"/login", state: { from }}}>Already a member? Log in.</Link> 
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
