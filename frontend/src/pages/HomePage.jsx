import React from "react";
import Button from "../components/common/Button";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <section className="bg-white rounded-2xl shadow-md p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 space-y-3">
          <h2 className="text-2xl font-semibold text-slate-800">
            Welcome to AyuCeylon – Your AI-powered Ayurvedic Companion
          </h2>
          <p className="text-sm text-slate-600">
            This assistant combines traditional Ayurveda wisdom with modern AI
            to help you understand your dosha, get lifestyle suggestions, and
            chat about herbs, diet, and routines.
          </p>
          <div className="flex flex-wrap gap-3 mt-3">
            <Link to="/prakriti">
              <Button>Start Prakriti Analysis</Button>
            </Link>
            <Link to="/chat">
              <Button variant="outline">Open Chatbot</Button>
            </Link>
          </div>
        </div>
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/10 via-secondary/10 to-emerald-100 flex items-center justify-center">
          <span className="text-4xl">🌿</span>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4 text-sm">
        <div className="bg-white rounded-2xl p-4 border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-1">Dosha Insights</h3>
          <p className="text-slate-600">
            Analyze your facial features and get an estimated Vata–Pitta–Kapha
            distribution with simple explanations.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-1">
            Knowledge Chatbot
          </h3>
          <p className="text-slate-600">
            Ask questions about daily routines, diet, herbs, and seasonal
            adjustments based on Ayurvedic principles.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-1">
            Personalized Suggestions
          </h3>
          <p className="text-slate-600">
            Get practical lifestyle tips you can try today—sleep, food, stress
            management, and more.
          </p>
        </div>
      </section>
    </div>
  );
}
