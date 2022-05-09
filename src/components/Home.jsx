import React, { useContext, useEffect, useState } from "react";
import { MdOutlineGroups, MdOutlinePerson } from "react-icons/md";
import { IoExitOutline, IoCloseSharp } from "react-icons/io5";
import Modal from "react-modal";
import axios from "axios";

import Transaction from "./Transaction";
import Actions from "./Actions/";

import DataContext from "./../hooks/DataContext";
import logo from "./../assets/mywallet-logo.png";

function Home() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [users, setUsers] = useState([]);
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

  function usersRequest() {
    const URI = "http://localhost:5000/api/users/all";
    const request = axios.get(URI, CONFIG);
    request
      .then((response) => {
        setUsers([...response.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function buildHomePage() {
    let amount = null;
    let cents = null;
    const balance = data.balance.toString().replace(".", ",").split("");
    if (data.balance * 1 === 0) {
      amount = "0,";
      cents = "00";
    } else {
      amount = balance.slice(0, 3).join("");
      cents = balance.slice(3, 5).join("");
    }

    return (
      <>
        <nav>
          <figure>
            <img src={logo} alt="logo" />
            <figcaption>Welcome, {data.user?.name}!</figcaption>
          </figure>
          <div className="icons-container">
            <MdOutlineGroups className="users-icon" onClick={openModal} />
            <IoExitOutline className="exit-icon" />
          </div>
          <Modal
            className="users-modal"
            portalClassName="users-modal-portal"
            overlayClassName="users-overlay"
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            ariaHideApp={false}
          >
            <IoCloseSharp className="close-modal-btn" onClick={closeModal} />
            <div className="users-container">
              {users.map((user) => {
                return (
                  <figure key={user.email} className="user-container">
                    <MdOutlinePerson />
                    <p>{user.name}</p>
                  </figure>
                );
              })}
            </div>
          </Modal>
        </nav>
        <section className="background-container">
          <div className="transactions-container">
            {current.length > 0 ? (
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
                <div className="idle-text">
                  <p>There are no transactions yet!</p>
                  <p>Create a new one by choosing one of the options below</p>
                </div>
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

    function openModal() {
      setIsOpen(true);
    }

    function closeModal() {
      setIsOpen(false);
    }
  }

  const homePage = buildHomePage();

  return (
    <>
      <main id="home-page">{homePage}</main>
    </>
  );
}

export default Home;
