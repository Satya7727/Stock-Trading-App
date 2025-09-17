import React, { useState, useEffect } from "react";
import axios from "axios";

const Summary = () => {
  const [user, setUser] = useState({ fullName: "User" });
  const [balance, setBalance] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get("/getUserDetails", {
          withCredentials: true,
        });
        setUser({ fullName: userRes.data.fullName });

        const balanceRes = await axios.get("/getBalance", {
          withCredentials: true,
        });
        setBalance(balanceRes.data.balance);

        const holdingsRes = await axios.get("/allHoldings", {
          withCredentials: true,
        });
        setHoldings(holdingsRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching summary data:", err);
        setError("Failed to load summary data. Please try again.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="username">
        <h6>Hi, {user.fullName}!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>
        <div className="data">
          <div className="first">
            <h3>₹{balance.toFixed(2)}</h3>
            <p>Margin available-Just for Demo now</p>
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

      <div className="section">
        <span>
          <p>Holdings ({holdings.length})</p>
        </span>
        <div className="data">
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
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
