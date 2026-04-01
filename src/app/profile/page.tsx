"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import ProfileHeader from "../../components/profile/ProfileHeader";
import NoFitnessPlan from "../../components/profile/NoFitnessPlan";
import PlanDetails from "../../components/profile/PlanDetails";
import PlanSelector from "../../components/profile/PlanSelector";
import ProfileSkeleton from "../../components/profile/ProfileSkeleton";
import { Id } from "../../../convex/_generated/dataModel";

const ProfilePage = () => {
  const { user } = useUser();
  const userId = user?.id as string;

  const allPlans = useQuery(api.plans.getUserPlans, { userId });
  const [selectedPlanId, setSelectedPlanId] = useState<null | string>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<null | { id: Id<"plans">; name: string }>(null);

  const activePlan = allPlans?.find((plan) => plan.isActive);

  const currentPlan = selectedPlanId
    ? allPlans?.find((plan) => plan._id === selectedPlanId)
    : activePlan;

  const macrosPlan = (currentPlan as any)?.macrosPlan;
  const grocerylistPlan = (currentPlan as any)?.grocerylistPlan;

  const deletePlan = useMutation(api.plans.deletePlan);

  const handleDeleteClick = (planId: Id<"plans">, planName: string) => {
    setPlanToDelete({ id: planId, name: planName });
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (planToDelete) {
      await deletePlan({ planId: planToDelete.id });
      setSelectedPlanId(null);
      window.location.reload();
    }
  };

  return (
    <section className="max-w-5xl relative z-10 pt-20 pb-32 flex-grow container mx-auto px-4 md:px-6 ">
      <ProfileHeader user={user} />
      {allPlans && allPlans?.length > 0 ? (
        <div className="space-y-12">
          <PlanSelector
            plans={allPlans}
            selectedPlanId={selectedPlanId}
            onSelectPlan={setSelectedPlanId}
            onRequestDelete={(planId, planName) =>
              handleDeleteClick(planId as Id<"plans">, planName)
            }
            showDeleteDialog={showDeleteDialog}
            setShowDeleteDialog={setShowDeleteDialog}
            onConfirmDelete={handleConfirmDelete}
            planToDeleteName={planToDelete?.name || ""}
          />
          {currentPlan && (
            <PlanDetails
              plan={currentPlan}
              macrosPlan={macrosPlan}
              grocerylistPlan={grocerylistPlan}
            />
            
          )}
        </div>
      ) : allPlans === undefined || allPlans === null ? (
        <ProfileSkeleton />
      ) : (
        <NoFitnessPlan />
      )}
    </section>
  );
};

export default ProfilePage;