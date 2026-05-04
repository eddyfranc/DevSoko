import { Link } from "react-router-dom";
import DevSokoLogo from "../../assets/DevSoko Logo.png";

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 hover:opacity-90 transition-opacity duration-300">
<img src={DevSokoLogo} alt="DevSoko Logo" className="h-14 w-14 rounded-full object-contain drop-shadow-lg hover:scale-105 transition-all duration-300" />
            <div>
              <span className="text-xl font-bold text-white">DevSoko</span>
              <span className="text-xs text-gray-300 block">Convert Code into Coins</span>
            </div>
          </Link>
          <p className="mt-4 text-gray-400">
            Built by devs, for dreamers. Your marketplace for digital assets.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Useful Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/projects"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/contactpage"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Email Newsletter</h3>
          <p className="text-gray-400 mb-4">
            Subscribe to our newsletter for monthly updates and new project
            alerts.
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email address"
              required
              className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-500 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

       <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">© 2026 DevSoko. All rights reserved.</p>
         
        </div>
    </footer>
  );
};

export default Footer;
