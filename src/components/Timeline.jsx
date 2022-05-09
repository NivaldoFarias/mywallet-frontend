import React from "react";

function Timeline({ index, lastIndex }) {
  return (
    <div className="transaction__timeline">
      <div className={timelineCss()}></div>
      <div className="circle"></div>
    </div>
  );

  function timelineCss() {
    let str = "line";
    if (index === 0) {
      str += " first-line";
    } else if (index === lastIndex) {
      str += " last-line";
    }
    return str;
  }
}

export default Timeline;
