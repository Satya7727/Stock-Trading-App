require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const axios = require("axios");

const verifyToken = require("./middleware/auth");
const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");

const PORT = process.env.PORT || 3003;
const uri = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";
const EODHD_API_KEY = process.env.EODHD_API_KEY;

const app = express();

app.use(
  cors({
    origin: [
      "https://stock-trading-app-amber.vercel.app",
      "https://stock-trading-app-zeuq.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', 1);

app.get("/allHoldings", verifyToken, async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({ userId: req.userId });
    res.json(allHoldings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/allPositions", verifyToken, async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({ userId: req.userId });
    res.json(allPositions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/allOrders", verifyToken, async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({ userId: req.userId });
    res.json(allOrders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/newOrder", verifyToken, async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orderCost = qty * price;
    if (user.balance < orderCost) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.balance -= orderCost;
    await user.save();

    let newOrder = new OrdersModel({
      name,
      qty,
      price,
      mode,
      userId: req.userId,
    });
    await newOrder.save();

    let holding = await HoldingsModel.findOne({ userId: req.userId, name: name });
    if (holding) {
      holding.qty += qty;
      holding.avg = ((holding.avg * holding.qty) + (price * qty)) / (holding.qty);
      holding.price = price;
      await holding.save();
    } else {
      holding = new HoldingsModel({
        userId: req.userId,
        name: name,
        qty: qty,
        avg: price,
        price: price,
      });
      await holding.save();
    }

    res.json({ message: "Order saved successfully", newBalance: user.balance });
  } catch (err) {
    console.error("Error saving order:", err.message);
    res.status(500).json({ message: "Failed to save order" });
  }
});

app.get("/getBalance", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ fullName, email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id, fullName: newUser.fullName }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000 * 24 * 3
    });

    res.status(201).json({
      message: "User created successfully",
      redirectUrl: "https://stock-trading-app-zeuq.vercel.app/"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id, fullName: user.fullName }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000 * 24 * 3
    });

    res.status(200).json({
      message: "Login successful",
      redirectUrl: "https://stock-trading-app-zeuq.vercel.app/"
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" });
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error during logout" });
  }
});

app.get("/getUserDetails", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("fullName email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ fullName: user.fullName, email: user.email });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/watchlist", async (req, res) => {
  const symbols = [
    'RELIANCE.NSE',
    'TCS.NSE',
    'INFY.NSE',
    'ICICIBANK.NSE',
    'HINDUNILVR.NSE',
  ];
  try {
    const watchlistData = await Promise.all(
      symbols.map(async (symbol) => {
        const stockRes = await axios.get(`https://eodhd.com/api/real-time/${symbol}?api_token=${EODHD_API_KEY}&fmt=json`);
        const stockData = stockRes.data;
        const changePercent = ((stockData.close - stockData.previousClose) / stockData.previousClose) * 100;
        return {
          name: stockData.code,
          price: stockData.close,
          percent: changePercent.toFixed(2),
          isDown: changePercent < 0,
        };
      })
    );
    res.status(200).json(watchlistData);
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Daily limit for API request ended' });
  }
});

mongoose
  .connect(uri)
  .then(() => {
    console.log("DB connected!");
    app.listen(PORT, () => {
      console.log(`App is started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });