import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Fleur, formatAr } from "../data/products";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  removeProduct,
} from "../services/productApi";
import PhotoSlot from "../components/PhotoSlot";

type ProductFilter =
  | "all"
  | "available"
  | "out_of_stock"
  | "inactive";

const PAGE_SIZE = 8;

const emptyProduct = (): Fleur => ({
  id: 0,
  nom: "",
  description: "",
  prix: 0,
  stock: 0,
  imageUrl: "",
  disponible: true,
  categorieId: 1,
});

export default function Admin() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Fleur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ProductFilter>("all");
  const [page, setPage] = useState(1);

  const [editing, setEditing] = useState<Fleur | null>(null);
  const [form, setForm] = useState<Fleur>(emptyProduct());
  const [saving, setSaving] = useState(false);

  const inputClass =
    "w-full border border-line dark:border-dark-line bg-white dark:bg-dark-surface text-ink dark:text-white rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-coral transition-colors";

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchProducts();

      setProducts(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de charger les produits";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();

    const handleProductsUpdated = () => {
      loadProducts();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "fq_products_updated_at") {
        loadProducts();
      }
    };

    window.addEventListener(
      "products-updated",
      handleProductsUpdated
    );

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        "products-updated",
        handleProductsUpdated
      );

      window.removeEventListener("storage", handleStorage);
    };
  }, [loadProducts]);

  const stats = useMemo(() => {
    const total = products.length;

    const available = products.filter(
      (product) =>
        product.disponible && product.stock > 0
    ).length;

    const outOfStock = products.filter(
      (product) => product.stock <= 0
    ).length;

    const inactive = products.filter(
      (product) =>
        !product.disponible && product.stock > 0
    ).length;

    const stockTotal = products.reduce(
      (sum, product) => sum + product.stock,
      0
    );

    return {
      total,
      available,
      outOfStock,
      inactive,
      stockTotal,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.nom.toLowerCase().includes(normalizedSearch) ||
        product.description
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesFilter =
        filter === "all" ||
        (filter === "available" &&
          product.disponible &&
          product.stock > 0) ||
        (filter === "out_of_stock" &&
          product.stock <= 0) ||
        (filter === "inactive" &&
          !product.disponible &&
          product.stock > 0);

      return matchesSearch && matchesFilter;
    });
  }, [products, search, filter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );

  const visibleProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;

    return filteredProducts.slice(
      start,
      start + PAGE_SIZE
    );
  }, [filteredProducts, page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const updateForm = (field: keyof Fleur, value: any) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const startAdd = () => {
    setError("");
    setEditing(emptyProduct());
    setForm(emptyProduct());
  };

  const startEdit = (product: Fleur) => {
    setError("");
    setEditing(product);
    setForm({ ...product });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(emptyProduct());
    setError("");
  };

  const notifyProductsChanged = () => {
    window.dispatchEvent(new Event("products-updated"));

    localStorage.setItem(
      "fq_products_updated_at",
      Date.now().toString()
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nom.trim()) {
      setError("Le nom du produit est obligatoire");
      return;
    }

    if (form.prix <= 0) {
      setError("Le prix doit être supérieur à 0");
      return;
    }

    if (form.stock < 0) {
      setError("Le stock ne peut pas être négatif");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const productToSave: Fleur = {
        ...form,
        nom: form.nom.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
      };

      let savedProduct: Fleur;

      if (productToSave.id > 0) {
        savedProduct = await updateProduct(productToSave);

        setProducts((previous) =>
          previous.map((product) =>
            product.id === savedProduct.id
              ? savedProduct
              : product
          )
        );

        showToast("Produit modifié avec succès", "success");
      } else {
        savedProduct = await createProduct(productToSave);

        setProducts((previous) => [
          ...previous,
          savedProduct,
        ]);

        showToast("Produit ajouté avec succès", "success");
      }

      cancelEdit();
      notifyProductsChanged();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la sauvegarde";

      setError(message);
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    id: number,
    productName: string
  ) => {
    const accepted = window.confirm(
      `Supprimer définitivement "${productName}" ?`
    );

    if (!accepted) return;

    try {
      setError("");

      await removeProduct(id);

      setProducts((previous) =>
        previous.filter((product) => product.id !== id)
      );

      showToast("Produit supprimé avec succès", "success");

      notifyProductsChanged();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression";

      setError(message);
      showToast(message, "error");
    }
  };

  const handleFilterChange = (
    newFilter: ProductFilter
  ) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handleSearchChange = (
    value: string
  ) => {
    setSearch(value);
    setPage(1);
  };

  const isAdmin =
    user?.role?.trim().toLowerCase() === "admin";

  // Sécurité supplémentaire, même si ProtectedRoute bloque déjà le Client.
  if (!isAdmin) {
    return (
      <div className="max-w-[600px] mx-auto px-6 py-24 text-center animate-fade-up">
        <div className="text-5xl mb-4">🔒</div>

        <h1 className="font-display text-2xl text-ink dark:text-white mb-4">
          {t.admin.accessDenied}
        </h1>

        <p className="text-ink-soft dark:text-gray-400 mb-6">
          {t.admin.accessDeniedText}
        </p>

        <Link
          to="/payment"
          className="inline-block bg-sage hover:bg-sage-dark text-white text-sm font-semibold px-6 py-3 rounded-sm"
        >
          Aller au paiement
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 animate-fade-up">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-coral mb-1">
            Administration
          </p>

          <h1 className="font-display text-3xl text-ink dark:text-white">
            Dashboard produits
          </h1>

          <p className="text-sm text-ink-soft dark:text-gray-400 mt-1">
            Gestion des produits connectée à PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadProducts}
            className="border border-line dark:border-dark-line text-ink dark:text-white text-sm font-semibold px-4 py-2.5 rounded-sm hover:border-coral hover:text-coral transition-colors"
          >
            ↻ Actualiser
          </button>

          {!editing && (
            <button
              type="button"
              onClick={startAdd}
              className="bg-sage hover:bg-sage-dark text-white text-sm font-semibold px-5 py-2.5 rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              + Ajouter un produit
            </button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="border border-line dark:border-dark-line bg-white dark:bg-dark-surface rounded-sm p-4">
          <p className="text-xs text-ink-soft dark:text-gray-400">
            Produits total
          </p>
          <p className="font-display text-3xl text-ink dark:text-white mt-1">
            {stats.total}
          </p>
        </div>

        <div className="border border-line dark:border-dark-line bg-white dark:bg-dark-surface rounded-sm p-4">
          <p className="text-xs text-ink-soft dark:text-gray-400">
            Disponibles
          </p>
          <p className="font-display text-3xl text-sage mt-1">
            {stats.available}
          </p>
        </div>

        <div className="border border-line dark:border-dark-line bg-white dark:bg-dark-surface rounded-sm p-4">
          <p className="text-xs text-ink-soft dark:text-gray-400">
            Rupture de stock
          </p>
          <p className="font-display text-3xl text-red-500 mt-1">
            {stats.outOfStock}
          </p>
        </div>

        <div className="border border-line dark:border-dark-line bg-white dark:bg-dark-surface rounded-sm p-4">
          <p className="text-xs text-ink-soft dark:text-gray-400">
            Désactivés
          </p>
          <p className="font-display text-3xl text-gold mt-1">
            {stats.inactive}
          </p>
        </div>

        <div className="border border-line dark:border-dark-line bg-white dark:bg-dark-surface rounded-sm p-4">
          <p className="text-xs text-ink-soft dark:text-gray-400">
            Stock total
          </p>
          <p className="font-display text-3xl text-coral mt-1">
            {stats.stockTotal}
          </p>
        </div>
      </div>

      {/* Formulaire CRUD */}
      {editing && (
        <form
          onSubmit={handleSave}
          className="border border-line dark:border-dark-line rounded-sm p-6 bg-white dark:bg-dark-surface space-y-4 mb-8"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl text-ink dark:text-white">
              {editing.id > 0
                ? "Modifier le produit"
                : "Ajouter un produit"}
            </h2>

            <button
              type="button"
              onClick={cancelEdit}
              className="text-xs font-semibold text-ink-soft dark:text-gray-400 hover:text-coral"
            >
              ✕ Fermer
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">
                Nom du produit
              </label>

              <input
                value={form.nom}
                onChange={(e) =>
                  updateForm("nom", e.target.value)
                }
                className={inputClass}
                placeholder="Bouquet de roses"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">
                Prix (Ar)
              </label>

              <input
                type="number"
                min="1"
                value={form.prix}
                onChange={(e) =>
                  updateForm("prix", Number(e.target.value))
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">
                Stock
              </label>

              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) =>
                  updateForm("stock", Number(e.target.value))
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">
                URL image
              </label>

              <input
                value={form.imageUrl}
                onChange={(e) =>
                  updateForm("imageUrl", e.target.value)
                }
                className={inputClass}
                placeholder="https://..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  updateForm("description", e.target.value)
                }
                rows={4}
                className={inputClass}
                placeholder="Description du produit..."
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-ink dark:text-white">
            <input
              type="checkbox"
              checked={form.disponible}
              onChange={(e) =>
                updateForm("disponible", e.target.checked)
              }
            />
            Produit disponible
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-sage hover:bg-sage-dark text-white text-sm font-semibold px-6 py-2.5 rounded-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving
                ? "Sauvegarde..."
                : editing.id > 0
                  ? "Modifier"
                  : "Ajouter"}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={cancelEdit}
              className="border border-line dark:border-dark-line text-ink-soft dark:text-gray-300 text-sm font-semibold px-6 py-2.5 rounded-sm hover:text-coral transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="mb-6 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-sm px-4 py-3">
          {error}
        </div>
      )}

      {/* Recherche et filtres */}
      <div className="border border-line dark:border-dark-line bg-white dark:bg-dark-surface rounded-sm p-4 mb-5">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft dark:text-gray-400"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" strokeLinecap="round" />
            </svg>

            <input
              value={search}
              onChange={(e) =>
                handleSearchChange(e.target.value)
              }
              className={`${inputClass} pl-10`}
              placeholder="Rechercher un produit..."
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange("all")}
              className={`text-xs font-semibold px-3 py-2 rounded-full border transition-colors ${
                filter === "all"
                  ? "border-coral text-coral bg-coral/5"
                  : "border-line dark:border-dark-line text-ink-soft dark:text-gray-300"
              }`}
            >
              Tous ({stats.total})
            </button>

            <button
              onClick={() => handleFilterChange("available")}
              className={`text-xs font-semibold px-3 py-2 rounded-full border transition-colors ${
                filter === "available"
                  ? "border-sage text-sage bg-sage/5"
                  : "border-line dark:border-dark-line text-ink-soft dark:text-gray-300"
              }`}
            >
              Disponibles ({stats.available})
            </button>

            <button
              onClick={() => handleFilterChange("out_of_stock")}
              className={`text-xs font-semibold px-3 py-2 rounded-full border transition-colors ${
                filter === "out_of_stock"
                  ? "border-red-500 text-red-500 bg-red-500/5"
                  : "border-line dark:border-dark-line text-ink-soft dark:text-gray-300"
              }`}
            >
              Rupture ({stats.outOfStock})
            </button>

            <button
              onClick={() => handleFilterChange("inactive")}
              className={`text-xs font-semibold px-3 py-2 rounded-full border transition-colors ${
                filter === "inactive"
                  ? "border-gold text-gold bg-gold/5"
                  : "border-line dark:border-dark-line text-ink-soft dark:text-gray-300"
              }`}
            >
              Désactivés ({stats.inactive})
            </button>
          </div>
        </div>
      </div>

      {/* Tableau */}
      {loading && (
        <div className="py-16 text-center text-sm text-ink-soft dark:text-gray-400">
          Chargement depuis PostgreSQL...
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="border border-line dark:border-dark-line bg-white dark:bg-dark-surface rounded-sm p-12 text-center">
          <div className="text-5xl mb-4">🌷</div>

          <h2 className="font-display text-xl text-ink dark:text-white mb-2">
            Aucun produit trouvé
          </h2>

          <p className="text-sm text-ink-soft dark:text-gray-400">
            Modifiez la recherche ou ajoutez un nouveau produit.
          </p>
        </div>
      )}

      {!loading && filteredProducts.length > 0 && (
        <>
          <div className="border border-line dark:border-dark-line rounded-sm overflow-x-auto">
            <table className="w-full min-w-[950px] text-sm">
              <thead className="bg-graybg dark:bg-dark-surface text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-ink dark:text-white">
                    Image
                  </th>

                  <th className="px-4 py-3 font-semibold text-ink dark:text-white">
                    Produit
                  </th>

                  <th className="px-4 py-3 font-semibold text-ink dark:text-white text-right">
                    Prix
                  </th>

                  <th className="px-4 py-3 font-semibold text-ink dark:text-white text-center">
                    Stock
                  </th>

                  <th className="px-4 py-3 font-semibold text-ink dark:text-white text-center">
                    État
                  </th>

                  <th className="px-4 py-3 font-semibold text-ink dark:text-white text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-line dark:divide-dark-line">
                {visibleProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-graybg/50 dark:hover:bg-dark-surface/50 transition-colors"
                  >
                    <td className="px-4 py-3 w-20">
                      <PhotoSlot
                        src={product.imageUrl}
                        alt={product.nom}
                        className="w-12 h-12"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink dark:text-white">
                        {product.nom}
                      </p>

                      {product.description && (
                        <p className="max-w-xs truncate text-xs text-ink-soft dark:text-gray-400 mt-1">
                          {product.description}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right font-semibold text-ink dark:text-white">
                      {formatAr(product.prix)}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`font-semibold ${
                          product.stock <= 0
                            ? "text-red-500"
                            : "text-ink dark:text-white"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      {product.stock <= 0 ? (
                        <span className="text-xs font-bold text-red-500">
                          Rupture
                        </span>
                      ) : product.disponible ? (
                        <span className="text-xs font-bold text-sage">
                          Disponible
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-gold">
                          Désactivé
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(product)}
                          className="text-xs font-semibold text-ink-soft dark:text-gray-300 hover:text-coral border border-line dark:border-dark-line rounded-sm px-3 py-1.5 transition-colors"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(product.id, product.nom)
                          }
                          className="text-xs font-semibold text-red-500 hover:text-white hover:bg-red-500 border border-red-500/40 rounded-sm px-3 py-1.5 transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
            <p className="text-xs text-ink-soft dark:text-gray-400">
              {filteredProducts.length} produit(s) trouvé(s) — page{" "}
              {page} sur {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage((current) => Math.max(1, current - 1))
                }
                className="border border-line dark:border-dark-line text-xs font-semibold text-ink dark:text-white px-4 py-2 rounded-sm hover:border-coral hover:text-coral disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Précédent
              </button>

              <span className="text-xs font-semibold text-ink dark:text-white px-2">
                {page} / {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) =>
                    Math.min(totalPages, current + 1)
                  )
                }
                className="border border-line dark:border-dark-line text-xs font-semibold text-ink dark:text-white px-4 py-2 rounded-sm hover:border-coral hover:text-coral disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Suivant →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}