import Navbar from "../Components/Shared/Navbar";
import RegisterForm from "../Components/Auth/RegisterForm";

const Register = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <RegisterForm />
      </div>
    </>
  );
};

export default Register;
