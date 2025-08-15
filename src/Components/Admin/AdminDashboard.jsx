import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Shared/Navbar";

const getAllProjects = () =>
  JSON.parse(localStorage.getItem("allProjects") || "[]");
const setAllProjects = (arr) =>
  localStorage.setItem("allProjects", JSON.stringify(arr));

const getMyProjects = () =>
  JSON.parse(localStorage.getItem("myProjects") || "[]");
const setMyProjects = (arr) =>
  localStorage.setItem("myProjects", JSON.stringify(arr));

const getPurchases = () =>
  JSON.parse(localStorage.getItem("purchases") || "[]");

const getPaymentBlocks = () =>
  JSON.parse(localStorage.getItem("paymentDisabledFor") || "[]");
const setPaymentBlocks = (arr) =>
  localStorage.setItem("paymentDisabledFor", JSON.stringify(arr));

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [projects, setProjects] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState("");
  const [blocked, setBlocked] = useState([]);

  useEffect(() => {
    const authed = localStorage.getItem("adminAuthed") === "true";
    if (!authed) navigate("/admin");
  }, [navigate]);

  useEffect(() => {
    setProjects(getAllProjects());
    setPurchases(getPurchases());
    setBlocked(getPaymentBlocks());
  }, []);

  const filteredProjects = useMemo(() => {
    if (!search.trim()) return projects;
    const q = search.toLowerCase();
    return projects.filter(
      (p) =>
        String(p.title || "").toLowerCase().includes(q) ||
        String(p.description || "").toLowerCase().includes(q) ||
        String(p.ownerEmail || "").toLowerCase().includes(q)
    );
  }, [projects, search]);

  const totals = useMemo(() => {
    const totalOrders = purchases.length;
    const totalRevenue = purchases.reduce(
      (sum, p) => sum + Number(p.amount || p.price || 0),
      0
    );
    const uniqueBuyers = new Set(purchases.map((p) => p.buyerEmail)).size;
    return { totalOrders, totalRevenue, uniqueBuyers };
  }, [purchases]);

  const handleDeleteProject = (id) => {
    if (!window.confirm("Delete this project?")) return;

    // remove from allProjects
    const nextAll = getAllProjects().filter((p) => p.id !== id);
    setAllProjects(nextAll);
    setProjects(nextAll);

    // also try remove from myProjects if it exists
    const nextMine = getMyProjects().filter((p) => p.id !== id);
    setMyProjects(nextMine);

    // (optional) remove purchases for this project
    // const remainingPurchases = getPurchases().filter(p => p.projectId !== id);
    // localStorage.setItem("purchases", JSON.stringify(remainingPurchases));
    // setPurchases(remainingPurchases);
  };

  const toggleBlock = (email) => {
    const set = new Set(getPaymentBlocks());
    if (set.has(email)) set.delete(email);
    else set.add(email);
    const next = Array.from(set);
    setPaymentBlocks(next);
    setBlocked(next);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthed");
    navigate("/admin");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="space-x-2">
              <button
                onClick={() => setTab("overview")}
                className={`px-3 py-1 rounded ${
                  tab === "overview" ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setTab("projects")}
                className={`px-3 py-1 rounded ${
                  tab === "projects" ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setTab("payments")}
                className={`px-3 py-1 rounded ${
                  tab === "payments" ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                Payments
              </button>
              <button
                onClick={() => setTab("users")}
                className={`px-3 py-1 rounded ${
                  tab === "users" ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                Users
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded bg-red-100 text-red-600"
              >
                Admin Logout
              </button>
            </div>
          </div>

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded shadow p-4">
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{totals.totalOrders}</p>
              </div>
              <div className="bg-white rounded shadow p-4">
                <p className="text-sm text-gray-500">Total Revenue (KES)</p>
                <p className="text-2xl font-bold">{totals.totalRevenue}</p>
              </div>
              <div className="bg-white rounded shadow p-4">
                <p className="text-sm text-gray-500">Unique Buyers</p>
                <p className="text-2xl font-bold">{totals.uniqueBuyers}</p>
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {tab === "projects" && (
            <div className="bg-white rounded shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">All Projects</h2>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search title/desc/owner…"
                  className="border rounded px-3 py-1"
                />
              </div>

              {filteredProjects.length === 0 ? (
                <p className="text-gray-500">No projects found.</p>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {filteredProjects.map((p) => (
                    <div
                      key={p.id}
                      className="border rounded p-3 bg-gray-50 flex flex-col"
                    >
                      {p.imageUrl && (
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-full h-40 object-cover rounded mb-2"
                        />
                      )}
                      <h3 className="font-semibold">{p.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {p.description}
                      </p>
                      <p className="mt-1 font-bold text-green-700">
                        KES {p.price}
                      </p>
                      {p.ownerEmail && (
                        <p className="text-xs text-gray-500">
                          Seller: {p.ownerEmail}
                        </p>
                      )}
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="mt-3 bg-red-600 text-white rounded px-3 py-1 hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PAYMENTS */}
          {tab === "payments" && (
            <div className="bg-white rounded shadow p-4">
              <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold">{totals.totalOrders}</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-500">Revenue (KES)</p>
                  <p className="text-2xl font-bold">{totals.totalRevenue}</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-500">Unique Buyers</p>
                  <p className="text-2xl font-bold">{totals.uniqueBuyers}</p>
                </div>
              </div>

              {purchases.length === 0 ? (
                <p className="text-gray-500">No purchases yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2 pr-4">Buyer</th>
                        <th className="py-2 pr-4">Project</th>
                        <th className="py-2 pr-4">Amount</th>
                        <th className="py-2 pr-4">Controls</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchases
                        .slice()
                        .reverse()
                        .map((o, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="py-2 pr-4">
                              {o.timestamp
                                ? new Date(o.timestamp).toLocaleString()
                                : "-"}
                            </td>
                            <td className="py-2 pr-4">{o.buyerEmail || "-"}</td>
                            <td className="py-2 pr-4">{o.projectTitle || o.projectId}</td>
                            <td className="py-2 pr-4">KES {o.amount || o.price || 0}</td>
                            <td className="py-2 pr-4">
                              {o.buyerEmail && (
                                <button
                                  onClick={() => toggleBlock(o.buyerEmail)}
                                  className={`px-2 py-1 rounded ${
                                    blocked.includes(o.buyerEmail)
                                      ? "bg-yellow-500 text-white"
                                      : "bg-gray-200"
                                  }`}
                                  title="Toggle payment permission for this buyer"
                                >
                                  {blocked.includes(o.buyerEmail)
                                    ? "Payments: OFF"
                                    : "Payments: ON"}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Blocked Buyers</h3>
                {blocked.length === 0 ? (
                  <p className="text-sm text-gray-500">None</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {blocked.map((e) => (
                      <span
                        key={e}
                        className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* USERS */}
          {tab === "users" && (
            <div className="bg-white rounded shadow p-4">
              <h2 className="text-xl font-semibold mb-4">Users (derived)</h2>
              <p className="text-sm text-gray-600 mb-4">
                Since we’re using localStorage, users are inferred from purchases (buyers)
                and projects (sellers). If you later store a proper users list, we can
                switch this tab to Firestore easily.
              </p>

              {(() => {
                const buyers = new Set(
                  purchases.map((p) => p.buyerEmail).filter(Boolean)
                );
                const sellers = new Set(
                  projects.map((p) => p.ownerEmail).filter(Boolean)
                );
                const all = Array.from(new Set([...buyers, ...sellers]));
                if (all.length === 0) {
                  return <p className="text-gray-500">No user data yet.</p>;
                }
                return (
                  <ul className="space-y-2">
                    {all.map((email) => (
                      <li
                        key={email}
                        className="flex items-center justify-between bg-gray-50 border rounded px-3 py-2"
                      >
                        <span>{email}</span>
                        <button
                          onClick={() => toggleBlock(email)}
                          className={`px-2 py-1 rounded ${
                            blocked.includes(email)
                              ? "bg-yellow-500 text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          {blocked.includes(email)
                            ? "Payments: OFF"
                            : "Payments: ON"}
                        </button>
                      </li>
                    ))}
                  </ul>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
