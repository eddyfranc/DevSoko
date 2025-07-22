import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
  
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-4">
          Welcome to DevSoko
        </h1>

        <p className="text-gray-700 text-lg md:text-xl max-w-xl mb-6">
         DevSoko: Built by devs, for dreamers. Upload your code, find your tribe, and turn passion into pay.
         Code it. Sell it. Flex it. A digital shop where devs win and buyers grin.
        </p>

        <div className="space-x-4">
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-lg"
          >
            Get Started
          </Link>
          <Link
            to="/projects"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md text-lg"
          >
            View Projects
          </Link>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Why DevSoko?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 shadow rounded">
              <h3 className="text-lg font-semibold text-blue-500 mb-2">For Developers</h3>
              <p className="text-gray-600 text-sm">
                Got projects or side apps? Upload, chill, and let the cash roll in.
              </p>
            </div>
            <div className="bg-white p-4 shadow rounded">
              <h3 className="text-lg font-semibold text-blue-500 mb-2">For Buyers</h3>
              <p className="text-gray-600 text-sm">
                Need a quick fix? Grab smart, ready-to-run tech without breaking a sweat.
              </p>
            </div>
            <div className="bg-white p-4 shadow rounded">
              <h3 className="text-lg font-semibold text-blue-500 mb-2">Secure Payments</h3>
              <p className="text-gray-600 text-sm">
                Fast, smooth, and stress-free checkouts — built for devs, loved by users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
