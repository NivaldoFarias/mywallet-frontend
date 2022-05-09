import React, { useContext, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios";

import DataContext from "./../hooks/DataContext";
import isNumber from "./../utils/isNumber";
import getRandomInt from "./../utils/getRandomInt";

function EditTransaction({ closeModal, type, id }) {
  const [transactionData, setTransactionData] = useState({
    amount: "",
    description: "",
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
          handleUpdate();
        }, getRandomInt(750, 2000));
      }}
    >
      <div className="input-group">
        <input
          className={hasSubmitted ? "disabled" : ""}
          type="number"
          autoComplete="off"
          value={transactionData.amount}
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
          value={transactionData.description}
          name="description"
          onChange={handleInputChange}
          maxLength="30"
          required
        />
        <span className="highlight"></span>
        <span className="bar"></span>
        <label>Description</label>
      </div>
      <button className={validateData()} type="submit">
        <p className={hasSubmitted ? "hidden" : ""}>Deposit</p>
        <div
          id="loading-dots"
          className={hasSubmitted ? "dot-pulse" : "dot-pulse hidden"}
        ></div>
      </button>
    </form>
  );

  function validateData() {
    return transactionData.amount?.length > 0 &&
      isNumber(transactionData.amount * 1) &&
      transactionData.description?.length > 0 &&
      !hasSubmitted
      ? ""
      : "disabled";
  }

  function handleInputChange(e) {
    setTransactionData({ ...transactionData, [e.target.name]: e.target.value });
  }

  function handleUpdate() {
    const body = {
      type: type,
      description: transactionData.description,
      amount: transactionData.amount.replace(/,/g, ".") * 1,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    };
    const request = axios.put(
      `https://mywallet-full-stack-poc.herokuapp.com/api/transactions/update/${id}`,
      body,
      config
    );
    request
      .then((_res) => {
        closeModal();
        setData({ ...data, update: !data.update });
      })
      .catch((error) => {
        confirmAlert({
          message: `${error.response?.data.message}. Please try again.`,
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

  function resetAll() {
    setHasSubmitted(false);
    setTransactionData({
      amount: "",
      description: "",
    });
  }
}

export default EditTransaction;
