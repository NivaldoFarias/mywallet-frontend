import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [current, setCurrent] = useState([]);
  const [users, setUsers] = useState([]);
  const [lastIndex, setlastIndex] = useState(null);
  const { data, setData } = useContext(DataContext);
  const CONFIG = {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  };

  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(transactionRequest, [data.update]);

  function transactionRequest() {
    const URI =
      "https://mywallet-full-stack-poc.herokuapp.com/api/transactions";
    const request = axios.get(URI, CONFIG);
    request
      .then((response) => {
        setCurrent(response.data.reverse());
        setlastIndex(response.data.length - 1);
        balanceRequest();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function balanceRequest() {
    const URI =
      "https://mywallet-full-stack-poc.herokuapp.com/api/users/balance";
    const request = axios.get(URI, CONFIG);
    request
      .then((response) => {
        setData({
          ...data,
          balance: response.data.balance.toFixed(2),
        });
        usersRequest();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function usersRequest() {
    const URI = "https://mywallet-full-stack-poc.herokuapp.com/api/users/all";
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
    const balance = data.balance?.toString().split(".");
    if (balance) {
      if (data.balance * 1 === 0) {
        amount = "0,";
        cents = "00";
      } else {
        amount = balance[0];
        cents = `,${balance[1]}`;
      }
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
            <IoExitOutline className="exit-icon" onClick={requestSignOff} />
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
              {users?.map((user) => {
                return (
                  <figure key={user.email} className="user-container">
                    <MdOutlinePerson
                      className={
                        user?.name === data.user?.name
                          ? "self-icon user-icon"
                          : "user-icon"
                      }
                    />
                    <div className="user-container__info">
                      <p className="user-container__info__name">{user.name}</p>
                      <p className="user-container__info__email">
                        {user.email}
                      </p>
                    </div>
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
                    lastIndex={lastIndex}
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

    function requestSignOff() {
      const URI =
        "https://mywallet-full-stack-poc.herokuapp.com/api/users/sign-off";
      const request = axios.post(URI, {}, CONFIG);
      request
        .then(() => {
          setData({
            ...data,
            user: null,
            token: null,
            balance: null,
            lastIndex: null,
          });
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
        });
    }

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
