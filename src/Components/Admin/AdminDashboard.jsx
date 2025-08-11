import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Check Admin Auth
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdminLoggedIn");
    if (!isAdmin) {
      navigate("/admin-login");
    }
  }, []);

  // Dummy Data
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", paymentsActive: true },
    { id: 2, name: "Jane Smith", email: "jane@example.com", paymentsActive: true },
  ]);

  const [projects, setProjects] = useState([
    { id: 1, title: "Portfolio Website", owner: "John Doe", price: 500 },
    { id: 2, title: "E-commerce App", owner: "Jane Smith", price: 1500 },
  ]);

  const [salesSummary, setSalesSummary] = useState({
    totalSales: 2000,
    transactions: 5,
  });

  const [activeTab, setActiveTab] = useState("users");

  // Delete project
  const handleDeleteProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  // Toggle payment status
  const togglePayments = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, paymentsActive: !user.paymentsActive }
          : user
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-blue-600 text-white" : "bg-white shadow"}`}
          onClick={() => setActiveTab("users")}
        >
          View Users
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "projects" ? "bg-blue-600 text-white" : "bg-white shadow"}`}
          onClick={() => setActiveTab("projects")}
        >
          View Projects
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "sales" ? "bg-blue-600 text-white" : "bg-white shadow"}`}
          onClick={() => setActiveTab("sales")}
        >
          Payment Summary
        </button>
      </div>

      {/* View Users */}
      {activeTab === "users" && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">All Users</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Payments</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="p-2 border">{u.name}</td>
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border">
                    {u.paymentsActive ? "Active" : "Deactivated"}
                  </td>
                  <td className="p-2 border">
                    <button
                      className={`px-3 py-1 rounded ${u.paymentsActive ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
                      onClick={() => togglePayments(u.id)}
                    >
                      {u.paymentsActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Projects */}
      {activeTab === "projects" && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">All Projects</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Owner</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td className="p-2 border">{p.title}</td>
                  <td className="p-2 border">{p.owner}</td>
                  <td className="p-2 border">KSh {p.price}</td>
                  <td className="p-2 border">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDeleteProject(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Summary */}
      {activeTab === "sales" && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Payment Summary</h2>
          <p>Total Sales: <span className="font-bold">KSh {salesSummary.totalSales}</span></p>
          <p>Transactions: <span className="font-bold">{salesSummary.transactions}</span></p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
