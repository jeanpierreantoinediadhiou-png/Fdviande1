import { Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useShop } from "@/context/ShopContext";
import { categoryLabel, formatPrice } from "@/lib/format";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useShop();
  const outOfStock = product.quantite <= 0;

  return (
    <article className="group relative overflow-hidden rounded-lg bg-card shadow-card transition-spring hover:shadow-elegant hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.nom}
          loading="lazy"
          width={768}
          height={768}
          className="h-full w-full object-cover transition-spring group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground">
          {categoryLabel(product.type)}
        </div>
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary/70">
            <span className="rounded-md bg-destructive px-3 py-1 text-xs font-semibold uppercase tracking-wider text-destructive-foreground">
              Épuisé
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display text-xl font-semibold leading-tight">{product.nom}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Prix / kg</div>
            <div className="font-display text-2xl font-bold text-primary">
              {formatPrice(product.prix)}
            </div>
          </div>
          <Button
            size="icon"
            disabled={outOfStock}
            onClick={() => {
              addToCart(product);
              toast.success(`${product.nom} ajouté au panier`);
            }}
            className="h-11 w-11 rounded-full bg-secondary hover:bg-primary text-secondary-foreground transition-smooth shadow-soft"
            aria-label={`Ajouter ${product.nom} au panier`}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </article>
  );
}
