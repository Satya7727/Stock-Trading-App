import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import { Tooltip, Grow } from "@mui/material";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";
import { DoughnutChart } from "./DoughnoutChart";

// Define a fallback list of 8 dummy stocks
const fallbackStocks = [
  { name: "INFY", price: 1520.5, percent: 1.25, isDown: false },
  { name: "TCS", price: 3450.7, percent: 0.8, isDown: true },
  { name: "RELIANCE", price: 2350.2, percent: 2.1, isDown: false },
  { name: "HDFC", price: 1675.0, percent: 0.5, isDown: true },
  { name: "ICICI", price: 870.3, percent: 1.8, isDown: false },
  { name: "WIPRO", price: 580.9, percent: 0.9, isDown: false },
  { name: "BHARTIARTL", price: 710.1, percent: 0.2, isDown: true },
  { name: "LT", price: 1850.4, percent: 1.5, isDown: false },
];

const WatchListActions = ({ uid }) => {
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = () => {
    if (generalContext && typeof generalContext.openBuyWindow === "function") {
      generalContext.openBuyWindow(uid, "BUY");
    }
  };

  const handleSellClick = () => {
    if (generalContext && typeof generalContext.openBuyWindow === "function") {
      generalContext.openBuyWindow(uid, "SELL");
    }
  };

  const commonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "32px",
    lineHeight: "32px",
    minWidth: "60px",
    marginRight: "6px",
    cursor: "pointer",
    verticalAlign: "middle",
  };

  return (
    <span className="actions">
      <span>
        <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
          <button className="buy" style={commonStyle} onClick={handleBuyClick}>
            <span>Buy</span>
          </button>
        </Tooltip>

        <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow}>
          <button className="sell" style={commonStyle} onClick={handleSellClick}>
            <span>Sell</span>
          </button>
        </Tooltip>

        <Tooltip title="Analytics (A)" placement="top" arrow TransitionComponent={Grow}>
          <button className="action" style={commonStyle}>
            <span>
              <BarChartOutlined />
            </span>
          </button>
        </Tooltip>

        <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
          <button className="action" style={commonStyle}>
            <span>
              <MoreHoriz />
            </span>
          </button>
        </Tooltip>
      </span>
    </span>
  );
};

const WatchListItem = ({ stock }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  const handleMouseEnter = () => {
    setShowWatchlistActions(true);
  };

  const handleMouseLeave = () => {
    setShowWatchlistActions(false);
  };

  if (!stock || typeof stock.price !== "number") {
    return (
      <li style={{ color: "red" }}>
        <div className="item">
          <p>Error loading stock data</p>
        </div>
      </li>
    );
  }

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="item">
        <p style={{ color: stock.isDown ? "red" : "green" }}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent">{stock.percent}%</span>
          {stock.isDown ? (
            <KeyboardArrowDown style={{ color: "red" }} />
          ) : (
            <KeyboardArrowUp style={{ color: "green" }} />
          )}
          <span className="price">₹{stock.price.toFixed(2)}</span>
        </div>
      </div>
      {showWatchlistActions && <WatchListActions uid={stock.name} />}
    </li>
  );
};

const WatchList = () => {
  const [allStocks, setAllStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await axios.get("http://localhost:3003/api/watchlist");
        const apiStocks = res.data;
        const mergedStocks = [...apiStocks, ...fallbackStocks];
        
        const uniqueStocks = Array.from(new Set(mergedStocks.map(s => s.name)))
          .map(name => {
            return mergedStocks.find(s => s.name === name);
          });
        
        if (uniqueStocks.length < 8) {
          uniqueStocks.push(...fallbackStocks.slice(uniqueStocks.length));
        }

        setAllStocks(uniqueStocks);
        setFilteredStocks(uniqueStocks);
        setLoading(false);
        setError(null); // Clear any previous error on success
      } catch (err) {
        console.error("Error fetching watchlist:", err);
        // Correctly handle the error state and display fallback stocks
        setError("API not responding. Displaying daily requests.");
        setAllStocks(fallbackStocks);
        setFilteredStocks(fallbackStocks);
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = allStocks.filter((stock) =>
      stock.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStocks(filtered);
  };

  const labels = filteredStocks.map((stock) => stock.name);
  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: filteredStocks.map((stock) => stock.price),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="watchlist-container">
        Loading watchlist...
      </div>
    );
  }

  // Only show the error message if there's an error AND no stocks to display.
  // We'll modify the main render to handle both cases.
  // The logic below is removed to allow the component to render the list and chart even with the error state.
  // if (error) {
  //   return <div className="watchlist-container">Error: {error}</div>;
  // }

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg: BSE, NIFTY, Gold MCX"
          className="search"
          onChange={handleSearchChange}
          value={searchQuery}
        />
        <span className="counts"> {filteredStocks.length} / 50</span>
      </div>

      {error && (
        <div style={{ padding: "10px", textAlign: "center", color: "red", fontWeight: "bold" }}>
          {error}
        </div>
      )}

      <ul className="list">
        {filteredStocks.map((stock, index) => (
          <WatchListItem stock={stock} key={index} />
        ))}
      </ul>

      <DoughnutChart data={data} />
    </div>
  );
};

export default WatchList;