import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Shared/Navbar";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASS = "AdminDevSoko";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (email.trim().toLowerCase() === ADMIN_EMAIL && pass === ADMIN_PASS) {
      localStorage.setItem("adminAuthed", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid admin credentials.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white p-6 rounded shadow"
        >
          <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <input
            type="email"
            placeholder="Admin email"
            className="w-full border rounded p-2 mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded p-2 mb-4"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminLogin;
