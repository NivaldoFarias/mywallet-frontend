import React, { useContext } from "react";
import DataContext from "./../hooks/DataContext";

function Timeline({ index }) {
  const { data } = useContext(DataContext);

  return (
    <div className="transaction__timeline">
      <div className={timelineCss()}></div>
      <div className="circle"></div>
    </div>
  );

  function timelineCss() {
    if (index === 0) {
      return "line first-line";
    } else if (data.lastIndex > 1 && index === data.lastIndex) {
      return "line last-line";
    } else return "line";
  }
}

export default Timeline;
