import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BulkActionBarProps {
  selectedCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  showConfirm?: boolean;
  showCancel?: boolean;
}

export const BulkActionBar = ({ 
  selectedCount, 
  onConfirm, 
  onCancel, 
  showConfirm = true, 
  showCancel = true 
}: BulkActionBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl px-6 py-3 rounded-full"
      >
        <span className="text-sm font-medium mr-4">
          {selectedCount} élément{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
        </span>
        
        {showConfirm && (
          <Button 
            variant="default" 
            size="sm" 
            className="bg-green-600 hover:bg-green-700 text-white gap-2 rounded-full"
            onClick={onConfirm}
          >
            <CheckCircle className="h-4 w-4" />
            Confirmer
          </Button>
        )}

        {showCancel && (
          <Button 
            variant="destructive" 
            size="sm" 
            className="gap-2 rounded-full"
            onClick={onCancel}
          >
            <XCircle className="h-4 w-4" />
            Annuler
          </Button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
