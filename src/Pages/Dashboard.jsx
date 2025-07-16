import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import UploadForm from "../Components/Project/UploadForm";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);

        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setRole(userData.role);

            if (userData.role === "seller") {
              // Fetch projects from localStorage
              const localProjects = JSON.parse(localStorage.getItem("myProjects")) || [];
              setProjects(localProjects);
            }
          }
        } catch (err) {
          console.warn("Error loading user:", err.message);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, db]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "upload":
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">Upload Project</h3>
            <UploadForm />
          </div>
        );
      case "projects":
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">Your Projects</h3>
            {projects.length === 0 ? (
              <p className="text-gray-500">
                You haven’t uploaded any projects yet.
              </p>
            ) : (
              <ul className="space-y-4">
                {projects.map((proj) => (
                  <li
                    key={proj.id}
                    className="border border-gray-200 rounded p-4 bg-white shadow"
                  >
                    <h4 className="font-semibold text-lg">{proj.title}</h4>
                    <img
                      src={proj.imageUrl}
                      alt={proj.title}
                      className="w-full h-48 object-cover rounded my-2"
                    />
                    <p className="text-gray-700">{proj.description}</p>
                    <p className="text-green-600 font-semibold">KES {proj.price}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case "sales":
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">Sales</h3>
            <p className="text-gray-600">Sales stats and reports coming soon!</p>
          </div>
        );
      default:
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-600">
              Welcome to your Dashboard
            </h3>
            <p className="text-gray-600">
              Select an option from the sidebar to get started.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow h-screen p-6 sticky top-0">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">DevSoko</h2>
        {user && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">Logged in as:</p>
            <p className="font-medium text-gray-800">{user.email}</p>
          </div>
        )}
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`block w-full text-left px-4 py-2 rounded ${
              activeTab === "home"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100"
            }`}
          >
            Dashboard Home
          </button>
          {role === "seller" && (
            <>
              <button
                onClick={() => setActiveTab("upload")}
                className={`block w-full text-left px-4 py-2 rounded ${
                  activeTab === "upload"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                Upload Project
              </button>
              <button
                onClick={() => setActiveTab("projects")}
                className={`block w-full text-left px-4 py-2 rounded ${
                  activeTab === "projects"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                My Projects
              </button>
              <button
                onClick={() => setActiveTab("sales")}
                className={`block w-full text-left px-4 py-2 rounded ${
                  activeTab === "sales"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                Sales
              </button>
            </>
          )}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 rounded bg-red-100 text-red-600 hover:bg-red-200 mt-4"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{renderContent()}</main>
    </div>
  );
};

export default Dashboard;
