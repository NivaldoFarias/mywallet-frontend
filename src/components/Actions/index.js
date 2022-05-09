import React, { useState } from "react";
import Modal from "react-modal";
import { IoCloseSharp } from "react-icons/io5";

import Transfer from "./Transfer";
import Deposit from "./Deposit";
import Withdrawal from "./Withdrawal";

function Actions() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState("");

  return (
    <footer className="action-container">
      <button
        className="action-container__deposit"
        onClick={() => {
          setAction("deposit");
          openModal();
        }}
      >
        <span>Deposit</span>
      </button>
      <button
        className="action-container__transfer"
        onClick={() => {
          setAction("transfer");
          openModal();
        }}
      >
        Transfer
      </button>
      <Modal
        className="modal"
        portalClassName="modal-portal"
        overlayClassName="overlay"
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
      >
        <IoCloseSharp className="close-modal-btn" onClick={closeModal} />
        {switchActions()}
      </Modal>
      <button
        className="action-container__withdraw"
        onClick={() => {
          setAction("withdrawal");
          openModal();
        }}
      >
        <span>Withdraw</span>
      </button>
    </footer>
  );

  function switchActions() {
    switch (action) {
      case "transfer":
        return <Transfer closeModal={closeModal} />;
      case "deposit":
        return <Deposit closeModal={closeModal} />;
      case "withdrawal":
        return <Withdrawal closeModal={closeModal} />;
      default:
        return null;
    }
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
}

export default Actions;
