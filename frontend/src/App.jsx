<<<<<<< HEAD
// frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";

// ✅ Dosha Diagnosis pages (your component)
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
import AboutPage from "./dosha-diagnosis/about/AboutPage.jsx";

function App() {
  return (
    <div className="min-h-screen bg-[#f6efe5] text-[#3e2b20]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />

          {/* Prakriti analysis main – start with face capture */}
          <Route path="/prakriti" element={<CaptureFacePage />} />

          {/* Capture steps */}
          <Route path="/prakriti/face" element={<CaptureFacePage />} />
          <Route path="/prakriti/eyes" element={<CaptureEyesPage />} />
          <Route path="/prakriti/mouth" element={<CaptureMouthPage />} />
          <Route path="/prakriti/skin" element={<CaptureSkinPage />} />
          <Route path="/prakriti/profile" element={<CaptureProfilePage />} /> 

          {/* After all captures → questionnaire form */}
          <Route path="/prakriti/form" element={<PrakritiAnalysisPage />} />

          {/* Results & sharing */}
          <Route path="/prakriti/results" element={<PrakritiResultPage />} />
          <Route path="/prakriti/share" element={<ShareResultsPage />} />


          {/* Other menu pages */}
          <Route path="/chat" element={<ChatbotPage />} />
          <Route path="/prescription" element={<PrescriptionPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    </div>
=======
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import HomePage from "./pages/home.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </Router>
>>>>>>> origin/main
  );
}

export default App;
