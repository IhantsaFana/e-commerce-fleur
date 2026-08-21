import { useEffect, useState } from "react";
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

const emptyFleur = (): Fleur => ({
  id: 0,
  nom: "",
  description: "",
  prix: 0,
  stock: 0,
  imageUrl: "",
  disponible: true,

  // Votre backend n'a pas encore de category_id.
  categorieId: 1,
});

export default function Admin() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [fleurs, setFleurs] = useState<Fleur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState<Fleur | null>(null);
  const [form, setForm] = useState<Fleur>(emptyFleur());
  const [saving, setSaving] = useState(false);

  const inputClass =
    "w-full border border-line dark:border-dark-line bg-white dark:bg-dark-surface text-ink dark:text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-coral transition-colors duration-200";

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const products = await fetchProducts();

      setFleurs(products);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de charger les produits depuis PostgreSQL";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

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
  }, []);

  const updateForm = (field: keyof Fleur, value: any) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const startAdd = () => {
    setError("");
    setEditing(emptyFleur());
    setForm(emptyFleur());
  };

  const startEdit = (fleur: Fleur) => {
    setError("");
    setEditing(fleur);
    setForm({ ...fleur });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(emptyFleur());
    setError("");
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

      // Modification d'un produit existant.
      if (productToSave.id > 0) {
        savedProduct = await updateProduct(productToSave);

        // Mise à jour immédiate dans la liste Admin.
        setFleurs((previous) =>
          previous.map((product) =>
            product.id === savedProduct.id
              ? savedProduct
              : product
          )
        );

        showToast("Produit modifié avec succès", "success");
      } else {
        // Création d'un nouveau produit.
        savedProduct = await createProduct(productToSave);

        // Ajout immédiat dans la liste Admin.
        setFleurs((previous) => [
          ...previous,
          savedProduct,
        ]);

        showToast("Produit ajouté avec succès", "success");
      }

      cancelEdit();

      // Met à jour Home dans le même onglet.
      window.dispatchEvent(new Event("products-updated"));

      // Met à jour Home dans un autre onglet.
      localStorage.setItem(
        "fq_products_updated_at",
        Date.now().toString()
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la sauvegarde du produit";

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
      `Supprimer définitivement le produit "${productName}" ?`
    );

    if (!accepted) return;

    try {
      setError("");

      await removeProduct(id);

      // Le produit disparaît immédiatement dans Admin.
      setFleurs((previous) =>
        previous.filter((product) => product.id !== id)
      );

      showToast("Produit supprimé avec succès", "success");

      // Met à jour Home dans le même onglet.
      window.dispatchEvent(new Event("products-updated"));

      // Met à jour Home dans un autre onglet.
      localStorage.setItem(
        "fq_products_updated_at",
        Date.now().toString()
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression du produit";

      setError(message);
      showToast(message, "error");
    }
  };

  // Seuls les Admin peuvent voir cette page.
  if (user?.role?.trim().toLowerCase() !== "admin") {
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
          to="/"
          className="inline-block bg-sage hover:bg-sage-dark text-white text-sm font-semibold px-6 py-3 rounded-sm"
        >
          {t.admin.backHome}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 animate-fade-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-ink dark:text-white">
            {t.admin.title}
          </h1>

          <p className="text-sm text-ink-soft dark:text-gray-400">
            Gestion des produits enregistrés dans PostgreSQL.
          </p>
        </div>

        <Link
          to="/"
          className="text-xs text-ink-soft dark:text-gray-400 hover:text-coral transition-colors"
        >
          ← {t.admin.backHome}
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="font-display text-xl text-ink dark:text-white">
            Produits ({fleurs.length})
          </h2>

          <p className="text-xs text-ink-soft dark:text-gray-400 mt-1">
            Liste venant directement du backend FastAPI et PostgreSQL.
          </p>
        </div>

        {!editing && (
          <button
            onClick={startAdd}
            className="bg-sage hover:bg-sage-dark text-white text-sm font-semibold px-5 py-2.5 rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            + {t.admin.addProduct}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-sm px-4 py-3">
          {error}
        </div>
      )}

      {editing && (
        <form
          onSubmit={handleSave}
          className="border border-line dark:border-dark-line rounded-sm p-6 bg-white dark:bg-dark-surface space-y-4 mb-8"
        >
          <h2 className="font-display text-xl text-ink dark:text-white">
            {editing.id > 0
              ? "Modifier le produit"
              : "Ajouter un produit"}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">
                {t.admin.name}
              </label>

              <input
                value={form.nom}
                onChange={(e) => updateForm("nom", e.target.value)}
                placeholder="Exemple : Bouquet de roses"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">
                {t.admin.price} (Ar)
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
                {t.admin.stock}
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
                {t.admin.image}
              </label>

              <input
                value={form.imageUrl}
                onChange={(e) =>
                  updateForm("imageUrl", e.target.value)
                }
                placeholder="https://..."
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">
                {t.admin.description}
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

            {t.admin.available}
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
              onClick={cancelEdit}
              disabled={saving}
              className="border border-line dark:border-dark-line text-ink-soft dark:text-gray-300 text-sm font-semibold px-6 py-2.5 rounded-sm hover:text-coral transition-colors"
            >
              {t.admin.cancel}
            </button>
          </div>
        </form>
      )}

      {loading && (
        <div className="py-16 text-center text-sm text-ink-soft dark:text-gray-400">
          Chargement des produits depuis PostgreSQL...
        </div>
      )}

      {!loading && fleurs.length === 0 && (
        <div className="border border-line dark:border-dark-line rounded-sm p-12 bg-white dark:bg-dark-surface text-center">
          <div className="text-5xl mb-4">🌷</div>

          <h2 className="font-display text-xl text-ink dark:text-white mb-2">
            Aucun produit dans PostgreSQL
          </h2>

          <p className="text-sm text-ink-soft dark:text-gray-400 mb-5">
            Cliquez sur « Ajouter un produit » pour créer votre premier produit.
          </p>

          {!editing && (
            <button
              onClick={startAdd}
              className="bg-sage hover:bg-sage-dark text-white text-sm font-semibold px-5 py-2.5 rounded-sm"
            >
              + {t.admin.addProduct}
            </button>
          )}
        </div>
      )}

      {!loading && fleurs.length > 0 && (
        <div className="border border-line dark:border-dark-line rounded-sm overflow-x-auto">
          <table className="w-full min-w-[850px] text-sm">
            <thead className="bg-graybg dark:bg-dark-surface text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-ink dark:text-white">
                  {t.admin.image}
                </th>

                <th className="px-4 py-3 font-semibold text-ink dark:text-white">
                  {t.admin.name}
                </th>

                <th className="px-4 py-3 font-semibold text-ink dark:text-white text-right">
                  {t.admin.price}
                </th>

                <th className="px-4 py-3 font-semibold text-ink dark:text-white text-center">
                  {t.admin.stock}
                </th>

                <th className="px-4 py-3 font-semibold text-ink dark:text-white text-center">
                  {t.admin.available}
                </th>

                <th className="px-4 py-3 font-semibold text-ink dark:text-white text-right">
                  {t.admin.actions}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line dark:divide-dark-line">
              {fleurs.map((fleur) => (
                <tr
                  key={fleur.id}
                  className="hover:bg-graybg/50 dark:hover:bg-dark-surface/50 transition-colors"
                >
                  <td className="px-4 py-3 w-20">
                    <PhotoSlot
                      src={fleur.imageUrl}
                      alt={fleur.nom}
                      className="w-12 h-12"
                    />
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-medium text-ink dark:text-white">
                      {fleur.nom}
                    </p>

                    {fleur.description && (
                      <p className="max-w-xs truncate text-xs text-ink-soft dark:text-gray-400 mt-1">
                        {fleur.description}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right text-ink dark:text-white">
                    {formatAr(fleur.prix)}
                  </td>

                  <td className="px-4 py-3 text-center text-ink-soft dark:text-gray-400">
                    {fleur.stock}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {fleur.disponible ? (
                      <span className="text-sage font-bold">✓</span>
                    ) : (
                      <span className="text-red-500 font-bold">✕</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(fleur)}
                        className="text-xs font-semibold text-ink-soft dark:text-gray-300 hover:text-coral border border-line dark:border-dark-line rounded-sm px-3 py-1.5 transition-colors"
                      >
                        {t.admin.edit}
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(fleur.id, fleur.nom)
                        }
                        className="text-xs font-semibold text-red-500 hover:text-white hover:bg-red-500 border border-red-500/40 rounded-sm px-3 py-1.5 transition-colors"
                      >
                        {t.admin.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}