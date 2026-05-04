import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { toggleSelection, selectAll, confirmOrder, cancelOrder } from "@/store/slices/ordersSlice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { Check, X, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatFCFA } from "@/lib/format";

interface OrderTableProps {
  orders: any[];
  isLoading?: boolean;
}

export const OrderTable = ({ orders, isLoading }: OrderTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedIds } = useSelector((state: RootState) => state.orders);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleConfirm = async (id: string) => {
    try {
      await dispatch(confirmOrder(id)).unwrap();
      toast.success("Commande confirmée");
    } catch (err: any) {
      toast.error(err);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await dispatch(cancelOrder(id)).unwrap();
      toast.success("Commande annulée");
    } catch (err: any) {
      toast.error(err);
    }
  };

  const isAllSelected = paginatedOrders.length > 0 && paginatedOrders.every(o => selectedIds.includes(o.id));

  const handleSelectAll = (checked: boolean) => {
    paginatedOrders.forEach(order => {
      const isSelected = selectedIds.includes(order.id);
      if (checked && !isSelected) {
        dispatch(toggleSelection(order.id));
      } else if (!checked && isSelected) {
        dispatch(toggleSelection(order.id));
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white dark:bg-zinc-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={isAllSelected}
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Aucune commande trouvée.
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                  <TableCell>
                    <Checkbox 
                      checked={selectedIds.includes(order.id)}
                      onCheckedChange={() => dispatch(toggleSelection(order.id))}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{order.id}</TableCell>
                  <TableCell className="font-medium">{order.client}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>{formatFCFA(order.total)}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.statut} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        title="Confirmer"
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 disabled:opacity-30"
                        disabled={order.statut !== 'EN_ATTENTE'}
                        onClick={() => handleConfirm(order.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        title="Annuler"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-30"
                        disabled={order.statut !== 'EN_ATTENTE'}
                        onClick={() => handleCancel(order.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Précédent
          </Button>
          <div className="text-sm font-medium">
            Page {currentPage} sur {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Suivant
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};
