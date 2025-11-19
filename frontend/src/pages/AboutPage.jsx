import React from "react";
import VataImg from "../assets/images/vata.png";
import PittaImg from "../assets/images/pitta.png";
import KaphaImg from "../assets/images/kapha.png";

const doshas = [
  {
    name: "Vata Dosha",
    description:
      "Composed of air and space elements, Vata governs movement and change in the body. When balanced, Vata promotes creativity and flexibility.",
    traits: ["Creative", "Energetic", "Quick", "Adaptable", "Light"],
    img: VataImg,
  },
  {
    name: "Pitta Dosha",
    description:
      "Composed of fire and water elements, Pitta governs metabolism, digestion, and transformation. When balanced, Pitta promotes intelligence and courage.",
    traits: ["Focused", "Intelligent", "Ambitious", "Precise", "Warm"],
    img: PittaImg,
  },
  {
    name: "Kapha Dosha",
    description:
      "Composed of earth and water elements, Kapha governs structure, stability, and lubrication. When balanced, Kapha promotes strength and emotional stability.",
    traits: ["Calm", "Nurturing", "Loyal", "Patient", "Strong"],
    img: KaphaImg,
  },
];

export default function AboutPage() {
  return (
    <section className="pt-10 pb-20 bg-[#f6f1e8]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-3xl font-semibold text-[#3e2b20] mb-2">
          Understanding Doshas
        </h1>
        <p className="text-[#7a5b3f] max-w-2xl mx-auto mb-10">
          In Ayurveda, doshas are the three energies that define every person's
          makeup. Learn about each dosha and its characteristics.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {doshas.map((dosha) => (
            <div
              key={dosha.name}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center"
            >
              <img
                src={dosha.img}
                alt={dosha.name}
                className="w-32 h-32 mb-4"
              />
              <h2 className="text-xl font-semibold text-[#3e2b20] mb-2">
                {dosha.name}
              </h2>
              <p className="text-[#7a5b3f] text-sm mb-4">{dosha.description}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {dosha.traits.map((trait) => (
                  <span
                    key={trait}
                    className="bg-[#f0e9d9] text-[#3e2b20] px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
