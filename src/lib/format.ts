export const formatPrice = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n) + " FCFA";

export const formatFCFA = formatPrice;

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const categoryLabel = (t: string) =>
  ({
    boeuf: "Bœuf",
    poulet: "Poulet",
    mouton: "Mouton",
    agneau: "Agneau",
    hache: "Viande hachée",
    saucisse: "Saucisses",
  } as Record<string, string>)[t] ?? t;
