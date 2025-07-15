import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Shared/Navbar";
import UploadForm from "../Components/Project/UploadForm";
import useUserRole from "../hooks/useUserRole";
import { auth } from "../firebase";

const UploadProject = () => {
  const { role, loading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
      } else if (role !== "seller") {
        alert("Only sellers can upload projects.");
        navigate("/projects");
      }
    }
  }, [loading, role, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Checking access...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <UploadForm />
      </div>
    </>
  );
};

export default UploadProject;
