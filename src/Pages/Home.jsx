
import React, { useEffect, useState } from "react";
import NewProjectsAvailable from "./NewProjectsAvailable"; 
import Footer from "../Components/Shared/Footer";

const Home = ({ onGetStarted, onViewProjects }) => {
  // Using curated Unsplash images to represent your background1-5
  const backgroundImages = [
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2070",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=2070",
    "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=2070"
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % backgroundImages.length
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="bg-[#020617]">
      {/* Hero Section */}
      <div
        className="min-h-screen pt-24 flex flex-col items-center justify-center bg-cover bg-center px-6 text-center transition-all duration-1000 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.75), rgba(2, 6, 23, 0.75)), url(${backgroundImages[currentImageIndex]})`,
        }}
      >
        <div className="z-10 animate-in fade-in slide-in-from-top duration-700">
          <NewProjectsAvailable /> 
        </div>
        
        <h1
          className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl animate-in fade-in zoom-in duration-1000"
          style={{ color: "#FF7F50" }}
        >
          Welcome to DevSoko
        </h1>
        
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white drop-shadow-md leading-relaxed">
          Built by devs, for dreamers.
          <br />
          Upload your code, find your tribe, and turn passion into pay.
          <br />
          <span className="text-red-300 font-semibold mt-2 block">
            Code It, Sell It, Flex It
          </span>
        </p>

        <div className="flex flex-wrap justify-center gap-6 z-10">
          <button
            onClick={onGetStarted}
            className="bg-blue-700 hover:bg-blue-600 text-white px-10 py-4 rounded-lg font-bold transition-all transform hover:scale-105 shadow-xl shadow-blue-500/20"
          >
            Get Started
          </button>
          <button
            onClick={onViewProjects}
            className="bg-white text-blue-900 px-10 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            View Projects
          </button>
        </div>
      </div>

      {/* Info Section */}
      <section className="relative z-30 bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl font-bold text-center mb-16"
            style={{ color: "#FF7F50" }}
          >
            Why DevSoko?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="text-blue-600 text-3xl mb-4">💻</div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                For Developers
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Got projects or side apps? Upload, chill, and let the cash roll in. We help you monetize your unused codebase.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="text-blue-600 text-3xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                For Buyers
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Need a quick fix? Grab smart, ready-to-run tech without breaking a sweat or hiring a full agency.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="text-blue-600 text-3xl mb-4">💳</div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                Secure Payments
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Fast, smooth, and stress-free checkouts — built for devs, loved by users. Integrated with global gateways.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
