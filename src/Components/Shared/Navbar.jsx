import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle scroll to toggle navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center ">   
        <Link to="/" className="text-3xl font-bold" style={{ color: "#FF7F50" }}>
          DevSoko
        </Link>
        <div className="space-x-4">
          <Link to="/projects" className="text-gray-900 hover:text-blue-600">
            Projects
          </Link>

          {role === "seller" && (
            <Link to="/upload" className="text-gray-900 hover:text-blue-600">
              Upload
            </Link>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="text-gray-900 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white px-3 py-1 rounded hover:opacity-90 transition-all"
                style={{ backgroundColor: "#FF7F50" }}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 font-semibold"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
