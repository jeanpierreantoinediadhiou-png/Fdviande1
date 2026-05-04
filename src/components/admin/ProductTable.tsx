import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { deleteProduct } from "@/store/slices/productsSlice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/format";

interface ProductTableProps {
  onEdit: (product: any) => void;
  searchQuery: string;
}

export const ProductTable = ({ onEdit, searchQuery }: ProductTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, status } = useSelector((state: RootState) => state.products);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProducts = products.filter(p => 
    p.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categorie.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async () => {
    if (deleteId !== null) {
      await dispatch(deleteProduct(String(deleteId)));
      toast.success("Produit supprimé");
      setDeleteId(null);
    }
  };

  if (status === 'loading') {
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
              <TableHead>Image</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Aucun produit trouvé.
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img src={product.image} alt={product.nom} className="h-10 w-10 rounded-full object-cover border" />
                  </TableCell>
                  <TableCell className="font-medium">{product.nom}</TableCell>
                  <TableCell>{product.categorie}</TableCell>
                  <TableCell>{formatPrice(product.prix)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className={product.stock < 5 ? "text-red-500 font-bold" : ""}>
                        {product.stock}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => onEdit(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => setDeleteId(product.id)}>
                        <Trash2 className="h-4 w-4" />
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

      <ConfirmDialog 
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer le produit ?"
        description="Cette action est irréversible. Le produit sera définitively supprimé de votre inventaire."
      />
    </div>
  );
};
