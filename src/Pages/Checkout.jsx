import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../Components/Shared/Navbar";

const Checkout = () => {
  const location = useLocation();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const projectId = queryParams.get("id");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, "userProjects", projectId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("Project not found.");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    } else {
      setLoading(false);
    }
  }, [projectId]);

  const handleWhatsAppOrder = () => {
    const phoneNumber = "254706867627"; // Change to your WhatsApp number
    const message = `Hello, I’d like to buy the project "${project.title}" for KES ${project.price}. Is it available?`;
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encoded}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow w-full max-w-lg">
          {loading ? (
            <p>Loading project...</p>
          ) : !project ? (
            <p className="text-red-600">Project not found.</p>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">{project.title}</h2>
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-64 object-cover rounded mb-4"
              />
              <p className="mb-2">{project.description}</p>
              <p className="font-semibold text-green-700 mb-4">Price: KES {project.price}</p>

              <button
                onClick={handleWhatsAppOrder}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Order via WhatsApp
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Checkout;
