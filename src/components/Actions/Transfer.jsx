import React, { useContext, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios";

import DataContext from "./../../hooks/DataContext";
import isNumber from "./../../utils/isNumber";
import getRandomInt from "./../../utils/getRandomInt";

function Transfer({ closeModal }) {
  const [transferData, setTransferData] = useState({
    amount: "",
    description: "",
    targetEmail: "",
  });
  const { data, setData } = useContext(DataContext);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  return (
    <form
      className="form-group"
      onSubmit={(e) => {
        e.preventDefault();
        setHasSubmitted(true);
        setTimeout(() => {
          handleTransfer();
        }, getRandomInt(750, 2000));
      }}
    >
      <div className="input-group">
        <input
          className={hasSubmitted ? "disabled" : ""}
          type="number"
          autoComplete="off"
          value={transferData.amount}
          name="amount"
          onChange={handleInputChange}
          required
        />
        <span className="highlight"></span>
        <span className="bar"></span>
        <label>Amount</label>
      </div>
      <div className="input-group">
        <input
          className={hasSubmitted ? "disabled" : ""}
          type="description"
          value={transferData.description}
          name="description"
          maxLength="30"
          onChange={handleInputChange}
          required
        />
        <span className="highlight"></span>
        <span className="bar"></span>
        <label>Description</label>
      </div>
      <div className="input-group">
        <input
          className={hasSubmitted ? "disabled" : ""}
          type="email"
          value={transferData.targetEmail}
          name="targetEmail"
          onChange={handleInputChange}
          required
        />
        <span className="highlight"></span>
        <span className="bar"></span>
        <label>Transfer to</label>
      </div>
      <button className={validateData()} type="submit">
        <p className={hasSubmitted ? "hidden" : ""}>Transfer</p>
        <div
          id="loading-dots"
          className={hasSubmitted ? "dot-pulse" : "dot-pulse hidden"}
        ></div>
      </button>
    </form>
  );

  function validateData() {
    return transferData.amount?.length > 0 &&
      transferData.amount * 1 <= data.balance &&
      isNumber(transferData.amount * 1) &&
      transferData.description?.length > 0 &&
      !hasSubmitted
      ? validateEmail(transferData.targetEmail)
      : "disabled";
  }

  function handleInputChange(e) {
    setTransferData({ ...transferData, [e.target.name]: e.target.value });
  }

  function handleTransfer() {
    const body = {
      to: transferData.targetEmail,
      description: transferData.description,
      amount: transferData.amount.replace(/,/g, ".") * 1,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    };
    const request = axios.post(
      "http://localhost:5000/api/transfers/new",
      body,
      config
    );
    request
      .then(() => {
        closeModal();
        setData({ ...data, update: !data.update });
      })
      .catch((error) => {
        confirmAlert({
          message: `${error.response.data.message}. Please try again.`,
          buttons: [
            {
              label: "OK",
              onClick: () => null,
            },
          ],
        });
        resetAll();
      });
  }

  function validateEmail(email) {
    if (
      String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      return "";
    }
    return "disabled";
  }

  function resetAll() {
    setHasSubmitted(false);
    setTransferData({
      amount: "",
      description: "",
      targetEmail: "",
    });
  }
}

export default Transfer;
