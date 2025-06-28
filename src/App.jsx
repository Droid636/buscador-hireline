import { useState } from "react";
import axios from "axios";

export default function JobSearch() {
  // Estados para el input, los resultados, la carga, el error y si se hizo una búsqueda
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Función que realiza la búsqueda al hacer clic en el botón
  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);
    setHasSearched(false);

    try {
      const response = await axios.post("http://localhost:3000/search", { query });
      setResults(response.data);
    } catch (err) {
      setError("Error al conectar con el servidor de scraping.");
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h1 className="text-xl font-bold mb-4 text-center text-gray-800">Buscador de empleos en Hireline</h1>

      {/* Input de búsqueda y botón */}
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          placeholder="Ejemplo: mongo"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSearch}
          disabled={loading}
        >
          Buscar
        </button>
      </div>

      {/* Spinner de carga */}
      {loading && (
        <div className="flex justify-center items-center my-4">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-blue-600">Buscando...</span>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Si ya se hizo una búsqueda pero no hay resultados */}
      {hasSearched && !loading && results.length === 0 && !error && (
        <p className="text-gray-600 text-center">No se encontraron resultados.</p>
      )}

      {/* Resultados */}
      <div className="mt-4 space-y-4">
        {results.map((item, idx) => (
          <div key={idx} className="border border-gray-300 rounded p-4 bg-gray-50 hover:bg-gray-100 transition">
            <h2 className="font-semibold text-lg text-gray-800">{item.titulo}</h2>
            <p className="text-sm text-blue-700 font-medium">{item.sueldo}</p>
            <p className="mt-2 text-gray-700 text-sm">{item.descripcion}</p>
            <div className="text-xs text-gray-500 mt-2">
              <span>{item.ubicacion}</span> | <span>{item.tipo}</span> | <span>{item.fecha}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
