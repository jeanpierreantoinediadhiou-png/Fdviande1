export type ProductCategory = "boeuf" | "poulet" | "mouton" | "agneau" | "hache" | "porc";

export const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "boeuf", label: "Bœuf" },
  { value: "poulet", label: "Poulet" },
  { value: "mouton", label: "Mouton" },
  { value: "agneau", label: "Agneau" },
  { value: "hache", label: "Viande hachée" },
  { value: "porc", label: "Porc" },
];

export interface Product {
  id: string;
  nom: string;
  type: ProductCategory;
  prix: number; // FCFA
  quantite: number; // stock
  image: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantite: number;
}

export type OrderStatus = "EN_ATTENTE" | "CONFIRMEE" | "ANNULEE";

export interface OrderItem {
  produit_id: string;
  nom: string;
  quantite: number;
  prix: number;
}

export interface Client {
  nom: string;
  tel: string;
  adresse: string;
  email?: string;
}

export interface Order {
  id: string;
  client: Client;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string; // ISO
}
