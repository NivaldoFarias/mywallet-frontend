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
import EditTransfer from "./EditTransfer";
import EditTransaction from "./EditTransaction";
import Timeline from "./Timeline";

function Transaction({ transaction, index, lastIndex }) {
  const [btnPress, setBtnPress] = useState(false);
  const [editorIsOpen, setOpenEditor] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);

  const { data, setData } = useContext(DataContext);

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
          <div className="transaction__info__description" onClick={openEditor}>
            {description}
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
        <Modal
          className="modal"
          portalClassName="modal-portal"
          overlayClassName="overlay"
          isOpen={editorIsOpen}
          onRequestClose={closeEditor}
          ariaHideApp={false}
        >
          <IoCloseSharp className="close-modal-btn" onClick={closeEditor} />
          {!transaction.type ? (
            <EditTransfer
              closeModal={closeEditor}
              id={transaction._id}
              targetEmail={transaction.to}
            />
          ) : (
            <EditTransaction
              closeModal={closeEditor}
              type={transaction.type}
              id={transaction._id}
            />
          )}
        </Modal>
      </>
    );

    function handleClick(e) {
      e.preventDefault();
      setBtnPress(!btnPress);
      requestDelete();
    }

    function openModal() {
      if (transaction.from === data.user.email || !transaction.from)
        setIsOpen(true);
      else {
        confirmAlert({
          message: `This transaction cannot be modified. Please try again by choosing one that was sent by you.`,
          buttons: [
            {
              label: "OK",
              onClick: () => null,
            },
          ],
        });
      }
    }

    function closeModal() {
      setIsOpen(false);
    }

    function openEditor() {
      setOpenEditor(true);
    }

    function closeEditor() {
      setOpenEditor(false);
    }

    function value() {
      return `${type === "deposit" ? "+" : "-"}R$${amount
        ?.toFixed(2)
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
      let URI = null;
      if (transaction.type) {
        URI = `https://mywallet-full-stack-poc.herokuapp.com/api/transactions/delete/${transaction._id}`;
      } else {
        URI = `https://mywallet-full-stack-poc.herokuapp.com/api/transfers/delete/${transaction._id}`;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      };
      const request = axios.delete(URI, config);
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
        });
    }
  }

  const transactionBody = buildTransaction();

  return <article className="transaction">{transactionBody}</article>;
}

export default Transaction;
