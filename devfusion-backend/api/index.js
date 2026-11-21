require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors({ 
  origin: ["https://spwebagency-f7663.web.app", "http://localhost:5173", "https://vercel.com"] 
})); 
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ROUTE 1: RAZORPAY
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: "receipt_" + Math.floor(Math.random() * 10000),
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// ROUTE 2: AI ESTIMATOR
app.post("/api/estimate-project", async (req, res) => {
  try {
    const { prompt } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    
    const aiPrompt = `You are a senior technical architect for an elite web agency called DevFusion.
    A potential client has requested the following project: "${prompt}"
    
    Analyze their request and break it down. You MUST respond with ONLY a valid raw JSON object. Do not include markdown tags like \`\`\`json. 
    
    The JSON object must have these exact keys:
    - "features": An array of 3 to 4 string values listing required technical features.
    - "timeframe": A string estimating build time (e.g., "2-3 Weeks").
    - "suggestedPrice": An integer representing estimated cost in USD.
    - "rationale": A single sentence explaining why it costs this much.`;

    const result = await model.generateContent(aiPrompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const estimateData = JSON.parse(cleanJson);
    
    res.status(200).json(estimateData);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate estimate" });
  }
});

// Export handler for Vercel serverless execution
module.exports = app;