import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

type ConfirmDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  planName: string;
};

const ConfirmDeleteDialog = ({
  open,
  onOpenChange,
  onConfirm,
  planName,
}: ConfirmDeleteDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-white/10 bg-white/5">
        <DialogHeader>
          <DialogTitle className="font-mono font-bold text-white">Delete Plan</DialogTitle>
          <DialogDescription className="text-white/70 text-sm font-mono mt-2">
            Are you sure you want to delete the plan "{planName}"? This action can't be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 mt-4">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-white font-mono text-sm hover:bg-white/5 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-sm hover:bg-red-500/20 transition-all duration-300"
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
