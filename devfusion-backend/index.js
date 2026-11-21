require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Import Gemini

const app = express();

// Trust both the live Firebase site and your local React environment
app.use(cors({ 
  origin: ["https://spwebagency-f7663.web.app", "http://localhost:5173"] 
})); 
app.use(express.json());

// Initialize APIs
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ==========================================
// ROUTE 1: RAZORPAY PAYMENTS
// ==========================================
app.post("/create-order", async (req, res) => {
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

// ==========================================
// ROUTE 2: AI PROJECT ESTIMATOR
// ==========================================
app.post("/estimate-project", async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Use the fast and cost-effective Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    
    // System instructions to force the AI to return clean JSON
    const aiPrompt = `You are a senior technical architect for an elite web agency called DevFusion.
    A potential client has requested the following project: "${prompt}"
    
    Analyze their request and break it down. You MUST respond with ONLY a valid raw JSON object. Do not include markdown tags like \`\`\`json. 
    
    The JSON object must have these exact keys:
    - "features": An array of 3 to 4 string values listing the required technical features (e.g., ["Auth", "Stripe Integration"]).
    - "timeframe": A string estimating the build time (e.g., "2-3 Weeks").
    - "suggestedPrice": An integer representing a fair estimated cost in USD (e.g., 1500).
    - "rationale": A single sentence explaining why it costs this much based on their requirements.`;

    const result = await model.generateContent(aiPrompt);
    const responseText = result.response.text();
    
    // Strip out any accidental markdown formatting the AI might sneak in
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const estimateData = JSON.parse(cleanJson);
    
    res.status(200).json(estimateData);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate estimate" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));