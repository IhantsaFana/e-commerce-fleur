

export interface Categorie {
  id: number;
  nom: string;
  description: string;
}

export interface Fleur {
  id: number;
  nom: string;
  description: string;
  prix: number;        // Decimal → nombre (Ariary)
  stock: number;
  imageUrl: string;
  disponible: boolean;
  dateCreation?: string; // généré côté backend (server_default)
  categorieId: number;
  // Champs d'affichage uniquement (facultatifs, non liés à la BDD)
  oldPrice?: number;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  featured?: boolean;
  freeGift?: boolean;
}

// Formate un prix en Ariary : 145000 -> "145 000 Ar"
export const formatAr = (price: number): string =>
  Math.round(price)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " Ar";

export const FREE_DELIVERY_THRESHOLD = 250000; // 250 000 Ar
export const DELIVERY_FEE = 25000; // 25 000 Ar

// ---------- Catégories (correspondent à la table `categories`) ----------
export const categories: Categorie[] = [
  { id: 1, nom: "Fleurs", description: "Bouquets et compositions florales" },
  { id: 2, nom: "Plantes", description: "Plantes d'intérieur et d'extérieur" },
  { id: 3, nom: "LEGO Gifts", description: "Cadeaux en briques LEGO" },
  { id: 4, nom: "Collection été", description: "Sélection estivale" },
  { id: 5, nom: "Paniers cadeaux", description: "Coffrets et paniers gourmands" },
  { id: 6, nom: "Cadeaux perso", description: "Cadeaux personnalisés" },
];

