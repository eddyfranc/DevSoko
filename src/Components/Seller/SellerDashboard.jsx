
import React, { useState, useEffect, useMemo } from 'react';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// Real-world storage helpers for DevSoko
const getMyProjects = () => JSON.parse(localStorage.getItem("myProjects") || "[]");
const getPurchases = () => JSON.parse(localStorage.getItem("purchases") || "[]");
const saveMyProjects = (projects) => localStorage.setItem("myProjects", JSON.stringify(projects));

const SellerDashboard = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [sales, setSales] = useState([]);
  const [currentUser, setCurrentUser] = useState(user || { email: '', codeCredits: 100, name: 'Seller' });
  const [loading, setLoading] = useState(!user);
  const navigate = useNavigate();
  
  // New Project Form State
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Full Stack'
  });

  // Get user from Firebase if not passed as prop
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, "users", authUser.uid));
        if (userDoc.exists()) {
          const userData = {
            email: authUser.email,
            ...userDoc.data(),
            codeCredits: userDoc.data().codeCredits || 100,
            name: userDoc.data().name || authUser.email.split('@')[0]
          };
          setCurrentUser(userData);
        } else {
          // Fallback if user doc doesn't exist
          setCurrentUser({
            email: authUser.email,
            codeCredits: 100,
            name: authUser.email.split('@')[0]
          });
        }
        setLoading(false);
      } else {
        // User not authenticated, redirect to login
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [user, navigate]);

  useEffect(() => {
    const p = getMyProjects();
    const s = getPurchases().filter(buy => buy.sellerEmail === currentUser.email);
    setProjects(p);
    setSales(s);
  }, [currentUser.email]);

  const stats = useMemo(() => {
    const totalSales = sales.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const activeCount = projects.length;
    return { totalSales, activeCount };
  }, [sales, projects]);

  const handleDeploy = (e) => {
    e.preventDefault();
    if (currentUser.codeCredits < 10) {
      alert("Insufficient CodeCredits! Recharge your developer wallet to deploy.");
      return;
    }

    const projectData = {
      ...newProject,
      id: `system-${Date.now()}`,
      status: 'active',
      ownerEmail: currentUser.email,
      timestamp: new Date().toISOString()
    };

    const updatedProjects = [projectData, ...projects];
    saveMyProjects(updatedProjects);
    
    // Global list sync (for admin/buyer)
    const all = JSON.parse(localStorage.getItem("allProjects") || "[]");
    localStorage.setItem("allProjects", JSON.stringify([projectData, ...all]));

    setProjects(updatedProjects);
    setCurrentUser(prev => ({ ...prev, codeCredits: prev.codeCredits - 10 }));
    if (setUser) setUser(prev => ({ ...prev, codeCredits: prev.codeCredits - 10 }));
    setShowUploadModal(false);
    setNewProject({ title: '', description: '', price: '', category: 'Full Stack' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Seller <span className="text-indigo-600">Forge</span></h1>
          <p className="text-slate-500 font-medium mt-1">Manage your intellectual property and track commercial success.</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-slate-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center space-x-3"
        >
          <span className="text-xl">⚡</span>
          <span>Deploy New System</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
        {['overview', 'inventory', 'sales'].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview Grid */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
              <span className="text-6xl italic font-black">$$$</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Gross Revenue</p>
            <h3 className="text-4xl font-black text-slate-900">KES {stats.totalSales.toLocaleString()}</h3>
            <div className="mt-6 flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Live Financial Feed</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Hosted Assets</p>
            <h3 className="text-4xl font-black text-slate-900">{stats.activeCount} <span className="text-sm font-medium text-slate-400">Systems</span></h3>
            <p className="text-xs text-indigo-500 font-bold mt-4">Platform Indexed</p>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-100 text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-4">Account Fuel</p>
            <h3 className="text-4xl font-black">{currentUser.codeCredits}</h3>
            <p className="text-xs text-indigo-100 font-medium mt-4 italic">Next deployment: 10 Credits</p>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Asset Name</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Pricing</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Tech Category</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Lifecycle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium italic">
                      No assets found in your repository.
                    </td>
                  </tr>
                ) : (
                  projects.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors cursor-default">
                      <td className="px-8 py-6 font-bold text-slate-800">{p.title}</td>
                      <td className="px-8 py-6">
                        <span className="font-black text-indigo-600">KES {p.price}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase">{p.category}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="flex items-center space-x-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          <span className="text-[10px] font-black uppercase text-emerald-600">Active</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sales Feed */}
      {activeTab === 'sales' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sales.length === 0 ? (
             <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                <span className="text-4xl mb-4 opacity-50">🛒</span>
                <p className="font-bold">Waiting for your first commercial breakthrough.</p>
             </div>
          ) : (
            sales.map((sale, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">✓</div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    {new Date(sale.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 truncate mb-1">{sale.projectTitle}</h4>
                <p className="text-[10px] text-slate-500 font-medium mb-4">{sale.buyerEmail}</p>
                <div className="pt-4 border-t border-slate-50 flex justify-between items-end">
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Transaction Value</span>
                   <span className="text-xl font-black text-slate-900">KES {sale.amount}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Deployment Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900">System Deployment</h2>
                <p className="text-slate-500 font-medium">Standard Indexing Fee: <span className="text-indigo-600 font-black">10 CodeCredits</span></p>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-900 text-2xl">×</button>
            </div>

            <form onSubmit={handleDeploy} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">System Title</label>
                <input 
                  required
                  type="text" 
                  value={newProject.title}
                  onChange={e => setNewProject({...newProject, title: e.target.value})}
                  className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-800"
                  placeholder="e.g. Real Estate Management SaaS"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Valuation (KES)</label>
                  <input 
                    required
                    type="number" 
                    value={newProject.price}
                    onChange={e => setNewProject({...newProject, price: e.target.value})}
                    className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-800"
                    placeholder="25000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Framework</label>
                  <select 
                    value={newProject.category}
                    onChange={e => setNewProject({...newProject, category: e.target.value})}
                    className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-800"
                  >
                    <option>Full Stack</option>
                    <option>Mobile Engine</option>
                    <option>UI Kit</option>
                    <option>AI/ML Script</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Manifesto / Description</label>
                <textarea 
                  required
                  rows={4}
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                  className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-600 resize-none"
                  placeholder="Detailed breakdown of system capabilities..."
                />
              </div>

              <div className="pt-4 space-y-3">
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-slate-900 transition-all active:scale-95"
                >
                  Confirm & Deduct Credits
                </button>
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Your wallet currently holds {currentUser.codeCredits} CodeCredits</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
