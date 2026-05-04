import { useMemo, useState } from "react";
import { useShop } from "@/context/ShopContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Search, X } from "lucide-react";
import { formatDate, formatFCFA } from "@/lib/format";
import { StatusBadge } from "./AdminDashboard";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrderStatus } from "@/lib/types";

export default function AdminOrders() {
  const { orders, setOrderStatus, bulkSetOrderStatus } = useShop();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filter !== "ALL" && o.status !== filter) return false;
      if (
        search &&
        !o.client.nom.toLowerCase().includes(search.toLowerCase()) &&
        !o.id.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [orders, filter, search]);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((o) => o.id));

  const bulkConfirm = () => {
    bulkSetOrderStatus(selected, "CONFIRMEE");
    toast.success(`${selected.length} commande(s) confirmée(s)`);
    setSelected([]);
  };
  const bulkCancel = () => {
    bulkSetOrderStatus(selected, "ANNULEE");
    toast.success(`${selected.length} commande(s) annulée(s)`);
    setSelected([]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold">Commandes</h1>
        <p className="text-muted-foreground mt-1">{orders.length} commande(s) au total.</p>
      </div>

      <Card className="shadow-soft border-border/60">
        <CardContent className="p-0">
          <div className="p-4 border-b flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher (ID, client)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les statuts</SelectItem>
                <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                <SelectItem value="CONFIRMEE">Confirmées</SelectItem>
                <SelectItem value="ANNULEE">Annulées</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selected.length > 0 && (
            <div className="px-4 py-2.5 border-b bg-secondary text-secondary-foreground flex items-center gap-3 animate-fade-in">
              <span className="text-sm font-medium">{selected.length} sélectionnée(s)</span>
              <div className="ml-auto flex gap-2">
                <Button
                  size="sm"
                  onClick={bulkConfirm}
                  className="bg-success hover:bg-success/90 text-success-foreground h-8"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Confirmer
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={bulkCancel}
                  className="h-8"
                >
                  <X className="h-3.5 w-3.5 mr-1.5" /> Annuler
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelected([])} className="h-8">
                  Désélectionner
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 w-10">
                    <Checkbox
                      checked={filtered.length > 0 && selected.length === filtered.length}
                      onCheckedChange={toggleAll}
                    />
                  </th>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Articles</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const canConfirm = o.status === "EN_ATTENTE";
                  const canCancel = o.status === "EN_ATTENTE";
                  return (
                    <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30 transition-smooth">
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selected.includes(o.id)}
                          onCheckedChange={() => toggle(o.id)}
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{o.client.nom}</div>
                        <div className="text-xs text-muted-foreground">{o.client.tel}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {o.items.reduce((s, i) => s + i.quantite, 0)} article(s)
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {formatFCFA(o.total)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {formatDate(o.date)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={!canConfirm}
                            onClick={() => {
                              setOrderStatus(o.id, "CONFIRMEE");
                              toast.success("Commande confirmée");
                            }}
                            className="h-8 text-success hover:text-success hover:bg-success/10 disabled:opacity-30"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={!canCancel}
                            onClick={() => {
                              setOrderStatus(o.id, "ANNULEE");
                              toast.success("Commande annulée");
                            }}
                            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-30"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                      Aucune commande.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
