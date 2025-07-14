import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Navbar from "../Components/Shared/Navbar";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const project = location.state?.project;

  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!project) navigate("/projects"); // redirect if no project
  }, [project, navigate]);

  const handleBuy = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return navigate("/login");

    // Simulate saving purchase
    await addDoc(collection(db, "purchases"), {
      buyerId: user.uid,
      buyerEmail: user.email,
      sellerEmail: project.email,
      projectId: project.id,
      projectTitle: project.title,
      amount: project.price,
      phoneNumber: phone,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    alert("Purchase submitted! (M-Pesa integration coming soon)");
    navigate("/projects");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <form onSubmit={handleBuy} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Confirm Purchase</h2>
          <p className="mb-2"><strong>Project:</strong> {project?.title}</p>
          <p className="mb-4"><strong>Price:</strong> Ksh {project?.price}</p>

          <input
            type="tel"
            placeholder="Your M-Pesa Number"
            className="w-full p-2 mb-4 border rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Pay with M-Pesa
          </button>
        </form>
      </div>
    </>
  );
};

export default Checkout;
