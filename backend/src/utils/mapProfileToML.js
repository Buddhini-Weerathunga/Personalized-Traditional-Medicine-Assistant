function capitalize(value) {
  if (!value || typeof value !== "string") return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function mapProfileToML(profile) {
  return {
    // BASIC
    age: profile.age,
    gender: profile.gender,
    veg_nonveg: profile.veg_nonveg,

    body_frame: capitalize(profile.body_frame),
    appetite_level: profile.appetite_level,
    meal_regular: profile.meal_regular,

    // FOOD
    spicy_food_frequency: profile.spicy_food_frequency,
    oily_food_frequency: profile.oily_food_frequency,
    sweet_food_frequency: profile.sweet_food_frequency,
    caffeine_intake: profile.caffeine_intake,
    processed_food_intake: profile.processed_food_intake,

    // URINE
    urine_color: profile.urine_color,

    // 🔥 FIXED FIELD NAMES (THIS IS THE KEY)
    stress_level: profile.stress_level,
    sleep_issues: profile.sleep_quality,
    headaches: profile.headache_severity,
    joint_pain: profile.joint_pain_severity,

    // ENVIRONMENT
    environment_temperature: profile.environment_temperature,
    environment_humidity: profile.environment_humidity,
    environment_wind: profile.environment_wind,

    // FAMILY HISTORY
    family_diabetes: profile.family_diabetes,
    family_thyroid: profile.family_thyroid,
    family_cholesterol: profile.family_cholesterol,
    family_obesity: profile.family_obesity,
    family_asthma: profile.family_asthma,
    family_heart_disease: profile.family_heart_disease,
    family_mental_health: profile.family_mental_health
  };
}

module.exports = mapProfileToML;
