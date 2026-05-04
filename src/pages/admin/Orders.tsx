import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchOrders, bulkConfirmOrders, bulkCancelOrders, clearSelection } from "@/store/slices/ordersSlice";
import { OrderTable } from "@/components/admin/OrderTable";
import { BulkActionBar } from "@/components/admin/BulkActionBar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";

export default function Orders() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedIds, items, status } = useSelector((state: RootState) => state.orders);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filteredOrders = items.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending") return matchesSearch && order.statut === "EN_ATTENTE";
    if (activeTab === "confirmed") return matchesSearch && order.statut === "CONFIRMEE";
    if (activeTab === "cancelled") return matchesSearch && order.statut === "ANNULEE";
    return matchesSearch;
  });

  const handleBulkConfirm = async () => {
    try {
      await dispatch(bulkConfirmOrders(selectedIds)).unwrap();
      toast.success(`${selectedIds.length} commandes confirmées`);
    } catch (err) {
      toast.error("Erreur lors de l'opération");
    }
  };

  const handleBulkCancel = async () => {
    try {
      await dispatch(bulkCancelOrders(selectedIds)).unwrap();
      toast.success(`${selectedIds.length} commandes annulées`);
    } catch (err) {
      toast.error("Erreur lors de l'opération");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commandes</h1>
          <p className="text-muted-foreground">Suivez et gérez les commandes clients.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Tabs defaultValue="all" className="w-full md:w-[400px]" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="pending">Attente</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
            <TabsTrigger value="cancelled">Annulées</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher une commande..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <OrderTable orders={filteredOrders} isLoading={status === 'loading'} />

      <BulkActionBar 
        selectedCount={selectedIds.length}
        onConfirm={handleBulkConfirm}
        onCancel={handleBulkCancel}
      />
    </div>
  );
}
