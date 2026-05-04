import { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useShop } from "@/context/ShopContext";
import { formatFCFA } from "@/lib/format";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

const schema = z.object({
  nom: z.string().trim().min(2, "Nom requis").max(100),
  tel: z.string().trim().min(6, "Téléphone requis").max(30),
  adresse: z.string().trim().min(5, "Adresse requise").max(300),
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: () => void;
}

export function CheckoutDialog({ open, onOpenChange, onSuccess }: Props) {
  const { cartTotal, placeOrder, cart } = useShop();
  const [form, setForm] = useState({ nom: "", tel: "", adresse: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: typeof errors = {};
      parsed.error.issues.forEach((i) => {
        errs[i.path[0] as keyof typeof form] = i.message;
      });
      setErrors(errs);
      return;
    }
    if (cart.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }
    const order = placeOrder({ nom: parsed.data.nom, tel: parsed.data.tel, adresse: parsed.data.adresse });
    setConfirmed(order.id);
    toast.success("Commande passée avec succès !");
    setTimeout(() => {
      setConfirmed(null);
      setForm({ nom: "", tel: "", adresse: "" });
      onSuccess();
    }, 2200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {confirmed ? (
          <div className="py-6 text-center animate-scale-in">
            <div className="mx-auto h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h3 className="font-display text-2xl font-bold">Merci !</h3>
            <p className="text-muted-foreground mt-2">
              Votre commande <span className="font-semibold text-foreground">{confirmed}</span> a
              bien été enregistrée.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Informations de livraison</DialogTitle>
              <DialogDescription>
                Total à payer à la livraison :{" "}
                <span className="font-semibold text-primary">{formatFCFA(cartTotal)}</span>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <Label htmlFor="nom">Nom complet</Label>
                <Input
                  id="nom"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  maxLength={100}
                  placeholder="Mariam Diallo"
                  className="mt-1.5"
                />
                {errors.nom && <p className="text-xs text-destructive mt-1">{errors.nom}</p>}
              </div>
              <div>
                <Label htmlFor="tel">Téléphone</Label>
                <Input
                  id="tel"
                  value={form.tel}
                  onChange={(e) => setForm({ ...form, tel: e.target.value })}
                  maxLength={30}
                  placeholder="+225 07 00 00 00 00"
                  className="mt-1.5"
                />
                {errors.tel && <p className="text-xs text-destructive mt-1">{errors.tel}</p>}
              </div>
              <div>
                <Label htmlFor="adresse">Adresse de livraison</Label>
                <Textarea
                  id="adresse"
                  value={form.adresse}
                  onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                  maxLength={300}
                  placeholder="Quartier, ville, point de repère"
                  className="mt-1.5"
                  rows={3}
                />
                {errors.adresse && (
                  <p className="text-xs text-destructive mt-1">{errors.adresse}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary-glow text-primary-foreground"
              >
                Confirmer la commande
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
