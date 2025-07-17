import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../Components/Shared/Navbar";

const Checkout = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const projectId = params.get("id");

  const [project, setProject] = useState(null);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
    const foundProject = allProjects.find((p) => p.id === projectId);
    setProject(foundProject);
  }, [projectId]);

  const handlePay = async () => {
    if (!phone || phone.length !== 12 || !phone.startsWith("254")) {
      alert("Enter valid Safaricom number e.g., 2547XXXXXXX");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/stk-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone,
          amount: project?.price || 1,
        }),
      });

      const data = await res.json();
      if (data.ResponseCode === "0") {
        alert("M-Pesa Prompt Sent! Confirm payment on your phone.");
      } else {
        alert("M-Pesa payment failed. Try again.");
        console.error("Payment Error:", data);
      }
    } catch (err) {
      console.error("Network Error:", err);
      alert("Network error. Make sure backend is running.");
    }
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

          <label className="block text-sm font-medium mb-1">Safaricom Phone Number</label>
          <input
            type="tel"
            className="border rounded px-3 py-2 w-full mb-4"
            placeholder="e.g. 254712345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            onClick={handlePay}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            Pay with M-Pesa
          </button>
        </div>
      </div>
    </>
  );
};

export default Checkout;
