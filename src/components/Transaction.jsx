import { CgArrowsExchangeAlt } from "react-icons/cg";
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";

import Timeline from "./Timeline";

function Transaction({ transaction, index }) {
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
        <Timeline index={index} />
        <div className="transaction__info">
          <div className={`transaction__info__amount ${transactionType()}`}>
            {value()}
          </div>
          <div className="transaction__info__description">
            <span>{description}</span>
          </div>
        </div>
      </>
    );

    function value() {
      return `${amount > 0 ? "+" : "-"}R$${amount
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
            <GiReceiveMoney className="transaction__header-icon deposit-icon" />
          );
        case "withdrawal":
          return (
            <GiPayMoney className="transaction__header-icon withdrawal-icon" />
          );
        default:
          return (
            <CgArrowsExchangeAlt className="transaction__header-icon transfer-icon" />
          );
      }
    }
  }

  const transactionBody = buildTransaction();

  return <article className="transaction">{transactionBody}</article>;
}

export default Transaction;
