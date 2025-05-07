import Head from "next/head";
import { useState } from "react";

export default function HomePage() {
  const [criteria, setCriteria] = useState({
    transaction: "achat",
    property_type: "",
    continent: "",
    country: "",
    commune: "",
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

  const locationOptions = {
    Europe: {
      France: ["Paris", "Lyon", "Marseille", "Bordeaux", "Nice", "Cannes", "Saint-Tropez"],
      Monaco: ["Monaco"],
      Belgique: [
        "Anderlecht", "Auderghem", "Berchem-Sainte-Agathe", "Bruxelles-ville",
        "Etterbeek", "Evere", "Forest", "Ganshoren", "Ixelles", "Jette",
        "Koekelberg", "Molenbeek-Saint-Jean", "Saint-Gilles", "Saint-Josse-ten-Noode",
        "Schaerbeek", "Uccle", "Watermael-Boitsfort", "Woluwe-Saint-Lambert", "Woluwe-Saint-Pierre"
      ],
      Espagne: ["Madrid", "Barcelone", "Valence", "Séville", "Ibiza", "Formentera", "Palma", "Minorque", "Malaga", "Alicante", "Benidorm", "Bilbao"],
      Allemagne: ["Berlin", "Munich", "Francfort", "Hambourg"],
      Italie: ["Rome", "Milan", "Venise", "Florence"]
    },
    "États-Unis": {
      "États-Unis": ["New York", "Los Angeles", "Chicago", "Houston", "Miami"]
    },
    Afrique: {
      Maroc: ["Casablanca", "Rabat", "Marrakech", "Tanger"],
      Algérie: ["Alger", "Oran", "Constantine"],
      Tunisie: ["Tunis", "Sfax", "Sousse"],
      Sénégal: ["Dakar", "Saint-Louis", "Thiès"],
      "Afrique du Sud": ["Le Cap", "Johannesburg", "Durban"]
    },
    Asie: {
      Chine: ["Pékin", "Shanghai", "Shenzhen"],
      Japon: ["Tokyo", "Osaka", "Kyoto"],
      Inde: ["Mumbai", "Delhi", "Bangalore"],
      Thaïlande: ["Bangkok", "Chiang Mai"],
      Vietnam: ["Hanoï", "Ho Chi Minh"],
      Cambodge: ["Phnom Penh", "Siem Reap"],
      Indonésie: ["Bali", "Jakarta", "Surabaya"]
    },
    Océanie: {
      Australie: ["Sydney", "Melbourne", "Brisbane", "Perth"],
      "Nouvelle-Zélande": ["Auckland", "Wellington", "Christchurch"]
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCriteria((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "continent" && { country: "", commune: "" }),
      ...(name === "country" && { commune: "" })
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

  const continents = Object.keys(locationOptions);
  const countries = criteria.continent ? Object.keys(locationOptions[criteria.continent]) : [];
  const communes = criteria.continent && criteria.country ? locationOptions[criteria.continent][criteria.country] : [];

  return (
    <>
      <Head>
        <title>SmartPropertyHunter – Recherche immobilière intelligente</title>
        <meta
          name="description"
          content="Trouvez votre bien idéal grâce à SmartPropertyHunter, votre assistant immobilier alimenté par l'IA."
        />
      </Head>

      <main className="min-h-screen bg-gray-50 p-8">
        <section className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
          <h1 className="text-4xl font-extrabold text-center mb-6">SmartPropertyHunter</h1>
          <p className="text-center text-gray-600 mb-8">
            Définissez vos critères et lancez votre recherche immobilière.
          </p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="transaction"
              value={criteria.transaction}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="achat">Achat</option>
              <option value="location">Location</option>
            </select>

            <select
              name="property_type"
              value={criteria.property_type}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Type de bien</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              name="continent"
              value={criteria.continent}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Continent</option>
              {continents.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              name="country"
              value={criteria.country}
              onChange={handleChange}
              disabled={!criteria.continent}
              className="border p-2 rounded"
            >
              <option value="">Pays</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Commune (remplace Ville) */}
            <select
              name="commune"
              value={criteria.commune}
              onChange={handleChange}
              disabled={!criteria.country}
              className="border p-2 rounded"
            >
              <option value="">Commune</option>
              {communes.map((com) => (
                <option key={com} value={com}>{com}</option>
              ))}
            </select>

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

            <label className="flex items-center gap-2">
              <input type="checkbox" name="has_garage" checked={criteria.has_garage} onChange={handleChange} /> Garage
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" name="has_garden" checked={criteria.has_garden} onChange={handleChange} /> Jardin
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" name="has_terrace" checked={criteria.has_terrace} onChange={handleChange} /> Terrasse
            </label>

            <div className="flex gap-2">
              <input
                type="number"
                name="min_price"
                placeholder="Prix min"
                value={criteria.min_price}
                onChange={handleChange}
                className="border p-2 rounded flex-1"
              />
              <input
                type="number"
                name="max_price"
                placeholder="Prix max"
                value={criteria.max_price}
                onChange={handleChange}
                className="border p-2 rounded flex-1"
              />
            </div>

            <button
              type="submit"
              className="col-span-1 md:col-span-2 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            >
              Rechercher
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
