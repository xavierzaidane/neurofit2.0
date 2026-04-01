"use client";

import { motion } from "motion/react";
import {
  AppleIcon,
  CalendarIcon,
  Download,
  DumbbellIcon,
  Flame,
  Share2,
  ShoppingCart,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type WorkoutRoutine = {
  name: string;
  sets?: number;
  reps?: number;
  description?: string;
};

type WorkoutExerciseDay = {
  day: string;
  routines: WorkoutRoutine[];
};

type WorkoutPlan = {
  schedule: string[];
  exercises: WorkoutExerciseDay[];
};

type DietMeal = {
  name: string;
  foods: string[];
};

type DietPlan = {
  dailyCalories: number;
  meals: DietMeal[];
};

type MacrosPlan = {
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
};

type GroceryCategory = {
  name: string;
  items: string[];
};

type GroceryListPlan = {
  categories: GroceryCategory[];
};

type PlanDetailsProps = {
  plan: {
    name: string;
    workoutPlan: WorkoutPlan;
    dietPlan: DietPlan;
  };
  macrosPlan?: MacrosPlan;
  grocerylistPlan?: GroceryListPlan;
};

const PlanDetails = ({ plan, macrosPlan, grocerylistPlan }: PlanDetailsProps) => (
  <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative border border-white/10 bg-white/5 rounded-lg p-6 md:p-8 overflow-hidden"
    >
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-lg font-mono font-bold text-white">
          PLAN: <span className="text-foreground">{plan.name}</span>
        </h3>
      </div>

      <Tabs defaultValue="workout" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="workout">
            <DumbbellIcon className=" size-4" />
            Workout
          </TabsTrigger>

          <TabsTrigger value="diet">
            <AppleIcon className=" h-4 w-4" />
            Diet
          </TabsTrigger>

          <TabsTrigger value="macros">
            <Flame className="h-4 w-4" />
            Macros
          </TabsTrigger>

          <TabsTrigger value="grocery">
            <ShoppingCart className="h-4 w-4" />
            Grocery
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workout">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-mono text-white/70">
              <CalendarIcon className="h-4 w-4" />
              SCHEDULE: {plan.workoutPlan.schedule.join(", ")}
            </div>

            <Accordion type="multiple" className="space-y-2">
              {plan.workoutPlan.exercises.map((exerciseDay, index) => (
                <AccordionItem
                  key={index}
                  value={exerciseDay.day}
                  className="border border-white/10 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5 font-mono text-sm font-bold text-white">
                    <div className="flex justify-between w-full items-center gap-2">
                      <span>{exerciseDay.day}</span>
                      <div className="text-xs text-white/60 font-mono">
                        {exerciseDay.routines.length} EXERCISES
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pb-4 px-4 pt-3">
                    <div className="space-y-2">
                      {exerciseDay.routines.map((routine, routineIndex) => (
                        <div
                          key={routineIndex}
                          className="border border-white/10 rounded p-3 text-sm"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-monofont-semibold text-white">
                              {routine.name}
                            </h4>
                            <div className="flex items-center gap-1 text-xs font-mono">
                              <span className="text-white/70">{routine.sets} sets</span>
                              <span className="text-white/70">×</span>
                              <span className="text-white/70">{routine.reps} reps</span>
                            </div>
                          </div>
                          {routine.description && (
                            <p className="text-xs text-white/60 mt-1">
                              {routine.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>

        <TabsContent value="diet">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-mono">
              <span className="text-white/70">DAILY CALORIES:</span>
              <span className="text-white font-bold">{plan.dietPlan.dailyCalories}K</span>
            </div>

            <div className="space-y-2">
              {plan.dietPlan.meals.map((meal, index) => (
                <div key={index} className="border border-white/10 rounded-lg p-3">
                  <h4 className="font-mono text-sm font-bold text-white mb-2">
                    {meal.name}
                  </h4>
                  <ul className="space-y-1">
                    {meal.foods.map((food, foodIndex) => (
                      <li key={foodIndex} className="text-xs font-mono text-white/70">
                        • {food}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="macros">
          {macrosPlan ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="border border-white/10 rounded-lg p-3">
                  <p className="text-xs font-mono text-white/60">CALORIES</p>
                  <p className="text-base font-bold text-white mt-1">
                    {macrosPlan.dailyCalories} kcal
                  </p>
                </div>
                <div className="border border-white/10 rounded-lg p-3">
                  <p className="text-xs font-mono text-white/60">PROTEIN</p>
                  <p className="text-base font-bold text-white mt-1">
                    {macrosPlan.proteinGrams} g
                  </p>
                </div>
                <div className="border border-white/10 rounded-lg p-3">
                  <p className="text-xs font-mono text-white/60">CARBS</p>
                  <p className="text-base font-bold text-white mt-1">
                    {macrosPlan.carbsGrams} g
                  </p>
                </div>
                <div className="border border-white/10 rounded-lg p-3">
                  <p className="text-xs font-mono text-white/60">FAT</p>
                  <p className="text-base font-bold text-white mt-1">
                    {macrosPlan.fatGrams} g
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-white/10 rounded-lg p-4 text-sm text-white/70 font-mono">
              No macros data found for this plan.
            </div>
          )}
        </TabsContent>

        <TabsContent value="grocery">
          {grocerylistPlan?.categories?.length ? (
            <div className="space-y-3">
              {grocerylistPlan.categories.map((category, index) => (
                <div key={index} className="border border-white/10 rounded-lg p-3">
                  <h4 className="font-mono text-sm font-bold text-white mb-2">
                    {category.name}
                  </h4>
                  <ul className="space-y-1">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-xs font-mono text-white/70">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-white/10 rounded-lg p-4 text-sm text-white/70 font-mono">
              No grocery list found for this plan.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>

    <div className="flex justify-end items-center gap-3 -mt-6">
      <button type="button" className="flex items-center px-4 py-2 text-sm font-mono text-white hover:text-white/70">
        <Share2 className="size-4 mr-2" />
        Share
      </button>

      <button
        type="button"
        className="flex items-center  px-4 py-2 text-sm font-mono text-black hover:text-white bg-white hover:bg-foreground rounded-lg transition-colors font-semibold"
      >
        <Download className="size-4 mr-2" />
        Download Plan
      </button>
    </div>
  </>
);

export default PlanDetails;
