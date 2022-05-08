import React, { useContext, useEffect } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { IoExitSharp } from "react-icons/io5";

import Transaction from "./Transaction";

import DataContext from "./../hooks/DataContext";
import logo from "./../assets/mywallet-logo.png";

function Home() {
  const { data, setData } = useContext(DataContext);
  const CONFIG = {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(transactionRequest, []);

  function transactionRequest() {
    const URI = "http://localhost:5000/api/transactions";
    const request = axios.get(URI, CONFIG);
    request
      .then((response) => {
        setData({
          ...data,
          transactions: response.data.reverse(),
          lastIndex: response.data.length - 1,
        });
        balanceRequest();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function balanceRequest() {
    const URI = "http://localhost:5000/api/users/balance";
    const request = axios.get(URI, CONFIG);
    request
      .then((response) => {
        setData({
          ...data,
          balance: response.data.balance.toFixed(2),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
        <section className="background-container">
          <div className="transactions-container">
            {data.transactions?.map((transaction, index) => {
              return (
                <Transaction
                  key={transaction._id}
                  index={index}
                  transaction={transaction}
                />
              );
            })}
          </div>
          <div className="balance-container">
            <div className="balance-container__title">Balance</div>
            <div className="balance-container__balance">
              <span>R$</span>
              {data.balance.toString().replace(".", ",")}
            </div>
          </div>
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