// ---------- Fleurs (correspondent à la table `fleurs`) ----------
export const fleurs: Fleur[] = [
  // ----- FLEURS (catégorie 1) -----
  { id: 1, nom: "Bouquet de roses rouges", description: "24 roses rouges premium, sélectionnées à la main et enveloppées avec soin.", prix: 145000, stock: 100, imageUrl: "/images/roses-rouges.jpg", disponible: true, categorieId: 1, oldPrice: 175000, rating: 5, reviews: 1284, featured: true, freeGift: true },
  { id: 2, nom: "Bouquet romantique", description: "Roses, chrysanthèmes et marguerites en harmonie romantique.", prix: 160000, stock: 100, imageUrl: "https://images.pexels.com/photos/34066269/pexels-photo-34066269.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 1, rating: 4, reviews: 862, featured: true },
  { id: 3, nom: "Bouquet pastel", description: "Pivoines, lys et chrysanthèmes aux tons pastel.", prix: 130000, stock: 100, imageUrl: "https://images.pexels.com/photos/38042962/pexels-photo-38042962.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 1, rating: 5, reviews: 647 },
  { id: 4, nom: "Bouquet de lys blancs", description: "Des lys blancs majestueux au parfum envoûtant.", prix: 155000, stock: 100, imageUrl: "https://images.pexels.com/photos/1033141/pexels-photo-1033141.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 1, rating: 5, reviews: 423, isNew: true },
  { id: 5, nom: "Bouquet de tulipes", description: "Tulipes colorées annonciatrices du printemps.", prix: 120000, stock: 100, imageUrl: "https://images.pexels.com/photos/2058498/pexels-photo-2058498.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 1, rating: 4, reviews: 356 },
  { id: 6, nom: "Bouquet d'orchidées", description: "Orchidées exotiques d'une élégance rare.", prix: 185000, stock: 100, imageUrl: "https://images.pexels.com/photos/10942998/pexels-photo-10942998.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 1, rating: 5, reviews: 298, featured: true, freeGift: true },
  { id: 7, nom: "Bouquet de pivoines", description: "Pivoines généreuses aux pétales soyeux.", prix: 140000, stock: 100, imageUrl: "https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 1, rating: 5, reviews: 512, isNew: true },
  { id: 8, nom: "Bouquet de gerberas", description: "Gerberas éclatants dans un camaïeu de couleurs vives.", prix: 95000, stock: 100, imageUrl: "https://images.pexels.com/photos/1488315/pexels-photo-1488315.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 1, rating: 4, reviews: 240 },
  { id: 9, nom: "Bouquet de roses blanches", description: "Roses blanches immaculées, symbole de pureté.", prix: 150000, stock: 100, imageUrl: "https://images.pexels.com/photos/140831/pexels-photo-140831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 1, rating: 5, reviews: 389, freeGift: true },
  { id: 10, nom: "Bouquet champêtre", description: "Un air de campagne avec des fleurs des champs.", prix: 110000, stock: 100, imageUrl: "https://images.pexels.com/photos/1052247/pexels-photo-1052247.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 1, rating: 4, reviews: 175, isNew: true },

  // ----- PLANTES (catégorie 2) -----
  { id: 11, nom: "Palmier d'intérieur", description: "Un palmier luxuriant livré en pot de terre cuite.", prix: 90000, stock: 100, imageUrl: "https://images.pexels.com/photos/30343587/pexels-photo-30343587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 2, rating: 4, reviews: 298 },
  { id: 12, nom: "Jardin d'intérieur", description: "Une sélection de plantes vertes en pot.", prix: 85000, stock: 100, imageUrl: "https://images.pexels.com/photos/30343679/pexels-photo-30343679.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 2, rating: 4, reviews: 214, featured: true },
  { id: 13, nom: "Cactus & succulentes", description: "Cactus et succulentes faciles à entretenir.", prix: 65000, stock: 100, imageUrl: "https://images.pexels.com/photos/16245916/pexels-photo-16245916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 2, rating: 5, reviews: 467, freeGift: true },
  { id: 14, nom: "Monstera deliciosa", description: "La plante tendance aux grandes feuilles découpées.", prix: 110000, stock: 100, imageUrl: "https://images.pexels.com/photos/30343587/pexels-photo-30343587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 2, rating: 5, reviews: 324, isNew: true, featured: true },
  { id: 15, nom: "Ficus lyrata", description: "Le figuier lyre aux grandes feuilles graphiques.", prix: 120000, stock: 100, imageUrl: "https://images.pexels.com/photos/30343679/pexels-photo-30343679.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 2, rating: 4, reviews: 189 },
  { id: 16, nom: "Orchidée en pot", description: "Une orchidée élégante en pot, floraison longue durée.", prix: 135000, stock: 100, imageUrl: "https://images.pexels.com/photos/4622971/pexels-photo-4622971.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 2, rating: 5, reviews: 276, freeGift: true },
  { id: 17, nom: "Aloe vera", description: "L'aloe vera, plante aux mille vertus.", prix: 55000, stock: 100, imageUrl: "https://images.pexels.com/photos/16245916/pexels-photo-16245916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 2, rating: 4, reviews: 143 },
  { id: 18, nom: "Bonsaï", description: "Un bonsaï d'art, cultivé avec patience.", prix: 180000, stock: 100, imageUrl: "https://images.pexels.com/photos/30343587/pexels-photo-30343587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 2, rating: 5, reviews: 98, isNew: true },
  { id: 19, nom: "Plante serpent", description: "La sansevieria, championne de la purification d'air.", prix: 75000, stock: 100, imageUrl: "https://images.pexels.com/photos/30343679/pexels-photo-30343679.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 2, rating: 4, reviews: 167 },
  { id: 20, nom: "Fougère de Boston", description: "Une fougère généreuse au feuillage retombant.", prix: 60000, stock: 100, imageUrl: "https://images.pexels.com/photos/30343587/pexels-photo-30343587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 2, rating: 4, reviews: 122 },

  // ----- LEGO GIFTS (catégorie 3) -----
  { id: 21, nom: "LEGO® Bouquet de roses", description: "Un bouquet de roses en briques LEGO® qui ne fanera jamais.", prix: 145000, stock: 100, imageUrl: "/images/lego-roses.jpg", disponible: true, categorieId: 3, rating: 5, reviews: 923, isNew: true, featured: true },
  { id: 22, nom: "LEGO® Botaniques", description: "La collection botanique LEGO® à assembler soi-même.", prix: 175000, stock: 100, imageUrl: "/images/lego-botanicals.jpg", disponible: true, categorieId: 3, rating: 5, reviews: 512, isNew: true },
  { id: 23, nom: "LEGO® Orchidée", description: "L'orchidée LEGO®, une reproduction bluffante.", prix: 155000, stock: 100, imageUrl: "/images/lego-botanicals.jpg", disponible: true, categorieId: 3, rating: 5, reviews: 341, isNew: true, featured: true },
  { id: 24, nom: "LEGO® Tournesols", description: "Des tournesols LEGO® éclatants.", prix: 130000, stock: 100, imageUrl: "/images/lego-roses.jpg", disponible: true, categorieId: 3, rating: 5, reviews: 198 },
  { id: 25, nom: "LEGO® Bonsaï", description: "Un bonsaï LEGO® méditatif à construire.", prix: 165000, stock: 100, imageUrl: "/images/lego-botanicals.jpg", disponible: true, categorieId: 3, rating: 5, reviews: 287, isNew: true },
  { id: 26, nom: "LEGO® Fleurs sauvages", description: "Un bouquet de fleurs sauvages en briques.", prix: 140000, stock: 100, imageUrl: "/images/lego-roses.jpg", disponible: true, categorieId: 3, rating: 5, reviews: 176 },
  { id: 27, nom: "LEGO® Fleurs de lotus", description: "Les fleurs de lotus LEGO®, un symbole d'harmonie.", prix: 120000, stock: 100, imageUrl: "/images/lego-botanicals.jpg", disponible: true, categorieId: 3, rating: 4, reviews: 154 },
  { id: 28, nom: "LEGO® Tulipes", description: "Des tulipes LEGO® colorées pour un printemps éternel.", prix: 110000, stock: 100, imageUrl: "/images/lego-roses.jpg", disponible: true, categorieId: 3, rating: 4, reviews: 132, isNew: true },
  { id: 29, nom: "LEGO® Centre de table", description: "Un somptueux centre de table floral en briques.", prix: 190000, stock: 100, imageUrl: "/images/lego-botanicals.jpg", disponible: true, categorieId: 3, rating: 5, reviews: 89, featured: true },
  { id: 30, nom: "LEGO® Jardin zen", description: "Un mini jardin zen LEGO® pour une pause méditation.", prix: 150000, stock: 100, imageUrl: "/images/lego-botanicals.jpg", disponible: true, categorieId: 3, rating: 5, reviews: 143 },

  // ----- COLLECTION ÉTÉ (catégorie 4) -----
  { id: 31, nom: "Bouquet ciel d'été", description: "Un bouquet bleu et jaune qui capture l'énergie du soleil.", prix: 80000, stock: 100, imageUrl: "https://images.pexels.com/photos/33791874/pexels-photo-33791874.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 4, rating: 4, reviews: 389, isNew: true },
  { id: 32, nom: "Bouquet de tournesols", description: "Des tournesols rayonnants mêlés à des fleurs champêtres.", prix: 85000, stock: 100, imageUrl: "https://images.pexels.com/photos/38545655/pexels-photo-38545655.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 4, rating: 5, reviews: 751, isNew: true, featured: true },
  { id: 33, nom: "Bouquet tropical", description: "Oiseaux de paradis, anthuriums et feuillages exotiques.", prix: 95000, stock: 100, imageUrl: "https://images.pexels.com/photos/33791874/pexels-photo-33791874.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 4, rating: 5, reviews: 214, isNew: true },
  { id: 34, nom: "Bouquet de lavande", description: "Un bouquet de lavande au parfum apaisant.", prix: 75000, stock: 100, imageUrl: "https://images.pexels.com/photos/414727/pexels-photo-414727.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 4, rating: 5, reviews: 268 },
  { id: 35, nom: "Bouquet d'hibiscus", description: "Hibiscus flamboyants aux couleurs éclatantes.", prix: 90000, stock: 100, imageUrl: "https://images.pexels.com/photos/1488315/pexels-photo-1488315.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 4, rating: 4, reviews: 187, isNew: true },
  { id: 36, nom: "Couronne d'été", description: "Une couronne florale estivale à accrocher.", prix: 100000, stock: 100, imageUrl: "https://images.pexels.com/photos/38545655/pexels-photo-38545655.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 4, rating: 4, reviews: 96, freeGift: true },
  { id: 37, nom: "Bouquet de marguerites", description: "Des marguerites simples, pures et lumineuses.", prix: 65000, stock: 100, imageUrl: "https://images.pexels.com/photos/1052247/pexels-photo-1052247.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 4, rating: 4, reviews: 154 },
  { id: 38, nom: "Bouquet de coquelicots", description: "Coquelicots rouges vibrants, la poésie des champs.", prix: 70000, stock: 100, imageUrl: "https://images.pexels.com/photos/33109472/pexels-photo-33109472.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 4, rating: 4, reviews: 121, isNew: true },
  { id: 39, nom: "Bouquet d'hortensias", description: "Hortensias généreux aux teintes douces.", prix: 115000, stock: 100, imageUrl: "https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 4, rating: 5, reviews: 203, featured: true },
  { id: 40, nom: "Bouquet de glaïeuls", description: "Glaïeuls élancés et colorés, le panache des jardins.", prix: 88000, stock: 100, imageUrl: "https://images.pexels.com/photos/1488315/pexels-photo-1488315.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 4, rating: 4, reviews: 87 },

  // ----- PANIERS CADEAUX (catégorie 5) -----
  { id: 41, nom: "Panier gourmand champagne", description: "Champagne, chocolats fins et douceurs dans un élégant panier.", prix: 240000, stock: 100, imageUrl: "https://images.pexels.com/photos/27393960/pexels-photo-27393960.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 5, rating: 5, reviews: 341, featured: true, freeGift: true },
  { id: 42, nom: "Coffret de boissons", description: "Un coffret coloré de boissons artisanales.", prix: 150000, stock: 100, imageUrl: "https://images.pexels.com/photos/39042289/pexels-photo-39042289.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 5, rating: 4, reviews: 187 },
  { id: 43, nom: "Panier de chocolats", description: "Un assortiment de chocolats fins, pralinés et ganaches.", prix: 135000, stock: 100, imageUrl: "https://images.pexels.com/photos/27393960/pexels-photo-27393960.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 5, rating: 5, reviews: 412, isNew: true },
  { id: 44, nom: "Panier thé & miel", description: "Thés parfumés et miels d'exception.", prix: 95000, stock: 100, imageUrl: "https://images.pexels.com/photos/39042289/pexels-photo-39042289.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 5, rating: 4, reviews: 156 },
  { id: 45, nom: "Coffret vin & fromage", description: "Un vin sélectionné accompagné de fromages affinés.", prix: 185000, stock: 100, imageUrl: "https://images.pexels.com/photos/27393960/pexels-photo-27393960.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 5, rating: 5, reviews: 234, featured: true },
  { id: 46, nom: "Panier de fruits", description: "Fruits frais de saison joliment présentés.", prix: 110000, stock: 100, imageUrl: "https://images.pexels.com/photos/39042289/pexels-photo-39042289.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 5, rating: 4, reviews: 145 },
  { id: 47, nom: "Coffret café", description: "Cafés de spécialité torréfiés avec soin.", prix: 125000, stock: 100, imageUrl: "https://images.pexels.com/photos/39042289/pexels-photo-39042289.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 5, rating: 4, reviews: 178, isNew: true },
  { id: 48, nom: "Panier bien-être", description: "Bougies, huiles essentielles et douceurs.", prix: 140000, stock: 100, imageUrl: "https://images.pexels.com/photos/27393960/pexels-photo-27393960.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 5, rating: 5, reviews: 198, freeGift: true },
  { id: 49, nom: "Coffret épicerie fine", description: "Confitures, miels, biscuits et spécialités artisanales.", prix: 130000, stock: 100, imageUrl: "https://images.pexels.com/photos/39042289/pexels-photo-39042289.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 5, rating: 4, reviews: 112 },
  { id: 50, nom: "Panier petit-déjeuner", description: "Croissants, confitures, jus frais et café.", prix: 105000, stock: 100, imageUrl: "https://images.pexels.com/photos/39042289/pexels-photo-39042289.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 5, rating: 4, reviews: 134, isNew: true },

  // ----- CADEAUX PERSO (catégorie 6) -----
  { id: 51, nom: "Bouquet fait-main", description: "Un bouquet artisanal crocheté à la main, unique en son genre.", prix: 145000, stock: 100, imageUrl: "https://images.pexels.com/photos/29753251/pexels-photo-29753251.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 6, rating: 5, reviews: 276, isNew: true },
  { id: 52, nom: "Bouquet surprise", description: "Laissez nos fleuristes composer un bouquet unique.", prix: 95000, stock: 100, imageUrl: "https://images.pexels.com/photos/33109472/pexels-photo-33109472.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 6, rating: 4, reviews: 158 },
  { id: 53, nom: "Bouquet photos souvenirs", description: "Un bouquet agrémenté de vos photos préférées.", prix: 120000, stock: 100, imageUrl: "https://images.pexels.com/photos/29753251/pexels-photo-29753251.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 6, rating: 5, reviews: 203, isNew: true, featured: true },
  { id: 54, nom: "Boîte à souvenirs", description: "Une élégante boîte personnalisée remplie de douceurs.", prix: 135000, stock: 100, imageUrl: "https://images.pexels.com/photos/29753251/pexels-photo-29753251.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 6, rating: 5, reviews: 167 },
  { id: 55, nom: "Bouquet brodé", description: "Un bouquet brodé à la main avec vos initiales.", prix: 150000, stock: 100, imageUrl: "https://images.pexels.com/photos/29753251/pexels-photo-29753251.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 6, rating: 5, reviews: 121, isNew: true },
  { id: 56, nom: "Cadre floral personnalisé", description: "Un cadre orné de fleurs séchées et de votre photo.", prix: 110000, stock: 100, imageUrl: "https://images.pexels.com/photos/33109472/pexels-photo-33109472.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 6, rating: 4, reviews: 98 },
  { id: 57, nom: "Bouquet de chocolats personnalisé", description: "Un bouquet de fleurs et chocolats fins, composé selon vos goûts.", prix: 125000, stock: 100, imageUrl: "https://images.pexels.com/photos/27393960/pexels-photo-27393960.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 6, rating: 5, reviews: 176, freeGift: true },
  { id: 58, nom: "Mug personnalisé & fleurs", description: "Un mug à votre effigie accompagné d'un joli bouquet.", prix: 85000, stock: 100, imageUrl: "https://images.pexels.com/photos/29753251/pexels-photo-29753251.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 6, rating: 4, reviews: 143, isNew: true },
  { id: 59, nom: "Oreiller personnalisé & fleurs", description: "Un coussin imprimé à votre image livré avec des fleurs.", prix: 155000, stock: 100, imageUrl: "https://images.pexels.com/photos/29753251/pexels-photo-29753251.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 6, rating: 5, reviews: 87, featured: true },
  { id: 60, nom: "Bouquet anniversaire personnalisé", description: "Un bouquet d'anniversaire composé avec les fleurs préférées.", prix: 165000, stock: 100, imageUrl: "https://images.pexels.com/photos/33109472/pexels-photo-33109472.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", disponible: true, categorieId: 6, rating: 5, reviews: 214, isNew: true },
];

export const getFleur = (id: number) => fleurs.find((f) => f.id === id);

export const getCategorie = (id: number) => categories.find((c) => c.id === id);
