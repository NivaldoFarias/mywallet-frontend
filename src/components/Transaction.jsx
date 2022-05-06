import { CgArrowsExchangeAlt } from "react-icons/cg";
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { AiOutlineInfoCircle } from "react-icons/ai";

function Transaction({ transaction, index }) {
  let typeIcon = null;
  switch (transaction.type) {
    case "income":
      typeIcon = (
        <GiReceiveMoney className="transaction__header-icon income-icon" />
      );
      break;
    case "expense":
      typeIcon = (
        <GiPayMoney className="transaction__header-icon expense-icon" />
      );
      break;
    case "transfer":
      typeIcon = (
        <CgArrowsExchangeAlt className="transaction__header-icon transfer-icon" />
      );
      break;
    default:
      typeIcon = (
        <AiOutlineInfoCircle className="transaction__header-icon info-icon" />
      );
      break;
  }
  const date = new Date(transaction.date);
  const time = date.toLocaleTimeString("pt-BR").slice(0, 5);
  const day = date.toLocaleDateString("pt-BR").slice(0, 5);

  function Timeline() {
    return (
      <div className="transaction__timeline">
        <div className={index === 0 ? "line first-line " : "line"}></div>
        <div className="circle"></div>
      </div>
    );
  }

  return (
    <>
      <article className="transaction">
        <div className="transaction__header">
          {typeIcon}
          <div className="transaction__header-date">
            <div className="transaction__header-date__day">{day}</div>
            <div className="transaction__header-date__time">{time}</div>
          </div>
        </div>
        <Timeline />
        <div className="transaction__info">
          <div className="transaction__info__amount">
            <span>{transaction.amount}</span>
          </div>
          <div className="transaction__info__description">
            <span>{transaction.description}</span>
          </div>
        </div>
      </article>
    </>
  );
}

export default Transaction;
