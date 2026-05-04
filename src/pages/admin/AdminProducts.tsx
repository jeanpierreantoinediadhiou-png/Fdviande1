import { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { categoryLabel, formatFCFA } from "@/lib/format";
import { ProductFormDialog } from "@/components/admin/ProductFormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { Product } from "@/lib/types";

export default function AdminProducts() {
  const { products, deleteProduct } = useShop();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const filtered = products.filter(
    (p) =>
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      categoryLabel(p.type).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Produits</h1>
          <p className="text-muted-foreground mt-1">{products.length} produit(s) au catalogue.</p>
        </div>
        <Button
          onClick={() => setCreating(true)}
          className="bg-primary hover:bg-primary-glow text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" /> Ajouter un produit
        </Button>
      </div>

      <Card className="shadow-soft border-border/60">
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <div className="relative max-w-sm">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Produit</th>
                  <th className="px-4 py-3 font-medium">Catégorie</th>
                  <th className="px-4 py-3 font-medium text-right">Prix</th>
                  <th className="px-4 py-3 font-medium text-right">Stock</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-smooth">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.nom}
                          className="h-10 w-10 rounded object-cover"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <div className="font-medium truncate">{p.nom}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {p.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{categoryLabel(p.type)}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatFCFA(p.prix)}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={
                          p.quantite === 0
                            ? "text-destructive font-medium"
                            : p.quantite < 10
                            ? "text-warning font-medium"
                            : "text-foreground"
                        }
                      >
                        {p.quantite}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditing(p)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setToDelete(p)}
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                      Aucun produit trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ProductFormDialog
        open={creating || !!editing}
        product={editing}
        onOpenChange={(v) => {
          if (!v) {
            setCreating(false);
            setEditing(null);
          }
        }}
      />

      <AlertDialog open={!!toDelete} onOpenChange={(v) => !v && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              "{toDelete?.nom}" sera définitivement retiré du catalogue. Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={() => {
                if (toDelete) {
                  deleteProduct(toDelete.id);
                  toast.success("Produit supprimé");
                  setToDelete(null);
                }
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
