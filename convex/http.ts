import { httpRouter } from "convex/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

const corsOrigin = process.env.CORS_ORIGIN || "*";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

const groqApiKey = process.env.GROQ_API_KEY;
const groqModel = process.env.GROQ_MODEL || "qwen/qwen3-32b";

const extractJson = (content: string) => {
  const trimmed = content.trim();
  const startIndex = trimmed.indexOf("{");
  const endIndex = trimmed.lastIndexOf("}");
  if (startIndex === -1 || endIndex === -1) {
    throw new Error(
      `No JSON object boundaries found in AI response. Content length=${trimmed.length}, preview=${trimmed.slice(0, 100)}`
    );
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
    inputs.age, inputs.weight, inputs.height, inputs.fitnessGoal, inputs.fitnessLevel, inputs.workoutDays,
  ]
    .map(normalizeCacheInput)
    .join("|");

const GROQ_TIMEOUT_MS = 30_000;

const callGroqChat = async (
  messages: Array<{ role: string; content: string }>
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: groqModel,
          messages,
          temperature: 0.2, // Lowering temperature reduces structural variance
          response_format: { type: "json_object" }, // <--- FORCES JSON OUTPUT
        }),
        signal: controller.signal,
      }
    );
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err?.name === "AbortError") {
      throw new Error(`Groq request timed out after ${GROQ_TIMEOUT_MS / 1000}s`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Groq HTTP error: status=${response.status}, body=${errorText.slice(0, 500)}`);
    throw new Error(`Groq request failed (${response.status}): ${errorText.slice(0, 300)}`);
  }

  const data = await response.json();
  const choice = data.choices?.[0];
  const content =
    choice?.message?.content ||
    choice?.message?.reasoning_content ||
    "";

  if (!content || !content.trim()) {
    console.error(
      "Groq returned empty content. Full response:",
      JSON.stringify(data).slice(0, 2000)
    );
    throw new Error(
      `Groq returned empty content. finish_reason=${choice?.finish_reason ?? "unknown"}`
    );
  }

  console.log(
    `Groq response OK: finish_reason=${choice?.finish_reason}, content_length=${content.length}`
  );
  return content;
};

const generateFitnessPlan = async (prompt: string) =>
  callGroqChat([
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

function validateWorkoutPlan(plan: any) {
  return {
    schedule: Array.isArray(plan?.schedule) ? plan.schedule : [],
    exercises: Array.isArray(plan?.exercises) ? plan.exercises.map((exercise: any) => ({
      day: exercise?.day || "Workout Day",
      routines: Array.isArray(exercise?.routines) ? exercise.routines.map((routine: any) => ({
        name: routine?.name || "Exercise",
        sets: typeof routine?.sets === "number" ? routine.sets : parseInt(routine?.sets) || 3,
        reps: typeof routine?.reps === "number" ? routine.reps : parseInt(routine?.reps) || 10,
      })) : [],
    })) : [],
  };
}

function validateDietPlan(plan: any) {
  return {
    dailyCalories: typeof plan?.dailyCalories === "number" ? plan.dailyCalories : parseInt(plan?.dailyCalories) || 2000,
    meals: Array.isArray(plan?.meals) ? plan.meals.map((meal: any) => ({
      name: meal?.name || "Meal",
      foods: Array.isArray(meal?.foods) ? meal.foods : [],
    })) : [],
  };
}

function validateGrocerylistPlan(plan: any) {
  return {
    // Safely fallback if categories or the plan itself is missing
    categories: Array.isArray(plan?.categories) 
      ? plan.categories.map((category: any) => ({
          name: category?.name || "General",
          items: Array.isArray(category?.items) ? category.items : [],
        })) 
      : [],
  };
}

function validateMacrosPlan(plan: any) {
  return {
    dailyCalories:
      typeof plan?.dailyCalories === "number"
        ? plan.dailyCalories
        : parseInt(plan?.dailyCalories) || 2000,
    proteinGrams:
      typeof plan?.proteinGrams === "number"
        ? plan.proteinGrams
        : parseInt(plan?.proteinGrams) || 120,
    carbsGrams:
      typeof plan?.carbsGrams === "number"
        ? plan.carbsGrams
        : parseInt(plan?.carbsGrams) || 200,
    fatGrams:
      typeof plan?.fatGrams === "number"
        ? plan.fatGrams
        : parseInt(plan?.fatGrams) || 60,
  };
}

http.route({
  path: "/generate-program",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders })),
});


http.route({
  path: "/generate-program",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Helper: classify error into a stable error code
    const classifyError = (err: unknown): string => {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("timed out")) return "GROQ_TIMEOUT";
      if (msg.includes("empty content")) return "AI_EMPTY_RESPONSE";
      if (msg.includes("not valid JSON") || msg.includes("No JSON object boundaries"))
        return "AI_INVALID_JSON";
      if (msg.includes("Groq request failed")) return "GROQ_REQUEST_FAILED";
      return "INTERNAL_ERROR";
    };

    // Helper: build a guaranteed-safe JSON error response
    const errorResponse = (status: number, message: string, code: string) =>
      new Response(
        JSON.stringify({ success: false, error: message, code }),
        {
          status,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );

    try {
      const payload = await request.json();

      const {
        user_id, age, height, weight, gender, status, body_fat, injuries, workout_days, training_style, target_timeline, fitness_goal, fitness_level, dietary_restrictions, food_allergies, daily_calories, protein_target, carbs_target, fat_target, meals_per_day, working_hours, sleep_hours, stress_level, workout_time, available_equipment, country_region, city_region,
      } = payload;

      console.log("Payload is here:", payload);

      const cacheKey = buildCacheKey({
        age, weight, height, fitnessGoal: fitness_goal, fitnessLevel: fitness_level, workoutDays: workout_days,
      });

      const cachedPlan = await ctx.runQuery(api.plans.getPlanByCacheKey, {
        cacheKey,
      });

      if (cachedPlan) {
        console.log(`Cache HIT for cacheKey=${cacheKey}`);
        const workoutPlan = validateWorkoutPlan(cachedPlan.workoutPlan);
        const dietPlan = validateDietPlan(cachedPlan.dietPlan);
        const macrosPlan = cachedPlan.macrosPlan
          ? validateMacrosPlan(cachedPlan.macrosPlan)
          : undefined;
        const grocerylistPlan = cachedPlan.grocerylistPlan
          ? validateGrocerylistPlan(cachedPlan.grocerylistPlan)
          : undefined;

        const planId = await ctx.runMutation(api.plans.createPlan, {
          userId: user_id, name: cachedPlan.name, workoutPlan, dietPlan, grocerylistPlan, macrosPlan, isActive: true, cacheKey,
        });

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              planId, workoutPlan, dietPlan, grocerylistPlan, macrosPlan,
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      console.log(`Cache MISS for cacheKey=${cacheKey}. Calling Groq...`);

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
- Return ONLY valid JSON matching the exact structure below.
- Do NOT wrap your response in markdown text blocks (do NOT use \`\`\`json).
- Every property specified must be present, and arrays must not be empty.
- Ensure all numbers (sets, reps, calories, grams) are actual JSON numbers, not strings.

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

      // --- Attempt 1: generate + parse ---
      let parsedPlan: any;
      try {
        const rawPlanText = await generateFitnessPlan(unifiedPrompt);
        parsedPlan = safeParseJson(rawPlanText, "unified-plan");
      } catch (firstError) {
        // --- Attempt 2: retry with stricter prompt ---
        console.warn(
          "First Groq attempt failed, retrying with stricter prompt:",
          firstError instanceof Error ? firstError.message : String(firstError)
        );

        try {
          const retryRaw = await callGroqChat([
            {
              role: "system",
              content:
                "Your previous response was not valid JSON. You MUST return ONLY a valid JSON object. No markdown, no commentary, no explanation — just the raw JSON object.",
            },
            { role: "user", content: unifiedPrompt },
          ]);
          parsedPlan = safeParseJson(retryRaw, "unified-plan-retry");
          console.log("Retry succeeded.");
        } catch (retryError) {
          console.error(
            "Retry also failed:",
            retryError instanceof Error ? retryError.message : String(retryError)
          );
          // Throw the original error so the error code classification is accurate
          throw firstError;
        }
      }

      // The validators now safely execute even if these root keys are completely missing
      let workoutPlan = validateWorkoutPlan(parsedPlan?.workoutPlan);
      let dietPlan = validateDietPlan(parsedPlan?.dietPlan);
      let macrosPlan = validateMacrosPlan(parsedPlan?.macrosPlan);
      let grocerylistPlan = validateGrocerylistPlan(parsedPlan?.grocerylistPlan);

      const planId = await ctx.runMutation(api.plans.createPlan, {
        userId: user_id, dietPlan, grocerylistPlan, isActive: true, macrosPlan, workoutPlan,
        name: `${fitness_goal || "Custom"} Plan - ${new Date().toLocaleDateString()}`,
        cacheKey,
      });

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            planId, workoutPlan, dietPlan, grocerylistPlan, macrosPlan,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorCode = classifyError(error);
      console.error(
        `Error generating fitness plan: code=${errorCode}, message=${errorMessage}`
      );
      return errorResponse(500, errorMessage, errorCode);
    }
  }),
});

export default http;