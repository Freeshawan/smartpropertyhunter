import Head from "next/head";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [criteria, setCriteria] = useState({
    transaction: 'achat',
    property_type: '',
    continent: '',
    country: '',
    city: '',
    neighborhood: '',
    min_bedrooms: '',
    max_bedrooms: '',
    has_garage: false,
    has_garden: false,
    has_terrace: false,
    min_price: '',
    max_price: ''
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

  const continentOptions = {
    Europe: ["France", "Belgique", "Espagne", "Allemagne", "Italie"],
    USA: ["États-Unis"],
    Afrique: ["Maroc", "Algérie", "Tunisie", "Sénégal"],
    Asie: ["Chine", "Japon", "Inde", "Thaïlande"],
    Océanie: ["Australie", "Nouvelle-Zélande"]
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setCriteria(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'continent' && { country: '' }) // reset country on continent change
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(criteria).forEach(([k, v]) => {
      if (v !== '' && v !== false) params.append(k, v);
    });
    const res = await fetch(`/api/properties?${params.toString()}`);
    setResults(await res.json());
  };

  return (
    <>
      <Head>
        <title>AIRealtyScout – Recherche immobilière intelligente</title>
        <meta name="description" content="Trouvez votre bien idéal grâce à notre recherche IA." />
      </Head>

      <main className="min-h-screen bg-gray-50 p-8">
        <section className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
          <h1 className="text-4xl font-extrabold text-center mb-6">AIRealtyScout</h1>
          <p className="text-center text-gray-600 mb-8">Définissez vos critères et lancez votre recherche immobilière.</p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Transaction */}
            <select name="transaction" value={criteria.transaction} onChange={handleChange} className="border p-2 rounded">
              <option value="achat">Achat</option>
              <option value="location">Location</option>
            </select>

            {/* Type de bien */}
            <select name="property_type" value={criteria.property_type} onChange={handleChange} className="border p-2 rounded">
              <option value="">Type de bien</option>
              {typeOptions.map(type => (<option key={type} value={type}>{type}</option>))}
            </select>

            {/* Continent */}
            <select name="continent" value={criteria.continent} onChange={handleChange} className="border p-2 rounded">
              <option value="">Continent</option>
              {Object.keys(continentOptions).map(cont => (<option key={cont} value={cont}>{cont}</option>))}
            </select>

            {/* Country */}
            <select name="country" value={criteria.country} onChange={handleChange} className="border p-2 rounded" disabled={!criteria.continent}>
              <option value="">Pays</option>
              {criteria.continent && continentOptions[criteria.continent].map(ct => (<option key={ct} value={ct}>{ct}</option>))}
            </select>

            {/* Ville et quartier */}
            <input name="city" placeholder="Ville" value={criteria.city} onChange={handleChange} className="border p-2 rounded" />
