import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const { from } = location.state || { from: { pathname: '/' } };


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(from)
  }, [from])
  return isLoggedIn ? (
    <Navigate to={from.pathname} replace />
  ) : (
    <>
      <div className="columns is-centered">
        <div className="column is-4">
          <form className="box login-box" onSubmit={handleSubmit}>
            <h2 className="title has-text-centered">Login</h2>
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
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <div className="control">
                <button
                  className="button is-primary is-fullwidth"
                  type="submit"
                >
                  Login
                </button>
              </div>
            </div>
            <p className="has-text-centered">
            <Link to={{ pathname:"/signup", state: { from }}}>Sign Up</Link> &nbsp;|&nbsp;
            <a href=""> Forgot Password</a>
          </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;





<Columns.Column className="login-section" id="login">
<Box className="login-box">
  <h2 className="is-size-4 has-text-centered">Log In</h2>
  <form>
    <Field>
      <Label>Email</Label>
      <Control>
        <Input type="email" placeholder="Email" />
      </Control>
    </Field>
    <Field>
      <Label>Password</Label>
      <Control>
        <Input type="password" placeholder="Password" />
      </Control>
    </Field>
    <Button className="fullwidth-button" type="submit">
      Login
    </Button>
  </form>
</Box>
</Columns.Column>
<Columns.Column className="or-text is-hidden-touch is-2">
<p>or</p>
</Columns.Column>