import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import App from "./App.js";
import SignUpLogin from "./Components/SignUpLogIn";
import { Container } from "react-bulma-components";
import SubmitPrompt from "./Components/SubmitPrompt";
import Login from "./Components/Login";
import Nav from "./Components/Nav";
import About from "./Components/About";
import { UserProvider } from "./Components/UserContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <Router>
        <Nav />
        <Container>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/signupLogin" element={<SignUpLogin />} />
            <Route path="/submitPrompt" element={<SubmitPrompt />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
