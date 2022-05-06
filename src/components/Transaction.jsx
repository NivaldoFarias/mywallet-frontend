import { CgArrowsExchangeAlt } from "react-icons/cg";
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { AiOutlineInfoCircle } from "react-icons/ai";

function Transaction({ transaction }) {
  let typeIcon = null;
  switch (transaction.type) {
    case "income":
      typeIcon = <GiReceiveMoney />;
      break;
    case "expense":
      typeIcon = <GiPayMoney />;
      break;
    case "transfer":
      typeIcon = <CgArrowsExchangeAlt />;
      break;
    default:
      typeIcon = <AiOutlineInfoCircle />;
      break;
  }

  return (
    <article className="transaction">
      <div className="transaction__icon">{typeIcon}</div>
      <div className="transaction__info">
        <div className="transaction__info-description">
          <span>{transaction.description}</span>
        </div>
        <div className="transaction__info-amount">
          <span>{transaction.amount}</span>
        </div>
        <div className="transaction__info-date">
          <span>{transaction.date}</span>
        </div>
      </div>
    </article>
  );
}

export default Transaction;
