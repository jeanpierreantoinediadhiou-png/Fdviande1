const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// =============== MIDDLEWARES ===============
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://192.168.1.152:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(express.json());

// =============== LOGS ===============
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method.toUpperCase();
  const path = req.path;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`\n[${timestamp}] ${method} ${path}`);
  console.log(`   🔗 IP: ${ip}`);
  
  // Log du body pour les POST/PUT
  if ((method === 'POST' || method === 'PUT') && Object.keys(req.body).length > 0) {
    console.log(`   📦 Body:`, JSON.stringify(req.body, null, 2));
  }
  
  // Intercepter la réponse
  const originalJson = res.json;
  res.json = function(data) {
    console.log(`   ✅ Response (${res.statusCode}):`, JSON.stringify(data, null, 2));
    return originalJson.call(this, data);
  };
  
  next();
});

// =============== ROUTES DE DIAGNOSTIC ===============
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Connexion au backend établie avec succès !',
    backend_url: `http://localhost:${PORT}`,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    healthy: true,
    port: PORT,
    uptime: process.uptime()
  });
});

// Simulation d'une base de données
const users = [
  { 
    email: 'jeanpierreantoinediadhiou@gmail.com', 
    password: 'antoine256', 
    role: 'admin', 
    nom: 'Antoine Diadhiou' 
  }
];

const computeRating = (product) => {
  if (!Array.isArray(product.reviews) || product.reviews.length === 0) {
    product.rating = 0;
    return;
  }
  const total = product.reviews.reduce((sum, review) => sum + review.rating, 0);
  product.rating = Number((total / product.reviews.length).toFixed(1));
};

