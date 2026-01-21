
import React, { useState, useEffect, useMemo } from 'react';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// Real-world storage helpers for DevSoko
const getAllProjects = () => JSON.parse(localStorage.getItem("allProjects") || "[]");
const getPurchases = () => JSON.parse(localStorage.getItem("purchases") || "[]");

const BuyerDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [projects, setProjects] = useState([]);
  const [myAcquisitions, setMyAcquisitions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(user || { email: '', codeCredits: 100, name: 'Buyer' });
  const [loading, setLoading] = useState(!user);
  const navigate = useNavigate();

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
    const all = getAllProjects();
    const buys = getPurchases().filter(buy => buy.buyerEmail === currentUser.email);
    setProjects(all);
    setMyAcquisitions(buys);
  }, [currentUser.email]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const stats = useMemo(() => {
    const totalSpent = myAcquisitions.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const assetCount = myAcquisitions.length;
    return { totalSpent, assetCount };
  }, [myAcquisitions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pt-24">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-slate-500 font-medium mt-1">Source high-performance codebases for your next project.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <input 
            type="text"
            placeholder="Filter by tech stack or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
        {['marketplace', 'my acquisitions', 'wallet'].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Marketplace View */}
      {activeTab === 'marketplace' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-slate-200">
              <span className="text-5xl mb-4 block">📦</span>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No systems found in the registry.</p>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const isOwned = myAcquisitions.some(a => a.projectId === project.id);
              return (
                <div key={project.id} className="group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 flex flex-col">
                  <div className="aspect-video bg-slate-100 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                    <div className="absolute top-6 left-6 flex space-x-2">
                       <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-black uppercase text-indigo-600 border border-white/20">
                         {project.category || 'Full Stack'}
                       </span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed font-medium italic">
                      {project.description}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Acquisition Price</span>
                        <span className="text-2xl font-black text-slate-900">KES {project.price}</span>
                      </div>
                      
                      {isOwned ? (
                        <button className="bg-emerald-100 text-emerald-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest">
                          Acquired ✓
                        </button>
                      ) : (
                        <button 
                          onClick={() => navigate('/checkout', { state: { project } })}
                          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                        >
                          Purchase
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Acquisitions View */}
      {activeTab === 'my acquisitions' && (
        <div className="space-y-6">
          {myAcquisitions.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[2.5rem] border border-slate-200 flex flex-col items-center justify-center">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-6">📂</div>
              <h3 className="text-xl font-bold text-slate-800">Your Portfolio is Empty</h3>
              <p className="text-slate-400 mt-2 font-medium">Head to the Marketplace to acquire your first system.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myAcquisitions.map((asset, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between group">
                  <div className="flex items-center space-x-6">
                    <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black">
                      {asset.projectTitle?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-lg">{asset.projectTitle || "Project Asset"}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Acquired on {new Date(asset.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button className="bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white text-slate-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Download Source
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Wallet View */}
      {activeTab === 'wallet' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Account Expenditure</p>
              <h3 className="text-6xl font-black text-slate-900 tracking-tighter">KES {stats.totalSpent.toLocaleString()}</h3>
              <p className="text-slate-500 font-medium mt-4 italic">Investment across {stats.assetCount} premium systems.</p>
            </div>
            
            <div className="mt-12 flex space-x-4">
               <button className="flex-1 bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100">
                  Buy CodeCredits
               </button>
               <button className="flex-1 bg-slate-100 text-slate-600 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">
                  Statement
               </button>
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-8">
                <span className="text-3xl font-black italic opacity-20 tracking-tighter uppercase">Wallet</span>
                <span className="text-indigo-400 text-2xl">⚡</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Available Fuel</p>
              <h3 className="text-4xl font-black">{currentUser.codeCredits} <span className="text-xs font-medium text-slate-500 block uppercase tracking-tighter">CodeCredits</span></h3>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-800">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Account Status</p>
              <p className="text-xs font-bold text-indigo-400 mt-1 uppercase">Tier 1: Professional Buyer</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
