import { useShop } from "@/context/ShopContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ClipboardList, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { formatDate, formatFCFA } from "@/lib/format";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const { products, orders } = useShop();

  const pending = orders.filter((o) => o.status === "EN_ATTENTE");
  const confirmed = orders.filter((o) => o.status === "CONFIRMEE");
  const lowStock = products.filter((p) => p.quantite > 0 && p.quantite < 10).length;
  const outOfStock = products.filter((p) => p.quantite === 0).length;
  const totalRevenue = confirmed.reduce((s, o) => s + o.total, 0);

  const stats = [
    {
      label: "Produits actifs",
      value: products.length,
      icon: Package,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Commandes en attente",
      value: pending.length,
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Commandes confirmées",
      value: confirmed.length,
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "CA confirmé",
      value: formatFCFA(totalRevenue),
      icon: ClipboardList,
      color: "text-secondary-foreground",
      bg: "bg-secondary",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">Aperçu de votre activité aujourd'hui.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-soft border-border/60">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    {s.label}
                  </div>
                  <div className="font-display text-2xl font-bold mt-2">{s.value}</div>
                </div>
                <div className={`h-10 w-10 rounded-md flex items-center justify-center ${s.bg}`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(lowStock > 0 || outOfStock > 0) && (
        <Card className="border-warning/40 bg-warning/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
            <p className="text-sm">
              <span className="font-medium">Alerte stock :</span>{" "}
              {outOfStock > 0 && <>{outOfStock} produit(s) épuisé(s)</>}
              {outOfStock > 0 && lowStock > 0 && " · "}
              {lowStock > 0 && <>{lowStock} produit(s) bientôt en rupture</>}.{" "}
              <Link to="/admin/produits" className="text-primary underline underline-offset-2">
                Gérer
              </Link>
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-soft border-border/60">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="font-display">Activité récente</CardTitle>
          <Link to="/admin/commandes" className="text-sm text-primary hover:underline">
            Voir tout
          </Link>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Aucune commande.</p>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 5).map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-smooth"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="font-mono text-xs text-muted-foreground shrink-0">{o.id}</div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{o.client.nom}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(o.date)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-semibold">{formatFCFA(o.total)}</span>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    EN_ATTENTE: { label: "En attente", cls: "bg-warning/15 text-warning border-warning/30" },
    CONFIRMEE: { label: "Confirmée", cls: "bg-success/15 text-success border-success/30" },
    ANNULEE: { label: "Annulée", cls: "bg-destructive/15 text-destructive border-destructive/30" },
  };
  const m = map[status] ?? { label: status, cls: "" };
  return (
    <Badge variant="outline" className={`${m.cls} font-medium`}>
      {m.label}
    </Badge>
  );
}
