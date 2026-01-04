// frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";
import FacePredictTest from "./dosha-diagnosis/camera-capture/FacePredictTest";
import { PrakritiResultProvider } from "./dosha-diagnosis/prakriti-analysis/PrakritiResultContext.jsx";

// import Navbar from "./components/layout/Navbar";  // ⛔ NAVBAR COMMENTED OUT
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Home from "./pages/home.jsx";
import Dashboard from "./pages/Dashboard.jsx";

/* Plant Identification Pages */
import PlantIdentificationHome from "./pages/plant-identification/PlantIdentificationHome.jsx";
import PlantScan from "./pages/plant-identification/PlantScan.jsx";
import PlantResults from "./pages/plant-identification/PlantResults.jsx";
import PlantDescriptionHome from "./pages/plant-identification/PlantDescriptionHome.jsx";
import PlantDescriptionDetail from "./pages/plant-identification/PlantDescriptionDetail.jsx";
import PlantHistory from "./pages/plant-identification/PlantHistory.jsx";
import RiskAlerts from "./pages/plant-identification/RiskAlerts.jsx";
import PlantSafety from "./pages/plant-identification/PlantSafety.jsx";

/* Health Profile Analysis Pages */
import AyurvedaDashboard from "./pages/health-profile-analysis/Dashboard.jsx";
import HealthProfileCreation from "./pages/health-profile-analysis/HealthProfile/Menu.jsx";
import AyurvedaMultiStepForm from "./pages/health-profile-analysis/HealthProfile/create.jsx";
import ViewHealthProfile from "./pages/health-profile-analysis/HealthProfile/ViewHealthProfile.jsx";
import EditHealthProfile from "./pages/health-profile-analysis/HealthProfile/EditHealthProfile.jsx";
import CreateHealthProfile from "./pages/health-profile-analysis/HealthProfile/CreateHealthProfile.jsx";
import VoiceAssistant from "./pages/health-profile-analysis/VoiceAssistant.jsx";
import HealthProfileMenu from "./pages/health-profile-analysis/HealthProfile/HealthProfileMenu.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HealthPrediction from "./pages/health-profile-analysis/HealthProfile/HealthPrediction.jsx";
import AyurvedaDietCoach from "./pages/health-profile-analysis/Diets/DietForm";
import HealthProfiles from "./pages/health-profile-analysis/HealthProfile/multiProfilesMenu.jsx";

// ✅ Dosha Diagnosis pages
import HomePage from "./dosha-diagnosis/home/HomePage.jsx";
import ChatbotPage from "./dosha-diagnosis/chat/ChatbotPage.jsx";

import PrakritiAnalysisPage from "./dosha-diagnosis/prakriti-analysis/PrakritiAnalysisPage.jsx";
import CaptureFacePage from "./dosha-diagnosis/prakriti-analysis/CaptureFacePage.jsx";
import CaptureEyesPage from "./dosha-diagnosis/prakriti-analysis/CaptureEyesPage.jsx";
import CaptureMouthPage from "./dosha-diagnosis/prakriti-analysis/CaptureMouthPage.jsx";
import CaptureSkinPage from "./dosha-diagnosis/prakriti-analysis/CaptureSkinPage.jsx";
import CaptureProfilePage from "./dosha-diagnosis/prakriti-analysis/CaptureProfilePage.jsx";
import PrakritiResultPage from "./dosha-diagnosis/prakriti-analysis/PrakritiResultPage.jsx";
import ShareResultsPage from "./dosha-diagnosis/prakriti-analysis/ShareResultsPage.jsx";

import PrescriptionPage from "./dosha-diagnosis/prescription/PrescriptionPage.jsx";
import PrescriptionDetailPage from "./dosha-diagnosis/prescription/PrescriptionDetailPage.jsx";
import AboutPage from "./dosha-diagnosis/about/AboutPage.jsx";

import YogaConsultation from './pages/YogaConsultation';

function App() {
  return (
    <div >

      {/* <Navbar />   ⛔ NAVBAR COMMENTED OUT */}

      <main>
        <Routes>
          {/* Auth pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Dosha module homepage */}
          <Route path="/home" element={<HomePage />} />

          {/* Other pages */}
          <Route path="/chat" element={<ChatbotPage />} />
          <Route path="/prescription" element={<PrescriptionPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/yoga-consultation" element={<YogaConsultation />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
