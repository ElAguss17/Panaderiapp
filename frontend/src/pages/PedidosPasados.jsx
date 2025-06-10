import React, { useEffect, useState } from 'react';
import axios from '../api';

const PedidosPasados = () => {
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
        const res = await axios.get(`/api/pedidos-pasados/?usuario=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPedidos(res.data);
      } catch (err) {
        setError('Error al cargar los pedidos pasados');
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  if (loading) return <div>Cargando pedidos pasados...</div>;
  if (error) return <div>{error}</div>;

  const pedidosOrdenados = [...pedidos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Facturas (Pedidos Pasados)</h2>
      {pedidosOrdenados.length === 0 ? (
        <div className="alert alert-info">No tienes pedidos pasados.</div>
      ) : (
        <div className="list-group">
          {pedidosOrdenados.map((pedido) => (
            <div
              key={pedido.pedido_id}
              className="list-group-item py-4 bg-primary bg-opacity-10 border-0"
              style={{ borderRadius: '0.5rem', marginBottom: '1rem' }}
            >
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-2 bg-primary bg-opacity-75 p-2 rounded">
                <div className="fs-5 fw-bold mb-2 mb-md-0 text-white">
                  Pedido <span className="text-white">({new Date(pedido.fecha).toLocaleDateString()})</span>
                </div>
                {/* SOlo si es admin/panadero muestra el cliente */}
                {(localStorage.getItem('tipo_usuario') === 'admin' || localStorage.getItem('tipo_usuario') === 'panadero') && (
                  <div className="text-white fw-semibold">
                    Cliente: <span className="badge bg-light text-dark">{pedido.cliente_nombre}</span>
                  </div>
                )}
              </div>
              <div className="row mb-2 bg-success bg-opacity-75 p-2 rounded">
                <div className="col-12 col-md-4 mb-1">
                  <span className="fw-semibold text-white">Entrega:</span>
                  <span className="ms-2 badge bg-success text-white border border-success-subtle rounded-pill">
                    {pedido.fecha_entrega}
                  </span>
                </div>
                <div className="col-12 col-md-4 mb-1">
                  <span className="fw-semibold text-white">Recurrente:</span>
                  <span className={`ms-2 badge ${pedido.recurrente ? 'bg-info text-white' : 'bg-light text-dark border'}`}>{pedido.recurrente ? 'Sí' : 'No'}</span>
                </div>
                <div className="col-12 col-md-4 mb-1 d-flex align-items-center gap-2">
                  <span className="fw-semibold text-white">Fin:</span>
                  <span className={`ms-2 badge ${pedido.fecha_fin ? 'bg-warning text-dark' : 'bg-light text-muted border'}`}>{pedido.fecha_fin || '-'}</span>
                  {/* Checkbox pagada admin/panadero */}
                  {(localStorage.getItem('tipo_usuario') === 'admin' || localStorage.getItem('tipo_usuario') === 'panadero') && (
                    <>
                      <span className="fw-semibold text-white ms-3">Pagada:</span>
                      <input
                        type="checkbox"
                        checked={pedido.pagada}
                        onChange={async (e) => {
                          // Arreglar actualizacion
                          ////////////////////
                          ///////////////////
                          setPedidos(prev => prev.map(p => p.pedido_id === pedido.pedido_id ? { ...p, pagada: e.target.checked } : p));
                          try {
                            const token = localStorage.getItem('access');
                            await axios.patch(`/api/pedidos/${pedido.pedido_id}/`, { pagada: e.target.checked }, {
                              headers: { Authorization: `Bearer ${token}` },
                            });
                          } catch (err) {
                            alert('Error al actualizar el estado de pagada');
                            // Si hay error no cambia nada
                            setPedidos(prev => prev.map(p => p.pedido_id === pedido.pedido_id ? { ...p, pagada: !e.target.checked } : p));
                          }
                        }}
                        style={{ transform: 'scale(1.3)' }}
                      />
                    </>
                  )}
                  {/* Si no, solo muestra el estado */}
                  {(localStorage.getItem('tipo_usuario') === 'cliente') && (
                    <span className={`ms-2 badge ${pedido.pagada ? 'bg-success' : 'bg-secondary'}`}>{pedido.pagada ? 'Pagada' : 'No pagada'}</span>
                  )}
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
                <button className="btn btn-success px-4" onClick={() => alert('Funcionalidad de factura próximamente')}>
                  Factura
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidosPasados;
