import { useState, useEffect } from "react";
import api from "../api";
import PanDiario from "./PanDiario";
import "../styles/Home.css"

function Home() {
  const [pedidoHoy, setPedidoHoy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Para clientes 
  useEffect(() => {
    const tipo = localStorage.getItem("tipo_usuario");
    if (tipo === "cliente") {
      // Soldo muestra los  pedidos para hoy
      const fetchPedidoHoy = async () => {
        setLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem("access");
          const userId = localStorage.getItem("usuario_id");
          const hoy = new Date().toISOString().split("T")[0];
          const res = await api.get(`/api/pedidos-pasados/?usuario=${userId}`);
          // Filtrar solo el pedido de hoy
          const pedidosHoy = res.data.filter(p => p.fecha_entrega === hoy);
          setPedidoHoy(pedidosHoy);
        } catch (err) {
          setError("Error al cargar tu pedido de hoy");
        } finally {
          setLoading(false);
        }
      };
      fetchPedidoHoy();
    }
  }, []);
  //paar admin/panaderos
  const tipo = localStorage.getItem("tipo_usuario");

  if (tipo === "admin" || tipo === "panadero") {
    return <PanDiario />;
  }

  // para clientes
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Tu pedido para hoy</h2>
      {loading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : pedidoHoy && pedidoHoy.length > 0 ? (
        <div className="list-group">
          {pedidoHoy.map((pedido) => (
            <div key={pedido.pedido_id} className="list-group-item mb-3">
              <div className="fw-bold">Pedido #{pedido.pedido_id}</div>
              <div>Fecha de entrega: {pedido.fecha_entrega}</div>
              <div>
                <strong>Productos:</strong>
                <ul>
                  {pedido.detalles && pedido.detalles.length > 0 ? (
                    pedido.detalles.map((detalle) => (
                      <li key={detalle.detalle_id}>
                        {detalle.producto.nombre} x {detalle.cantidad}
                      </li>
                    ))
                  ) : (
                    <li>Sin productos</li>
                  )}
                </ul>
              </div>
              <div>
                Estado: {pedido.pagada ? <span className="badge bg-success">Pagada</span> : <span className="badge bg-secondary">No pagada</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">No tienes pedido para hoy.</div>
      )}
    </div>
  );
}

export default Home;
