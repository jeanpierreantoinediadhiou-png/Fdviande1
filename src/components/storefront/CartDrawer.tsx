import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useShop } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { formatFCFA } from "@/lib/format";
import { CheckoutDialog } from "./CheckoutDialog";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { cart, updateCartQty, removeFromCart, cartTotal } = useShop();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-background">
          <SheetHeader className="px-6 py-5 border-b">
            <SheetTitle className="font-display text-2xl flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Votre panier
            </SheetTitle>
          </SheetHeader>

          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingBag className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-medium">Votre panier est vide</p>
              <p className="text-sm text-muted-foreground mt-1">
                Parcourez le catalogue pour ajouter des produits.
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cart.map(({ product, quantite }) => (
                  <div key={product.id} className="flex gap-4 pb-4 border-b border-border/60 last:border-0">
                    <img
                      src={product.image}
                      alt={product.nom}
                      className="h-20 w-20 rounded-md object-cover"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium leading-tight truncate">{product.nom}</h4>
                      <div className="text-sm text-primary font-semibold mt-0.5">
                        {formatFCFA(product.prix)}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateCartQty(product.id, quantite - 1)}
                          className="h-7 w-7 rounded border border-border flex items-center justify-center hover:bg-muted transition-smooth"
                          aria-label="Diminuer"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{quantite}</span>
                        <button
                          onClick={() => updateCartQty(product.id, quantite + 1)}
                          className="h-7 w-7 rounded border border-border flex items-center justify-center hover:bg-muted transition-smooth"
                          aria-label="Augmenter"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="ml-auto h-7 w-7 rounded text-muted-foreground hover:text-destructive flex items-center justify-center transition-smooth"
                          aria-label="Retirer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t bg-muted/30 px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase tracking-wider text-muted-foreground">
                    Total
                  </span>
                  <span className="font-display text-2xl font-bold text-primary">
                    {formatFCFA(cartTotal)}
                  </span>
                </div>
                <Button
                  className="w-full h-12 bg-primary hover:bg-primary-glow text-primary-foreground shadow-elegant"
                  onClick={() => setCheckoutOpen(true)}
                >
                  Passer commande
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        onSuccess={() => {
          setCheckoutOpen(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}
