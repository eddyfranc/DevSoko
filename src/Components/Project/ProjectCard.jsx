import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const handleBuy = () => {
    navigate("/checkout", { state: { project } });
  };

  return (
    <div className="bg-white shadow-md rounded p-4 w-full max-w-md">
      <h3 className="text-xl font-bold mb-2 text-blue-600">{project.title}</h3>
      <p className="text-gray-700 mb-2">{project.description}</p>
      <p className="text-sm text-gray-500 mb-2">By: {project.email}</p>
      <p className="font-semibold text-green-600 mb-4">Ksh {project.price}</p>

      <button
        onClick={handleBuy}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Buy Now
      </button>
    </div>
  );
};

export default ProjectCard;
