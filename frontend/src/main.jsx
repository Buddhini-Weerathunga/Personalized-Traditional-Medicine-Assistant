import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/globals.css";
import "./styles/chat.css";
import "./styles/prakriti.css";

import { ChatProvider } from "./context/ChatContext";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";

import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import PrakritiAnalysisPage from "./pages/PrakritiAnalysisPage";

function AppShell() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <div className="app-shell">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/prakriti" element={<PrakritiAnalysisPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </ChatProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppShell />
  </React.StrictMode>
);
