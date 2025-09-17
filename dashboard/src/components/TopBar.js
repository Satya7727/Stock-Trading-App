import React from "react";
import Menu from "./Menu";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const TopBar = () => {
  const nifty = { points: 23501.10, percent: 0.15, isProfit: true };
  const sensex = { points: 77209.90, percent: 0.16, isProfit: true };

  const NiftyArrow = nifty.isProfit ? (
    <KeyboardArrowUp style={{ color: "green", fontSize: "16px", marginLeft: "2px" }} />
  ) : (
    <KeyboardArrowDown style={{ color: "red", fontSize: "16px", marginLeft: "2px" }} />
  );

  const SensexArrow = sensex.isProfit ? (
    <KeyboardArrowUp style={{ color: "green", fontSize: "16px", marginLeft: "2px" }} />
  ) : (
    <KeyboardArrowDown style={{ color: "red", fontSize: "16px", marginLeft: "2px" }} />
  );

  return (
    <div className="topbar-container">
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className="index-points" style={{ color: nifty.isProfit ? "green" : "red" }}>
            {nifty.points.toFixed(2)}
          </p>
          <p className="percent" style={{ color: nifty.isProfit ? "green" : "red" }}>
            ({nifty.percent.toFixed(2)}%){NiftyArrow}
          </p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className="index-points" style={{ color: sensex.isProfit ? "green" : "red" }}>
            {sensex.points.toFixed(2)}
          </p>
          <p className="percent" style={{ color: sensex.isProfit ? "green" : "red" }}>
            ({sensex.percent.toFixed(2)}%){SensexArrow}
          </p>
        </div>
      </div>
      <Menu />
    </div>
  );
};

export default TopBar;