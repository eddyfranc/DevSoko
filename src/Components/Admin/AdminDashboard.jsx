import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdminLoggedIn");
    if (!isAdmin) {
      navigate("/admin-login");
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome Admin 👨‍💻</h1>
      {/* You can now add admin features here */}
      <p className="text-gray-700">Manage users, sales, uploads, etc.</p>
    </div>

  
  );
};

export default AdminDashboard;
