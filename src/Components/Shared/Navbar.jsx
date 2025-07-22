import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-solid border-black-500 px-6 py-4 pt-6 flex fixed w-full justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">DevSoko</Link>
      <div className="space-x-4">
        <Link to="/projects" className="text-gray-700 hover:text-blue-600">Projects</Link>

        {/* Show only if user is a seller */}
        {role === "seller" && (
          <Link to="/upload" className="text-gray-700 hover:text-blue-600">Upload</Link>
        )}

        {/* Not logged in */}
        {!user && (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Register</Link>
          </>
        )}

        {/* Logged in */}
        {user && (
          <>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
            <button onClick={handleLogout} className="text-red-600 font-semibold">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