let products = [
  {
    id: "p1",
    nom: "Côte de Bœuf",
    prix: 12500,
    oldPrice: 16000,
    description: "Côte de bœuf maturée, tendre et savoureuse, idéale pour un barbecue de qualité.",
    images: [
      "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=1200",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200",
      "https://images.unsplash.com/photo-1542831371-d531d36971e6?w=1200",
    ],
    image: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=1200",
    category: "boeuf",
    type: "boeuf",
    quantite: 15,
    stock: 15,
    origin: "Sénégal",
    weight: "1.2 kg",
    freshness: "Abattu il y a 2 jours",
    storage: "Réfrigération 0-4°C",
    createdAt: "2026-04-28T10:00:00Z",
    reviews: [
      { id: 101, author: "Fatou", rating: 5, comment: "Viande délicieuse et parfaitement fraîche.", date: "2026-04-28T09:20:00Z" },
      { id: 102, author: "Moussa", rating: 4, comment: "Super tendreté, je recommande.", date: "2026-04-25T16:35:00Z" },
    ],
    categorie: "Boeuf",
  },
  {
    id: "p2",
    nom: "Poulet Fermier",
    prix: 5000,
    oldPrice: 6500,
    description: "Poulet fermier élevé en plein air, goût authentique et chair juteuse.",
    images: [
      "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=1200",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200",
      "https://images.unsplash.com/photo-1604908177522-f2563398d1bd?w=1200",
    ],
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=1200",
    category: "poulet",
    type: "poulet",
    quantite: 20,
    stock: 20,
    origin: "Sénégal",
    weight: "1.6 kg",
    freshness: "Abattu il y a 1 jour",
    storage: "Réfrigération 0-4°C",
    createdAt: "2026-04-30T08:00:00Z",
    reviews: [
      { id: 201, author: "Aïcha", rating: 5, comment: "Parfait pour la famille, la cuisson est toujours réussie.", date: "2026-05-01T11:05:00Z" },
    ],
    categorie: "Volaille",
  },
  {
    id: "p3",
    nom: "Saucisses de Porc",
    prix: 3500,
    oldPrice: 0,
    description: "Saucisses artisanales de porc, fines et savoureuses, préparées avec soin.",
    images: [
      "https://images.unsplash.com/photo-1518977676601-b53f82baa6f8?w=1200",
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=1200",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200",
    ],
    image: "https://images.unsplash.com/photo-1518977676601-b53f82baa6f8?w=1200",
    category: "porc",
    type: "porc",
    quantite: 10,
    stock: 10,
    origin: "Sénégal",
    weight: "0.8 kg",
    freshness: "Abattu il y a 3 jours",
    storage: "Réfrigération 0-4°C",
    createdAt: "2026-04-27T13:00:00Z",
    reviews: [
      { id: 301, author: "Khadim", rating: 4, comment: "Idéal pour un repas convivial, très bon rapport qualité/prix.", date: "2026-04-28T19:20:00Z" },
    ],
    categorie: "Porc",
  },
  {
    id: "p4",
    nom: "Filet Mignon",
    prix: 18000,
    oldPrice: 22000,
    description: "Filet mignon de bœuf, texture fondante et goût raffiné.",
    images: [
      "https://images.unsplash.com/photo-1558030006-450675393462?w=1200",
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=1200",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200",
    ],
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=1200",
    category: "boeuf",
    type: "boeuf",
    quantite: 8,
    stock: 8,
    origin: "Sénégal",
    weight: "0.9 kg",
    freshness: "Abattu il y a 2 jours",
    storage: "Réfrigération 0-4°C",
    createdAt: "2026-04-29T10:00:00Z",
    reviews: [
      { id: 401, author: "Marie", rating: 5, comment: "Un incontournable pour les grandes occasions.", date: "2026-05-02T14:50:00Z" },
    ],
    categorie: "Boeuf",
  },
  {
    id: "p5",
    nom: "Gigot d'Agneau",
    prix: 15000,
    oldPrice: 17500,
    description: "Gigot d'agneau tendre, élevé localement et préparé pour une cuisson maîtrisée.",
    images: [
      "https://images.unsplash.com/photo-1625944525533-473f1e635245?w=1200",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200",
      "https://images.unsplash.com/photo-1600185364398-847acc2af2f5?w=1200",
    ],
    image: "https://images.unsplash.com/photo-1625944525533-473f1e635245?w=1200",
    category: "agneau",
    type: "agneau",
    quantite: 12,
    stock: 12,
    origin: "Sénégal",
    weight: "1.4 kg",
    freshness: "Abattu il y a 4 jours",
    storage: "Réfrigération 0-4°C",
    createdAt: "2026-04-24T09:00:00Z",
    reviews: [
      { id: 501, author: "Abdou", rating: 5, comment: "Une viande très savoureuse et bien conditionnée.", date: "2026-04-26T12:30:00Z" },
    ],
    categorie: "Agneau",
  },
  {
    id: "p6",
    nom: "Viande Hachée",
    prix: 4000,
    oldPrice: 5500,
    description: "Viande hachée 80% maigre, parfaite pour burgers, boulettes et kebabs.",
    images: [
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=1200",
      "https://images.unsplash.com/photo-1605474437746-8ec7796a5d60?w=1200",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200",
    ],
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=1200",
    category: "hache",
    type: "hache",
    quantite: 25,
    stock: 25,
    origin: "Sénégal",
    weight: "0.5 kg",
    freshness: "Abattu il y a 1 jour",
    storage: "Réfrigération 0-4°C",
    createdAt: "2026-05-01T07:00:00Z",
    reviews: [
      { id: 601, author: "Aminata", rating: 4, comment: "Qualité excellente pour des plats maison.", date: "2026-05-03T09:10:00Z" },
    ],
    categorie: "Viande hachée",
  },
];

products.forEach(computeRating);

let orders = [
  { id: "ORD-001", client: "Jean Dupont", total: 17500, statut: "EN_ATTENTE", date: new Date().toISOString(), produits: ["Côte de Bœuf", "Poulet Fermier"] },
  { id: "ORD-002", client: "Marie Curie", total: 12500, statut: "CONFIRMEE", date: new Date().toISOString(), produits: ["Côte de Bœuf"] },
  { id: "ORD-003", client: "Pierre Martin", total: 8500, statut: "EN_ATTENTE", date: new Date(Date.now() - 86400000).toISOString(), produits: ["Saucisses de Porc", "Viande Hachée"] },
  { id: "ORD-004", client: "Sophie Laurent", total: 18000, statut: "ANNULEE", date: new Date(Date.now() - 172800000).toISOString(), produits: ["Filet Mignon"] },
  { id: "ORD-005", client: "Lucas Dubois", total: 15000, statut: "CONFIRMEE", date: new Date(Date.now() - 259200000).toISOString(), produits: ["Gigot d'Agneau"] },
];

