const express = require("express");
const mysql = require("mysql2");
const axios = require("axios");
require("dotenv").config();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'buvi@2006',
    database: process.env.DB_NAME || 'your_database',
  });
  

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to database.");
});
// Route to handle GPT queries
const retryRequest = async (userQuery) => {
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 1000; // 1 second delay
  
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const gptResponse = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userQuery }],
          },
          { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
        );
  
        return gptResponse.data.choices[0].message.content.trim();
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.log(`Rate limit exceeded, retrying... (attempt ${attempt})`);
          if (error.response.headers['retry-after']) {
            const retryAfter = parseInt(error.response.headers['retry-after']);
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000)); // Wait for retry time specified by OpenAI
          } else {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY)); // Wait a default time before retrying
          }
        } else {
          console.error("Error with GPT API:", error);
          throw error;
        }
      }
    }
    throw new Error("Max retries reached");
  };
  
  // Usage in your route
  app.post("/api/query", async (req, res) => {
    const { userQuery } = req.body;
    try {
      const sqlQuery = await retryRequest(userQuery);
      db.query(sqlQuery, (err, results) => {
        if (err) {
          console.error("Error executing query:", err);
          res.status(500).json({ error: "Database query failed" });
        } else {
          res.json({ results });
        }
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to generate SQL query" });
    }
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
