import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NewProjectsAvailable from "./NewProjectsAvailable"; 
// import background1 from "../assets/background1.webp";
import background2 from "../assets/background2.webp";
// import background3 from "../assets/Background3.jpg";
import background4 from "../assets/background4.webp";
import background5 from "../assets/background5.png";
import Footer from "../Components/Shared/Footer";

const Home = () => {
  const backgroundImages = [ background2, background4, background5];
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
    <>
      {/* Hero Section */}
      <div
        className="min-h-screen pt-24 flex flex-col items-center justify-center bg-cover bg-center px-6 text-center transition-all duration-1000 relative" // Add `relative` here
        style={{
          backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
        }}
      >
        <NewProjectsAvailable /> 
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md"
          style={{ color: "burlywood" }}
        >
          Welcome to DevSoko
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white drop-shadow-md">
          Built by devs, for dreamers.
          <br />
          Upload your code, find your tribe, and turn passion into pay.
          <br />
          <span className="text-blue-300 font-semibold">
            Code It, Sell It, Flex It
          </span>

        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/register"
            className="bg-blue-800 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/projects"
            className="bg-white text-blue-800 px-6 py-3 rounded hover:bg-gray-100 transition"
          >
            View Projects
          </Link>
        </div>
      </div>

      {/* Info Section */}
      <section className="relative z-30 bg-white py-16 px-4">
        <h2
          className="text-3xl font-bold text-center mb-10"
          style={{ color: "burlywood" }}
        >
          Why DevSoko?
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl shadow-md w-72 transform transition-transform duration-200 hover:scale-105">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              For Developers
            </h3>
            <p className="text-gray-700">
              Got projects or side apps? Upload, chill, and let the cash roll in.
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md w-72 transform transition-transform duration-200 hover:scale-105">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              For Buyers
            </h3>
            <p className="text-gray-700">
              Need a quick fix? Grab smart, ready-to-run tech without breaking a sweat.
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl shadow-md w-72 transform transition-transform duration-200 hover:scale-105">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Secure Payments
            </h3>
            <p className="text-gray-700">
              Fast, smooth, and stress-free checkouts — built for devs, loved by users.
            </p>
          </div>
        </div>
      </section>
       <Footer />
    </>
  );
};

export default Home;