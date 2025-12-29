import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import HomePage from "./pages/home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PlantScan from "./pages/plant-identification/PlantScan.jsx";
import PlantResults from "./pages/plant-identification/PlantResults.jsx";
import PlantHistory from "./pages/plant-identification/PlantHistory.jsx";
import RiskAlerts from "./pages/plant-identification/RiskAlerts.jsx";
import PlantSafety from "./pages/plant-identification/PlantSafety.jsx";

function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/plant-scan" element={<PlantScan />} />
        <Route path="/plant-results" element={<PlantResults />} />
        <Route path="/plant-history" element={<PlantHistory />} />
        <Route path="/risk-alerts" element={<RiskAlerts />} />
        <Route path="/plant-safety/:plantId" element={<PlantSafety />} />
      </Routes>
    </Router>
  );
}

export default App;
