import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import Navbar from "../Components/Shared/Navbar";

const ViewProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "userProjects"));
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProjects(list);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
            Available Projects
          </h1>

          {loading ? (
            <p className="text-center">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="text-center text-gray-500">No projects found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-white rounded shadow p-4">
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                  <h2 className="text-lg font-semibold text-gray-800">{proj.title}</h2>
                  <p className="text-sm text-gray-600 mb-2">
                    {proj.description.slice(0, 100)}...
                  </p>
                  <p className="font-bold text-green-600 mb-3">KES {proj.price}</p>
                  <Link
                    to={`/checkout?id=${proj.id}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Buy Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewProjects;
