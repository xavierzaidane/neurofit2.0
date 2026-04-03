import { httpRouter } from "convex/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

const defaultOllamaBaseUrl = "http://127.0.0.1:11434";
const ollamaBaseUrl =
  process.env.OLLAMA_BASE_URL ||
  (process.env.NODE_ENV === "production" ? undefined : defaultOllamaBaseUrl);
const ollamaModel = process.env.OLLAMA_MODEL;
const ollamaApiKey = process.env.OLLAMA_API_KEY;
const corsOrigin = process.env.CORS_ORIGIN || "*";
const corsHeaders = {
  "Access-Control-Allow-Origin": corsOrigin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const buildOllamaUrl = (path: string) => {
  if (!ollamaBaseUrl) {
    throw new Error(
      "Missing OLLAMA_BASE_URL environment variable (required in production)."
    );
  }

  return new URL(path, ollamaBaseUrl).toString();
};

const buildOllamaHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (ollamaApiKey) {
    headers.Authorization = `Bearer ${ollamaApiKey}`;
  }

  return headers;
};

const extractJson = (content: string) => {
  const trimmed = content.trim();
  const startIndex = trimmed.indexOf("{");
  const endIndex = trimmed.lastIndexOf("}");
  if (startIndex === -1 || endIndex === -1) {
    return trimmed;
  }
  return trimmed.slice(startIndex, endIndex + 1);
};

const safeParseJson = (raw: string, context: string) => {
  const extracted = extractJson(raw);
  try {
    return JSON.parse(extracted);
  } catch (error) {
    console.error(`Failed to parse AI JSON (${context}):`, error);
    console.error("Raw AI output:", raw);
    throw new Error("AI response was not valid JSON.");
  }
};

const normalizeCacheInput = (value: string | undefined | null) =>
  (value ?? "").toString().trim().toLowerCase();

const buildCacheKey = (inputs: {
  age: string;
  weight: string;
  height: string;
  fitnessGoal: string;
  fitnessLevel: string;
  workoutDays: string;
}) =>
  [
    inputs.age,
    inputs.weight,
    inputs.height,
    inputs.fitnessGoal,
    inputs.fitnessLevel,
    inputs.workoutDays,
  ]
    .map(normalizeCacheInput)
    .join("|");

const callOllamaChat = async (messages: Array<{ role: string; content: string }>) => {
  const response = await fetch(buildOllamaUrl("/api/chat"), {
    method: "POST",
    headers: buildOllamaHeaders(),
    body: JSON.stringify({
      model: ollamaModel,
      messages,
      stream: false,
      format: "json",
      options: {
        temperature: 0.4,
        top_p: 0.9,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  return data.message.content;
};

const generateFitnessPlan = async (prompt: string) =>
  callOllamaChat([
    {
      role: "system",
      content:
        "Return ONLY valid JSON. Do not include markdown, commentary, or extra keys.",
    },
    { role: "user", content: prompt },
  ]);


http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }

    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("No svix headers found", {
        status: 400,
      });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred", { status: 400 });
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, first_name, last_name, image_url, email_addresses } = evt.data;

      const email = email_addresses[0].email_address;

      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.users.syncUser, {
          email,
          name,
          image: image_url,
          clerkId: id,
        });
      } catch (error) {
        console.log("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
      }
    }

    if (eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.users.updateUser, {
          clerkId: id,
          email,
          name,
          image: image_url,
        });
      } catch (error) {
        console.log("Error updating user:", error);
        return new Response("Error updating user", { status: 500 });
      }
    }

    return new Response("Webhooks processed successfully", { status: 200 });
  }),
});

// validate and fix workout plan to ensure it has proper numeric types
function validateWorkoutPlan(plan: any) {
  const validatedPlan = {
    schedule: plan.schedule,
    exercises: plan.exercises.map((exercise: any) => ({
      day: exercise.day,
      routines: exercise.routines.map((routine: any) => ({
        name: routine.name,
        sets: typeof routine.sets === "number" ? routine.sets : parseInt(routine.sets) || 1,
        reps: typeof routine.reps === "number" ? routine.reps : parseInt(routine.reps) || 10,
      })),
    })),
  };
  return validatedPlan;
}

// validate diet plan to ensure it strictly follows schema
function validateDietPlan(plan: any) {
  // only keep the fields we want
  const validatedPlan = {
    dailyCalories:
      typeof plan.dailyCalories === "number"
        ? plan.dailyCalories
        : parseInt(plan.dailyCalories) || 2000,
    meals: plan.meals.map((meal: any) => ({
      name: meal.name,
      foods: meal.foods,
    })),
  };
  return validatedPlan;
}

function validateGrocerylistPlan(plan: any) {
  const validatedPlan = {
    categories: (plan.categories || []).map((category: any) => ({
      name: category.name,
      items: Array.isArray(category.items) ? category.items : [],
    })),
  };
  return validatedPlan;
}

function validateMacrosPlan(plan: any) {
  const validatedPlan = {
    dailyCalories:
      typeof plan.dailyCalories === "number"
        ? plan.dailyCalories
        : parseInt(plan.dailyCalories) || 2000,
    proteinGrams:
      typeof plan.proteinGrams === "number"
        ? plan.proteinGrams
        : parseInt(plan.proteinGrams) || 120,
    carbsGrams:
      typeof plan.carbsGrams === "number"
        ? plan.carbsGrams
        : parseInt(plan.carbsGrams) || 200,
    fatGrams:
      typeof plan.fatGrams === "number"
        ? plan.fatGrams
        : parseInt(plan.fatGrams) || 60,
  };
  return validatedPlan;
}

