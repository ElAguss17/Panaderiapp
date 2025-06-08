import React, { useEffect, useState } from "react";
import axios from "../api";

export default function PanDiario() {
  const [productosPorPrioridad, setProductosPorPrioridad] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPanDiario = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access");
        const hoy = new Date().toISOString().split("T")[0];
        // Endpoint backend: /api/pan-diario/?fecha=YYYY-MM-DD
        const res = await axios.get(`/api/pan-diario/?fecha=${hoy}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProductosPorPrioridad(res.data);
      } catch (err) {
        setError("Error al cargar el pan diario");
      } finally {
        setLoading(false);
      }
    };
    fetchPanDiario();
  }, []);

  if (loading) return <div>Cargando pan diario...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Pan Diario (Producción de Hoy)</h2>
      {Object.keys(productosPorPrioridad).length === 0 ? (
        <div className="alert alert-info">No hay pedidos para hoy.</div>
      ) : (
        Object.entries(productosPorPrioridad).sort(([a], [b]) => a - b).map(([prioridad, productos]) => (
          <div key={prioridad} className="mb-4">
            <h4 className="mb-3">Prioridad {prioridad}</h4>
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Producto</th>
                  <th>Cantidad total</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(prod => (
                  <tr key={prod.producto_id}>
                    <td>{prod.nombre}</td>
                    <td>{prod.cantidad_total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
