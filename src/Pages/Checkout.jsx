import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Navbar from "../Components/Shared/Navbar";

const Checkout = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const projectId = params.get("id");

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
  const project = allProjects.find((p) => p.id === projectId);

  const handlePayment = async () => {
    if (!phone.startsWith("254")) {
      setMessage("Enter phone in format 2547xxxxxxxx");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:3000/stk-push", {
        phone,
        amount: project.price || 1,
      });

      if (res.data.ResponseCode === "0") {
        setMessage("Payment prompt sent to your phone. Please complete the payment.");
      } else {
        setMessage("Failed to initiate payment.");
      }
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.error || "Something went wrong"));
    }

    setLoading(false);
  };

  if (!project) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <h2 className="text-xl text-red-500">Project not found</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
        <div className="max-w-xl w-full bg-white shadow rounded p-6">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-60 object-cover rounded mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{project.title}</h1>
          <p className="text-gray-600 mb-4">{project.description}</p>
          <p className="text-lg font-semibold text-green-600 mb-6">KES {project.price}</p>

          <input
            type="text"
            placeholder="Enter phone (e.g. 254712345678)"
            className="w-full border p-2 mb-4 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay with M-Pesa"}
          </button>

          {message && (
            <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Checkout;
