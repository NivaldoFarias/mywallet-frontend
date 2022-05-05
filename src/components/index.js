import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useLocalStorage } from "./../hooks/useLocalStorage";
import DataContext from "./../hooks/DataContext";

import Login from "./Login";
import SignUp from "./Signup";
import Home from "./Home";

export default function App() {
  const [data, setData] = useLocalStorage("data", null);

  return (
    <DataContext.Provider value={{ data, setData }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </DataContext.Provider>
  );
}
