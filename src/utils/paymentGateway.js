export const processPayment = async (packagePrice, isDark) => {
  try {
    console.log("1. Contacting Vercel backend...");
    const response = await fetch("https://devfusion-backend.vercel.app/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: packagePrice }),
    });

    const order = await response.json();
    console.log("2. Order Data from Vercel:", order);

    if (!order.id) {
      alert("Backend Error: Did not receive a valid Order ID from Vercel. Check Vercel logs!");
      return;
    }

    // HARDCODED PUBLIC KEY to bypass Vite .env parsing errors
    const rzpKey = "rzp_test_TZXHKzvDdzP6f7"; 
    console.log("3. Using Razorpay Key:", rzpKey);

    const options = {
      key: rzpKey,
      amount: order.amount,
      currency: order.currency,
      name: "DevFusion",
      description: "Web Development Services",
      order_id: order.id,
      handler: function (response) {
        console.log("Payment Success!", response);
        alert("Payment Successful! Welcome to DevFusion.");
      },
      theme: { color: isDark ? "#020617" : "#3b82f6" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Payment failed:", error);
    alert("Could not load payment gateway. Check console.");
  }
};