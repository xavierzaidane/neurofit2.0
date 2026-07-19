"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface WorkoutsPerPlanChartProps {
  plans: any[];
}

export const WorkoutsPerPlanChart: React.FC<WorkoutsPerPlanChartProps> = ({ plans }) => {
  // Take last 6 plans for the chart columns
  const recentPlans = [...plans].reverse().slice(-6);

  // Map each plan to two metrics: Workout Days (length of schedule) and Total Exercises
  const data = recentPlans.map((plan) => {
    const daysCount = plan.workoutPlan?.exercises?.length || 0;
    let exercisesCount = 0;
    plan.workoutPlan?.exercises?.forEach((day: any) => {
      exercisesCount += day.routines?.length || 0;
    });

    return {
      name: plan.name.length > 8 ? plan.name.slice(0, 8) + "..." : plan.name,
      fullName: plan.name,
      days: daysCount,
      exercises: exercisesCount,
    };
  });

  const chartConfig = {
    days: {
      label: "Workout Days",
      color: "var(--foreground)",
    },
    exercises: {
      label: "Exercises Count",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="bg-card border-border select-none hover:border-border/80 transition-all duration-300 flex flex-col justify-between h-full relative shadow-sm">
      <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base text-card-foreground font-normal">Workout by Intensity</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Workout Intensity Breakdown</CardDescription>
        </div>
        <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground">
          <ArrowUpRight className="size-4" />
        </div>
      </CardHeader>

      <CardContent className="mt-6 flex-1 flex flex-col justify-end">
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-[180px] h-[180px] w-full">
            <BarChart data={data}>
              <CartesianGrid vertical={false} className="stroke-border/30" strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                className="fill-muted-foreground font-sans text-[11px]"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground font-mono text-[11px]"
                width={20}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="days" fill="var(--color-days)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="exercises" fill="var(--color-exercises)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="h-[180px] flex items-center justify-center text-xs text-muted-foreground font-mono">
            No active plans found
          </div>
        )}
      </CardContent>

      {/* Legend Footer */}
      <CardFooter className="mt-5 flex items-center justify-center gap-6 border-t border-border pt-4 pb-6">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm bg-foreground" />
          <span className="text-[12px] text-muted-foreground font-sans font-medium">Workout Days</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm bg-chart-2" />
          <span className="text-[12px] text-muted-foreground font-sans font-medium">Exercises Count</span>
        </div>
      </CardFooter>
    </Card>
  );
};
