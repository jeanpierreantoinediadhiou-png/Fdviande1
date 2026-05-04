import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchProducts, addProduct, updateProduct } from "@/store/slices/productsSlice";
import { ProductTable } from "@/components/admin/ProductTable";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

export default function Products() {
  const dispatch = useDispatch<AppDispatch>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct.id, ...data })).unwrap();
        toast.success("Produit mis à jour");
      } else {
        await dispatch(addProduct(data)).unwrap();
        toast.success("Produit ajouté");
      }
      setIsFormOpen(false);
    } catch (err) {
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
          <p className="text-muted-foreground">Gérez votre catalogue de viandes.</p>
        </div>
        <Button onClick={handleAddProduct} className="gap-2">
          <Plus className="h-4 w-4" /> Ajouter un produit
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white dark:bg-zinc-950 p-4 rounded-lg border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Rechercher un produit..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ProductTable onEdit={handleEditProduct} searchQuery={searchQuery} />

      <ProductForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingProduct}
      />
    </div>
  );
}
