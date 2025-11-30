import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import HomePage from "./pages/home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AyurvedaDashboard from "./pages/health-profile-analysis/Dashboard.jsx";
import HealthProfileCreation from "./pages/health-profile-analysis/HealthProfile/Menu.jsx";


function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Health Profie Analysis Routes*/} 
        <Route path="/personalized-treatment" element={<AyurvedaDashboard />} />
        <Route path="/health-profile/menu" element={<HealthProfileCreation />} />

      </Routes>
    </Router>
  );
}

export default App;
