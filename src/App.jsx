import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [top10, setTop10] = useState([]);
  const [bottom10, setBottom10] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [viewFilter, setViewFilter] = useState("all"); // all | top | bottom

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);
    setTop10([]);
    setBottom10([]);
    setHasSearched(false);
    setViewFilter("all");

    try {
      const response = await axios.get(`http://localhost:3000/api/vacantes?busqueda=${query}`);
      let data = response.data.data || [];
      setResults(data); // Guardamos todos los resultados (con o sin salario)

      // Calcular salarios numéricos
      const dataConSalario = data.map((item) => {
        const salarioStr = item.sueldo || "";
        const numeros = salarioStr.match(/[\d,]+/g);
        let salarioNum = 0;

        if (numeros) {
          const lastNumber = numeros[numeros.length - 1].replace(/,/g, "");
          salarioNum = parseInt(lastNumber, 10);
        }

        return { ...item, salarioNum };
      }).filter((item) => item.salarioNum > 0);

      if (dataConSalario.length > 0) {
        const ordenDesc = [...dataConSalario].sort((a, b) => b.salarioNum - a.salarioNum);
        const ordenAsc = [...dataConSalario].sort((a, b) => a.salarioNum - b.salarioNum);

        let sliceCount = 10;
        if (dataConSalario.length <= 3) {
          sliceCount = 1;
        } else if (dataConSalario.length <= 10) {
          sliceCount = 3;
        }

        setTop10(ordenDesc.slice(0, sliceCount));
        setBottom10(ordenAsc.slice(0, sliceCount));
      }

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

      {hasSearched && !loading && results.length > 0 && (
        <>
          <div className="jobsearch-filter">
            <label>
              <input
                type="radio"
                name="viewFilter"
                value="all"
                checked={viewFilter === "all"}
                onChange={() => setViewFilter("all")}
              />
              Todos
            </label>

            <label>
              <input
                type="radio"
                name="viewFilter"
                value="top"
                checked={viewFilter === "top"}
                onChange={() => setViewFilter("top")}
              />
              Mejores salarios
            </label>

            <label>
              <input
                type="radio"
                name="viewFilter"
                value="bottom"
                checked={viewFilter === "bottom"}
                onChange={() => setViewFilter("bottom")}
              />
              Peores salarios
            </label>
          </div>

          <div className="jobsearch-results-container">
            {viewFilter === "all" && (
              <div className="jobsearch-results-column">
                <h2>Todos los empleos</h2>
                {results.map((item, idx) => (
                  <div key={idx} className="jobsearch-card">
                    <h3 className="jobsearch-card-title">{item?.titulo}</h3>
                    <p className="jobsearch-card-sueldo">{item?.sueldo}</p>
                    <p className="jobsearch-card-text">{item?.horario}</p>
                    <div className="jobsearch-card-footer">
                      <span>{item?.ciudadModalidad}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewFilter === "top" && top10.length > 0 && (
              <div className="jobsearch-results-column">
                <h2>Mejores salarios</h2>
                {top10.map((item, idx) => (
                  <div key={idx} className="jobsearch-card">
                    <h3 className="jobsearch-card-title">{item?.titulo}</h3>
                    <p className="jobsearch-card-sueldo">{item?.sueldo}</p>
                    <p className="jobsearch-card-text">{item?.horario}</p>
                    <div className="jobsearch-card-footer">
                      <span>{item?.ciudadModalidad}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewFilter === "bottom" && bottom10.length > 0 && (
              <div className="jobsearch-results-column">
                <h2>Peores salarios</h2>
                {bottom10.map((item, idx) => (
                  <div key={idx} className="jobsearch-card">
                    <h3 className="jobsearch-card-title">{item?.titulo}</h3>
                    <p className="jobsearch-card-sueldo">{item?.sueldo}</p>
                    <p className="jobsearch-card-text">{item?.horario}</p>
                    <div className="jobsearch-card-footer">
                      <span>{item?.ciudadModalidad}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(viewFilter === "top" && top10.length === 0) ||
            (viewFilter === "bottom" && bottom10.length === 0) ? (
              <p className="jobsearch-no-results">
                No hay suficientes empleos con salario para mostrar.
              </p>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
