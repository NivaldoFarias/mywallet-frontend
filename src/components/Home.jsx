import React, { useContext, useEffect, useState } from "react";
import { MdOutlineGroups } from "react-icons/md";
import { IoExitOutline } from "react-icons/io5";
import axios from "axios";

import Transaction from "./Transaction";
import Actions from "./Actions/";

import DataContext from "./../hooks/DataContext";
import logo from "./../assets/mywallet-logo.png";

function Home() {
  const [current, setCurrent] = useState(0);
  const { data, setData } = useContext(DataContext);
  const CONFIG = {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(transactionRequest, [data.update]);

  function transactionRequest() {
    const URI = "http://localhost:5000/api/transactions";
    const request = axios.get(URI, CONFIG);
    request
      .then((response) => {
        setCurrent(response.data.reverse());
        setData({
          ...data,
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
    const balance = data.balance.toString().replace(".", ",").split("");
    const amount = balance.slice(0, 3).join("");
    const cents = balance.slice(3, 5).join("");

    return (
      <>
        <nav>
          <figure>
            <img src={logo} alt="logo" />
            <figcaption>Welcome, {data.user?.name}!</figcaption>
          </figure>
          <div className="icons-container">
            <MdOutlineGroups className="users-icon" />
            <IoExitOutline className="exit-icon" />
          </div>
        </nav>
        <section className="background-container">
          <div className="transactions-container">
            {current ? (
              current.map((transaction, index) => {
                return (
                  <Transaction
                    key={transaction._id}
                    index={index}
                    transaction={transaction}
                  />
                );
              })
            ) : (
              <>
                <p>Carregando...</p>
              </>
            )}
          </div>
          <div className="balance-container">
            <div className="balance-container__balance">
              <span>R$</span>
              {amount}
              <span>{cents}</span>
            </div>
          </div>
        </section>
        <Actions></Actions>
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
