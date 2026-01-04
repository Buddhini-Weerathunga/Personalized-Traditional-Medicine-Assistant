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
import PlantScan from "./pages/plant-identification/PlantScan.jsx";
import PlantResults from "./pages/plant-identification/PlantResults.jsx";
import PlantHistory from "./pages/plant-identification/PlantHistory.jsx";
import RiskAlerts from "./pages/plant-identification/RiskAlerts.jsx";
import PlantSafety from "./pages/plant-identification/PlantSafety.jsx";

/* Health Profile Analysis Pages */
import AyurvedaDashboard from "./pages/health-profile-analysis/Dashboard.jsx";
import AyurvedaMultiStepForm from "./pages/health-profile-analysis/HealthProfile/create.jsx";
import ViewHealthProfile from "./pages/health-profile-analysis/HealthProfile/ViewHealthProfile.jsx";
import EditHealthProfile from "./pages/health-profile-analysis/HealthProfile/EditHealthProfile.jsx";
import CreateHealthProfile from "./pages/health-profile-analysis/HealthProfile/CreateHealthProfile.jsx";
import VoiceAssistant from "./pages/health-profile-analysis/VoiceAssistant.jsx";
import HealthProfileMenu from "./pages/health-profile-analysis/HealthProfile/HealthProfileMenu.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HealthPrediction from "./pages/health-profile-analysis/HealthProfile/HealthPrediction.jsx";

/* Dosha Diagnosis Pages */
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
    <div>
      {/* <Navbar /> ⛔ NAVBAR COMMENTED OUT */}

      <main>
        <Routes>
          {/* Auth pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Dosha module homepage */}
          <Route path="/home" element={<HomePage />} />

          {/* Dosha general pages */}
          <Route path="/chat" element={<ChatbotPage />} />
          <Route path="/prescription" element={<PrescriptionPage />} />
          <Route path="/prescription/:id" element={<PrescriptionDetailPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* ---------------------------------------------- */}
          {/* PRAKRITI ROUTES (CONTEXT WRAPPED) */}
          {/* ---------------------------------------------- */}
          <Route
            path="/prakriti/*"
            element={
              <PrakritiResultProvider>
                <Routes>
                  <Route index element={<CaptureFacePage />} />
                  <Route path="face" element={<CaptureFacePage />} />
                  <Route path="eyes" element={<CaptureEyesPage />} />
                  <Route path="mouth" element={<CaptureMouthPage />} />
                  <Route path="skin" element={<CaptureSkinPage />} />
                  <Route path="profile" element={<CaptureProfilePage />} />
                  <Route path="form" element={<PrakritiAnalysisPage />} />
                  <Route path="results" element={<PrakritiResultPage />} />
                  <Route path="share" element={<ShareResultsPage />} />
                </Routes>
              </PrakritiResultProvider>
            }
          />

          {/* ---------------------------------------------- */}
          {/* Health Profile Analysis Routes */}
          {/* ---------------------------------------------- */}
          <Route path="/personalized-treatment" element={<AyurvedaDashboard />} />
          <Route path="/health-profile/create" element={<AyurvedaMultiStepForm />} />
          <Route path="/health-profile/edit" element={<EditHealthProfile />} />
          <Route path="/health-prediction" element={<HealthPrediction />} />

          {/* Protected Health Routes */}
          <Route
            path="/health-profile/voice-assistant"
            element={
              <ProtectedRoute>
                <VoiceAssistant />
              </ProtectedRoute>
            }
          />
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

          {/* yoga pages */}
          <Route path="/yoga-consultation" element={<YogaConsultation />} />

          {/* ---------------------------------------------- */}
          {/* Plant Identification Routes */}
          {/* ---------------------------------------------- */}
          <Route path="/plant-scan" element={<PlantScan />} />
          <Route path="/plant-results" element={<PlantResults />} />
          <Route path="/plant-history" element={<PlantHistory />} />
          <Route path="/risk-alerts" element={<RiskAlerts />} />
          <Route path="/plant-safety/:plantId" element={<PlantSafety />} />

          {/* Test Page */}
          <Route path="/dosha-face-test" element={<FacePredictTest />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
