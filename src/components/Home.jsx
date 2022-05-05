import React, { useContext, useEffect } from "react";
import axios from "axios";

import { FaUser } from "react-icons/fa";
import { IoExitSharp } from "react-icons/io5";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { AiOutlineInfoCircle } from "react-icons/ai";

import DataContext from "./../hooks/DataContext";
import logo from "./../assets/mywallet-logo.png";

function Home() {
  const { data, setData } = useContext(DataContext);
  const URI = "http://localhost:5000/api/transactions/all";
  const CONFIG = {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  };

  useEffect(() => {
    const request = axios.get(URI, CONFIG);
    request
      .then((response) => {
        setData({ ...data, transactions: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function Transaction({ transaction }) {
    let typeIcon = null;
    switch (transaction.type) {
      case "income":
        typeIcon = <GiReceiveMoney />;
        break;
      case "expense":
        typeIcon = <GiPayMoney />;
        break;
      case "transfer":
        typeIcon = <CgArrowsExchangeAlt />;
        break;
      default:
        typeIcon = <AiOutlineInfoCircle />;
        break;
    }

    return (
      <article className="transaction">
        <div className="transaction__icon">{typeIcon}</div>
        <div className="transaction__info">
          <div className="transaction__info-description">
            <span>{transaction.description}</span>
          </div>
          <div className="transaction__info-amount">
            <span>{transaction.amount}</span>
          </div>
          <div className="transaction__info-date">
            <span>{transaction.date}</span>
          </div>
        </div>
      </article>
    );
  }

  function buildHomePage() {
    return (
      <>
        <nav>
          <figure>
            <img src={logo} alt="logo" />
            <figcaption>Welcome, {data?.user.name}!</figcaption>
          </figure>
          <div className="icons-container">
            <FaUser />
            <IoExitSharp />
          </div>
        </nav>
        <section className="transactions-container">
          {data.transactions.map((transaction) => {
            return <Transaction transaction={transaction} />;
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
