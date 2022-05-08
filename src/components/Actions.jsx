import React, { useState } from "react";
import Modal from "react-modal";
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
        <button onClick={closeModal}>close</button>
        <div>I am a modal</div>
        <form className="transfer-form">
          <input />
          <button>tab navigation</button>
          <button>stays</button>
          <button>inside</button>
          <button>the modal</button>
        </form>
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
