// frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";
import FacePredictTest from "./dosha-diagnosis/camera-capture/FacePredictTest";
import { PrakritiResultProvider } from "./dosha-diagnosis/prakriti-analysis/PrakritiResultContext.jsx";

// import Navbar from "./components/layout/Navbar";  // ⛔ NAVBAR COMMENTED OUT
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Home from "./pages/home.jsx";
import Dashboard from "./pages/Dashboard.jsx";

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
import AboutPage from "./dosha-diagnosis/about/AboutPage.jsx";

function App() {
  return (
    <div >

      {/* <Navbar />   ⛔ NAVBAR COMMENTED OUT */}

      <main >
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

          {/* ---------------------------------------------- */}
        {/* ✅ WRAP ONLY DOSHA DIAGNOSIS ROUTES */}
        {/* ---------------------------------------------- */}

        <Route
          path="/prakriti/*"
          element={
            <PrakritiResultProvider>
              <Routes>
                <Route path="face" element={<CaptureFacePage />} />
                <Route path="eyes" element={<CaptureEyesPage />} />
                <Route path="mouth" element={<CaptureMouthPage />} />
                <Route path="skin" element={<CaptureSkinPage />} />
                <Route path="profile" element={<CaptureProfilePage />} />
                <Route path="form" element={<PrakritiAnalysisPage />} />
                <Route path="results" element={<PrakritiResultPage />} />
                <Route path="share" element={<ShareResultsPage />} />

                {/* Default route: /prakriti → face */}
                <Route index element={<CaptureFacePage />} />
              </Routes>
            </PrakritiResultProvider>
          }
        />

        {/* Test Page */}
        <Route path="/dosha-face-test" element={<FacePredictTest />} />
      </Routes>
    </main>
    </div>
  );
}

export default App;
