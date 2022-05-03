import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useLocalStorage } from "./../hooks/useLocalStorage";
import UserContext from "./../hooks/UserContext";
import TokenContext from "./../hooks/TokenContext";

import Login from "./Login";
import SignUp from "./Signup";

export default function App() {
  const [user, setUser] = useLocalStorage("user", null);
  const [token, setToken] = useLocalStorage("token", null);

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      <UserContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </TokenContext.Provider>
  );
}
