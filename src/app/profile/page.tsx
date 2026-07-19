"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import ProfileHeader from "../../components/profile/ProfileHeader";
import NoFitnessPlan from "../../components/profile/NoFitnessPlan";
import PlanDetails from "../../components/profile/PlanDetails";
import ProfileSkeleton from "../../components/profile/ProfileSkeleton";
import { Id } from "../../../convex/_generated/dataModel";
import { FitnessPlansCard } from "../../components/profile/dashboard/FitnessPlansCard";
import { WorkoutsPerPlanChart } from "../../components/profile/dashboard/WorkoutsPerPlanChart";
import { TotalPlanCard } from "../../components/profile/dashboard/TotalPlanCard";
import { PlansTable } from "../../components/profile/dashboard/PlansTable";
import { NeurobotHistoryCard } from "../../components/profile/dashboard/NeurobotHistoryCard";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const { user } = useUser();
  const userId = user?.id as string;

  const allPlans = useQuery(api.plans.getUserPlans, { userId });
  const [selectedPlanId, setSelectedPlanId] = useState<null | string>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<null | { id: Id<"plans">; name: string }>(null);

  const deletePlan = useMutation(api.plans.deletePlan);

  // Detail Modal Plan
  const detailPlan = selectedPlanId
    ? allPlans?.find((plan) => plan._id === selectedPlanId)
    : null;

  const handleDeleteClick = (planId: Id<"plans">, planName: string) => {
    setPlanToDelete({ id: planId, name: planName });
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (planToDelete) {
      await deletePlan({ planId: planToDelete.id });
      setSelectedPlanId(null);
      setShowDeleteDialog(false);
      window.location.reload();
    }
  };

  return (
    <section className="relative z-10 pt-24 pb-32 flex-grow container mx-auto px-4 md:px-8 max-w-7xl">
      <ProfileHeader user={user} />

      {allPlans && allPlans.length > 0 ? (
        <div className="flex flex-col gap-6">
          {/* Top Row Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-6 items-stretch">
            <div>
              <FitnessPlansCard plans={allPlans} />
            </div>
            <div>
              <WorkoutsPerPlanChart plans={allPlans} />
            </div>
            <div>
              <TotalPlanCard plans={allPlans} />
            </div>
          </div>

          {/* Bottom Row Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-stretch">
            <div>
              <PlansTable
                plans={allPlans}
                onSelectPlan={(id) => setSelectedPlanId(id)}
                onDeletePlan={(id, name) => handleDeleteClick(id as Id<"plans">, name)}
              />
            </div>
            <div>
              <NeurobotHistoryCard />
            </div>
          </div>
        </div>
      ) : allPlans === undefined ? (
        <ProfileSkeleton />
      ) : (
        <NoFitnessPlan />
      )}

      {/* Plan Details slide-out sheet */}
      <Sheet open={!!selectedPlanId} onOpenChange={(open) => !open && setSelectedPlanId(null)}>
        <SheetContent className="w-full sm:max-w-4xl bg-card border-l border-border p-6 md:p-8 overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-xl font-normal text-card-foreground font-sans">
              Plan View Mode
            </SheetTitle>
              <SheetDescription>
    Choose how you want to view and organize your plans.
  </SheetDescription>
          </SheetHeader>

          {detailPlan && (
            <div className="-mt-5">
              <PlanDetails
                plan={detailPlan}
                macrosPlan={detailPlan.macrosPlan}
                grocerylistPlan={detailPlan.grocerylistPlan}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      {planToDelete && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="border border-white/10 bg-card max-w-md rounded-2xl p-6">
            <DialogTitle className="font-bold text-card-foreground text-lg font-sans">Delete Plan</DialogTitle>
            <p className="text-muted-foreground text-sm font-sans mt-3">
              Are you sure you want to delete the plan "{planToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                className="border-border text-card-foreground font-sans text-xs font-bold hover:bg-muted/40"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                className="text-xs font-bold font-sans"
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default ProfilePage;