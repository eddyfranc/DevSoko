import React, { useState } from "react";
import axios from "axios";

const Checkout = () => {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(10); // you can make this dynamic

  const handlePayment = async () => {
    if (!phone || phone.length !== 12 || !phone.startsWith("254")) {
      alert("Please enter a valid Safaricom phone number in the format 2547XXXXXXXX");
      return;
    }

    try {
      const res = await axios.post("/api/stk-push", {
  phone: "2547XXXXXXX", // Make sure it's in correct format
  amount: 100
});

      alert("STK Push Sent! Check your phone to complete payment.");
      console.log("Payment response:", res.data);
    } catch (err) {
      console.error(" Payment error:", err);
      alert("Something went wrong during payment. Try again.");
    }
  };


  // In your Checkout.jsx (after successful "payment")
const saveSale = () => {
  const sales = JSON.parse(localStorage.getItem('sales')) || [];

  const newSale = {
    projectId: project.id,
    projectTitle: project.title,
    buyerEmail: currentUser.email,
    sellerEmail: project.sellerEmail,
    date: new Date().toLocaleString(),
    amount: project.price
  };

  sales.push(newSale);
  localStorage.setItem('sales', JSON.stringify(sales));
};

  
  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-xl rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">DevSoko Checkout</h2>

      <label className="block mb-2 font-medium text-gray-700">Phone Number (Format: 2547XXXXXXXX)</label>
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="254712345678"
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <label className="block mb-2 font-medium text-gray-700">Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <button
        onClick={handlePayment}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Pay with M-Pesa
      </button>
    </div>
  );
};

export default Checkout;
