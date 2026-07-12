import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  plans: defineTable({
    userId: v.string(),
    name: v.string(),
    cacheKey: v.optional(v.string()),
    workoutPlan: v.object({
      schedule: v.array(v.string()),
      exercises: v.array(
        v.object({
          day: v.string(),
          routines: v.array(
            v.object({
              name: v.string(),
              sets: v.optional(v.number()),
              reps: v.optional(v.number()),
              duration: v.optional(v.string()),
              description: v.optional(v.string()),
              exercises: v.optional(v.array(v.string())),
            })
          ),
        })
      ),
    }),
    dietPlan: v.object({
      dailyCalories: v.number(),
      meals: v.array(
        v.object({
          name: v.string(),
          foods: v.array(v.string()),
        })
      ),
    }),
    grocerylistPlan: v.optional(
      v.object({
        categories: v.array(
          v.object({
            name: v.string(),
            items: v.array(v.string()),
          })
        ),
      })
    ),
    macrosPlan: v.optional(
      v.object({
        dailyCalories: v.number(),
        proteinGrams: v.number(),
        carbsGrams: v.number(),
        fatGrams: v.number(),
      })
    ),
    isActive: v.boolean(),
    
  })
    .index("by_user_id", ["userId"])
    .index("by_active", ["isActive"])
    .index("by_cache_key", ["cacheKey"]),

  gyms: defineTable({
  placeId:      v.string(),
  name:         v.string(),
  address:      v.string(),
  lat:          v.number(),
  lng:          v.number(),
  rating:       v.optional(v.number()),
  openingHours: v.optional(v.array(v.string())),
  photos:       v.optional(v.array(v.string())),
  cachedAt:     v.number(),
  }).index("by_placeId", ["placeId"]),

  bookings: defineTable({
    userId:           v.string(),
    gymId:            v.string(),
    className:        v.string(),
    scheduledAt:      v.number(),
    status:           v.string(),
    confirmationCode: v.optional(v.string()),
  }).index("by_userId", ["userId"])
    .index("by_status", ["status"]),

  reminders: defineTable({
  userId:    v.string(),
  bookingId: v.optional(v.string()),
  remindAt:  v.number(),
  message:   v.string(),
  sent:      v.boolean(),
  }).index("by_sent", ["sent"])
  .index("by_userId", ["userId"]),

});