// --- API PRODUITS ---
app.get('/api/products', (req, res) => {
  const category = req.query.category?.toString().toLowerCase();
  let result = products;

  if (category) {
    result = products.filter((product) => product.category?.toLowerCase() === category);
  }

  res.json(result);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p.id.toString() === req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Produit non trouvé." });
  }
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const payload = req.body;
  const newProduct = {
    id: `p${Date.now()}`,
    nom: payload.nom || payload.name || "Produit Viande TP",
    prix: Number(payload.prix || payload.price || 0),
    quantite: Number(payload.quantite || payload.stock || 0),
    stock: Number(payload.stock || payload.quantite || 0),
    image: payload.image || payload.images?.[0] || "",
    images: payload.images || [payload.image] || [],
    category: payload.category || payload.type || "boeuf",
    type: payload.type || payload.category || "boeuf",
    description: payload.description || "Description indisponible.",
    origin: payload.origin || "Sénégal",
    weight: payload.weight || "0.5 kg",
    freshness: payload.freshness || "Abattu récemment",
    storage: payload.storage || "Réfrigération 0-4°C",
    createdAt: payload.createdAt || new Date().toISOString(),
    oldPrice: payload.oldPrice || 0,
    reviews: payload.reviews || [],
    rating: 0,
    categorie: payload.categorie || payload.category || "Boeuf",
  };
  computeRating(newProduct);
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.post('/api/reviews', (req, res) => {
  const { productId, author, rating, comment } = req.body;

  if (!productId || !author || !comment || !rating) {
    return res.status(400).json({ message: "Tous les champs du commentaire sont requis." });
  }

  const product = products.find((p) => p.id.toString() === productId.toString());
  if (!product) {
    return res.status(404).json({ message: "Produit non trouvé." });
  }

  const review = {
    id: Date.now(),
    author,
    rating: Number(rating),
    comment,
    date: new Date().toISOString(),
  };

  product.reviews.unshift(review);
  computeRating(product);

  res.status(201).json({
    message: "Avis ajouté avec succès.",
    review,
    reviews: product.reviews,
    rating: product.rating,
  });
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { prix, stock, ...rest } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Le prix est requis pour la mise à jour." });
  }

  let updatedPrix;
  if (prix !== undefined) {
    updatedPrix = Number(prix);
    if (!Number.isFinite(updatedPrix) || updatedPrix <= 0) {
      return res.status(400).json({ message: "Le prix doit être un nombre positif." });
    }
  }

  let updatedStock;
  if (stock !== undefined) {
    updatedStock = Number(stock);
    if (!Number.isFinite(updatedStock) || updatedStock < 0) {
      return res.status(400).json({ message: "Le stock ne peut pas être négatif." });
    }
  }

  const productIndex = products.findIndex(p => p.id == id);
  if (productIndex === -1) {
    return res.status(404).json({ message: "Produit non trouvé." });
  }

  products[productIndex] = {
    ...products[productIndex],
    ...rest,
    ...(prix !== undefined && { prix: updatedPrix }),
    ...(stock !== undefined && { stock: updatedStock }),
  };

  res.json({ message: "Produit mis à jour", product: products[productIndex] });
});

app.delete('/api/products/:id', (req, res) => {
  products = products.filter(p => p.id != req.params.id);
  res.json({ message: "Produit supprimé" });
});

// --- API COMMANDES ---
app.get('/api/orders', (req, res) => res.json(orders));

const updateOrderStatus = (id, newStatut) => {
  const order = orders.find(o => o.id === id);
  if (!order) return { error: "Commande non trouvée" };

  if (newStatut === 'CONFIRMEE' && order.statut === 'ANNULEE') {
    return { error: "Impossible de confirmer une commande déjà annulée." };
  }
  if (newStatut === 'ANNULEE' && order.statut === 'CONFIRMEE') {
    return { error: "Impossible d'annuler une commande déjà confirmée." };
  }

  order.statut = newStatut;
  return { success: true };
};

