import { Beef } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded bg-gradient-primary flex items-center justify-center">
            <Beef className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold">Viande TP</span>
          <span className="text-xs text-muted-foreground">— Boucherie artisanale</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Viande TP. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
