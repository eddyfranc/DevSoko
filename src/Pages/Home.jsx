import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Shared/Navbar";

const Home = () => {
  const backgroundImages = [background1, background2, background3, background4];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % backgroundImages.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6 py-12 pt-30 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-4 pt-24">
          Welcome to DevSoko
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          Built by devs, for dreamers. 
          <br/>Upload your code, find your tribe, and turn passion into pay.<br/> 
          <span className="text-blue-500 semibold">Code It, Sell It, Flex It</span>. A
          digital marketplace where devs win and buyers grin.
        </p>
        <div className="flex space-x-4">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/projects"
            className="bg-white text-blue-600 px-6 py-3 rounded hover:bg-gray-100 transition"
          >
            View Projects
          </Link>
        </div>
      </div>

      
      <div className="relative z-30 bg-white py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Why DevSoko?
        </h2>
        <div className="flex flex-wrap justify-center gap-6 px-4">
          <div className="bg-white p-6 rounded shadow-md w-72 transform transition-transform duration-200 hover:scale-105">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              For Developers
            </h3>
            <p className="text-gray-700">
              Got projects or side apps? Upload, chill, and let the cash roll in.
            </p>
          </div>
          <div className="bg-white p-6 rounded shadow-md w-72 transform transition-transform duration-200 hover:scale-105">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              For Buyers
            </h3>
            <p className="text-gray-700">
              Need a quick fix? Grab smart, ready-to-run tech without breaking a sweat.
            </p>
          </div>
          <div className="bg-white p-6 rounded shadow-md w-72 transform transition-transform duration-200 hover:scale-105">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Secure Payments
            </h3>
            <p className="text-gray-700">
              Fast, smooth, and stress-free checkouts — built for devs, loved by users.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
