import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import UploadForm from "../Components/Project/UploadForm";

// ... (imports remain the same)

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
              const localProjects = JSON.parse(localStorage.getItem("myProjects")) || [];
              setProjects(localProjects);
            }
          }
        } catch (err) {
          console.error("Error fetching user:", err.message);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const renderContent = () => {
    if (role === "seller") {
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
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Welcome to your Dashboard</h3>
              <p className="text-gray-600">Select an option from the sidebar to get started.</p>
            </div>
          );
      }
    }

    // Buyer View
    const allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
    const purchases = JSON.parse(localStorage.getItem("purchases")) || [];

    return (
      <div>
        <h3 className="text-xl font-semibold mb-4 text-blue-600">Browse Projects</h3>
        {allProjects.length === 0 ? (
          <p className="text-gray-500">No projects available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProjects.map((proj) => {
              const purchased = purchases.find(
                (p) => p.projectId === proj.id && p.buyerEmail === user.email
              );

              return (
                <div
                  key={proj.id}
                  className="bg-white rounded shadow p-4 border border-gray-200"
                >
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                  <h2 className="text-lg font-semibold text-gray-800">{proj.title}</h2>
                  <p className="text-sm text-gray-600 mb-2">{proj.description?.slice(0, 100)}...</p>
                  <p className="font-bold text-green-600 mb-3">KES {proj.price}</p>

                  {purchased ? (
                    <a
                      href={purchased.downloadUrl}
                      download
                      className="block bg-green-600 text-white text-center px-4 py-2 rounded hover:bg-green-700"
                    >
                      Download Project
                    </a>
                  ) : (
                    <button
                      onClick={() => navigate(`/checkout?id=${proj.id}`)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Buy Now
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

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
              activeTab === "home" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
            }`}
          >
            Dashboard Home
          </button>

          {role === "seller" && (
            <>
              <button
                onClick={() => setActiveTab("upload")}
                className={`block w-full text-left px-4 py-2 rounded ${
                  activeTab === "upload" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                }`}
              >
                Upload Project
              </button>
              <button
                onClick={() => setActiveTab("projects")}
                className={`block w-full text-left px-4 py-2 rounded ${
                  activeTab === "projects" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                }`}
              >
                My Projects
              </button>
              <button
                onClick={() => setActiveTab("sales")}
                className={`block w-full text-left px-4 py-2 rounded ${
                  activeTab === "sales" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
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
