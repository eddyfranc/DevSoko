import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
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
import AdminLogin from "./Components/Admin/AdminLogin";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import SellerDashboard from "./Components/Seller/SellerDashboard";
import BuyerDashboard from "./Components/Buyer/BuyerDashboard";
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
