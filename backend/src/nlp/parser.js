function parseText(step, text) {
  text = text.toLowerCase();
  let data = {};

  const has = (keywords) => keywords.some(k => text.includes(k));

  /* helper to clamp numeric values */
  const clamp = (v, min = 1, max = 5) => Math.min(max, Math.max(min, v));

  switch (step) {

    /* ---------------- BODY FRAME ---------------- */
    case 0:
      data.body_frame =
        has(["thin", "slim", "lean"]) ? "thin" :
        has(["heavy", "fat", "broad", "obese"]) ? "heavy" :
        "medium";
      break;

    /* ---------------- APPETITE & MEALS ---------------- */
    case 1:
      data.appetite_level =
        has(["very hungry", "high appetite"]) ? "High" :
        has(["low appetite", "less hungry"]) ? "Low" :
        has(["variable", "changes", "irregular appetite"]) ? "Variable" :
        "Moderate";

      data.meal_regular =
        has(["sometimes", "occasionally"]) ? "Sometime" :
        has(["irregular", "skip", "not regular"]) ? "No" :
        "Yes";
      break;

    /* ---------------- FOOD INTAKE ---------------- */
    case 2: {
      const level = (topic) =>
        has([`very high ${topic}`]) ? 5 :
        has([`high ${topic}`]) ? 4 :
        has([`moderate ${topic}`, `average ${topic}`]) ? 3 :
        has([`low ${topic}`]) ? 2 :
        has([`very low ${topic}`, `no ${topic}`]) ? 1 :
        3;

      data.spicy_food_frequency = clamp(level("spicy"));
      data.oily_food_frequency = clamp(level("oily"));
      data.sweet_food_frequency = clamp(level("sweet"));
      data.caffeine_intake = clamp(level("caffeine"));
      data.processed_food_intake = clamp(level("processed"));

      data.veg_nonveg =
        has(["non vegetarian", "meat", "fish", "chicken"]) ? "Non-Vegetarian" :
        has(["eggetarian", "eggs only"]) ? "Eggetarian" :
        "Vegetarian";
      break;
    }

    /* ---------------- URINE ---------------- */
    case 3:
      data.urine_color =
        has(["clear"]) ? "clear" :
        has(["dark"]) ? "Dark Yellow" :
        has(["pale"]) ? "Pale Yellow" :
        "Yellow";
      break;

    /* ---------------- MENTAL ---------------- */
    case 4:
      data.stress_level = clamp(
        has(["extremely stressed", "very high stress"]) ? 5 :
        has(["high stress", "stressed"]) ? 4 :
        has(["moderate stress"]) ? 3 :
        has(["low stress", "relaxed"]) ? 2 :
        3
      );
      break;

    /* ---------------- SLEEP ---------------- */
    case 5: {
      const severity =
        has(["hardly sleep", "very poor sleep"]) ? 5 :
        has(["poor sleep", "bad sleep"]) ? 4 :
        has(["average sleep"]) ? 3 :
        has(["good sleep"]) ? 2 :
        3;

      /* ML expects positive quality (higher = better) */
      data.sleep_quality = clamp(6 - severity);
      break;
    }

    /* ---------------- PAIN ---------------- */
    case 6:
      data.headache_severity = clamp(
        has(["severe headache", "extreme headache"]) ? 5 :
        has(["moderate headache"]) ? 3 :
        has(["mild headache"]) ? 2 :
        3
      );

      data.joint_pain_severity = clamp(
        has(["severe joint pain", "extreme joint pain"]) ? 5 :
        has(["moderate joint pain"]) ? 3 :
        has(["mild joint pain"]) ? 2 :
        3
      );
      break;

    /* ---------------- ENVIRONMENT ---------------- */
    case 7:
      const env =
        has(["hot", "warm"]) ? "hot" :
        has(["cool", "cold"]) ? "cold" :
        "Moderate";

      data.environment_temperature = env;
      data.environment_humidity = env;
      data.environment_wind = env;
      break;

    /* ---------------- FAMILY HISTORY ---------------- */
    case 8:
      data.family_diabetes = has(["diabetes"]) ? "Yes" : "No";
      data.family_thyroid = has(["thyroid"]) ? "Yes" : "No";
      data.family_cholesterol = has(["cholesterol"]) ? "Yes" : "No";
      data.family_obesity = has(["obesity", "obese"]) ? "Yes" : "No";
      data.family_asthma = has(["asthma"]) ? "Yes" : "No";
      data.family_heart_disease = has(["heart"]) ? "Yes" : "No";
      data.family_mental_health =
        has(["mental", "depression", "anxiety"]) ? "Yes" : "No";
      break;

    /* ---------------- DEMOGRAPHIC ---------------- */
    case 9: {
      const ageMatch = text.match(/\d+/);
      data.age = ageMatch ? Number(ageMatch[0]) : null;

      data.gender =
        has(["male"]) && !has(["female"]) ? "Male" :
        has(["female"]) ? "Female" :
        "Other";
      break;
    }
  }

  return data;
}

module.exports = parseText;
