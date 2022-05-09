import React, { useContext, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Modal from "react-modal";
import axios from "axios";

import { CgArrowsExchangeAlt } from "react-icons/cg";
import { GoCreditCard } from "react-icons/go";
import { BsCashStack } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { RiErrorWarningLine } from "react-icons/ri";

import DataContext from "./../hooks/DataContext";
import Timeline from "./Timeline";

function Transaction({ transaction, index, lastIndex, _id }) {
  const [btnPress, setBtnPress] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);

  const { data } = useContext(DataContext);

  const { type, amount, description } = transaction;
  const date = new Date(transaction.date);
  const time = date.toLocaleTimeString("pt-BR").slice(0, 5);
  const day = date.toLocaleDateString("pt-BR").slice(0, 5);

  function buildTransaction() {
    const typeIcon = transactionIcon();

    return (
      <>
        <div className="transaction__header">
          {typeIcon}
          <div className="transaction__header-date">
            <div className="transaction__header-date__day">{day}</div>
            <div className="transaction__header-date__time">{time}</div>
          </div>
        </div>
        <Timeline index={index} lastIndex={lastIndex} />
        <div className="transaction__info">
          <div className={`transaction__info__amount ${transactionType()}`}>
            {value()}
          </div>
          <div className="transaction__info__description">
            <span>{description}</span>
          </div>
        </div>
        <IoCloseSharp className="transaction__delete-btn" onClick={openModal} />
        <Modal
          className="delete-modal"
          portalClassName="delete-modal-portal"
          overlayClassName="delete-overlay"
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          ariaHideApp={false}
        >
          <IoCloseSharp className="close-modal-btn" onClick={closeModal} />
          <div className="idle-text">
            <RiErrorWarningLine className="idle-text__warning" />
            <p className="idle-text__title">Delete transaction?</p>
            <p className="idle-text__confirm">
              You will not be able to recover it
            </p>
          </div>
          <button className="confirm-delete-btn" onClick={handleClick}>
            <p>Yes, I am sure</p>
          </button>
        </Modal>
      </>
    );

    function handleClick(e) {
      e.preventDefault();
      setBtnPress(!btnPress);
      requestDelete();
    }

    function openModal() {
      setIsOpen(true);
    }

    function closeModal() {
      setIsOpen(false);
    }

    function value() {
      return `${type === "deposit" ? "+" : "-"}R$${amount
        .toFixed(2)
        .toString()
        .replace(".", ",")}`;
    }

    function transactionType() {
      return type === "withdrawal" || "deposit" ? type : "transfer";
    }

    function transactionIcon() {
      switch (type) {
        case "deposit":
          return (
            <GoCreditCard className="transaction__header-icon deposit-icon" />
          );
        case "withdrawal":
          return (
            <BsCashStack className="transaction__header-icon withdrawal-icon" />
          );
        default:
          return (
            <CgArrowsExchangeAlt className="transaction__header-icon transfer-icon" />
          );
      }
    }

    function requestDelete() {
      const body = {
        transactionId: _id,
      };
      const config = {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      };
      const request = axios.delete(
        "http://localhost:5000/api/transactions/delete",
        body,
        config
      );
      request
        .then((_res) => {
          closeModal();
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
        });
    }
  }

  const transactionBody = buildTransaction();

  return <article className="transaction">{transactionBody}</article>;
}

export default Transaction;