http.route({
  path: "/ollama/generate-program",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders })),
});

http.route({
  path: "/ollama/generate-program",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const payload = await request.json();

      const {
        user_id,
        age,
        height,
        weight,
        gender,
        status,
        body_fat,
        injuries,
        workout_days,
        training_style,
        target_timeline,
        fitness_goal,
        fitness_level,
        dietary_restrictions,
        food_allergies,
        daily_calories,
        protein_target,
        carbs_target,
        fat_target,
        meals_per_day,
        working_hours,
        sleep_hours,
        stress_level,
        workout_time,
        available_equipment,
        country_region,
        city_region,
      } = payload;

      console.log("Payload is here:", payload);

      const cacheKey = buildCacheKey({
        age,
        weight,
        height,
        fitnessGoal: fitness_goal,
        fitnessLevel: fitness_level,
        workoutDays: workout_days,
      });

      const cachedPlan = await ctx.runQuery(api.plans.getPlanByCacheKey, {
        cacheKey,
      });

      if (cachedPlan) {
        const workoutPlan = validateWorkoutPlan(cachedPlan.workoutPlan);
        const dietPlan = validateDietPlan(cachedPlan.dietPlan);
        const macrosPlan = cachedPlan.macrosPlan
          ? validateMacrosPlan(cachedPlan.macrosPlan)
          : undefined;
        const grocerylistPlan = cachedPlan.grocerylistPlan
          ? validateGrocerylistPlan(cachedPlan.grocerylistPlan)
          : undefined;

        const planId = await ctx.runMutation(api.plans.createPlan, {
          userId: user_id,
          name: cachedPlan.name,
          workoutPlan,
          dietPlan,
          grocerylistPlan,
          macrosPlan,
          isActive: true,
          cacheKey,
        });

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              planId,
              workoutPlan,
              dietPlan,
              grocerylistPlan,
              macrosPlan,
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      const unifiedPrompt = `You are an experienced fitness and nutrition coach creating a complete plan in a single response.

User profile:
Age: ${age}
Height: ${height}
Weight: ${weight}
Gender: ${gender}
Status: ${status}
Body fat %: ${body_fat}
Injuries or limitations: ${injuries}
Available days for workout: ${workout_days}
Target timeline: ${target_timeline}
Fitness goal: ${fitness_goal}
Fitness level: ${fitness_level}
Preferred training style: ${training_style}
Preferred workout time: ${workout_time}
Available equipment: ${available_equipment}
Location: ${city_region}, ${country_region}
Working hours: ${working_hours}
Sleep hours: ${sleep_hours}
Stress level: ${stress_level}
Daily calories target (user input): ${daily_calories}
Dietary restrictions: ${dietary_restrictions}
Food allergies: ${food_allergies}
Meals per day: ${meals_per_day}
Protein target (g): ${protein_target}
Carbs target (g): ${carbs_target}
Fat target (g): ${fat_target}

Requirements:
- Consider muscle group splits to avoid overtraining consecutive days.
- Match exercises to fitness level and injuries.
- Align workouts and diet to the fitness goal and timeline.
- Prefer local foods based on the user's location.

CRITICAL SCHEMA INSTRUCTIONS:
- Return ONLY valid JSON. No markdown. No explanation.
- Output MUST contain ONLY the fields shown in the schema below.
- ALL numeric values MUST be numbers (never strings).
- Do NOT add extra fields.

Return a JSON object with this EXACT structure:
{
  "workoutPlan": {
    "schedule": ["Monday", "Wednesday", "Friday"],
    "exercises": [
      {
        "day": "Monday",
        "routines": [
          { "name": "Exercise Name", "sets": 3, "reps": 10 }
        ]
      }
    ]
  },
  "dietPlan": {
    "dailyCalories": 2000,
    "meals": [
      { "name": "Breakfast", "foods": ["Oatmeal", "Greek yogurt"] }
    ]
  },
  "macrosPlan": {
    "dailyCalories": 2200,
    "proteinGrams": 160,
    "carbsGrams": 240,
    "fatGrams": 70
  },
  "grocerylistPlan": {
    "categories": [
      { "name": "Proteins", "items": ["Chicken breast", "Greek yogurt"] }
    ]
  }
}`;

      const rawPlanText = await generateFitnessPlan(unifiedPrompt);
      const parsedPlan = safeParseJson(rawPlanText, "unified-plan");

      let workoutPlan = validateWorkoutPlan(parsedPlan.workoutPlan);
      let dietPlan = validateDietPlan(parsedPlan.dietPlan);
      let macrosPlan = validateMacrosPlan(parsedPlan.macrosPlan);
      let grocerylistPlan = validateGrocerylistPlan(parsedPlan.grocerylistPlan);

      const planId = await ctx.runMutation(api.plans.createPlan, {
        userId: user_id,
        dietPlan,
        grocerylistPlan,
        isActive: true,
        macrosPlan,
        workoutPlan,
        name: `${fitness_goal || "Custom"} Plan - ${new Date().toLocaleDateString()}`,
        cacheKey,
      });

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            planId,
            workoutPlan,
            dietPlan,
            grocerylistPlan,
            macrosPlan,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } catch (error) {
      console.error("Error generating fitness plan:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  }),
});

export default http;