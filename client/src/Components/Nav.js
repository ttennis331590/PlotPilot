import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import logo from '../Images/2x/plotpilot_logo.png';
import { Container, Level, Image, Columns } from 'react-bulma-components';
function Nav() {
  return (
    <Columns className="is-vcentered px-4">
      <Columns.Column>
        <Link to="/submitPrompt" className="nav-text">
          Submit a Prompt
        </Link>
      </Columns.Column>
      <Columns.Column>
        <Link to="/popStories" className="nav-text">
          Popular Stories
        </Link>
      </Columns.Column>
      <Columns.Column textAlign="centered">
        <Link to="/">
          <Image src={logo} alt="PlotPilot Logo" className="logo-nav" />
        </Link>
      </Columns.Column>
      <Columns.Column className="has-text-right">
      <Link to="/about" className="nav-text">
            About
        </Link>
      </Columns.Column>
      <Columns.Column className="has-text-right">
      <Link to="/signupLogin" className="nav-text">
          Sign Up/Log In
        </Link>
    </Columns.Column>
    </Columns>
  );
}

export default Nav;
