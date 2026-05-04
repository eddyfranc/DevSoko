import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Components/Shared/Navbar";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import UploadProject from "./Pages/UploadProject";
import ViewProjects from "./Pages/ViewProjects";
import Checkout from "./Pages/Checkout";
import ProjectDetails from "./Pages/ProjectDetails";
import ConnectPurchasePage from "./Pages/DevTokensPurchasePage";
import ConnectPackageCard from "./Pages/DevTokenPackageCard";
import AdminLogin from "./Components/Admin/AdminLogin";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import SellerDashboard from "./Components/Seller/SellerDashboard";
import BuyerDashboard from "./Components/Buyer/BuyerDashboard";
import ContactPage from "./Pages/ContactPage";

function App() {
  const location = useLocation();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("devsoko-theme");
    const initialTheme = savedTheme === "dark" ? "dark" : "light";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("devsoko-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  const hideNavbar = location.pathname === '/admin-dashboard';

  return (
    
      <>
        {!hideNavbar && <Navbar theme={theme} toggleTheme={toggleTheme} />}
       
      <Routes>
        <Route path="/" element={<Home theme={theme} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/upload" element={<UploadProject />} />
        <Route path="/projects" element={<ViewProjects />} />
        <Route path="/dashboard" element={<BuyerDashboard />} />
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
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
