import Head from "next/head";
import { useState } from "react";

export default function HomePage() {
  const [criteria, setCriteria] = useState({
    transaction: "achat",
    property_type: "",
    country: "",
    city: "",
    neighborhood: "",
    min_bedrooms: "",
    max_bedrooms: "",
    has_garage: false,
    has_garden: false,
    has_terrace: false,
    min_price: "",
    max_price: ""
  });
  const [results, setResults] = useState([]);

  const typeOptions = [
    "Maison",
    "Appartement",
    "Projet neuf - Maisons",
    "Projet neuf - Appartements",
    "Maison de vacances",
    "Garage",
    "Bureau",
    "Commerce",
    "Industrie",
    "Terrain",
    "Immeuble de rapport",
    "Autre"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCriteria((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(criteria).forEach(([k, v]) => {
      if (v !== "" && v !== false) params.append(k, v);
    });
    const res = await fetch(`/api/properties?${params.toString()}`);
    setResults(await res.json());
  };

  return (
    <>
      <Head>
        <title>AIRealtyScout – Recherche immobilière intelligente</title>
        <meta
          name="description"
          content="Trouvez votre bien idéal grâce à notre moteur de recherche immobilier alimenté par l'IA."
        />
      </Head>

      <main className="min-h-screen bg-gray-50 p-8">
        <section className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
          <h1 className="text-4xl font-extrabold text-center mb-6">
            AIRealtyScout
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Définissez vos critères et lancez votre recherche immobilière.
          </p>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Transaction */}
            <select
              name="transaction"
              value={criteria.transaction}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="achat">Achat</option>
              <option value="location">Location</option>
            </select>

            {/* Type de bien */}
            <select
              name="property_type"
              value={criteria.property_type}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Type de bien</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* Localisation */}
            <input
              name="country"
              placeholder="Pays"
              value={criteria.country}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="city"
              placeholder="Ville"
              value={criteria.city}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="neighborhood"
              placeholder="Quartier"
              value={criteria.neighborhood}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            {/* Chambres */}
            <div className="flex gap-2">
              <input
                type="number"
                name="min_bedrooms"
                placeholder="Chambres min"
                value={criteria.min_bedrooms}
                onChange={handleChange}
                className="border p-2 rounded flex-1"
              />
              <input
                type="number"
                name="max_bedrooms"
                placeholder="Chambres max"
                value={criteria.max_bedrooms}
                onChange={handleChange}
                className="border p-2 rounded flex-1"
              />
            </div>

            {/* Équipements */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="has_garage"
                checked={criteria.has_garage}
                onChange={handleChange}
              />{" "}
              Garage
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="has_garden"
                checked={criteria.has_garden}
                onChange={handleChange}
              />{" "}
              Jardin
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="has_terrace"
                checked={criteria.has_terrace}
                onChange={handleChange}
              />{" "}
              Terrasse
            </label>

            {/* Budget */}
            <div className="flex gap-2 md:col-span-2">
              <input
                type="number"
                name="min_price"
                placeholder="Prix min (€)"
                value={criteria.min_price}
                onChange={handleChange}
                className="border p-2 rounded flex-1"
              />
              <input
                type="number"
                name="max_price"
                placeholder="Prix max (€)"
                value={criteria.max_price}
                onChange={handleChange}
                className="border p-2 rounded flex-1"
              />
            </div>

            {/* Bouton */}
            <button
              type="submit"
              className="md:col-span-2 bg-blue-600 text-white py-2 rounded-2xl hover:bg-blue-700 transition"
            >
              Rechercher
            </button>
          </form>
        </section>

        {/* Résultats */}
        <section className="max-w-4xl mx-auto mt-8 space-y-6">
          {results.map((prop) => (
            <div
              key={prop.id}
              className="border p-4 rounded-2xl shadow-md"
            >
              <h2 className="font-semibold text-xl">{prop.title}</h2>
              <p className="text-gray-600">
                {prop.location} – {prop.price} €
              </p>
              <div className="flex flex-wrap gap-2 mt-2 text-sm">
                {prop.bedrooms > 0 && <span>{prop.bedrooms} ch.</span>}
                {prop.has_garage && <span>Garage</span>}
                {prop.has_garden && <span>Jardin</span>}
                {prop.has_terrace && <span>Terrasse</span>}
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
