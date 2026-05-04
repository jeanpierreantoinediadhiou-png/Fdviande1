import { Beef, Leaf, Truck } from "lucide-react";

export function Story() {
  const features = [
    {
      icon: Leaf,
      title: "Élevage responsable",
      desc: "Partenaires sélectionnés pour leurs pratiques durables et le bien-être animal.",
    },
    {
      icon: Beef,
      title: "Découpe artisanale",
      desc: "Chaque pièce est préparée à la main par nos bouchers experts.",
    },
    {
      icon: Truck,
      title: "Livraison fraîche",
      desc: "Chaîne du froid maîtrisée, livré chez vous en moins de 24h.",
    },
  ];

  return (
    <section id="histoire" className="bg-secondary text-secondary-foreground py-20 md:py-28">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">
              Notre histoire
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 leading-tight">
              Trois générations <br />
              <span className="italic text-accent">d'amour</span> pour la viande.
            </h2>
            <p className="mt-6 text-secondary-foreground/70 leading-relaxed">
              Depuis 1962, la maison Viande TP perpétue un savoir-faire transmis de père en fils.
              Nous croyons qu'une grande viande commence par un grand élevage — et se termine
              dans le respect du produit.
            </p>
          </div>

          <div className="grid sm:grid-cols-1 gap-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="flex gap-5 p-6 rounded-lg bg-secondary-foreground/5 border border-secondary-foreground/10 hover:border-accent/40 transition-smooth"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="h-12 w-12 shrink-0 rounded-md bg-accent/15 flex items-center justify-center">
                  <f.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                  <p className="text-sm text-secondary-foreground/60 mt-1 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
