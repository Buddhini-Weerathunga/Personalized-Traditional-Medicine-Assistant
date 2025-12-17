import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import HomePage from "./pages/home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AyurvedaDashboard from "./pages/health-profile-analysis/Dashboard.jsx";
import HealthProfileCreation from "./pages/health-profile-analysis/HealthProfile/Menu.jsx";
import AyurvedaMultiStepForm from "./pages/health-profile-analysis/HealthProfile/create.jsx";
import ViewHealthProfile from "./pages/health-profile-analysis/HealthProfile/ViewHealthProfile.jsx";
import VoiceAssistant from "./pages/health-profile-analysis/VoiceAssistant.jsx";
import HealthProfileMenu from "./pages/health-profile-analysis/HealthProfile/HealthProfileMenu.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

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
      
        <Route path="/health-profile/create" element={<AyurvedaMultiStepForm />} />
        
        
        {/* 🔐 PROTECTED ROUTE */}
        <Route
          path="/health-profile/voice-assistant"
          element={
            <ProtectedRoute>
              <VoiceAssistant />
            </ProtectedRoute>
          }
        />
         {/* 🔐 PROTECTED ROUTE */}
        <Route
          path="/health-profile/menu"
          element={
            <ProtectedRoute>
              <HealthProfileMenu />
            </ProtectedRoute>
          }
        />
        <Route
  path="/health-profile/view"
  element={
    <ProtectedRoute>
      <ViewHealthProfile />
    </ProtectedRoute>
  }
/>

      
      </Routes>
    </Router>
  );
}

export default App;
