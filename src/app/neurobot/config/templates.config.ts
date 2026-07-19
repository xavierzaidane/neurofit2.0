import { TemplateConfig } from "../types";

export const templatesConfig: TemplateConfig[] = [
  // Workouts
  {
    id: "workout-plan",
    category: "Workouts",
    title: "Custom workout plan",
    icon: "Dumbbell",
    promptBody: "Create a [Duration (e.g. 4-week, 1-day)] custom workout plan for a [Fitness Level (e.g. beginner, intermediate, advanced)] individual focusing on [Focus Area (e.g. strength, hypertrophy, fat loss)] using [Equipment (e.g. full gym, dumbbells, bodyweight)].",
    placeholders: ["Duration", "Fitness Level", "Focus Area", "Equipment"]
  },
  {
    id: "exercise-form",
    category: "Workouts",
    title: "Exercise form cues",
    icon: "Activity",
    promptBody: "Provide step-by-step form cues, common mistakes to avoid, and safe execution tips for the [Exercise Name (e.g. barbell squat, deadlift)].",
    placeholders: ["Exercise Name"]
  },
  {
    id: "scale-difficulty",
    category: "Workouts",
    title: "Scale exercise difficulty",
    icon: "TrendingUp",
    promptBody: "I am currently doing [Exercise Name] but find it too [Difficulty (e.g. hard, easy)]. Provide 3 progressions or regressions that I can use instead to match my strength.",
    placeholders: ["Exercise Name", "Difficulty"]
  },
  {
    id: "warmup-routine",
    category: "Workouts",
    title: "Dynamic warmup guide",
    icon: "Flame",
    promptBody: "Design a dynamic warmup routine targeting [Focus Muscle Groups (e.g. shoulders/chest, legs/hips)] to prepare for a [Workout Type (e.g. heavy lifting, running)] session.",
    placeholders: ["Focus Muscle Groups", "Workout Type"]
  },

  // Nutrition
  {
    id: "meal-planner",
    category: "Nutrition",
    title: "Custom meal planner",
    icon: "Utensils",
    promptBody: "Build a [Meal Count (e.g. 3-meal, 4-meal)] daily meal plan aiming for [Calorie/Macro Target (e.g. 2500 kcal, high protein)] that complies with [Dietary Restrictions (e.g. vegan, gluten-free, none)].",
    placeholders: ["Meal Count", "Calorie/Macro Target", "Dietary Restrictions"]
  },
  {
    id: "macro-calc",
    category: "Nutrition",
    title: "Calculate macros",
    icon: "Scale",
    promptBody: "Calculate my recommended daily calorie intake and macronutrient split (Protein, Carbs, Fats) for [Goal (e.g. muscle gain, fat loss)] based on my weight: [Weight (e.g. 80kg)], height: [Height (e.g. 180cm)], age: [Age], and activity level: [Activity Level (e.g. sedentary, moderately active)].",
    placeholders: ["Goal", "Weight", "Height", "Age", "Activity Level"]
  },
  {
    id: "grocery-list",
    category: "Nutrition",
    title: "Grocery shopping list",
    icon: "ShoppingBag",
    promptBody: "Generate a healthy grocery shopping list structured by supermarket aisles for a [Budget/Preference (e.g. budget-friendly, high-protein)] diet supporting [Number of People] people for one week.",
    placeholders: ["Budget/Preference", "Number of People"]
  },
  {
    id: "recipe-swap",
    category: "Nutrition",
    title: "Healthy ingredient swap",
    icon: "RefreshCw",
    promptBody: "I want to cook [Recipe Name (e.g. classic lasagna, chocolate cake)]. Please suggest healthier ingredient substitutions to lower the [Focus (e.g. calories, simple carbs, saturated fat)] while preserving taste and texture.",
    placeholders: ["Recipe Name", "Focus"]
  },

  // Recovery & Care
  {
    id: "mobility-routine",
    category: "Recovery & Care",
    title: "Stretching & mobility routine",
    icon: "Heart",
    promptBody: "Create a [Duration (e.g. 15-minute)] stretching and mobility sequence designed to relieve tightness in the [Target Area (e.g. lower back, hips, shoulders)].",
    placeholders: ["Duration", "Target Area"]
  },
  {
    id: "injury-recovery",
    category: "Recovery & Care",
    title: "Active recovery day plan",
    icon: "ShieldAlert",
    promptBody: "Outline an active recovery day routine for an athlete recovering from a heavy week of [Activity Type (e.g. powerlifting, marathon training)], ensuring low impact on joints.",
    placeholders: ["Activity Type"]
  },
  {
    id: "sleep-prep",
    category: "Recovery & Care",
    title: "Sleep hygiene checklist",
    icon: "Moon",
    promptBody: "Design a night-time wind-down routine and environment checklist to optimize deep sleep and physical recovery for someone experiencing [Issue (e.g. restlessness, high stress)].",
    placeholders: ["Issue"]
  },

  // Coaching
  {
    id: "client-checkin",
    category: "Coaching",
    title: "Client check-in script",
    icon: "MessageSquare",
    promptBody: "Draft a weekly coaching check-in message for a client who is working towards [Client Goal (e.g. weight loss, body recomposition)] but has recently faced [Challenge (e.g. low energy, busy schedule)]. Make the tone encouraging, supportive, and action-oriented.",
    placeholders: ["Client Goal", "Challenge"]
  },
  {
    id: "goal-setting",
    category: "Coaching",
    title: "Set SMART fitness goals",
    icon: "Target",
    promptBody: "Help me structure a SMART (Specific, Measurable, Achievable, Relevant, Time-bound) goal framework for my objective: '[My Objective]' over a timeline of [Timeframe (e.g. 3 months)].",
    placeholders: ["My Objective", "Timeframe"]
  },
  {
    id: "fitness-plateau",
    category: "Coaching",
    title: "Break a workout plateau",
    icon: "Zap",
    promptBody: "I have hit a plateau in my [Exercise/Metric (e.g. bench press strength, weight loss progress)] which has stayed flat for [Time (e.g. 4 weeks)]. Review my current approach: '[Current Approach]' and recommend 3 strategic adjustments to break through.",
    placeholders: ["Exercise/Metric", "Time", "Current Approach"]
  }
];
