"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FitnessPlansCardProps {
  plans: any[];
}

export const FitnessPlansCard: React.FC<FitnessPlansCardProps> = ({ plans }) => {
  const totalPlans = plans.length;

  // Compute breakdown stats across all plans
  let totalExercises = 0;
  let totalMeals = 0;
  let totalMacros = 0;
  let totalGroceries = 0;

  plans.forEach((plan) => {
    // Workout exercises
    plan.workoutPlan?.exercises?.forEach((exDay: any) => {
      totalExercises += exDay.routines?.length || 0;
    });

    // Diet meals
    totalMeals += plan.dietPlan?.meals?.length || 0;

    // Macros
    if (plan.macrosPlan) {
      totalMacros++;
    }

    // Grocery items
    plan.grocerylistPlan?.categories?.forEach((cat: any) => {
      totalGroceries += cat.items?.length || 0;
    });
  });

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="bg-card border-border select-none hover:border-border/80 transition-all duration-300 flex flex-col justify-between h-full relative shadow-sm">
      <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="font-normal text-card-foreground">Today's Plan</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">{formattedDate}</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-full text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/program">
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center py-6">
        <span className="text-7xl font-normal tracking-tighter text-foreground">
          {totalPlans}
        </span>
        <span className="text-[11px] text-muted-foreground font-normal tracking-wider uppercase mt-1">
          Plans Created
        </span>

        {/* Visit Breakdown */}
        <div className="w-full mt-6 space-y-3 bg-muted/20 border border-border/50 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-chart-1" />
              <span className="text-muted-foreground">Total Workouts</span>
            </div>
            <span className="font-semibold text-card-foreground font-mono">{totalExercises}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-chart-2" />
              <span className="text-muted-foreground">Diet Meals</span>
            </div>
            <span className="font-semibold text-card-foreground font-mono">{totalMeals}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-chart-3" />
              <span className="text-muted-foreground">Macros Tracked</span>
            </div>
            <span className="font-semibold text-card-foreground font-mono">{totalMacros}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-chart-4" />
              <span className="text-muted-foreground">Grocery Items</span>
            </div>
            <span className="font-semibold text-card-foreground font-mono">{totalGroceries}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-center gap-1 text-xs text-muted-foreground pt-0 pb-6">
        <span>Trending up</span>
        <svg className="w-3.5 h-3.5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        <span className="ml-2">Active fitness focus</span>
      </CardFooter>
    </Card>
  );
};
