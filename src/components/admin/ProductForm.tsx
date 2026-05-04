import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export const ProductForm = ({ isOpen, onClose, onSubmit, initialData }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    nom: "",
    prix: "",
    categorie: "",
    stock: "",
    image: "",
    description: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ nom: "", prix: "", categorie: "", stock: "", image: "", description: "" });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nom = formData.nom.toString().trim();
    const prix = parseFloat(formData.prix.toString());
    const stock = parseInt(formData.stock.toString());

    if (!nom) {
      toast.error("Le nom du produit est requis.");
      return;
    }
    if (isNaN(prix) || prix <= 0) {
      toast.error("Le prix doit être un nombre positif.");
      return;
    }
    if (isNaN(stock) || stock < 0) {
      toast.error("Le stock ne peut pas être négatif.");
      return;
    }

    onSubmit({
      ...formData,
      nom,
      prix,
      stock,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Modifier le produit" : "Ajouter un produit"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nom">Nom du produit</Label>
            <Input id="nom" name="nom" value={formData.nom} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="prix">Prix (FCFA)</Label>
              <Input
                id="prix"
                name="prix"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                min="1"
                step="1"
                value={formData.prix}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                min="0"
                step="1"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="categorie">Catégorie</Label>
            <Input id="categorie" name="categorie" value={formData.categorie} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">URL de l'image</Label>
            <Input id="image" name="image" value={formData.image} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit">{initialData ? "Mettre à jour" : "Créer"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
