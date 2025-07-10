import Navbar from "../Components/Shared/Navbar";
import LoginForm from "../Components/Auth/LoginForm";

const Login = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoginForm />
      </div>
    </>
  );
};

export default Login;
