import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useShop } from "@/context/ShopContext";
import { formatDate, formatPrice, categoryLabel } from "@/lib/format";
import { getProductById, getProducts, postReview } from "@/lib/api";
import type { ProductDetail } from "@/lib/types";
import { Heart, Star, ShoppingCart, Truck, ArrowLeft, MapPin, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";

const stars = [1, 2, 3, 4, 5];

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useShop();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [similar, setSimilar] = useState<ProductDetail[]>([]);
  const [status, setStatus] = useState<"loading" | "idle" | "error">("loading");
  const [error, setError] = useState<string>("");
  const [activeImage, setActiveImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setStatus("loading");
      setError("");
      if (!id) {
        setError("Produit introuvable.");
        setStatus("error");
        return;
      }

      const result = await getProductById(id);
      if (!result.success || !result.data) {
        setError(result.error || "Impossible de charger le produit.");
        setStatus("error");
        return;
      }

      setProduct(result.data);
      setActiveImage(result.data.images[0] ?? result.data.image ?? "");

      const listResult = await getProducts();
      if (listResult.success && listResult.data) {
        setSimilar(
          listResult.data
            .filter((item) => item.id.toString() !== id && item.category === result.data.category)
            .slice(0, 4),
        );
      }

      setStatus("idle");
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      document.title = `${product.nom} • Viande TP`;
    } else {
      document.title = "Produit • Viande TP";
    }
  }, [product]);

  const availability = useMemo(() => {
    if (!product) return "Indisponible";
    return product.stock > 0 ? "En stock" : "Rupture";
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock <= 0) {
      toast.error("Produit en rupture de stock.");
      return;
    }

    addToCart(
      {
        id: product.id.toString(),
        nom: product.nom,
        type: (product.category || product.type || "boeuf") as any,
        prix: product.prix,
        quantite: product.stock,
        image: product.images[0] || product.image,
        description: product.description,
      },
      quantity,
    );

    toast.success(`${product.nom} ajouté au panier`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    toast.success("Produit ajouté au panier. Passez à la caisse pour finaliser votre commande.");
  };

  const handleReviewSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!product) return;

    if (!reviewName.trim() || !reviewComment.trim()) {
      toast.error("Votre nom et commentaire sont requis.");
      return;
    }

    setReviewSubmitting(true);
    const result = await postReview(product.id, reviewName.trim(), reviewRating, reviewComment.trim());
    setReviewSubmitting(false);

    if (!result.success || !result.data) {
      toast.error(result.error || "Impossible d'ajouter l'avis.");
      return;
    }

    setProduct((prev) =>
      prev
        ? {
            ...prev,
            rating: result.data.rating,
            reviews: result.data.reviews,
          }
        : prev,
    );
    setReviewName("");
    setReviewRating(5);
    setReviewComment("");
    toast.success("Merci, votre avis a été ajouté.");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container space-y-8">
          <div className="h-6 w-48 rounded-full bg-secondary/40 animate-pulse" />
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="space-y-4">
              <div className="h-[520px] rounded-[2rem] bg-secondary/30 animate-pulse" />
              <div className="grid gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-28 rounded-3xl bg-secondary/30 animate-pulse" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 w-32 rounded-full bg-secondary/30 animate-pulse" />
              <div className="h-12 rounded-3xl bg-secondary/30 animate-pulse" />
              <div className="h-72 rounded-3xl bg-secondary/30 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-background py-24">
        <div className="container text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Produit non trouvé</p>
          <h1 className="mt-4 text-4xl font-bold">Oups, impossible de trouver ce produit.</h1>
          <p className="mt-4 text-muted-foreground">{error || "Le produit n'existe pas ou a été supprimé."}</p>
          <Button variant="secondary" className="mt-8" onClick={() => navigate(-1)}>
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Retour au catalogue
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">Boucherie artisanale • Viande TP</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={product?.stock > 0 ? "secondary" : "destructive"}>{availability}</Badge>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs uppercase tracking-[0.25em] text-secondary-foreground">
              {product?.origin}
            </span>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.45fr_0.95fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-secondary-foreground/10 bg-card p-4 shadow-card">
              <div className="relative overflow-hidden rounded-[1.75rem] bg-muted">
                <img
                  src={activeImage || product?.images[0] || product?.image}
                  alt={product?.nom}
                  className="h-[520px] w-full object-cover transition-all duration-500"
                />
                <button
                  type="button"
                  onClick={() => window.open(activeImage || product?.images[0] || product?.image, "_blank")}
                  className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-sm font-medium text-foreground shadow-soft transition hover:bg-background"
                >
                  Agrandir
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {(product?.images ?? []).slice(0, 3).map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`overflow-hidden rounded-[1.5rem] border transition ${
                    activeImage === image ? "border-primary" : "border-secondary-foreground/10"
                  }`}
                >
                  <img src={image} alt={`Miniature ${index + 1}`} className="h-28 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-secondary-foreground/10 bg-card p-8 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.35em] text-accent">Produit</p>
                  <h1 className="font-display text-4xl font-bold leading-tight">{product?.nom}</h1>
                </div>
                {product?.oldPrice && product.oldPrice > product.prix ? (
                  <Badge variant="destructive">-{Math.round(((product.oldPrice - product.prix) / product.oldPrice) * 100)}%</Badge>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div>
                  <div className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Prix</div>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-primary">{formatPrice(product?.prix ?? 0)}</span>
                    {product?.oldPrice && product.oldPrice > product.prix ? (
                      <span className="text-sm text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
                    ) : null}
                  </div>
                </div>
                <div className="rounded-3xl bg-secondary px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Star className="h-4 w-4 text-yellow-400" /> {product?.rating.toFixed(1) ?? "0.0"}
                  </div>
                  <p className="text-xs text-muted-foreground">{product?.reviews.length ?? 0} avis</p>
                </div>
              </div>

              <div className="grid gap-3 border-y border-secondary-foreground/10 py-6">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-3xl bg-secondary px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Origine</p>
                    <p className="font-semibold">{product?.origin}</p>
                  </div>
                  <div className="rounded-3xl bg-secondary px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Catégorie</p>
                    <p className="font-semibold">{categoryLabel(product?.category ?? product?.type ?? "boeuf")}</p>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-3xl bg-secondary px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Poids</p>
                    <p className="font-semibold">{product?.weight}</p>
                  </div>
                  <div className="rounded-3xl bg-secondary px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Fraîcheur</p>
                    <p className="font-semibold">{product?.freshness}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid gap-2 sm:grid-cols-[1fr_auto] items-center">
                  <label className="text-sm font-medium text-muted-foreground">Quantité</label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
                    >
                      -
                    </Button>
                    <span className="min-w-[3rem] text-center font-semibold">{quantity}</span>
                    <Button type="button" variant="secondary" onClick={() => setQuantity((qty) => qty + 1)}>
                      +
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button className="flex-1" onClick={handleAddToCart}>
                    <ShoppingCart className="h-4 w-4" /> Ajouter au panier
                  </Button>
                  <Button variant="secondary" className="flex-1" onClick={handleBuyNow}>
                    Acheter maintenant
                  </Button>
                </div>
                <Button variant="ghost" className="w-full justify-center gap-2">
                  <Heart className="h-4 w-4" /> Ajouter aux favoris
                </Button>
              </div>

              <div className="grid gap-3 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" /> Livraison froide en moins de 24h
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Traçabilité et élevage local
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Conservation {product?.storage}
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.8fr_1fr]">
          <div className="space-y-8">
            <section className="rounded-[2rem] border border-secondary-foreground/10 bg-card p-8 shadow-card">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-accent">Description</p>
                  <h2 className="mt-3 text-3xl font-bold">Détails du produit</h2>
                </div>
                <span className="text-sm text-muted-foreground">Mis à jour le {formatDate(product?.createdAt ?? new Date().toISOString())}</span>
              </div>
              <p className="mt-6 text-muted-foreground leading-relaxed">{product?.description}</p>
            </section>

            <section className="rounded-[2rem] border border-secondary-foreground/10 bg-card p-8 shadow-card">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-accent">Avis clients</p>
                  <h2 className="mt-3 text-3xl font-bold">Note moyenne</h2>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-foreground">
                  <Star className="h-4 w-4 text-yellow-400" /> {product?.rating.toFixed(1)} • {product?.reviews.length} avis
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {product?.reviews.length ? (
                  product.reviews.slice(0, 4).map((review) => (
                    <div key={review.id} className="rounded-3xl border border-secondary-foreground/10 bg-secondary p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold">{review.author}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(review.date)}</p>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400">
                          {stars.map((star) => (
                            <Star key={star} className={star <= review.rating ? "h-4 w-4" : "h-4 w-4 text-secondary-foreground"} />
                          ))}
                        </div>
                      </div>
                      <p className="mt-4 text-muted-foreground">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">Pas encore d'avis pour ce produit.</p>
                )}
              </div>

              <form onSubmit={handleReviewSubmit} className="mt-10 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-2 text-sm">
                    <span>Nom</span>
                    <input
                      value={reviewName}
                      onChange={(event) => setReviewName(event.target.value)}
                      className="w-full rounded-3xl border border-secondary-foreground/10 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                      placeholder="Votre nom"
                    />
                  </label>
                  <label className="block space-y-2 text-sm">
                    <span>Note</span>
                    <div className="flex items-center gap-1">
                      {stars.map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setReviewRating(value)}
                          className={`rounded-full p-2 transition ${
                            value <= reviewRating ? "bg-yellow-400 text-white" : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          <Star className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  </label>
                </div>

                <label className="block space-y-2 text-sm">
                  <span>Commentaire</span>
                  <textarea
                    value={reviewComment}
                    onChange={(event) => setReviewComment(event.target.value)}
                    rows={5}
                    className="w-full resize-none rounded-3xl border border-secondary-foreground/10 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="Racontez votre expérience..."
                  />
                </label>

                <Button type="submit" disabled={reviewSubmitting}>
                  {reviewSubmitting ? "Envoi..." : "Envoyer l'avis"}
                </Button>
              </form>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-secondary-foreground/10 bg-card p-6 shadow-card">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-accent">Similaires</p>
                  <h2 className="text-2xl font-semibold">Produits complémentaires</h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {similar.length ? (
                  similar.map((item) => (
                    <Link
                      to={`/product/${item.id}`}
                      key={item.id}
                      className="group block overflow-hidden rounded-3xl border border-secondary-foreground/10 bg-secondary p-4 transition hover:border-primary"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.nom}
                          className="h-20 w-20 rounded-3xl object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{item.nom}</p>
                          <p className="text-sm text-muted-foreground">{formatPrice(item.prix)}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-muted-foreground">Aucun produit similaire disponible pour le moment.</p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
