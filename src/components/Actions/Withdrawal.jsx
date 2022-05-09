import React, { useContext, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios";

import DataContext from "./../../hooks/DataContext";
import isNumber from "./../../utils/isNumber";
import getRandomInt from "./../../utils/getRandomInt";

function Withdrawal({ closeModal }) {
  const [withdrawalData, setWithdrawalData] = useState({
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
          handleWithdrawal();
        }, getRandomInt(750, 2000));
      }}
    >
      <div className="input-group">
        <input
          className={hasSubmitted ? "disabled" : ""}
          type="number"
          autoComplete="off"
          value={withdrawalData.amount}
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
          value={withdrawalData.description}
          maxLength="30"
          name="description"
          onChange={handleInputChange}
          required
        />
        <span className="highlight"></span>
        <span className="bar"></span>
        <label>Description</label>
      </div>
      <button className={validateData()} type="submit">
        <p className={hasSubmitted ? "hidden" : ""}>Withdraw</p>
        <div
          id="loading-dots"
          className={hasSubmitted ? "dot-pulse" : "dot-pulse hidden"}
        ></div>
      </button>
    </form>
  );

  function validateData() {
    return withdrawalData.amount?.length > 0 &&
      withdrawalData.amount * 1 <= data.balance &&
      isNumber(withdrawalData.amount * 1) &&
      withdrawalData.description?.length > 0 &&
      !hasSubmitted
      ? ""
      : "disabled";
  }

  function handleInputChange(e) {
    setWithdrawalData({ ...withdrawalData, [e.target.name]: e.target.value });
  }

  function handleWithdrawal() {
    const body = {
      type: "withdrawal",
      description: withdrawalData.description,
      amount: withdrawalData.amount.replace(/,/g, ".") * 1,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    };
    const request = axios.post(
      "https://mywallet-full-stack-poc.herokuapp.com/api/transactions/new",
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
    setWithdrawalData({
      amount: "",
      description: "",
    });
  }
}

export default Withdrawal;
