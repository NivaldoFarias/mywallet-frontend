import React, { useContext, useEffect } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { IoExitSharp } from "react-icons/io5";

import Transaction from "./Transaction";

import DataContext from "./../hooks/DataContext";
import logo from "./../assets/mywallet-logo.png";

function Home() {
  const { data, setData } = useContext(DataContext);
  const URI = "http://localhost:5000/api/transactions";
  const CONFIG = {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  };

  useEffect(() => {
    const request = axios.get(URI, CONFIG);
    request
      .then((response) => {
        console.log(response);
        setData({
          ...data,
          transactions: response.data,
          lastIndex: response.data.length - 1,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function buildHomePage() {
    return (
      <>
        <nav>
          <figure>
            <img src={logo} alt="logo" />
            <figcaption>Welcome, {data.user?.name}!</figcaption>
          </figure>
          <div className="icons-container">
            <FaUser className="user-icon" />
            <IoExitSharp className="exit-icon" />
          </div>
        </nav>
        <section className="transactions-container">
          {data.transactions?.map((transaction, index) => {
            return (
              <Transaction
                key={transaction._id}
                index={index}
                transaction={transaction}
              />
            );
          })}
        </section>
        <footer>
          <div className="action-container">entrada</div>
          <div className="action-container">saída</div>
        </footer>
      </>
    );
  }

  const homePage = buildHomePage();

  return (
    <>
      <main id="home-page">{homePage}</main>
    </>
  );
}

export default Home;
