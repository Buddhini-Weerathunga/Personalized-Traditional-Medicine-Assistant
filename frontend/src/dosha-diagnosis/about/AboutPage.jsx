// frontend/src/dosha-diagnosis/about/AboutPage.jsx
import React from "react";
import Navbar from "../../components/layout/Navbar.jsx";
import VataImg from "../../assets/images/vata.png";
import PittaImg from "../../assets/images/pitta.png";
import KaphaImg from "../../assets/images/kapha.png";

const AboutPage = () => {
  return (
    <>
      <Navbar />

      <main className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-white min-h-[calc(100vh-64px)]">
        {/* Soft background glow */}
        <div className="pointer-events-none">
          <div className="absolute -top-24 -left-16 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-30" />
        </div>

        <section className="relative max-w-5xl mx-auto px-4 py-14 lg:py-16">
          {/* Header */}
          <div className="mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              <span>ℹ️ About</span>
              <span className="h-4 w-px bg-green-300" />
              <span>Dosha Diagnosis Module</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Understand Your{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Prakriti & Doshas
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              In Ayurveda, your <span className="font-semibold">Prakriti</span>{" "}
              is your unique mind–body constitution. It is shaped by the balance
              of three Doshas: <span className="font-semibold">Vata</span>,{" "}
              <span className="font-semibold">Pitta</span>, and{" "}
              <span className="font-semibold">Kapha</span>. Understanding your
              dominant Dosha helps you choose supportive food, lifestyle, and
              daily routines for better physical health and emotional balance.
            </p>
          </div>

          {/* Dosha Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Vata Card */}
            <div className="bg-white/80 rounded-2xl shadow-md border border-green-100 p-6 flex flex-col items-center text-center hover:border-emerald-200 hover:shadow-lg transition-all">
              <img
                src={VataImg}
                alt="Vata Dosha"
                className="w-20 h-20 mb-4 object-contain"
              />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Vata Dosha
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Formed by the <span className="font-semibold">air</span> and{" "}
                <span className="font-semibold">space</span> elements, Vata
                governs movement and communication in the body. Balanced Vata
                brings creativity, inspiration, and flexibility.
              </p>
              <div className="flex flex-wrap gap-2 justify-center text-xs">
                {["Creative", "Energetic", "Quick", "Adaptable", "Light"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Pitta Card */}
            <div className="bg-white/80 rounded-2xl shadow-md border border-green-100 p-6 flex flex-col items-center text-center hover:border-emerald-200 hover:shadow-lg transition-all">
              <img
                src={PittaImg}
                alt="Pitta Dosha"
                className="w-20 h-20 mb-4 object-contain"
              />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Pitta Dosha
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Made of <span className="font-semibold">fire</span> and{" "}
                <span className="font-semibold">water</span>, Pitta governs
                digestion, metabolism, and transformation. When balanced, Pitta
                supports clarity, intelligence, and courage.
              </p>
              <div className="flex flex-wrap gap-2 justify-center text-xs">
                {[
                  "Focused",
                  "Intelligent",
                  "Ambitious",
                  "Precise",
                  "Warm",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Kapha Card */}
            <div className="bg-white/80 rounded-2xl shadow-md border border-green-100 p-6 flex flex-col items-center text-center hover:border-emerald-200 hover:shadow-lg transition-all">
              <img
                src={KaphaImg}
                alt="Kapha Dosha"
                className="w-20 h-20 mb-4 object-contain"
              />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Kapha Dosha
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Built from <span className="font-semibold">earth</span> and{" "}
                <span className="font-semibold">water</span>, Kapha provides
                structure, stability, and lubrication. Balanced Kapha brings
                strength, calmness, and emotional stability.
              </p>
              <div className="flex flex-wrap gap-2 justify-center text-xs">
                {["Calm", "Nurturing", "Loyal", "Patient", "Strong"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Small closing note */}
          <div className="mt-10 p-4 rounded-2xl bg-white/70 border border-green-100 shadow-sm">
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Our Dosha Diagnosis module uses{" "}
              <span className="font-semibold">AI-powered analysis</span> to help
              you understand which Dosha is most dominant and how to bring it
              into balance with gentle, practical recommendations.
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-xl">🕉️</span>
              </div>
              <span className="text-xl font-bold">AyuCeylon</span>
            </div>
            <p className="text-gray-400 text-sm">
              Ancient Ayurvedic wisdom meets modern AI to bring holistic,
              personalized wellness insights.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-green-400 cursor-pointer">
                Yoga Consultation
              </li>
              <li className="hover:text-green-400 cursor-pointer">
                Disease Detection
              </li>
              <li className="hover:text-green-400 cursor-pointer">
                Treatment Plans
              </li>
              <li className="hover:text-green-400 cursor-pointer">
                Plant Identification
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-green-400 cursor-pointer">About Us</li>
              <li className="hover:text-green-400 cursor-pointer">Contact</li>
              <li className="hover:text-green-400 cursor-pointer">Blog</li>
              <li className="hover:text-green-400 cursor-pointer">Careers</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex gap-4 text-2xl">
              <span className="hover:text-green-400 cursor-pointer">📘</span>
              <span className="hover:text-green-400 cursor-pointer">📷</span>
              <span className="hover:text-green-400 cursor-pointer">🐦</span>
              <span className="hover:text-green-400 cursor-pointer">💼</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© 2025 AyuCeylon. All rights reserved. Made with 💚 for wellness.</p>
        </div>
      </footer>
    </>
  );
};

export default AboutPage;
