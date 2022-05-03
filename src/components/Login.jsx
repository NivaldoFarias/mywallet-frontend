import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import axios from "axios";

import UserContext from "./../hooks/UserContext";
import TokenContext from "./../hooks/TokenContext";
import logo from "./../assets/mywallet-logo.png";

import getRandomInt from "./../utils/getRandomInt.js";

function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { setToken } = useContext(TokenContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null) {
      navigate("/today");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main id="login-page">
      <figure>
        <img src={logo} alt="logo" />
        <figcaption>MyWallet</figcaption>
      </figure>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setHasSubmitted(true);
          setTimeout(() => {
            handleLogin();
          }, getRandomInt(750, 2000));
        }}
      >
        <div className="input-group">
          <input
            className={hasSubmitted ? "disabled" : ""}
            type="text"
            value={loginData.email}
            name="email"
            onChange={handleInputChange}
            required
          />
          <span className="highlight"></span>
          <span className="bar"></span>
          <label>E-mail</label>
        </div>
        <div className="input-group">
          <input
            className={hasSubmitted ? "disabled" : ""}
            type="password"
            value={loginData.password}
            name="password"
            onChange={handleInputChange}
            required
          />
          <span className="highlight"></span>
          <span className="bar"></span>
          <label>Senha</label>
        </div>
        <button className={validateLogin()} type="submit">
          <p className={hasSubmitted ? "hidden" : ""}>Entrar</p>
          <div
            id="loading-dots"
            className={hasSubmitted ? "dot-pulse" : "dot-pulse hidden"}
          ></div>
        </button>
        <Link to="/signup">Não possui uma conta? Cadastre-se</Link>
      </form>
    </main>
  );

  function validateLogin() {
    return loginData.email?.length > 0 &&
      loginData.password?.length > 0 &&
      !hasSubmitted
      ? validateEmail(loginData.email)
      : "disabled";
  }

  function handleInputChange(e) {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  }

  function handleLogin() {
    const promise = axios.post("localhost:5000/mywallet/login", {
      email: loginData.email,
      password: loginData.password,
    });

    promise.then((response) => {
      setUser(response.data);
      setToken(response.data.token);

      navigate("/today");
    });
    promise.catch((error) => {
      confirmAlert({
        message: `${error.response.data.message} Por favor, tente novamente.`,
        buttons: [
          {
            label: "OK",
            onClick: () => null,
          },
        ],
      });
      resetAll();
    });
  }

  function validateEmail(email) {
    if (
      String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      return "";
    }
    return "disabled";
  }

  function resetAll() {
    setHasSubmitted(false);
    setLoginData({
      email: "",
      password: "",
    });
  }
}

export default Login;
