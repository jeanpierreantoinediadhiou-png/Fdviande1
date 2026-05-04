import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Beef, User } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onCartOpen: () => void;
}

export function Navbar({ onCartOpen }: NavbarProps) {
  const { cartCount } = useShop();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-primary shadow-soft transition-spring group-hover:scale-105">
            <Beef className="h-5 w-5 text-primary-foreground" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl font-bold tracking-tight">Viande TP</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Boucherie artisanale
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#catalogue" className="text-foreground/80 hover:text-primary transition-smooth">
            Catalogue
          </a>
          <a href="#histoire" className="text-foreground/80 hover:text-primary transition-smooth">
            Notre histoire
          </a>
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className={`text-foreground/80 hover:text-primary transition-smooth ${
                pathname.startsWith("/admin") ? "text-primary" : ""
              }`}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2 mr-2">
              <span className="text-xs hidden lg:inline text-muted-foreground">Bonjour, {user.nom}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.reload();
                }}
              >
                Déconnexion
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/auth')}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Connexion</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onCartOpen}
            className="relative gap-2 border-foreground/20 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-smooth"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Panier</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-[11px] font-bold px-1 animate-scale-in">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
