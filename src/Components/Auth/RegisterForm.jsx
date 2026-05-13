import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Save user role & email to Supabase users table
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email,
          role,
        });

      if (insertError) throw insertError;

      console.log("User registered and saved to Supabase.");
      alert("Registration successful! Please check your email to verify your account before logging in.");
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="bg-white p-6 rounded shadow-md w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Create an Account
      </h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 mb-4 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 mb-4 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength="8"
        required
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      >
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
      </select>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default RegisterForm;
