function parseText(step, text) {
  text = text.toLowerCase();
  let data = {};

  switch (step) {
    case 0:
      data.body_frame =
        text.includes("thin") ? "Thin" :
        text.includes("heavy") ? "Heavy" : "Medium";

      data.appetite_level =
        text.includes("low") ? "Low" :
        text.includes("high") ? "High" : "Moderate";

      data.meal_regular =
        text.includes("irregular") ? "No" : "Yes";
      break;

    case 1:
      data.prakriti_vata_score = text.includes("dry") ? 3 : 1;
      data.prakriti_pitta_score = text.includes("hot") ? 3 : 1;
      data.prakriti_kapha_score = text.includes("heavy") ? 3 : 1;
      break;

    case 4:
      data.stress_level =
        text.includes("high") ? 5 :
        text.includes("moderate") ? 3 : 1;
      break;

    case 5:
      data.sleep_issues = text.includes("poor") ? 4 : 1;
      data.fatigue = text.includes("tired") ? 4 : 1;
      break;

    case 9:
      const ageMatch = text.match(/\d+/);
      data.age = ageMatch ? Number(ageMatch[0]) : null;
      data.gender =
        text.includes("male") ? "Male" :
        text.includes("female") ? "Female" : "Other";
      break;
  }

  return data;
}

module.exports = parseText;
