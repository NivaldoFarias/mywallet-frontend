import React, { useState } from "react";
import Modal from "react-modal";
import { IoCloseSharp } from "react-icons/io5";

import Transfer from "./Transfer";

function Actions() {
  const [modalIsOpen, setIsOpen] = useState(false);

  return (
    <footer className="action-container">
      <button className="action-container__deposit">
        <span>Deposit</span>
      </button>
      <button className="action-container__transfer" onClick={openModal}>
        Transfer
      </button>
      <Modal
        className="modal"
        portalClassName="modal-portal"
        overlayClassName="overlay"
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <IoCloseSharp className="close-modal-btn" onClick={closeModal} />
        <Transfer closeModal={closeModal} />
      </Modal>
      <button className="action-container__withdraw">
        <span>Withdraw</span>
      </button>
    </footer>
  );

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
}

export default Actions;
