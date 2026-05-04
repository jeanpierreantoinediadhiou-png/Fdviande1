import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-meat.jpg";
import { ArrowRight, Award } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Viande premium artisanale"
          className="h-full w-full object-cover"
          width={1600}
          height={1024}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      <div className="container relative py-24 md:py-36 lg:py-44">
        <div className="max-w-2xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-background/10 backdrop-blur px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent mb-6">
            <Award className="h-3.5 w-3.5" />
            Sélection du boucher
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] text-primary-foreground">
            La viande,
            <br />
            <span className="italic text-gradient-gold">noblement</span> servie.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-primary-foreground/80 leading-relaxed">
            Pièces d'exception sélectionnées chaque matin auprès d'éleveurs de confiance.
            Livrées fraîches, à votre porte.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              size="lg"
              asChild
              className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-elegant px-8 h-12 text-base"
            >
              <a href="#catalogue">
                Découvrir le catalogue
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-secondary h-12 px-8"
            >
              <a href="#histoire">Notre histoire</a>
            </Button>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-8 max-w-md">
            {[
              { n: "12+", l: "Éleveurs partenaires" },
              { n: "24h", l: "Fraîcheur garantie" },
              { n: "4.9★", l: "Avis clients" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-3xl text-accent">{s.n}</div>
                <div className="text-xs uppercase tracking-wider text-primary-foreground/60 mt-1">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
