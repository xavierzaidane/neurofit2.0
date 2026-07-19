import { type ProgramFormData } from "@/data/samples";

export type FieldConfig = {
  key: keyof ProgramFormData;
  label: string;
  sublabel?: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
};

export type QAStep = {
  title: string;
  skipWholeSection?: boolean;
  fields: FieldConfig[];
};

export const qaSteps: QAStep[] = [
  {
    title: "Let's start with the basics",
    fields: [
      {
        key: "age",
        label: "How old are you?",
        type: "text",
        placeholder: "e.g. 28",
        required: true,
      },
      {
        key: "height",
        label: "What is your height?",
        type: "text",
        placeholder: "e.g. 175 cm",
        required: true,
      },
      {
        key: "weight",
        label: "What is your current weight?",
        type: "text",
        placeholder: "e.g. 72 kg",
        required: true,
      },
      {
        key: "gender",
        label: "What is your gender?",
        type: "select",
        required: false,
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
        ],
      },
    ],
  },
  {
    title: "Where are you starting from?",
    fields: [
      {
        key: "status",
        label: "What is your current daily status?",
        type: "select",
        required: false,
        options: [
          { value: "single", label: "Single" },
          { value: "married", label: "Married" },
          { value: "working-parent", label: "Working Parent" },
          { value: "student", label: "Student" },
        ],
      },
      {
        key: "bodyFat",
        label: "Do you know your approximate body fat percentage?",
        sublabel: "(optional)",
        type: "text",
        placeholder: "e.g. 18%",
        required: false,
      },
      {
        key: "injuries",
        label: "Do you have any injuries or physical limitations?",
        sublabel: "(optional)",
        type: "textarea",
        placeholder: "e.g. Lower back pain, avoid heavy deadlifts",
        required: false,
      },
    ],
  },
  {
    title: "How do you want to train?",
    fields: [
      {
        key: "workoutDays",
        label: "How many days per week do you want to work out?",
        type: "select",
        required: true,
        options: [
          { value: "2", label: "2" },
          { value: "3", label: "3" },
          { value: "4", label: "4" },
          { value: "5", label: "5" },
          { value: "6", label: "6" },
          { value: "7", label: "7" },
        ],
      },
      {
        key: "trainingStyle",
        label: "What is your preferred training style?",
        type: "select",
        required: true,
        options: [
          { value: "strength", label: "Strength" },
          { value: "hypertrophy", label: "Hypertrophy" },
          { value: "cardio-conditioning", label: "Cardio + Conditioning" },
          { value: "mixed", label: "Mixed" },
        ],
      },
      {
        key: "targetTimeline",
        label: "What is your target timeline for this plan?",
        type: "select",
        required: false,
        options: [
          { value: "4-weeks", label: "4 Weeks" },
          { value: "8-weeks", label: "8 Weeks" },
          { value: "12-weeks", label: "12 Weeks" },
          { value: "16-plus-weeks", label: "16+ Weeks" },
        ],
      },
    ],
  },
  {
    title: "What's your goal?",
    fields: [
      {
        key: "fitnessGoal",
        label: "What is your primary fitness goal?",
        type: "select",
        required: true,
        options: [
          { value: "improve-endurance", label: "Improve endurance" },
          { value: "fat-loss", label: "Fat loss" },
          { value: "lean-bulk", label: "Lean bulk" },
          { value: "dirty-bulk", label: "Dirty bulk" },
          { value: "cutting", label: "Cutting" },
          { value: "recomposition", label: "Body recomposition" },
          { value: "strength", label: "Build strength" },
        ],
      },
      {
        key: "fitnessLevel",
        label: "What is your current fitness level?",
        type: "select",
        required: true,
        options: [
          { value: "beginner", label: "Beginner" },
          { value: "intermediate", label: "Intermediate" },
          { value: "advanced", label: "Advanced" },
        ],
      },
    ],
  },
  {
    title: "Any dietary considerations?",
    fields: [
      {
        key: "dietaryRestrictions",
        label: "Do you have any dietary restrictions we should know about?",
        sublabel: "(optional)",
        type: "textarea",
        placeholder: "e.g. Lactose intolerant, no shellfish",
        required: false,
      },
      {
        key: "foodAllergies",
        label: "Do you have any food allergies?",
        sublabel: "(optional)",
        type: "text",
        placeholder: "e.g. Shellfish, peanuts",
        required: false,
      },
    ],
  },
  {
    title: "Nutrition targets",
    skipWholeSection: true,
    fields: [
      {
        key: "dailyCalories",
        label: "What is your daily target calorie intake?",
        sublabel: "(optional)",
        type: "text",
        placeholder: "e.g. 2200 kcal",
        required: false,
      },
      {
        key: "proteinTarget",
        label: "What is your target protein intake in grams?",
        sublabel: "(optional)",
        type: "text",
        placeholder: "e.g. 150",
        required: false,
      },
      {
        key: "carbsTarget",
        label: "What is your target carbs intake in grams?",
        sublabel: "(optional)",
        type: "text",
        placeholder: "e.g. 220",
        required: false,
      },
      {
        key: "fatTarget",
        label: "What is your target fat intake in grams?",
        sublabel: "(optional)",
        type: "text",
        placeholder: "e.g. 65",
        required: false,
      },
      {
        key: "mealsPerDay",
        label: "How many meals do you prefer to eat per day?",
        sublabel: "(optional)",
        type: "select",
        required: false,
        options: [
          { value: "2", label: "2" },
          { value: "3", label: "3" },
          { value: "4", label: "4" },
          { value: "5-plus", label: "5+" },
        ],
      },
    ],
  },
  {
    title: "Your daily rhythm",
    fields: [
      {
        key: "workingHours",
        label: "What are your typical working hours?",
        type: "text",
        placeholder: "e.g. 09:00 - 18:00",
        required: false,
      },
      {
        key: "sleepHours",
        label: "How many hours of sleep do you get on average?",
        type: "text",
        placeholder: "e.g. 7",
        required: false,
      },
      {
        key: "stressLevel",
        label: "How would you describe your typical stress level?",
        type: "select",
        required: false,
        options: [
          { value: "low", label: "Low" },
          { value: "moderate", label: "Moderate" },
          { value: "high", label: "High" },
        ],
      },
    ],
  },
  {
    title: "Workout logistics",
    fields: [
      {
        key: "workoutTime",
        label: "What is your preferred time of day to work out?",
        type: "select",
        required: false,
        options: [
          { value: "morning", label: "Morning" },
          { value: "afternoon", label: "Afternoon" },
          { value: "evening", label: "Evening" },
          { value: "flexible", label: "Flexible" },
        ],
      },
      {
        key: "availableEquipment",
        label: "What equipment do you have access to?",
        type: "text",
        placeholder: "e.g. Dumbbells, resistance bands, treadmill",
        required: false,
      },
    ],
  },
  {
    title: "Where are you located?",
    fields: [
      {
        key: "countryRegion",
        label: "Which country or region do you live in?",
        type: "text",
        placeholder: "e.g. Indonesia",
        required: false,
      },
      {
        key: "cityRegion",
        label: "Which city or region are you located in?",
        type: "text",
        placeholder: "e.g. DKI Jakarta",
        required: false,
      },
    ],
  },
];
