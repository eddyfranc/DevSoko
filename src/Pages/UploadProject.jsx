import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadForm from "../Components/Project/UploadForm";
import useUserRole from "../hooks/useUserRole";
import { auth } from "../firebase";

const UploadProject = () => {
  const { role, loading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!auth.currentUser) {
        navigate("/login");
      } else if (role !== "seller") {
        alert("Only sellers can upload projects.");
        navigate("/projects");
      }
    }
  }, [role, loading]);

  if (loading) return <p className="text-center mt-10">Checking access...</p>;

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <UploadForm />
      </div>
    </>
  );
};

export default UploadProject;
