import type { Product, Order } from "./types";
import boeuf from "@/assets/prod-boeuf.jpg";
import poulet from "@/assets/prod-poulet.jpg";
import mouton from "@/assets/prod-mouton.jpg";
import agneau from "@/assets/prod-agneau.jpg";
import hache from "@/assets/prod-hache.jpg";
import porc from "@/assets/prod-porc.jpg";

export const SEED_PRODUCTS: Product[] = [
  {
    id: "p1",
    nom: "Entrecôte de bœuf",
    type: "boeuf",
    prix: 6500,
    quantite: 24,
    image: boeuf,
    description: "Pièce noble persillée, tendre et savoureuse. Idéale grillée.",
  },
  {
    id: "p2",
    nom: "Poulet fermier entier",
    type: "poulet",
    prix: 3500,
    quantite: 40,
    image: poulet,
    description: "Élevé en plein air, chair ferme et goût authentique.",
  },
  {
    id: "p3",
    nom: "Côtelettes de mouton",
    type: "mouton",
    prix: 5800,
    quantite: 18,
    image: mouton,
    description: "Côtelettes parfumées au thym, parfaites pour le barbecue.",
  },
  {
    id: "p4",
    nom: "Gigot d'agneau",
    type: "agneau",
    prix: 7200,
    quantite: 12,
    image: agneau,
    description: "Gigot tendre à rôtir, viande rosée et délicate.",
  },
  {
    id: "p5",
    nom: "Viande hachée pur bœuf",
    type: "hache",
    prix: 4200,
    quantite: 30,
    image: hache,
    description: "Hachée du jour, 15% de matière grasse. Burgers & boulettes.",
  },
  {
    id: "p6",
    nom: "Viande de porc",
    type: "porc",
    prix: 4500,
    quantite: 20,
    image: porc,
    description: "Viande de porc fraîche, tendre et savoureuse. Idéale rôtie ou grillée.",
  },
];

export const SEED_ORDERS: Order[] = [
  {
    id: "CMD-1042",
    client: { nom: "Mariam Diallo", tel: "+225 07 11 22 33 44", adresse: "Cocody, Abidjan" },
    items: [
      { produit_id: "p1", nom: "Entrecôte de bœuf", quantite: 2, prix: 6500 },
      { produit_id: "p5", nom: "Viande hachée pur bœuf", quantite: 1, prix: 4200 },
    ],
    total: 17200,
    status: "EN_ATTENTE",
    date: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: "CMD-1041",
    client: { nom: "Ibrahim Touré", tel: "+225 05 99 88 77 66", adresse: "Yopougon, Abidjan" },
    items: [{ produit_id: "p2", nom: "Poulet fermier entier", quantite: 3, prix: 3500 }],
    total: 10500,
    status: "CONFIRMEE",
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "CMD-1040",
    client: { nom: "Awa Koffi", tel: "+225 01 22 33 44 55", adresse: "Plateau, Abidjan" },
    items: [{ produit_id: "p4", nom: "Gigot d'agneau", quantite: 1, prix: 7200 }],
    total: 7200,
    status: "ANNULEE",
    date: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
];
