"use client";

import { motion } from "motion/react";
import { Trash2 } from "lucide-react";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

export type PlanSummary = {
  _id: string;
  name: string;
  isActive: boolean;
};

type PlanSelectorProps = {
  plans: PlanSummary[];
  selectedPlanId: string | null;
  onSelectPlan: (planId: string) => void;
  onRequestDelete: (planId: string, planName: string) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (open: boolean) => void;
  onConfirmDelete: () => void;
  planToDeleteName: string;
};

const PlanSelector = ({
  plans,
  selectedPlanId,
  onSelectPlan,
  onRequestDelete,
  showDeleteDialog,
  setShowDeleteDialog,
  onConfirmDelete,
  planToDeleteName,
}: PlanSelectorProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.1 }}
    className="relative backdrop-blur-md border border-white/10 bg-white/5 rounded-lg p-3 md:p-7 overflow-hidden -mt-10"
  >
    <div className="flex items-start justify-between mb-9">
      <div>
        <h2 className="text-3xl md:text-2xl font-mono tracking-tighter font-display text-white">
          <span className="text-white">Your</span>{" "}
          <span className="text-white">Fitness Plans</span>
        </h2>
        <p className="text-sm font-mono text-muted-foreground mt-1">
          Manage and track all your fitness plans
        </p>
      </div>

      <div className="font-mono text-xs text-muted-foreground px-3 py-1">
        TOTAL: {plans.length}
      </div>
    </div>

    <div className="flex flex-wrap gap-3 -mt-2">
      {plans.map((plan) => (
        <div key={plan._id} className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectPlan(plan._id)}
            className={`px-3 py-2 rounded-lg font-normal text-sm tracking-wider transition-all duration-300 border ${
              selectedPlanId === plan._id
                ? "bg-foreground/20 text-foreground border-foreground/50 "
                : " text-white/70 border-white/20 hover:border-foreground/50 hover:text-white"
            }`}
          >
            {plan.name}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white/20 hover:text-red-700 hover:border-red-500/50 transition-all duration-300"
            onClick={() => onRequestDelete(plan._id, plan.name)}
            title="Delete plan"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      ))}

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={onConfirmDelete}
        planName={planToDeleteName}
      />
    </div>
  </motion.div>
);

export default PlanSelector;
