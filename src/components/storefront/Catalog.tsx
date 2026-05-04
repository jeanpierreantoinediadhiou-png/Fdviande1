import { useMemo, useState } from "react";
import { useShop } from "@/context/ShopContext";
import { ProductCard } from "./ProductCard";
import { CATEGORIES, type ProductCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Catalog() {
  const { products } = useShop();
  const [filter, setFilter] = useState<"all" | ProductCategory>("all");

  const filtered = useMemo(
    () => (filter === "all" ? products : products.filter((p) => p.type === filter)),
    [products, filter]
  );

  return (
    <section id="catalogue" className="container py-20 md:py-28">
      <div className="flex flex-col items-center text-center mb-12">
        <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-4">
          Notre sélection
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-bold max-w-2xl">
          Des pièces choisies, <span className="italic text-primary">une à une</span>.
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Chaque morceau est sélectionné pour sa fraîcheur, sa traçabilité et son goût.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          Tous
        </FilterChip>
        {CATEGORIES.map((c) => (
          <FilterChip
            key={c.value}
            active={filter === c.value}
            onClick={() => setFilter(c.value)}
          >
            {c.label}
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          Aucun produit dans cette catégorie.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-5 py-2 rounded-full text-sm font-medium transition-smooth border",
        active
          ? "bg-secondary text-secondary-foreground border-secondary shadow-soft"
          : "bg-transparent border-border text-foreground/70 hover:border-foreground/40 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
