import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Register from './Pages/Register';
import Login from './Pages/Login';
import UploadProject from './Pages/UploadProject';
import ViewProjects from './Pages/ViewProjects';
import Dashboard from "./Pages/Dashboard";
import Checkout from "./Pages/Checkout";

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login />} />
  <Route path="/upload" element={<UploadProject />} />
  <Route path="/projects" element={<ViewProjects />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/checkout" element={<Checkout />} />
</Routes>


function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to DevSoko 🚀</h1>
    </div>
  );
}

export default App;
