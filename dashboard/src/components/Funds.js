import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Funds.css";

const BACKEND_URL = "https://stock-trading-app-scxb.vercel.app";

const Funds = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/getBalance`, {
          withCredentials: true,
        });
        setBalance(res.data.balance);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching balance:", err);
        setError("Failed to fetch funds. Please log in again.");
        setLoading(false);
      }
    };
    fetchBalance();
  }, []);

  if (loading) {
    return <div className="loading-container">Loading funds...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  const openingBalance = 100000;
  const usedMargin = openingBalance - balance;

  return (
    <div className="funds-container">
      <div className="funds-row">
        <div className="funds-col">
          <h3 className="funds-title">Equity</h3>
          <div className="funds-table">
            <div className="row-item">
              <p>Available margin</p>
              <p className="value highlight">₹{balance.toFixed(2)}</p>
            </div>
            <div className="row-item">
              <p>Used margin</p>
              <p className="value">₹{usedMargin.toFixed(2)}</p>
            </div>
            <div className="row-item">
              <p>Available cash</p>
              <p className="value">₹{balance.toFixed(2)}</p>
            </div>

            <hr />

            <div className="row-item">
              <p>Opening Balance</p>
              <p>₹{openingBalance.toFixed(2)}</p>
            </div>
            <div className="row-item">
              <p>Opening Balance</p>
              <p>₹0.00</p>
            </div>
            <div className="row-item">
              <p>Payin</p>
              <p>₹0.00</p>
            </div>
            <div className="row-item">
              <p>SPAN</p>
              <p>₹0.00</p>
            </div>
            <div className="row-item">
              <p>Delivery margin</p>
              <p>₹0.00</p>
            </div>
            <div className="row-item">
              <p>Exposure</p>
              <p>₹0.00</p>
            </div>
            <div className="row-item">
              <p>Options premium</p>
              <p>₹0.00</p>
            </div>

            <hr />

            <div className="row-item">
              <p>Collateral (Liquid funds)</p>
              <p>₹0.00</p>
            </div>
            <div className="row-item">
              <p>Collateral (Equity)</p>
              <p>₹0.00</p>
            </div>
            <div className="row-item">
              <p>Total Collateral</p>
              <p>₹0.00</p>
            </div>
          </div>
        </div>

        <div className="funds-col funds-left">
          <div className="funds-header">
            <p>Instant, zero-cost fund transfers with UPI</p>
            <Link to="/add-funds" className="btn btn-green">
              Add funds
            </Link>
            <Link to="/withdraw-funds" className="btn btn-blue">
              Withdraw
            </Link>
          </div>

          <div className="funds-footer">
            <p>You don't have a commodity account</p>
            <Link to="/open-account" className="btn btn-blue">
              Open Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Funds;
