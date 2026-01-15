
import React, { useEffect, useMemo, useState } from "react";

// Utility functions to interact with your REAL platform data
const getAllProjects = () => JSON.parse(localStorage.getItem("allProjects") || "[]");
const setAllProjects = (arr) => localStorage.setItem("allProjects", JSON.stringify(arr));
const getMyProjects = () => JSON.parse(localStorage.getItem("myProjects") || "[]");
const setMyProjects = (arr) => localStorage.setItem("myProjects", JSON.stringify(arr));
const getPurchases = () => JSON.parse(localStorage.getItem("purchases") || "[]");
const getPaymentBlocks = () => JSON.parse(localStorage.getItem("paymentDisabledFor") || "[]");
const setPaymentBlocks = (arr) => localStorage.setItem("paymentDisabledFor", JSON.stringify(arr));

/**
 * dministrative interface for managing projects,
 * transactions, and users.
 */
const AdminDashboard = ({ user = { name: "Admin" } }) => {
  const [tab, setTab] = useState("overview");
  const [projects, setProjects] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState("");
  const [blocked, setBlocked] = useState([]);

  // Load real data from storage on mount
  useEffect(() => {
    refreshData();
    // Sync listener for cross-tab updates (Real-time feel)
    const handleStorageChange = () => refreshData();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const refreshData = () => {
    setProjects(getAllProjects());
    setPurchases(getPurchases());
    setBlocked(getPaymentBlocks());
  };

  const filteredProjects = useMemo(() => {
    const q = search.toLowerCase();
    return projects.filter(p => 
      String(p.title || "").toLowerCase().includes(q) ||
      String(p.ownerEmail || "").toLowerCase().includes(q)
    );
  }, [projects, search]);

  const stats = useMemo(() => {
    const totalOrders = purchases.length;
    const totalRevenue = purchases.reduce((sum, p) => sum + Number(p.amount || p.price || 0), 0);
    const platformCommission = totalRevenue * 0.15; // Your 15% cut
    const uniqueUsers = new Set([
      ...purchases.map(p => p.buyerEmail),
      ...projects.map(p => p.ownerEmail)
    ].filter(Boolean)).size;

    return { totalOrders, totalRevenue, platformCommission, uniqueUsers };
  }, [purchases, projects]);

  const handleDeleteProject = (id) => {
    if (!window.confirm("Are you sure? This action is permanent for the developer.")) return;
    const nextAll = getAllProjects().filter((p) => p.id !== id);
    setAllProjects(nextAll);
    const nextMine = getMyProjects().filter((p) => p.id !== id);
    setMyProjects(nextMine);
    setProjects(nextAll);
  };

  const toggleBlock = (email) => {
    const currentBlocks = getPaymentBlocks();
    const isBlocked = currentBlocks.includes(email);
    const next = isBlocked ? currentBlocks.filter((e) => e !== email) : [...currentBlocks, email];
    setPaymentBlocks(next);
    setBlocked(next);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      {/* Admin Side Navigation */}
      <aside className="w-full lg:w-72 bg-slate-900 text-white flex flex-col p-6 shadow-2xl z-20">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tighter">DEV<span className="text-indigo-400">SOKO</span></h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Admin Authority</p>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'overview', label: 'Global Insights', icon: '📊' },
            { id: 'projects', label: 'Project Inventory', icon: '💻' },
            { id: 'payments', label: 'Transaction Ledger', icon: '💰' },
            { id: 'users', label: 'User Management', icon: '👥' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                tab === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <button className="w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-3 rounded-xl text-sm font-bold transition-all">
            Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto max-h-screen">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-3xl font-black text-slate-800 capitalize">{tab} Control</h2>
            <p className="text-slate-500 font-medium">Monitoring real-time platform activity and data.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            </div>
            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Dynamic Tab Rendering */}
        {tab === "overview" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: `KES ${stats.totalRevenue.toLocaleString()}`, color: 'text-slate-800', bg: 'bg-white' },
                { label: 'Platform Profit (15%)', value: `KES ${stats.platformCommission.toLocaleString()}`, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Active Users', value: stats.uniqueUsers, color: 'text-slate-800', bg: 'bg-white' },
                { label: 'Total Orders', value: stats.totalOrders, color: 'text-slate-800', bg: 'bg-white' },
              ].map((card, i) => (
                <div key={i} className={`${card.bg} p-6 rounded-3xl border border-slate-200 shadow-sm`}>
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">{card.label}</p>
                  <h3 className={`text-2xl font-black ${card.color}`}>{card.value}</h3>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
              <h4 className="text-xl font-bold text-slate-800 mb-6">Platform Activity Trends</h4>
              <div className="h-64 flex items-end space-x-2">
                 {/* Visual Mock for Data Trend */}
                 {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                   <div key={i} className="flex-1 bg-indigo-100 rounded-t-xl hover:bg-indigo-600 transition-colors cursor-pointer group relative" style={{ height: `${h}%` }}>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">KES {h * 1000}</span>
                   </div>
                 ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>
        )}

        {tab === "projects" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {filteredProjects.map((p) => (
              <div key={p.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm group hover:shadow-xl transition-all">
                {p.imageUrl && <img src={p.imageUrl} alt="" className="w-full h-40 object-cover" />}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 line-clamp-1">{p.title}</h3>
                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-black uppercase">KES {p.price}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{p.description}</p>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-bold mb-6">
                    <span className="bg-slate-100 px-2 py-1 rounded uppercase tracking-wider">{p.ownerEmail}</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteProject(p.id)}
                    className="w-full bg-red-50 text-red-600 py-3 rounded-2xl text-xs font-black hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest"
                  >
                    Terminate Listing
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "payments" && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Timestamp</th>
                    <th className="px-8 py-5">Buyer Account</th>
                    <th className="px-8 py-5">System Asset</th>
                    <th className="px-8 py-5">Revenue</th>
                    <th className="px-8 py-5">Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {purchases.slice().reverse().map((o, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5 text-xs text-slate-500 font-medium">
                        {o.timestamp ? new Date(o.timestamp).toLocaleString() : "Unknown"}
                      </td>
                      <td className="px-8 py-5 text-xs font-bold text-slate-700">{o.buyerEmail}</td>
                      <td className="px-8 py-5 text-xs text-indigo-600 font-bold uppercase">{o.projectTitle || "Asset#"+o.projectId}</td>
                      <td className="px-8 py-5 text-sm font-black text-slate-900">KES {o.amount || o.price || 0}</td>
                      <td className="px-8 py-5">
                        <button
                          onClick={() => toggleBlock(o.buyerEmail)}
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${
                            blocked.includes(o.buyerEmail)
                              ? "bg-amber-100 text-amber-600 hover:bg-amber-600 hover:text-white"
                              : "bg-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                          }`}
                        >
                          {blocked.includes(o.buyerEmail) ? "Locked" : "Authorized"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
            {(() => {
              const buyers = new Set(purchases.map(p => p.buyerEmail).filter(Boolean));
              const sellers = new Set(projects.map(p => p.ownerEmail).filter(Boolean));
              const all = Array.from(new Set([...buyers, ...sellers]));
              
              return all.map(email => (
                <div key={email} className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col items-center text-center shadow-sm">
                  <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center text-xl mb-4 font-bold text-slate-400 uppercase tracking-tighter">
                    {email.charAt(0)}
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1 truncate w-full">{email}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-6 tracking-widest">
                    {sellers.has(email) ? "Verified Seller" : "Platform Buyer"}
                  </p>
                  <button
                    onClick={() => toggleBlock(email)}
                    className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      blocked.includes(email)
                        ? "bg-red-500 text-white shadow-lg shadow-red-200"
                        : "bg-slate-900 text-white hover:bg-slate-700 shadow-lg shadow-slate-200"
                    }`}
                  >
                    {blocked.includes(email) ? "Unblock Account" : "Block Payments"}
                  </button>
                </div>
              ));
            })()}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
