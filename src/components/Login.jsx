import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios";

import getRandomInt from "./../utils/getRandomInt.js";
import DataContext from "./../hooks/DataContext";
import logo from "./../assets/mywallet-logo.png";

function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { data, setData } = useContext(DataContext);
  const navigate = useNavigate();

  /* useEffect(() => {
    if (data?.user !== null) {
      navigate("/today");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); */

  function buildLoginPage() {
    return (
      <>
        <figure>
          <img src={logo} alt="logo" />
          <figcaption>MyWallet</figcaption>
        </figure>
        <form
          className="form-group"
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
            <label>Password</label>
          </div>
          <button className={validateLogin()} type="submit">
            <p className={hasSubmitted ? "hidden" : ""}>Sign In</p>
            <div
              id="loading-dots"
              className={hasSubmitted ? "dot-pulse" : "dot-pulse hidden"}
            ></div>
          </button>
          <Link to="/signup">Not yet registered? Sign up!</Link>
        </form>
      </>
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
      const request = axios.post("http://localhost:5000/api/auth/sign-in", {
        email: loginData.email,
        password: loginData.password,
      });

      request.then((response) => {
        setData({
          ...data,
          user: { name: response.data.name, email: response.data.email },
          token: response.data.token,
        });
        navigate("/home");
      });
      request.catch((error) => {
        confirmAlert({
          message: `${error.response.data.message}, please try again.`,
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

  const loginPage = buildLoginPage();

  return (
    <>
      <main id="login-page" className="auth-pages">
        {loginPage}
      </main>
    </>
  );
}

export default Login;
