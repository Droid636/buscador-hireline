import { useState } from "react";
import axios from "axios";
import "./JobSearch.css"; 

export default function JobSearch() {
  // Estados para el input, los resultados, la carga, los errores y si se buscó
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Función que realiza la búsqueda
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
    <div className="jobsearch-container">
      <h1 className="jobsearch-title">Buscador de empleos en Hireline</h1>

      <div className="jobsearch-form">
        <input
          className="jobsearch-input"
          type="text"
          placeholder="Ejemplo: mongo"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="jobsearch-button"
          onClick={handleSearch}
          disabled={loading}
        >
          Buscar
        </button>
      </div>

      {loading && (
        <div className="jobsearch-loading">
          <div className="jobsearch-spinner"></div>
          Buscando...
        </div>
      )}

      {error && <p className="jobsearch-error">{error}</p>}

      {hasSearched && !loading && results.length === 0 && !error && (
        <p className="jobsearch-no-results">No se encontraron resultados.</p>
      )}

      <div className="jobsearch-results">
        {results.map((item, idx) => (
          <div key={idx} className="jobsearch-card">
            <h2 className="jobsearch-card-title">{item.titulo}</h2>
            <p className="jobsearch-card-sueldo">{item.sueldo}</p>
            <p className="jobsearch-card-text">{item.descripcion}</p>
            <div className="jobsearch-card-footer">
              <span>{item.ubicacion}</span> | <span>{item.tipo}</span> | <span>{item.fecha}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
