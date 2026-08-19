# 📦 Guide : pousser les 11 tâches Trello sur GitHub

## Le principe (une seule méthode)

Le projet est déjà terminé. Pour que votre testeur puisse valider chaque carte
Trello une par une, on pousse **1 commit = 1 carte**, dans l'ordre du tableau,
sur la branche `main`.

Chaque message de commit contient le numéro de la carte (`[TRL-1]`, `[TRL-2]`…)
→ c'est ce qui fait le lien automatique avec Trello (Power-Up GitHub).

## ⚠️ Le point délicat (déjà résolu pour vous)

`src/App.tsx` importe les pages une par une. Si vous pushez `Payment.tsx` avant
`Cart.tsx`, le projet ne compile plus et le testeur voit une erreur.

➡️ **Solution** : dans `docs/versions/` vous trouverez les versions
intermédiaires de `App.tsx` (et de quelques pages) à copier dans `src/` AVANT
chaque commit. Chaque version ne référence QUE les fichiers déjà poussés →
**le build passe à chaque étape**. À la fin (étape 11), vos fichiers `src/`
sont identiques au projet final.

> 💻 **Windows** : remplacez `cp` par `copy` (ex. `copy docs\versions\step-02\App.tsx src\App.tsx`).

---

## Étape 1 — [TRL-1] Landing page

```bash
cd votre-projet
git init
git add landing/index.html .gitignore
git commit -m "[TRL-1] feat: landing page"
git branch -M main
git remote add origin https://github.com/VOTRE-PSEUDO/voninkazona.git
git push -u origin main

# (optionnel) publier le landing page seul en ligne :
git subtree push --prefix landing origin gh-pages
```

## Étape 2 — [TRL-2] Authentification

```bash
cp docs/versions/step-02/App.tsx src/App.tsx
cp docs/versions/step-02/Auth.tsx src/pages/Auth.tsx
git add package.json vite.config.ts tsconfig.json index.html src/main.tsx src/index.css src/data/translations.ts src/context/LanguageContext.tsx src/context/AuthContext.tsx src/components/ProtectedRoute.tsx src/pages/Auth.tsx src/App.tsx
git commit -m "[TRL-2] feat: authentification (login + inscription)"
git push
```

## Étape 3 — [TRL-3] Liste des produits

```bash
cp docs/versions/step-03/App.tsx src/App.tsx
cp docs/versions/step-03/ProductCard.tsx src/components/ProductCard.tsx
git add src/data/products.ts src/components/PhotoSlot.tsx src/pages/Home.tsx src/components/ProductCard.tsx src/App.tsx public/images
git commit -m "[TRL-3] feat: liste des produits avec filtres"
git push
```

## Étape 4 — [TRL-4] Boutons

```bash
cp docs/versions/step-04/App.tsx src/App.tsx
cp docs/versions/step-04/Header.tsx src/components/Header.tsx
git add src/context/ThemeContext.tsx src/components/ThemeToggle.tsx src/components/LanguageSwitcher.tsx src/components/Header.tsx src/components/Footer.tsx src/App.tsx
git commit -m "[TRL-4] feat: boutons d'action (theme, langue, compte)"
git push
```

## Étape 5 — [TRL-5] Ajouter au panier

```bash
cp docs/versions/step-05/App.tsx src/App.tsx
git add src/context/CartContext.tsx src/components/ProductCard.tsx src/components/Header.tsx src/App.tsx
git commit -m "[TRL-5] feat: ajouter au panier"
git push
```

> Les `ProductCard.tsx` et `Header.tsx` actuels contiennent déjà le bouton « + »
> et le badge panier — aucun fichier à copier pour eux à cette étape.

## Étape 6 — [TRL-6] Panier

```bash
cp docs/versions/step-06/App.tsx src/App.tsx
cp docs/versions/step-06/Cart.tsx src/pages/Cart.tsx
git add src/pages/Cart.tsx src/App.tsx
git commit -m "[TRL-6] feat: page panier"
git push
```

## Étape 7 — [TRL-7] Création commande

```bash
git add src/components/CheckoutSteps.tsx src/data/order.ts src/pages/Cart.tsx src/pages/Auth.tsx
git commit -m "[TRL-7] feat: creation de commande (etapes + donnees)"
git push
```

> Les `Cart.tsx` et `Auth.tsx` actuels intègrent déjà l'indicateur d'étapes —
> aucun fichier à copier, `App.tsx` ne change pas à cette étape.

## Étape 8 — [TRL-8] Voir détails achat

```bash
cp docs/versions/step-08/App.tsx src/App.tsx
git add src/pages/ProductDetail.tsx src/App.tsx
git commit -m "[TRL-8] feat: page details d'un achat"
git push
```

## Étape 9 — [TRL-9] Paiement

```bash
cp docs/versions/step-09/App.tsx src/App.tsx
git add src/pages/Payment.tsx src/App.tsx
git commit -m "[TRL-9] feat: paiement (carte, MVola, Orange, Airtel, PayPal)"
git push
```

## Étape 10 — [TRL-10] Facture

```bash
cp docs/versions/step-10/App.tsx src/App.tsx
git add src/pages/Invoice.tsx src/App.tsx
git commit -m "[TRL-10] feat: facture imprimable"
git push
```

## Étape 11 — [TRL-11] Gestion de produit

```bash
cp docs/versions/step-11/App.tsx src/App.tsx
git add src/App.tsx src/utils/cn.ts
git commit -m "[TRL-11] feat: gestion de produit (navigation finale)"
git push
```

> ⚠️ Si votre carte « Gestion de produit » signifie un **CRUD admin**
> (ajouter/modifier/supprimer des produits), cette page n'existe pas encore dans
> le projet. Ce commit correspond à l'architecture finale (routes, redirections,
> scroll). Construisez la page admin ensuite et pushez-la en `[TRL-11] v2`.

---

## ✅ Vérification finale

```bash
npm run build          # doit réussir
git log --oneline      # 11 commits = 11 cartes Trello
```

## 🧪 Côté testeur : valider chaque tâche

**Option la plus simple** : connectez le repo à **Vercel** ou **Netlify**
(2 minutes, gratuit). Chaque `git push` génère automatiquement une URL de
prévisualisation → le testeur clique, teste la nouveauté, valide la carte.

**En local** :

```bash
git pull
npm install
npm run dev
```

## 🔗 Lier Trello ↔ GitHub

1. Tableau Trello → **Power-Ups → GitHub** → connectez le repo
2. Sur chaque carte, vous verrez les branches et commits correspondants
   (grâce à la convention `[TRL-XX]` dans les messages de commit)

## 📋 Tableau récapitulatif

| Commit | Carte Trello | Ce que le testeur vérifie |
|---|---|---|
| TRL-1 | Landing page | `landing/index.html` (site statique autonome) |
| TRL-2 | Authentification | `/auth` : login + inscription |
| TRL-3 | Liste des produits | Accueil : grille + filtres catégories |
| TRL-4 | Boutons | Header : thème, langue, compte |
| TRL-5 | Ajouter panier | Bouton « + » sur chaque produit |
| TRL-6 | Panier | `/cart` : qté, retirer, total |
| TRL-7 | Création commande | Étapes Panier → Connexion → Paiement → Facture |
| TRL-8 | Voir détails achat | `/product/:id` : image, description, avis |
| TRL-9 | Paiement | `/payment` : 5 modes de paiement |
| TRL-10 | Facture | `/invoice` : facture détaillée + imprimer |
| TRL-11 | Gestion de produit | Navigation finale, scroll, redirections |
