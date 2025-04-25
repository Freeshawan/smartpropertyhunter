import { useEffect, useState } from 'react';

export default function Home() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => setProperties(data));
  }, []);

  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold">SmartPropertyHunter</h1>
      <p className="mt-4">Biens disponibles :</p>
      <ul className="mt-2 list-disc list-inside">
        {properties.map(prop => (
          <li key={prop.id} className="mt-1">
            <strong>{prop.title}</strong> – {prop.price} € – {prop.location}
          </li>
        ))}
      </ul>
    </div>
  );
}
