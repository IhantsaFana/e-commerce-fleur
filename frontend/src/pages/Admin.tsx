import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Fleur, Categorie, formatAr } from "../data/products";
import {
  getFleurs,
  getCategories,
  saveFleur,
  deleteFleur,
  saveCategorie,
  deleteCategorie,
  nextFleurId,
  nextCategorieId,
} from "../services/productStore";
import PhotoSlot from "../components/PhotoSlot";

type Tab = "produits" | "categories";

const emptyFleur = (): Fleur => ({
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

  const [tab, setTab] = useState<Tab>("produits");
  const [fleurs, setFleurs] = useState<Fleur[]>(() => getFleurs());
  const [categories, setCategories] = useState<Categorie[]>(() =>
    getCategories()
  );
  const [editing, setEditing] = useState<Fleur | null>(null);
  const [form, setForm] = useState<Fleur>(emptyFleur());
  const [newCat, setNewCat] = useState("");

  // Accès réservé uniquement au rôle Admin.
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

  const refresh = () => {
    setFleurs(getFleurs());
    setCategories(getCategories());
  };

  const catMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category.nom])),
    [categories]
  );

  const inputClass =
    "w-full border border-line dark:border-dark-line bg-white dark:bg-dark-surface text-ink dark:text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-coral transition-colors duration-200";

  const updateForm = (field: keyof Fleur, value: any) =>
    setForm((current) => ({ ...current, [field]: value }));

  const startAdd = () => {
    const id = nextFleurId();
    const newFleur = { ...emptyFleur(), id };

    setEditing(newFleur);
    setForm(newFleur);
  };

  const startEdit = (fleur: Fleur) => {
    setEditing(fleur);
    setForm({ ...fleur });
  };

  const handleSaveFleur = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nom.trim()) return;

    saveFleur({
      ...form,
      nom: form.nom.trim(),
    });

    refresh();
    setEditing(null);
    showToast(t.admin.saved, "success");
  };

  const handleDeleteFleur = (id: number) => {
    if (!window.confirm(t.admin.confirmDelete)) return;

    deleteFleur(id);
    refresh();
    showToast(t.admin.deleted, "success");
  };

  const handleAddCat = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCat.trim()) return;

    saveCategorie({
      id: nextCategorieId(),
      nom: newCat.trim(),
      description: "",
    });

    setNewCat("");
    refresh();
    showToast(t.admin.saved, "success");
  };

  const handleDeleteCat = (id: number) => {
    const inUse = fleurs.some((fleur) => fleur.categorieId === id);

    if (inUse) {
      showToast(t.admin.categoryInUse, "error");
      return;
    }

    if (!window.confirm(t.admin.confirmDelete)) return;

    deleteCategorie(id);
    refresh();
    showToast(t.admin.deleted, "success");
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 animate-fade-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-ink dark:text-white">
            {t.admin.title}
          </h1>

          <p className="text-sm text-ink-soft dark:text-gray-400">
            {t.admin.subtitle}
          </p>
        </div>

        <Link
          to="/"
          className="text-xs text-ink-soft dark:text-gray-400 hover:text-coral transition-colors"
        >
          ← {t.admin.backHome}
        </Link>
      </div>

      <div className="flex mb-6 border border-line dark:border-dark-line rounded-lg p-1 bg-graybg dark:bg-dark-surface w-fit">
        <button
          onClick={() => setTab("produits")}
          className={`px-5 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
            tab === "produits"
              ? "bg-white dark:bg-dark-bg text-coral shadow-sm"
              : "text-ink-soft dark:text-gray-400"
          }`}
        >
          {t.admin.productsTab} ({fleurs.length})
        </button>

        <button
          onClick={() => setTab("categories")}
          className={`px-5 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
            tab === "categories"
              ? "bg-white dark:bg-dark-bg text-coral shadow-sm"
              : "text-ink-soft dark:text-gray-400"
          }`}
        >
          {t.admin.categoriesTab} ({categories.length})
        </button>
      </div>

      {tab === "produits" && (
        <div className="space-y-6">
          {!editing && (
            <button
              onClick={startAdd}
              className="bg-sage hover:bg-sage-dark text-white text-sm font-semibold px-5 py-2.5 rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              + {t.admin.addProduct}
            </button>
          )}

          {editing && (
            <form
              onSubmit={handleSaveFleur}
              className="border border-line dark:border-dark-line rounded-sm p-6 bg-white dark:bg-dark-surface space-y-4"
            >
              <h2 className="font-display text-lg text-ink dark:text-white">
                {fleurs.some((fleur) => fleur.id === editing.id)
                  ? t.admin.editProduct
                  : t.admin.addProduct}
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">
                    {t.admin.name}
                  </label>

                  <input
                    value={form.nom}
                    onChange={(e) => updateForm("nom", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">
                    {t.admin.category}
                  </label>

                  <select
                    value={form.categorieId}
                    onChange={(e) =>
                      updateForm("categorieId", Number(e.target.value))
                    }
                    className={inputClass}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">
                    {t.admin.price} (Ar)
                  </label>

                  <input
                    type="number"
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
                    value={form.stock}
                    onChange={(e) =>
                      updateForm("stock", Number(e.target.value))
                    }
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">
                    {t.admin.image}
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
                    {t.admin.description}
                  </label>

                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      updateForm("description", e.target.value)
                    }
                    rows={3}
                    className={inputClass}
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

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-sage hover:bg-sage-dark text-white text-sm font-semibold px-6 py-2.5 rounded-sm transition-colors"
                >
                  {t.admin.save}
                </button>

                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="border border-line dark:border-dark-line text-ink-soft dark:text-gray-300 text-sm font-semibold px-6 py-2.5 rounded-sm hover:text-coral transition-colors"
                >
                  {t.admin.cancel}
                </button>
              </div>
            </form>
          )}

          <div className="border border-line dark:border-dark-line rounded-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-graybg dark:bg-dark-surface text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-ink dark:text-white">
                    {t.admin.image}
                  </th>
                  <th className="px-4 py-3 font-semibold text-ink dark:text-white">
                    {t.admin.name}
                  </th>
                  <th className="px-4 py-3 font-semibold text-ink dark:text-white">
                    {t.admin.category}
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
                    <td className="px-4 py-3 w-16">
                      <PhotoSlot
                        src={fleur.imageUrl}
                        alt={fleur.nom}
                        className="w-12 h-12"
                      />
                    </td>

                    <td className="px-4 py-3 text-ink dark:text-white font-medium">
                      {fleur.nom}
                    </td>

                    <td className="px-4 py-3 text-ink-soft dark:text-gray-400">
                      {catMap.get(fleur.categorieId) ?? "-"}
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
                          className="text-xs font-semibold text-ink-soft dark:text-gray-300 hover:text-coral border border-line dark:border-dark-line rounded-sm px-3 py-1 transition-colors"
                        >
                          {t.admin.edit}
                        </button>

                        <button
                          onClick={() => handleDeleteFleur(fleur.id)}
                          className="text-xs font-semibold text-red-500 hover:text-white hover:bg-red-500 border border-red-500/40 rounded-sm px-3 py-1 transition-colors"
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
        </div>
      )}

      {tab === "categories" && (
        <div className="space-y-6 max-w-2xl">
          <form onSubmit={handleAddCat} className="flex gap-3">
            <input
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder={t.admin.newCategory}
              className={inputClass}
            />

            <button
              type="submit"
              className="bg-sage hover:bg-sage-dark text-white text-sm font-semibold px-5 py-2 rounded-sm whitespace-nowrap transition-colors"
            >
              + {t.admin.add}
            </button>
          </form>

          <div className="border border-line dark:border-dark-line rounded-sm overflow-hidden">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between px-4 py-3 border-b border-line dark:border-dark-line last:border-b-0"
              >
                <div>
                  <span className="font-medium text-ink dark:text-white">
                    {category.nom}
                  </span>

                  <span className="ml-3 text-xs text-ink-soft dark:text-gray-500">
                    {
                      fleurs.filter(
                        (fleur) => fleur.categorieId === category.id
                      ).length
                    }{" "}
                    {t.admin.articles}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteCat(category.id)}
                  className="text-xs font-semibold text-red-500 hover:text-white hover:bg-red-500 border border-red-500/40 rounded-sm px-3 py-1 transition-colors"
                >
                  {t.admin.delete}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}