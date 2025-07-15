import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc
} from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);

        // ✅ Modern Firestore syntax (Firebase v9+)
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setRole(userData.role);

          // Fetch projects if user is seller
          if (userData.role === "seller") {
            const q = query(
              collection(db, "projects"),
              where("userId", "==", currentUser.uid)
            );
            const snapshot = await getDocs(q);
            const list = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }));
            setProjects(list);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-2 text-blue-600">Welcome to your Dashboard</h2>
        {user && <p className="mb-4 text-gray-700">Logged in as: {user.email}</p>}

        {/* Seller View */}
        {role === "seller" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Your Projects</h3>
              <Link
                to="/upload"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Upload Project
              </Link>
            </div>

            {projects.length === 0 ? (
              <p className="text-gray-500">You haven’t uploaded any projects yet.</p>
            ) : (
              <ul className="space-y-2">
                {projects.map((proj) => (
                  <li
                    key={proj.id}
                    className="border border-gray-200 rounded px-4 py-2 bg-gray-50"
                  >
                    <h4 className="font-semibold">{proj.title}</h4>
                    <p className="text-sm text-gray-600">{proj.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* Buyer View */}
        {role === "buyer" && (
          <p className="text-gray-600">You are logged in as a buyer. Purchase history coming soon!</p>
        )}

        {/* Default or unknown role */}
        {role && role !== "buyer" && role !== "seller" && (
          <p className="text-gray-600">You are logged in as: {role}</p>
        )}

        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
