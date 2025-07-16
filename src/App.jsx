import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Shared/Navbar";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import UploadProject from "./Pages/UploadProject";
import ViewProjects from "./Pages/ViewProjects";
import Dashboard from "./Pages/Dashboard";
import Checkout from "./Pages/Checkout";
import ScrollToTop from "./Pages/ScrollToTop";  

function App() {
  return (
    <>
      <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={<UploadProject />} />
          <Route path="/projects" element={<ViewProjects />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
     
    </>
  );
}

export default App;
