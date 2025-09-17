import axios from "axios";
import { useState, useEffect } from "react";

const BACKEND_URL = "https://stock-trading-app-ton3.onrender.com";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/allPositions`, {
          withCredentials: true,
        });
        setAllPositions(res.data);
      } catch (err) {
        console.error("Error fetching positions:", err.response?.data?.message || err.message);
        setError("Failed to fetch positions. Please log in again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPositions();
  }, []);

  if (loading) {
    return <div>Loading positions...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <h3>Positions ({allPositions.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>
          <tbody>
            {allPositions.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const pnl = curValue - stock.avg * stock.qty;
              const isProfit = pnl >= 0.0;
              const dayChange = 0;

              return (
                <tr key={index}>
                  <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td style={{ color: isProfit ? "green" : "red" }}>
                    {pnl.toFixed(2)}
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
    </>
  );
};

export default Positions;
