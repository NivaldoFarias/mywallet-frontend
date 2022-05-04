import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import logo from "./../assets/mywallet-logo.png";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  });
  const navigate = useNavigate();

  function buildSignupPage() {
    const validateForm =
      formData.name?.length > 0 &&
      formData.email?.length > 0 &&
      formData.password?.length > 0 &&
      formData.image?.length > 0
        ? ""
        : "disabled";

    return (
      <>
        <figure>
          <img src={logo} alt="logo" />
          <figcaption>MyWallet</figcaption>
        </figure>
        <form className="form-group" onSubmit={handleSignUp}>
          <div className="input-group">
            <input
              type="text"
              value={formData.name}
              name="name"
              onChange={handleInputChange}
              required
            />
            <span className="highlight"></span>
            <span className="bar"></span>
            <label>Name</label>
          </div>
          <div className="input-group">
            <input
              type="text"
              value={formData.email}
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
              type="password"
              value={formData.password}
              name="password"
              onChange={handleInputChange}
              required
            />
            <span className="highlight"></span>
            <span className="bar"></span>
            <label>Password</label>
          </div>
          <div className="input-group">
            <input
              type="password"
              value={formData.image}
              name="image"
              onChange={handleInputChange}
              required
            />
            <span className="highlight"></span>
            <span className="bar"></span>
            <label>Confirm Password</label>
          </div>
          <button className={validateForm} type="submit">
            Register
          </button>
          <Link to="/">Already have an account? Login!</Link>
        </form>
      </>
    );

    function handleSignUp(e) {
      e.preventDefault();

      const promise = axios.post("localhost:5000/mywallet/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      promise.then((response) => {
        console.log(response);
        navigate("/");
      });
      promise.catch((error) => console.log(error.response));
    }

    function handleInputChange(e) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  }

  const singupPage = buildSignupPage();

  return (
    <>
      <main id="signup-page" className="auth-pages">
        {singupPage}
      </main>
    </>
  );
}

export default SignUp;
