import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useLocalStorage } from "./../hooks/useLocalStorage";
import DataContext from "./../hooks/DataContext";

import Login from "./Login";
import SignUp from "./Signup";

export default function App() {
  const [data, setData] = useLocalStorage("data", null);

  return (
    <DataContext.Provider value={{ data, setData }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </DataContext.Provider>
  );
}
