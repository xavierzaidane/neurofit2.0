"use client";

import React from "react";
import { Layers } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

interface TotalPlanCardProps {
  plans: any[];
}

export const TotalPlanCard: React.FC<TotalPlanCardProps> = ({ plans }) => {
  // Aggregate metrics
  let workoutDays = 0;
  let dietMeals = 0;
  let macrosPlans = 0;
  let groceryLists = 0;

  plans.forEach((plan) => {
    workoutDays += plan.workoutPlan?.exercises?.length || 0;
    dietMeals += plan.dietPlan?.meals?.length || 0;
    if (plan.macrosPlan) macrosPlans++;
    if (plan.grocerylistPlan?.categories?.length) groceryLists++;
  });

  const data = [
    { label: "Workout Days", value: workoutDays, fill: "var(--color-workouts)" },
    { label: "Diet Meals", value: dietMeals, fill: "var(--color-meals)" },
    { label: "Macros Plans", value: macrosPlans, fill: "var(--color-macros)" },
    { label: "Grocery Lists", value: groceryLists, fill: "var(--color-groceries)" },
  ];

  const chartConfig = {
    workouts: {
      label: "Workout Days",
      color: "var(--foreground)",
    },
    meals: {
      label: "Diet Meals",
      color: "var(--chart-2)",
    },
    macros: {
      label: "Macros Plans",
      color: "var(--chart-3)",
    },
    groceries: {
      label: "Grocery Lists",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="bg-card border-border select-none hover:border-border/80 transition-all duration-300 flex flex-col justify-between h-full relative shadow-sm">
      <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base text-card-foreground font-normal">Top Plans by Type</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Accumulated Stats</CardDescription>
        </div>
        <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground">
          <Layers className="size-4" />
        </div>
      </CardHeader>

      <CardContent className="my-6">
        <ChartContainer config={chartConfig} className="min-h-[180px] h-[180px] w-full">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ left: -10, right: 10, top: 0, bottom: 0 }}
          >
            <CartesianGrid horizontal={false} className="stroke-border/30" strokeDasharray="3 3" />
            <XAxis type="number" hide />
            <YAxis
              dataKey="label"
              type="category"
              tickLine={false}
              axisLine={false}
              className="fill-muted-foreground font-sans text-[11px]"
              width={85}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="value" radius={4} barSize={12}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="border-t border-border pt-4 pb-6 flex justify-center">
        <span className="text-xs text-muted-foreground font-normal  tracking-wider">
          Plan Metrics Summary
        </span>
      </CardFooter>
    </Card>
  );
};
