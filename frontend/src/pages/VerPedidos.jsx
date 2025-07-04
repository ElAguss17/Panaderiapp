import React, { useEffect, useState } from 'react';
import axios from '../api';

const VerPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('access');
        const userId = localStorage.getItem('usuario_id');
        // Usar solo pedidos futuros
        const res = await axios.get(`/pedidos-futuros/?usuario=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPedidos(res.data);
      } catch (err) {
        setError('Error al cargar los pedidos');
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  const handleEliminar = async (pedido_id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este pedido?')) return;
    try {
      const token = localStorage.getItem('access');
      await axios.delete(`/pedidos-futuros/${pedido_id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPedidos(pedidos.filter(p => p.pedido_id !== pedido_id));
    } catch (err) {
      alert('Error al eliminar el pedido');
    }
  };

  if (loading) return <div>Cargando pedidos...</div>;
  if (error) return <div>{error}</div>;

  // Ordenar pedidos de más nuevo a más viejo
  const pedidosOrdenados = [...pedidos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mis Pedidos Futuros</h2>
      {pedidosOrdenados.length === 0 ? (
        <div className="alert alert-info">No tienes pedidos futuros.</div>
      ) : (
        <div className="list-group">
          {pedidosOrdenados.map((pedido) => (
            <div
              key={pedido.pedido_id}
              className="list-group-item py-4 bg-primary bg-opacity-25 border-0"
              style={{ borderRadius: '0.5rem', marginBottom: '1rem' }}
            >
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-2 bg-primary bg-opacity-75 p-2 rounded">
                <div className="fs-5 fw-bold mb-2 mb-md-0 text-white">
                  Entrega: <span className="text-white">({pedido.fecha_entrega})</span>
                </div>
              </div>
              <div className="row mb-2 bg-success bg-opacity-75 p-2 rounded">
                <div className="col-12 col-md-4 mb-1">
                  <span className="fw-semibold text-white">Pedido:</span>
                  <span className="ms-2 badge bg-success text-white border border-success-subtle rounded-pill">
                    {new Date(pedido.fecha).toLocaleDateString()}
                  </span>
                </div>
                <div className="col-12 col-md-4 mb-1">
                  <span className="fw-semibold text-white">Recurrente:</span>
                  <span className={`ms-2 badge ${pedido.recurrente ? 'bg-info text-white' : 'bg-light text-dark border'}`}>{pedido.recurrente ? 'Sí' : 'No'}</span>
                </div>
                <div className="col-12 col-md-4 mb-1">
                  <span className="fw-semibold text-white">Fin:</span>
                  <span className={`ms-2 badge ${pedido.fecha_fin ? 'bg-warning text-dark' : 'bg-light text-muted border'}`}>{pedido.fecha_fin || '-'}</span>
                </div>
              </div>
              <div className="mt-2 bg-info bg-opacity-75 p-2 rounded">
                <div className="table-responsive">
                  <table className="table table-sm table-bordered align-middle mb-0">
                    <thead className="table-info">
                      <tr>
                        <th className="bg-info text-white">Producto</th>
                        <th className="bg-info text-white">Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedido.detalles && pedido.detalles.length > 0 ? (
                        pedido.detalles.map((detalle, idx) => (
                          <tr
                            key={detalle.detalle_id}
                            className={
                              idx % 2 === 0
                                ? 'bg-info bg-opacity-25'
                                : 'bg-info bg-opacity-50'
                            }
                          >
                            <td className="fw-semibold">{detalle.producto.nombre}</td>
                            <td><span className="badge bg-dark fs-6">{detalle.cantidad}</span></td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="2" className="text-center text-muted">Sin productos</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <button className="btn btn-danger px-4" onClick={() => handleEliminar(pedido.pedido_id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerPedidos;
