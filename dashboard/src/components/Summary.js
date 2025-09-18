import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "https://stock-trading-app-ton3.onrender.com";

const Summary = () => {
  const [user, setUser] = useState({ fullName: "User" });
  const [balance, setBalance] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, balanceRes, holdingsRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/getUserDetails`, { withCredentials: true }),
          axios.get(`${BACKEND_URL}/getBalance`, { withCredentials: true }),
          axios.get(`${BACKEND_URL}/allHoldings`, { withCredentials: true }),
        ]);

        setUser({ fullName: userRes.data.fullName || "User" });
        setBalance(balanceRes.data.balance || 0);
        setHoldings(Array.isArray(holdingsRes.data) ? holdingsRes.data : []);
      } catch (err) {
        console.error(
          "Error fetching summary data:",
          err.response?.data?.message || err.message
        );
        setError("Failed to load summary data. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculations
  const totalInvestment = holdings.reduce(
    (total, stock) => total + stock.qty * stock.avg,
    0
  );
  const currentValue = holdings.reduce(
    (total, stock) => total + stock.qty * stock.price,
    0
  );
  const totalPNL = currentValue - totalInvestment;
  const pnlPercentage =
    totalInvestment === 0 ? 0 : (totalPNL / totalInvestment) * 100;

  if (loading) {
    return <div>Loading summary...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <>
      {/* User Greeting */}
      <div className="username">
        <h6>Hi, {user.fullName}!</h6>
        <hr className="divider" />
      </div>

      {/* Balance Section */}
      <div className="section">
        <span>
          <p>Equity</p>
        </span>
        <div className="data">
          <div className="first">
            <h3>₹{balance.toFixed(2)}</h3>
            <p>Margin available (Demo)</p>
          </div>
          <hr />
          <div className="second">
            <p>
              Margins used <span>₹{(100000 - balance).toFixed(2)}</span>
            </p>
            <p>
              Opening balance <span>₹100000.00</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      {/* Holdings Section */}
      <div className="section">
        <span>
          <p>Holdings ({holdings.length})</p>
        </span>
        <div className="data">
          {holdings.length > 0 ? (
            <>
              <div className="first">
                <h3 style={{ color: totalPNL >= 0 ? "green" : "red" }}>
                  ₹{totalPNL.toFixed(2)}{" "}
                  <small style={{ color: totalPNL >= 0 ? "green" : "red" }}>
                    {totalPNL >= 0 ? "+" : ""}
                    {pnlPercentage.toFixed(2)}%
                  </small>
                </h3>
                <p>P&L</p>
              </div>
              <hr />
              <div className="second">
                <p>
                  Current Value <span>₹{currentValue.toFixed(2)}</span>
                </p>
                <p>
                  Investment <span>₹{totalInvestment.toFixed(2)}</span>
                </p>
              </div>
            </>
          ) : (
            <p>No holdings yet. Start trading to see your summary here.</p>
          )}
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
