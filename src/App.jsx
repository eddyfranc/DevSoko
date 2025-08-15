import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Shared/Navbar";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import UploadProject from "./Pages/UploadProject";
import ViewProjects from "./Pages/ViewProjects";
import Dashboard from "./Pages/Dashboard";
import Checkout from "./Pages/Checkout";
import ProjectDetails from "./Pages/ProjectDetails";
import ConnectPurchasePage from "./Pages/DevTokensPurchasePage";
import ConnectPackageCard from "./Pages/DevTokenPackageCard";
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";
import ContactPage from "./Pages/ContactPage";


function App() {
  return (
    
      <>
        <Navbar />
       
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<UploadProject />} />
        <Route path="/projects" element={<ViewProjects />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} /> 
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path='/ConnectPurchasePage' element={<ConnectPurchasePage />} />
        <Route path='/ConnectPackageCard' element={<ConnectPackageCard />} />
        <Route path='/contactpage' element={<ContactPage/>} />

      </Routes>
      </>
     
  );
}

export default App;
