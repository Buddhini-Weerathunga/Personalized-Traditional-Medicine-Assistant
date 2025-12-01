// frontend/src/dosha-diagnosis/about/AboutPage.jsx
import React from "react";
import VataImg from "../../assets/images/vata.png";
import PittaImg from "../../assets/images/pitta.png";
import KaphaImg from "../../assets/images/kapha.png";

const AboutPage = () => {
  return (
    <section className="py-10 bg-[#f7ecdd]">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-semibold text-[#3e2b20] mb-4">
          About Dosha Diagnosis
        </h1>
        <p className="text-[#6b4a2b] mb-8 leading-relaxed">
          In Ayurveda, your <span className="font-semibold">Prakriti</span> is your
          unique mind–body constitution. It is determined by the balance of
          three Doshas: Vata, Pitta, and Kapha. Understanding your dominant
          Dosha helps you choose the right food, lifestyle, and daily routines
          for better health and emotional balance.
        </p>

        {/* Cards row */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Vata Card */}
          <div className="bg-[#fdf5ea] rounded-2xl shadow-sm border border-[#e2d3c1] p-6 flex flex-col items-center text-center">
            <img
              src={VataImg}
              alt="Vata Dosha"
              className="w-20 h-20 mb-4 object-contain"
            />
            <h2 className="text-xl font-semibold text-[#3e2b20] mb-2">
              Vata Dosha
            </h2>
            <p className="text-sm text-[#6b4a2b] mb-4">
              Composed of air and space elements, Vata governs movement and
              change in the body. When balanced, Vata promotes creativity and
              flexibility.
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-xs">
              {["Creative", "Energetic", "Quick", "Adaptable", "Light"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-[#f0e0c7] text-[#5b3b25]"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Pitta Card */}
          <div className="bg-[#fdf5ea] rounded-2xl shadow-sm border border-[#e2d3c1] p-6 flex flex-col items-center text-center">
            <img
              src={PittaImg}
              alt="Pitta Dosha"
              className="w-20 h-20 mb-4 object-contain"
            />
            <h2 className="text-xl font-semibold text-[#3e2b20] mb-2">
              Pitta Dosha
            </h2>
            <p className="text-sm text-[#6b4a2b] mb-4">
              Composed of fire and water elements, Pitta governs metabolism,
              digestion, and transformation. When balanced, Pitta promotes
              intelligence and courage.
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
                  className="px-3 py-1 rounded-full bg-[#f0e0c7] text-[#5b3b25]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Kapha Card */}
          <div className="bg-[#fdf5ea] rounded-2xl shadow-sm border border-[#e2d3c1] p-6 flex flex-col items-center text-center">
            <img
              src={KaphaImg}
              alt="Kapha Dosha"
              className="w-20 h-20 mb-4 object-contain"
            />
            <h2 className="text-xl font-semibold text-[#3e2b20] mb-2">
              Kapha Dosha
            </h2>
            <p className="text-sm text-[#6b4a2b] mb-4">
              Composed of earth and water elements, Kapha governs structure,
              stability, and lubrication. When balanced, Kapha promotes strength
              and emotional stability.
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-xs">
              {["Calm", "Nurturing", "Loyal", "Patient", "Strong"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-[#f0e0c7] text-[#5b3b25]"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