app.patch('/api/orders/:id/confirm', (req, res) => {
  const result = updateOrderStatus(req.params.id, 'CONFIRMEE');
  if (result.error) return res.status(400).json({ message: result.error });
  res.json({ message: "Commande confirmée" });
});

app.patch('/api/orders/:id/cancel', (req, res) => {
  const result = updateOrderStatus(req.params.id, 'ANNULEE');
  if (result.error) return res.status(400).json({ message: result.error });
  res.json({ message: "Commande annulée" });
});

// --- BULK ACTIONS ---
app.patch('/api/orders/bulk-confirm', (req, res) => {
  const { ids } = req.body;
  const results = ids.map(id => ({ id, ...updateOrderStatus(id, 'CONFIRMEE') }));
  const successCount = results.filter(r => r.success).length;
  res.json({ 
    message: `${successCount} commandes confirmées`, 
    details: results 
  });
});

app.patch('/api/orders/bulk-cancel', (req, res) => {
  const { ids } = req.body;
  const results = ids.map(id => ({ id, ...updateOrderStatus(id, 'ANNULEE') }));
  const successCount = results.filter(r => r.success).length;
  res.json({ 
    message: `${successCount} commandes annulées`, 
    details: results 
  });
});

// Route d'inscription
app.post('/api/register', (req, res) => {
  const { nom, email, password, role } = req.body;
  
  // Validation stricte
  if (!email || !password || !nom) {
    return res.status(400).json({ message: "Email, mot de passe et nom sont requis." });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères." });
  }
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "Cet utilisateur existe déjà." });
  }
  
  const newUser = { nom, email, password, role: role || 'user' };
  users.push(newUser);
  
  console.log(`✓ Nouvel utilisateur inscrit: ${email}`);
  res.status(201).json({ 
    message: "Compte créé avec succès !", 
    user: { nom, email, role: newUser.role } 
  });
});

// Route de connexion
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validation stricte
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis." });
  }
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    console.log(`✓ Connexion réussie: ${email} (${user.role})`);
    res.json({ 
      message: "Connexion réussie", 
      user: { nom: user.nom, email: user.email, role: user.role } 
    });
  } else {
    console.log(`✗ Tentative de connexion échouée: ${email}`);
    res.status(401).json({ message: "Email ou mot de passe incorrect." });
  }
});

// Route de déconnexion (pour le futur)
app.post('/api/logout', (req, res) => {
  res.json({ message: "Déconnecté avec succès" });
});

// =============== ROUTE RACINE ===============
app.get('/', (req, res) => {
  res.send('Serveur Viande-TP1 opérationnel !');
});

// =============== GESTION D'ERREURS GLOBALE ===============
app.use((err, req, res, next) => {
  console.error('Erreur:', err.message);
  res.status(500).json({ message: 'Erreur serveur interne', error: err.message });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// =============== DÉMARRAGE DU SERVEUR ===============
const server = app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║   SERVEUR VIANDE-TP1 DÉMARRÉ        ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║ 🚀 URL: http://localhost:${PORT.toString().padEnd(24)}║`);
  console.log(`║ 📡 CORS activé pour: localhost:8080   ║`);
  console.log('║ 📝 Routes disponibles:                ║');
  console.log('║    GET  /api/test                     ║');
  console.log('║    GET  /api/health                   ║');
  console.log('║    POST /api/login                    ║');
  console.log('║    POST /api/register                 ║');
  console.log('║    GET  /api/products                 ║');
  console.log('║    GET  /api/products/:id             ║');
  console.log('║    POST /api/reviews                  ║');
  console.log('║    PUT  /api/products/:id             ║');
  console.log('║    GET  /api/orders                   ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
});

// Gestion des signaux d'arrêt
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, arrêt du serveur...');
  server.close(() => {
    console.log('Serveur fermé');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT reçu, arrêt du serveur...');
  server.close(() => {
    console.log('Serveur fermé');
    process.exit(0);
  });
});
