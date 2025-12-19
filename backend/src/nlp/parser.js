function parseText(step, text) {
  text = text.toLowerCase();
  let data = {};

  // ✅ REQUIRED helper (THIS WAS MISSING)
  const has = (keywords) => keywords.some(k => text.includes(k));

  switch (step) {
    case 0:
      data.body_frame =
        has(["thin", "slim"]) ? "Thin" :
        has(["heavy", "fat", "broad"]) ? "Heavy" :
        "Medium";
      break;

    case 1:
      data.appetite_level =
        has(["high", "very hungry"]) ? "High" :
        has(["low", "less hungry"]) ? "Low" :
        has(["variable", "changes", "sometimes high", "sometimes low"]) ? "Variable" :
        "Moderate";

      data.meal_regular =
        has(["sometimes", "occasionally"]) ? "Sometimes" :
        has(["irregular", "skip", "not regular"]) ? "No" :
        "Yes";
      break;

    case 2: {
      const level = (topic) =>
        text.includes(`very high ${topic}`) ? 5 :
        text.includes(`high ${topic}`) ? 4 :
        text.includes(`moderate ${topic}`) || text.includes(`average ${topic}`) ? 3 :
        text.includes(`low ${topic}`) ? 2 :
        text.includes(`very low ${topic}`) || text.includes(`no ${topic}`) ? 1 :
        3;

      data.spicy_food_frequency = level("spicy");
      data.oily_food_frequency = level("oily");
      data.sweet_food_frequency = level("sweet");
      data.caffeine_intake = level("caffeine");
      data.processed_food_intake = level("processed");
      data.fruits_intake = level("fruit");
      data.vegetables_intake = level("vegetable");

      data.meal_regular =
        text.includes("sometimes") ? "Sometimes" :
        text.includes("irregular") || text.includes("skip meals") ? "No" :
        "Yes";

      data.veg_nonveg =
        text.includes("non vegetarian") || text.includes("meat") || text.includes("fish") || text.includes("chicken")
          ? "Non-Vegetarian"
          : text.includes("eggetarian") || text.includes("eggs only")
          ? "Eggetarian"
          : text.includes("vegetarian") || text.includes("veg")
          ? "Vegetarian"
          : null;
      break;
    }

    case 3:
      data.urine_color =
        text.includes("clear") ? "Clear" :
        text.includes("dark") ? "Dark Yellow" :
        text.includes("pale") ? "Pale Yellow" :
        text.includes("yellow") ? "Yellow" :
        null;
      break;

    case 4:
      data.stress_level =
        has(["very high stress", "extremely stressed"]) ? 5 :
        has(["high stress", "stressed"]) ? 4 :
        has(["moderate stress", "sometimes stressed"]) ? 3 :
        has(["low stress", "relaxed"]) ? 2 :
        has(["very low stress", "calm"]) ? 1 :
        3;

      data.focus_level =
        has(["very high focus", "excellent focus"]) ? 5 :
        has(["high focus", "good focus"]) ? 4 :
        has(["moderate focus", "average focus"]) ? 3 :
        has(["low focus", "poor focus"]) ? 2 :
        has(["very low focus", "cannot focus"]) ? 1 :
        3;
      break;

    case 5:
      data.sleep_issues =
        has(["very poor sleep", "severe sleep problem", "hardly sleep"]) ? 5 :
        has(["poor sleep", "bad sleep"]) ? 4 :
        has(["average sleep", "okay sleep"]) ? 3 :
        has(["good sleep"]) ? 2 :
        has(["very good sleep", "excellent sleep"]) ? 1 :
        3;
      break;

    case 6:
      data.headaches =
        has(["very high headache", "severe headache", "extreme headache"]) ? 5 :
        has(["high headache", "strong headache"]) ? 4 :
        has(["moderate headache", "average headache"]) ? 3 :
        has(["low headache", "mild headache"]) ? 2 :
        has(["very low headache", "no headache"]) ? 1 :
        3;

      data.joint_pain =
        has(["very high joint pain", "severe joint pain", "extreme joint pain"]) ? 5 :
        has(["high joint pain", "strong joint pain"]) ? 4 :
        has(["moderate joint pain", "average joint pain"]) ? 3 :
        has(["low joint pain", "mild joint pain"]) ? 2 :
        has(["very low joint pain", "no joint pain"]) ? 1 :
        3;
      break;

    case 7:
      data.living_environment =
        text.includes("hot") ? "Hot" :
        text.includes("cool") ? "Cool" :
        "Moderate";
      break;

    case 8:
      data.family_diabetes = text.includes("diabetes") ? "Yes" : "No";
      data.family_thyroid = text.includes("thyroid") ? "Yes" : "No";
      data.family_cholesterol = text.includes("cholesterol") ? "Yes" : "No";
      data.family_obesity = text.includes("obesity") || text.includes("obese") ? "Yes" : "No";
      data.family_asthma = text.includes("asthma") ? "Yes" : "No";
      data.family_heart_disease = text.includes("heart") ? "Yes" : "No";
      data.family_mental_health =
        text.includes("mental") || text.includes("depression") || text.includes("anxiety")
          ? "Yes"
          : "No";
      break;

    case 9:
      const ageMatch = text.match(/\d+/);
      data.age = ageMatch ? Number(ageMatch[0]) : null;
      data.gender =
        text.includes("male") ? "Male" :
        text.includes("female") ? "Female" :
        "Other";
      break;
  }

  return data;
}

module.exports = parseText;
