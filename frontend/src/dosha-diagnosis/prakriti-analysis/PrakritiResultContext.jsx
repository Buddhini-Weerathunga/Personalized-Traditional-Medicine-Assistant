// frontend/src/dosha-diagnosis/prakriti-analysis/PrakritiResultContext.jsx
import React, { createContext, useContext, useState, useMemo } from "react";

const PrakritiResultContext = createContext(null);

export function PrakritiResultProvider({ children }) {
  const [results, setResults] = useState({
    face: null,
    eyes: null,
    mouth: null,
    skin: null,
    profile: null,
  });

  const setRegionResult = (region, result) => {
    setResults((prev) => ({
      ...prev,
      [region]: result,
    }));
  };

  const clearAllResults = () => {
    setResults({
      face: null,
      eyes: null,
      mouth: null,
      skin: null,
      profile: null,
    });
  };

  // 👉 Combine probabilities from all available regions
  const summary = useMemo(() => {
    const regions = ["face", "eyes", "mouth", "skin", "profile"];
    let sumVata = 0;
    let sumPitta = 0;
    let sumKapha = 0;
    let count = 0;

    regions.forEach((region) => {
      const r = results[region];
      if (r && r.probabilities) {
        const p = r.probabilities;
        sumVata += p.Vata ?? p.vata ?? 0;
        sumPitta += p.Pitta ?? p.pitta ?? 0;
        sumKapha += p.Kapha ?? p.kapha ?? 0;
        count += 1;
      }
    });

    if (count === 0) {
      return {
        vata: 0,
        pitta: 0,
        kapha: 0,
        dominant: null,
        completedCount: 0,
      };
    }

    const vata = sumVata / count;
    const pitta = sumPitta / count;
    const kapha = sumKapha / count;

    let dominant = "Vata";
    let maxVal = vata;
    if (pitta > maxVal) {
      dominant = "Pitta";
      maxVal = pitta;
    }
    if (kapha > maxVal) {
      dominant = "Kapha";
      maxVal = kapha;
    }

    return {
      vata,
      pitta,
      kapha,
      dominant,
      completedCount: count,
    };
  }, [results]);

  const value = {
    results,
    setRegionResult,
    clearAllResults,
    summary,
  };

  return (
    <PrakritiResultContext.Provider value={value}>
      {children}
    </PrakritiResultContext.Provider>
  );
}

export function usePrakritiResults() {
  const ctx = useContext(PrakritiResultContext);
  if (!ctx) {
    throw new Error("usePrakritiResults must be used inside PrakritiResultProvider");
  }
  return ctx;
}
