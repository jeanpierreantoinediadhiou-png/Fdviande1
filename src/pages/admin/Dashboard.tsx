import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Users, TrendingUp, Package } from "lucide-react";
import { formatPrice } from "@/lib/format";

export default function Dashboard() {
  const { items: products } = useSelector((state: RootState) => state.products);
  const { items: orders } = useSelector((state: RootState) => state.orders);

  const confirmedRevenue = orders.filter(o => o.statut === 'CONFIRMEE').reduce((acc, o) => acc + o.total, 0);
  
  const stats = [
    { title: "Commandes", value: orders.length, icon: ShoppingBag, color: "text-blue-600" },
    { title: "Produits", value: products.length, icon: Package, color: "text-orange-600" },
    { 
      title: "Revenu (Confirmé)", 
      value: formatPrice(confirmedRevenue), 
      icon: TrendingUp, 
      color: "text-green-600" 
    },
    { title: "Clients", value: "12", icon: Users, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue sur votre interface de gestion.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dernières Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{order.client}</p>
                    <p className="text-xs text-muted-foreground">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatPrice(order.total)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>État du Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <img src={product.image} className="h-8 w-8 rounded-full object-cover" />
                    <p className="text-sm font-medium">{product.nom}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${product.stock < 5 ? 'text-red-500' : 'text-green-500'}`}>
                      {product.stock} en stock
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
