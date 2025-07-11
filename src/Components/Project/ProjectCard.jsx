const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white shadow-md rounded p-4 w-full max-w-md">
      {project.imageURL && (
        <img
          src={project.imageURL}
          alt={project.title}
          className="w-full h-48 object-cover rounded mb-4"
        />
      )}
      <h3 className="text-xl font-bold mb-2 text-blue-600">{project.title}</h3>
      <p className="text-gray-700 mb-2">{project.description}</p>
      <p className="text-sm text-gray-500 mb-2">By: {project.email}</p>
      <p className="font-semibold text-green-600">Ksh {project.price}</p>
    </div>
  );
};

export default ProjectCard;
