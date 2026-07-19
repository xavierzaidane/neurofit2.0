"use client";

import React from "react";
import { Trash2, ExternalLink } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface PlansTableProps {
  plans: any[];
  onSelectPlan: (planId: string) => void;
  onDeletePlan: (planId: any, planName: string) => void;
}

export const PlansTable: React.FC<PlansTableProps> = ({ plans, onSelectPlan, onDeletePlan }) => {
  return (
    <Card className="bg-card border-border select-none hover:border-border/80 transition-all duration-300 flex flex-col justify-between h-full shadow-sm">
      <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-base text-card-foreground font-normal">Fitness Plans</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {plans.length} {plans.length === 1 ? "plan" : "plans"} listed
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto min-h-[220px] pb-6">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="pb-3 text-[11px] font-normal text-muted-foreground uppercase tracking-wider pl-2 h-auto">Name</TableHead>
              <TableHead className="pb-3 text-[11px] font-normal text-muted-foreground uppercase tracking-wider h-auto">Status</TableHead>
              <TableHead className="pb-3 text-[11px] font-normal text-muted-foreground uppercase tracking-wider h-auto">Created Date</TableHead>
              <TableHead className="pb-3 text-[11px] font-normal text-muted-foreground uppercase tracking-wider h-auto">Workout Days</TableHead>
              <TableHead className="pb-3 text-[11px] font-normal text-muted-foreground uppercase tracking-wider h-auto">Calories</TableHead>
              <TableHead className="pb-3 text-[11px] font-normal text-muted-foreground uppercase tracking-wider text-right pr-2 h-auto">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/30">
            {plans.map((plan) => {
              const createdDate = new Date(plan._creationTime).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              });

              return (
                <TableRow
                  key={plan._id}
                  onClick={() => onSelectPlan(plan._id)}
                  className="group hover:bg-muted/30 cursor-pointer border-b border-border/30 last:border-b-0"
                >
                  {/* Name */}
                  <TableCell className="py-4 pl-2">
                    <span className="text-[13px] font-normal text-card-foreground group-hover:text-foreground transition-colors font-sans">
                      {plan.name}
                    </span>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="py-4">
                    {plan.isActive ? (
                      <Badge className="bg-foreground/10 text-foreground border border-foreground/20 font-semibold hover:bg-foreground/20 transition-colors">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-border text-muted-foreground font-semibold">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>

                  {/* Created Date */}
                  <TableCell className="py-4 text-[12px] font-medium text-muted-foreground font-mono">
                    {createdDate}
                  </TableCell>

                  {/* Workout Days */}
                  <TableCell className="py-4 text-[12px] font-medium text-muted-foreground font-mono">
                    {plan.workoutPlan?.exercises?.length || 0} Days
                  </TableCell>

                  {/* Calories */}
                  <TableCell className="py-4 text-[12px] font-medium text-muted-foreground font-mono">
                    {plan.dietPlan?.dailyCalories || 0} kcal
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-4 text-right pr-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSelectPlan(plan._id)}
                        className="w-8 h-8 text-muted-foreground hover:text-foreground"
                        title="View details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeletePlan(plan._id, plan.name)}
                        className="w-8 h-8 text-muted-foreground hover:text-destructive"
                        title="Delete plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {plans.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-xs text-muted-foreground font-normal">
                  No fitness plans found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
