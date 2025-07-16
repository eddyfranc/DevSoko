import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import ProjectCard from "../Components/Project/ProjectCard";

const ViewProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const projectList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectList);
    };

    fetchProjects();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Available Projects</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {projects.length === 0 ? (
            <p className="text-gray-500">No projects available.</p>
          ) : (
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ViewProjects;
