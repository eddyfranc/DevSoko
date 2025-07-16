import { useLocation } from "react-router-dom";
import Navbar from "../Components/Shared/Navbar";

const Checkout = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const projectId = params.get("id");

  const allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
  const project = allProjects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <h2 className="text-xl text-red-500">Project not found</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
        <div className="max-w-xl w-full bg-white shadow rounded p-6">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-60 object-cover rounded mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{project.title}</h1>
          <p className="text-gray-600 mb-4">{project.description}</p>
          <p className="text-lg font-semibold text-green-600 mb-6">KES {project.price}</p>

          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Pay with M-Pesa
          </button>
        </div>
      </div>
    </>
  );
};

export default Checkout;
