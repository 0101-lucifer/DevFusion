const functions = require("firebase-functions");
const Razorpay = require("razorpay");

// Initialize Razorpay with your Test Keys
const razorpay = new Razorpay({
  key_id: "rzp_test_TYlb7G6UITnJCw",
  key_secret: "Mql1d0hWCBJ4bIwTRnFiCgVu",
});

// Create a secure Callable Function for the React frontend to use
exports.createRazorpayOrder = functions.https.onCall(async (data) => {
  try {
    // We will pass the dynamic amount from our React app later
    const amount = data.amount; 

    const options = {
      amount: amount * 100, // Razorpay expects the amount in paise (e.g., 500 INR = 50000 paise)
      currency: "INR",
      receipt: "receipt_order_" + Math.floor(Math.random() * 10000),
    };

    // Tell Razorpay to generate a secure order ID
    const order = await razorpay.orders.create(options);
    
    // Send that Order ID back to the React frontend
    return order;
    
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new functions.https.HttpsError("internal", "Could not create order.");
  }
});