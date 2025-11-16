// frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";

// Pages
import HomePage from "./pages/HomePage";
import ChatbotPage from "./pages/ChatbotPage";
import CaptureFacePage from "./pages/CaptureFacePage";
import CaptureEyesPage from "./pages/CaptureEyesPage";
import CaptureMouthPage from "./pages/CaptureMouthPage";
import CaptureSkinPage from "./pages/CaptureSkinPage";
import CaptureProfilePage from "./pages/CaptureProfilePage";
import PrakritiResultPage from "./pages/PrakritiResultPage";
import ShareResultsPage from "./pages/ShareResultsPage";

// Simple placeholders for menu items
import RemediesPage from "./pages/RemediesPage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <div className="min-h-screen bg-[#f6efe5] text-[#3e2b20]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatbotPage />} />

          {/* Prakriti / capture flow */}
          <Route path="/prakriti/capture/face" element={<CaptureFacePage />} />
          <Route path="/prakriti/capture/eyes" element={<CaptureEyesPage />} />
          <Route
            path="/prakriti/capture/mouth"
            element={<CaptureMouthPage />}
          />
          <Route path="/prakriti/capture/skin" element={<CaptureSkinPage />} />
          <Route
            path="/prakriti/capture/profile"
            element={<CaptureProfilePage />}
          />

          <Route path="/prakriti/results" element={<PrakritiResultPage />} />
          <Route path="/prakriti/share" element={<ShareResultsPage />} />

          {/* Navbar menu items */}
          <Route path="/remedies" element={<RemediesPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
