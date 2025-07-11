import UploadForm from "../Components/Project/UploadForm";
import Navbar from "../Components/Shared/Navbar";

const UploadProject = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <UploadForm />
      </div>
    </>
  );
};

export default UploadProject;
