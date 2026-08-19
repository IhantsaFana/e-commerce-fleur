import type { Lang } from "./translations";

export interface LocalizedText {
  fr: string;
  en: string;
  mg: string;
}

export interface Product {
  id: string;
  name: LocalizedText;
  category: LocalizedText;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  tag: string;
  freeGift?: boolean;
  isNew?: boolean;
  featured?: boolean;
  description: LocalizedText;
}

export const products: Product[] = [
  {
    id: "roses-rouges",
    name: { fr: "Bouquet de roses rouges", en: "Red roses bouquet", mg: "Fehezam-boninkazo mavokely mena" },
    category: { fr: "Fleurs", en: "Flowers", mg: "Voninkazo" },
    price: 39.9,
    oldPrice: 49.9,
    rating: 5,
    reviews: 1284,
    image: "/images/roses-rouges.jpg",
    tag: "Fleurs",
    freeGift: true,
    featured: true,
    description: {
      fr: "Un bouquet intemporel de 24 roses rouges de qualité premium, soigneusement sélectionnées et enveloppées à la main. Le cadeau parfait pour déclarer votre amour.",
      en: "A timeless bouquet of 24 premium red roses, carefully selected and hand-wrapped. The perfect gift to declare your love.",
      mg: "Fehezam-boninkazo 24 mavokely mena tsara kalitao, voafantina tsara sy nofonosina amin'ny tanana. Fanomezana tsara indrindra hanehoana fitiavana.",
    },
  },
  {
    id: "bouquet-romantique",
    name: { fr: "Bouquet romantique", en: "Romantic bouquet", mg: "Fehezam-boninkazo romantika" },
    category: { fr: "Fleurs", en: "Flowers", mg: "Voninkazo" },
    price: 44.9,
    rating: 4,
    reviews: 862,
    image: "https://images.pexels.com/photos/34066269/pexels-photo-34066269.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    tag: "Fleurs",
    featured: true,
    description: {
      fr: "Roses, chrysanthèmes et marguerites réunis dans une harmonie romantique. Un mélange délicat qui émerveillera l'être aimé.",
      en: "Roses, chrysanthemums and daisies united in romantic harmony. A delicate blend that will delight your loved one.",
      mg: "Mavokely, krismanternoma ary margarita mirindra anaty fifandraisana romantika. Fifangaroana tsara hampifaly ny olon-tianao.",
    },
  },
  {
    id: "bouquet-pastel",
    name: { fr: "Bouquet pastel", en: "Pastel bouquet", mg: "Fehezam-boninkazo pastel" },
    category: { fr: "Fleurs", en: "Flowers", mg: "Voninkazo" },
    price: 36.9,
    rating: 5,
    reviews: 647,
    image: "https://images.pexels.com/photos/38042962/pexels-photo-38042962.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    tag: "Fleurs",
    description: {
      fr: "Un bouquet élégant aux tons pastel : pivoines, lys et chrysanthèmes roses. Douceur et élégance pour toutes les occasions.",
      en: "An elegant pastel bouquet: peonies, lilies and pink chrysanthemums. Softness and elegance for every occasion.",
      mg: "Fehezam-boninkazo kanto amin'ny loko pastel: peonia, lisy ary krismanternoma. Malemilemy sy kanto ho an'ny fotoana rehetra.",
    },
  },
  {
    id: "ciel-ete",
    name: { fr: "Bouquet ciel d'été", en: "Summer sky bouquet", mg: "Fehezam-boninkazo lanitra fahavaratra" },
    category: { fr: "Collection été", en: "Summer collection", mg: "Fahavaratra" },
    price: 29.9,
    rating: 4,
    reviews: 389,
    image: "https://images.pexels.com/photos/33791874/pexels-photo-33791874.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    tag: "Collection été",
    isNew: true,
    description: {
      fr: "Un bouquet éclatant bleu et jaune qui capture l'énergie du soleil. Frais, joyeux et plein de vie pour un été inoubliable.",
      en: "A dazzling blue and yellow bouquet that captures the energy of the sun. Fresh, joyful and full of life for an unforgettable summer.",
      mg: "Fehezam-boninkazo manga sy mavo mamirapiratra maka ny herin'ny masoandro. Vaovao, falifaly ary feno fiainana.",
    },
  },
  {
    id: "tournesols",
    name: { fr: "Bouquet de tournesols", en: "Sunflower bouquet", mg: "Fehezam-boninkazo tanamasoandro" },
    category: { fr: "Collection été", en: "Summer collection", mg: "Fahavaratra" },
    price: 32.9,
    rating: 5,
    reviews: 751,
    image: "https://images.pexels.com/photos/38545655/pexels-photo-38545655.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    tag: "Collection été",
    isNew: true,
    featured: true,
    description: {
      fr: "Des tournesols rayonnants mêlés à des fleurs champêtres. Un bouquet solaire qui apporte le bonheur dans chaque pièce.",
      en: "Radiant sunflowers mixed with wildflowers. A sunny bouquet that brings happiness to every room.",
      mg: "Tanamasoandro mamirapiratra mifangaro voninkazo an-tanety. Fehezam-boninkazo mitondra fahasambarana.",
    },
  },
  {
    id: "palmier",
    name: { fr: "Palmier d'intérieur", en: "Indoor palm", mg: "Palmie anaty trano" },
    category: { fr: "Plantes", en: "Plants", mg: "Zavamaniry" },
    price: 34.9,
    rating: 4,
    reviews: 298,
    image: "https://images.pexels.com/photos/30343587/pexels-photo-30343587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    tag: "Plantes",
    description: {
      fr: "Un palmier luxuriant livré dans un joli pot en terre cuite. Purifie l'air et apporte une touche tropicale à votre intérieur.",
      en: "A lush palm delivered in a lovely terracotta pot. Purifies the air and brings a tropical touch to your home.",
      mg: "Palmie maitso mavana ao anaty vilany tany. Manadio ny rivotra ary mitondra haingo tropikaly ao an-trano.",
    },
  },
  {
    id: "jardin-interieur",
    name: { fr: "Jardin d'intérieur", en: "Indoor garden", mg: "Zaridaina anaty trano" },
    category: { fr: "Plantes", en: "Plants", mg: "Zavamaniry" },
    price: 29.9,
    rating: 4,
    reviews: 214,
    image: "https://images.pexels.com/photos/30343679/pexels-photo-30343679.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    tag: "Plantes",
    description: {
      fr: "Une sélection de plantes vertes en pot qui s'épanouissent au soleil. Idéal pour verdir votre bureau ou votre salon.",
      en: "A selection of potted green plants that thrive in sunlight. Perfect to green up your office or living room.",
      mg: "Zavamaniry maitso anaty vilany maromaro maniry ao anaty masoandro. Tsara ho an'ny birao na ny efitrano fandraisana.",
    },
  },
  {
    id: "cactus",
    name: { fr: "Cactus & succulentes", en: "Cactus & succulents", mg: "Kaktosy sy sokilenta" },
    category: { fr: "Plantes", en: "Plants", mg: "Zavamaniry" },
    price: 24.9,
    rating: 5,
    reviews: 467,
    image: "https://images.pexels.com/photos/16245916/pexels-photo-16245916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    tag: "Plantes",
    freeGift: true,
    description: {
      fr: "Un assortiment de cactus et succulentes faciles à entretenir. Parfait pour les débutants et les esprits occupés.",
      en: "An assortment of easy-care cacti and succulents. Perfect for beginners and busy people.",
      mg: "Kaktosy sy sokilenta mora karakaraina. Tsara ho an'ireo vao manomboka sy ireo sahirana.",
    },
  },
  {
    id: "lego-roses",
    name: { fr: "LEGO® Bouquet de roses", en: "LEGO® Rose bouquet", mg: "LEGO® Fehezam-boninkazo mavokely" },
    category: { fr: "LEGO Gifts", en: "LEGO Gifts", mg: "LEGO Gifts" },
    price: 49.9,
    rating: 5,
    reviews: 923,
    image: "/images/lego-roses.jpg",
    tag: "LEGO Gifts",
    isNew: true,
    featured: true,
    description: {
      fr: "Un bouquet de roses en briques LEGO® qui ne fanera jamais. À construire à deux : le cadeau créatif par excellence.",
      en: "A LEGO® brick rose bouquet that will never wither. Build it together: the ultimate creative gift.",
      mg: "Fehezam-boninkazo vita amin'ny LEGO® tsy malazo mandrakizay. Azo aorina miaraka: fanomezana famoronana tsy manam-paharoa.",
    },
  },
  {
    id: "lego-botaniques",
    name: { fr: "LEGO® Botaniques", en: "LEGO® Botanicals", mg: "LEGO® Botanika" },
    category: { fr: "LEGO Gifts", en: "LEGO Gifts", mg: "LEGO Gifts" },
    price: 59.9,
    rating: 5,
    reviews: 512,
    image: "/images/lego-botanicals.jpg",
    tag: "LEGO Gifts",
    isNew: true,
    description: {
      fr: "La collection botanique LEGO® : des plantes en briques à assembler soi-même. Décoration zen garantie, sans entretien.",
      en: "The LEGO® botanical collection: brick plants to assemble yourself. Guaranteed zen decor, zero maintenance.",
      mg: "Fanangonana botanika LEGO®: zavamaniry aorina amin'ny tenanao. Haingo tsara tarehy tsy mila fikarakarana.",
    },
  },
  {
    id: "panier-champagne",
    name: { fr: "Panier gourmand champagne", en: "Champagne gourmet basket", mg: "Harona champagne gourmet" },
    category: { fr: "Paniers cadeaux", en: "Gift baskets", mg: "Harona fanomezana" },
    price: 64.9,
    rating: 5,
    reviews: 341,
    image: "https://images.pexels.com/photos/27393960/pexels-photo-27393960.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    tag: "Paniers cadeaux",
    freeGift: true,
    featured: true,
    description: {
      fr: "Champagne, chocolats fins et douceurs dans un élégant panier cadeau. Le raffinement pour les grandes occasions.",
      en: "Champagne, fine chocolates and treats in an elegant gift basket. Refinement for special occasions.",
      mg: "Champagne, sôkôlà tsara sy mamy ao anaty harona fanomezana kanto. Hatsarana ho an'ny fotoana lehibe.",
    },
  },
  {
    id: "coffret-boissons",
    name: { fr: "Coffret de boissons", en: "Beverage gift box", mg: "Kitapo zava-pisotro" },
    category: { fr: "Paniers cadeaux", en: "Gift baskets", mg: "Harona fanomezana" },
    price: 42.9,
    rating: 4,
    reviews: 187,
    image: "https://images.pexels.com/photos/39042289/pexels-photo-39042289.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    tag: "Paniers cadeaux",
    description: {
      fr: "Un coffret coloré de boissons artisanales à partager entre amis. Parfait pour un pique-nique ou une soirée réussie.",
      en: "A colorful box of artisanal drinks to share with friends. Perfect for a picnic or a great evening.",
      mg: "Kitapo mavokely zava-pisotro vita tanana hozaraina amin'ny namana. Tsara ho an'ny piknika na hariva.",
    },
  },
  {
    id: "bouquet-crochet",
    name: { fr: "Bouquet fait-main", en: "Handmade bouquet", mg: "Fehezam-boninkazo vita tanana" },
    category: { fr: "Cadeaux perso", en: "Personalized gifts", mg: "Fanomezana manokana" },
    price: 49.9,
    rating: 5,
    reviews: 276,
    image: "https://images.pexels.com/photos/29753251/pexels-photo-29753251.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    tag: "Cadeaux perso",
    isNew: true,
    description: {
      fr: "Un bouquet artisanal crocheté à la main, unique en son genre. Un cadeau personnalisé qui dure pour toujours.",
      en: "A hand-crocheted artisanal bouquet, one of a kind. A personalized gift that lasts forever.",
      mg: "Fehezam-boninkazo vita tanana, tsy misy tahaka azy. Fanomezana manokana maharitra mandrakizay.",
    },
  },
  {
    id: "bouquet-surprise",
    name: { fr: "Bouquet surprise", en: "Surprise bouquet", mg: "Fehezam-boninkazo tampoka" },
    category: { fr: "Cadeaux perso", en: "Personalized gifts", mg: "Fanomezana manokana" },
    price: 34.9,
    rating: 4,
    reviews: 158,
    image: "https://images.pexels.com/photos/33109472/pexels-photo-33109472.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    tag: "Cadeaux perso",
    description: {
      fr: "Laissez nos fleuristes composer un bouquet unique selon vos envies. La surprise qui fait toujours plaisir.",
      en: "Let our florists create a unique bouquet according to your wishes. The surprise that always delights.",
      mg: "Avelao ny floristika hanamboatra fehezam-boninkazo manokana araka ny fanirianao. Fahagagana mahafaly foana.",
    },
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const getLocalized = (text: LocalizedText, lang: Lang) => text[lang];

export const FREE_DELIVERY_THRESHOLD = 50;
export const DELIVERY_FEE = 5.9;
