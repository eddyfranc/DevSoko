import React, { useEffect, useState, useMemo } from 'react';

// Reusable Storage Helper (Syncs with Seller Dashboard)
const storage = {
  get: (key) => JSON.parse(localStorage.getItem(key) || "[]"),
};

const ViewProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All Systems');

  useEffect(() => {
    // Simulate network delay for "enticing" loading feel
    const timer = setTimeout(() => {
      const all = storage.get("allProjects");
      setProjects(all);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  const categories = ['All Systems', 'Frontend', 'Backend', 'Full Stack', 'Mobile Engine', 'UI Kit', 'AI/ML Script'];

  const filteredProjects = useMemo(() => {
    if (filter === 'All Systems') return projects;
    return projects.filter(p => p.category === filter);
  }, [projects, filter]);

  // Visual Utility: Generates a unique gradient for projects without images
  const getGradient = (title) => {
    const colors = [
      'from-indigo-500 to-purple-600',
      'from-emerald-400 to-cyan-500',
      'from-orange-400 to-rose-500',
      'from-blue-600 to-indigo-800',
      'from-slate-800 to-slate-900'
    ];
    const index = title ? title.length % colors.length : 0;
    return colors[index];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-100 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
        </div>
        <p className="mt-6 text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Scanning Digital Assets...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-transparent to-transparent -z-10" />
        
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-block bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Premium Software Marketplace</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
            Acquire <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Production-Ready</span> Systems
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 font-medium text-lg">
            High-performance codebases, SaaS templates, and AI engines ready for immediate commercial deployment.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === cat 
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 scale-105' 
                : 'bg-white text-slate-400 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-6">
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <span className="text-5xl block grayscale opacity-20">📦</span>
            <h3 className="text-xl font-bold text-slate-900">No systems found in this sector</h3>
            <p className="text-slate-400">Check back later for new deployments.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.map((proj) => (
              <div 
                key={proj.id} 
                className="group bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
              >
                {/* Image / Gradient Preview */}
                <div className="h-64 relative overflow-hidden">
                  {proj.imageUrl ? (
                    <img
                      src={proj.imageUrl}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getGradient(proj.title)} p-10 flex flex-col justify-end`}>
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                        <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">{proj.category}</span>
                        <div className="h-1 w-12 bg-white/40 mt-2 rounded-full" />
                      </div>
                    </div>
                  )}
                  
                  {/* Status Overlay */}
                  <div className="absolute top-6 right-6">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-sm flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span>Verified Code</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">{proj.category}</span>
                       <span className="text-[10px] font-medium text-slate-400 italic">ID: {String(proj.id).slice(-6)}</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                      {proj.title}
                    </h2>
                    <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      {proj.description || "No manifesto provided for this technical asset."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Acquisition Cost</p>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-xs font-bold text-slate-400 uppercase">KES</span>
                        <span className="text-2xl font-black text-slate-900">{Number(proj.price).toLocaleString()}</span>
                      </div>
                    </div>

                    <a
                      href={`/checkout?id=${proj.id}`}
                      className="bg-slate-900 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 shadow-lg shadow-slate-100 transition-all flex items-center space-x-2"
                    >
                      <span>Purchase</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Quality Badge */}
      <footer className="mt-20 flex justify-center">
        <div className="flex items-center space-x-8 opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
          <div className="flex items-center space-x-2 font-black text-[10px] uppercase tracking-widest text-slate-400">
            <span className="text-xl">🛡️</span>
            <span>Escrow Protected</span>
          </div>
          <div className="flex items-center space-x-2 font-black text-[10px] uppercase tracking-widest text-slate-400">
            <span className="text-xl">⚡</span>
            <span>Instant Delivery</span>
          </div>
          <div className="flex items-center space-x-2 font-black text-[10px] uppercase tracking-widest text-slate-400">
            <span className="text-xl">💳</span>
            <span>MPESA Integrated</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ViewProjects;
