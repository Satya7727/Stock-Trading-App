import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";
import { useState, useEffect } from "react";

const BACKEND_URL = "https://stock-trading-app-ton3.onrender.com";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/allHoldings`, {
          withCredentials: true,
        });
        setAllHoldings(res.data);
        setLoading(false);
      } catch (err) {
        console.error(
          "Error fetching holdings:",
          err.response?.data?.message || err.message
        );
        setError("Failed to fetch holdings. Please log in again.");
        setLoading(false);
      }
    };
    fetchHoldings();
  }, []);

  const totalInvestment = allHoldings.reduce(
    (total, stock) => total + stock.qty * stock.avg,
    0
  );
  const currentValue = allHoldings.reduce(
    (total, stock) => total + stock.qty * stock.price,
    0
  );
  const totalPNL = currentValue - totalInvestment;
  const pnlPercentage =
    totalInvestment === 0 ? 0 : (totalPNL / totalInvestment) * 100;

  const labels = allHoldings.map((stock) => stock.name);
  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  if (loading) {
    return <div>Loading holdings...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <h3>Holdings ({allHoldings.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const pnl = curValue - stock.avg * stock.qty;
              const isProfit = pnl >= 0.0;
              const netChange = 0;
              const dayChange = 0;

              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td style={{ color: isProfit ? "green" : "red" }}>
                    {pnl.toFixed(2)}
                  </td>
                  <td style={{ color: netChange >= 0 ? "green" : "red" }}>
                    {netChange.toFixed(2)}
                  </td>
                  <td style={{ color: dayChange >= 0 ? "green" : "red" }}>
                    {dayChange.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="row">
        <div className="col">
          <h5>₹{totalInvestment.toFixed(2)}</h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>₹{currentValue.toFixed(2)}</h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 style={{ color: totalPNL >= 0 ? "green" : "red" }}>
            ₹{totalPNL.toFixed(2)} ({pnlPercentage.toFixed(2)}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>
      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
