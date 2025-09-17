import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import "./BuyActionWindow.css";

const BACKEND_URL = "https://stock-trading-app-ton3.onrender.com";

const BuyActionWindow = ({ uid, mode = "BUY", onClose }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);

  const handleOrderClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BACKEND_URL}/newOrder`,
        {
          name: uid,
          qty: stockQuantity,
          price: stockPrice,
          mode: mode,
        },
        { withCredentials: true }
      );
      toast.success("Order placed!");
      onClose();
    } catch (err) {
      console.error(
        "Error saving order:",
        err.response?.data?.message || err.message
      );
      toast.error("An error occurred!");
      onClose();
    }
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
              min="1"
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <button
            className={`btn ${mode === "BUY" ? "btn-blue" : "btn-red"}`}
            onClick={handleOrderClick}
          >
            {mode === "BUY" ? "Buy" : "Sell"}
          </button>
          <button className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
