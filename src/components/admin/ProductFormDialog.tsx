import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, type Product, type ProductCategory } from "@/lib/types";
import { useShop } from "@/context/ShopContext";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: Product | null;
}

const empty = {
  nom: "",
  type: "boeuf" as ProductCategory,
  prix: 0,
  quantite: 0,
  image: "",
  description: "",
};

export function ProductFormDialog({ open, onOpenChange, product }: Props) {
  const { addProduct, updateProduct } = useShop();
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (product) {
      setForm({
        nom: product.nom,
        type: product.type,
        prix: product.prix,
        quantite: product.quantite,
        image: product.image,
        description: product.description,
      });
    } else {
      setForm(empty);
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom.trim() || form.prix <= 0) {
      toast.error("Nom et prix valides requis");
      return;
    }
    const payload = {
      ...form,
      nom: form.nom.trim().slice(0, 100),
      description: form.description.trim().slice(0, 500),
      image: form.image.trim() || "/placeholder.svg",
      prix: Number(form.prix),
      quantite: Math.max(0, Math.floor(Number(form.quantite))),
    };
    if (product) {
      updateProduct(product.id, payload);
      toast.success("Produit mis à jour");
    } else {
      addProduct(payload);
      toast.success("Produit ajouté");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {product ? "Modifier le produit" : "Nouveau produit"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nom">Nom</Label>
            <Input
              id="nom"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              maxLength={100}
              className="mt-1.5"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Catégorie</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm({ ...form, type: v as ProductCategory })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="prix">Prix (FCFA)</Label>
              <Input
                id="prix"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                min={1}
                step={1}
                value={form.prix}
                onChange={(e) => setForm({ ...form, prix: Number(e.target.value) })}
                className="mt-1.5"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantite">Stock</Label>
              <Input
                id="quantite"
                type="number"
                min={0}
                value={form.quantite}
                onChange={(e) => setForm({ ...form, quantite: Number(e.target.value) })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="image">URL de l'image</Label>
              <Input
                id="image"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="/placeholder.svg"
                className="mt-1.5"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              maxLength={500}
              className="mt-1.5"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-glow text-primary-foreground">
              {product ? "Enregistrer" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
