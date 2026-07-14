const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/backtest", async (req, res) => {
  try {
    const { symbol, timeframe, startDate, endDate } = req.body;

    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();

    const response = await axios.get(
      "https://api.binance.com/api/v3/klines",
      {
        params: {
          symbol,
          interval: timeframe,
          startTime,
          endTime,
          limit: 1000,
        },
      }
    );

    res.json({
      success: true,
      candles: response.data,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch candles",
    });
  }
});

module.exports = router;