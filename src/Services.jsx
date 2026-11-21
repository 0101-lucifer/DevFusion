export default function Services() {
  const handlePayment = async (packagePrice) => {
    try {
      const response = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: packagePrice }), 
      });
      
      const order = await response.json();

      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Test Key ID
        amount: order.amount,
        currency: order.currency,
        name: "DevFusion",
        description: "Web Development Services",
        order_id: order.id,
        handler: function (response) {
          console.log("Payment Success!", response);
          alert("Payment Successful! Welcome to DevFusion.");
        },
        theme: {
          color: "#1e293b", 
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment failed:", error);
      alert("Could not load payment gateway.");
    }
  };

  return (
    <div className="p-10 text-center">
      <h2 className="text-3xl font-bold mb-6">DevFusion Services</h2>
      <button 
        onClick={() => handlePayment(500)} 
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Buy Standard Package (₹500)
      </button>
    </div>
  );
}