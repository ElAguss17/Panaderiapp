import { useEffect, useState } from "react";
import api from "../api";

export default function CarritoPedidos() {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [fechaEntrega, setFechaEntrega] = useState("");
    const [recurrente, setRecurrente] = useState(false);
    const [fechaFin, setFechaFin] = useState("");
    const [procesandoPedido, setProcesandoPedido] = useState(false);

    const usuarioId = localStorage.getItem("usuario_id");
    console.log("ID del usuario:", usuarioId); 
    useEffect(() => {
        api.get("/productos/").then(res => setProductos(res.data));
    }, []);

    // Fecha mínima permitida (pasado mañana)
    const hoy = new Date();
    const pasadoManana = new Date(hoy);
    pasadoManana.setDate(hoy.getDate() + 2);
    const minFechaEntrega = pasadoManana.toISOString().split("T")[0];

    //Comprobar fecha que no sa pasada

    const isFechaValida = (fecha) => {
        if (!fecha) return false;
        const fechaInput = new Date(fecha);
        return fechaInput >= pasadoManana;
    };

    // const isFechaValida = () => true;

    const agregarAlCarrito = (producto) => {
        setCarrito(prev =>
            prev.find(p => p.producto_id === producto.producto_id)
                ? prev.map(p => p.producto_id === producto.producto_id ? { ...p, cantidad: p.cantidad + 1 } : p)
                : [...prev, { ...producto, cantidad: 1 }]
        );
    };

    const quitarDelCarrito = (producto_id) => {
        setCarrito(prev => prev.filter(p => p.producto_id !== producto_id));
    };

    const hacerPedido = async () => {
        if (procesandoPedido) return;
        setProcesandoPedido(true);
        try {
            if (!usuarioId) {
                alert("Debes iniciar sesión para hacer un pedido.");
                return;
            }
            if (!fechaEntrega) {
                alert("Selecciona una fecha de entrega");
                return;
            }
            if (!isFechaValida(fechaEntrega)) {
                alert("La fecha de entrega debe ser al menos pasado mañana.");
                return;
            }
            if (recurrente && !fechaFin) {
                alert("Selecciona la fecha de fin para el pedido recurrente");
                return;
            }
            if (recurrente && !isFechaValida(fechaFin)) {
                alert("La fecha de fin debe ser al menos pasado mañana.");
                return;
            }
            if (recurrente && fechaFin < fechaEntrega) {
                alert("La fecha de fin no puede ser anterior a la de entrega.");
                return;
            }
            if (carrito.length === 0) {
                alert("El carrito está vacío");
                return;
            }
            if (recurrente) {
                // Crear un pedido para cada día entre fechaEntrega y fechaFin (inclusive)
                let current = new Date(fechaEntrega);
                const end = new Date(fechaFin);
                while (current <= end) {
                    const fechaActual = current.toISOString().split("T")[0];
                    const pedidoRes = await api.post("/pedidos/", {
                        cliente: usuarioId,
                        fecha_entrega: fechaActual,
                        recurrente: true, // marcar como recurrente
                        fecha_fin: fechaFin, // incluir la fecha de fin original
                    });
                    const pedidoId = pedidoRes.data.pedido_id;
                    await Promise.all(
                        carrito.map(item =>
                            api.post("/pedidosdetalle/", {
                                pedido: pedidoId,
                                producto: item.producto_id,
                                cantidad: item.cantidad,
                            })
                        )
                    );
                    current.setDate(current.getDate() + 1);
                }
                alert("¡Pedidos recurrentes realizados con éxito!");
            } else {
                // Pedido único
                const pedidoRes = await api.post("/pedidos/", {
                    cliente: usuarioId,
                    fecha_entrega: fechaEntrega,
                    recurrente,
                    fecha_fin: recurrente ? fechaFin : null,
                });
                const pedidoId = pedidoRes.data.pedido_id;
                await Promise.all(
                    carrito.map(item =>
                        api.post("/pedidosdetalle/", {
                            pedido: pedidoId,
                            producto: item.producto_id,
                            cantidad: item.cantidad,
                        })
                    )
                );
                alert("¡Pedido realizado con éxito!");
            }
            setCarrito([]);
            setFechaEntrega("");
            setFechaFin("");
            setRecurrente(false);
        } catch (error) {
            alert("Error al realizar el pedido");
            console.error(error);
        } finally {
            setProcesandoPedido(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-success" onClick={hacerPedido} disabled={carrito.length === 0 || procesandoPedido}>
                    Hacer pedido
                </button>
                <button className="btn btn-primary" onClick={() => window.location.href = '/ver-pedidos'}>
                    Ver pedidos
                </button>
            </div>
            {/* Formulario de fechas y recurrencia */}
            <div className="mb-3">
                <label className="form-label">Fecha de entrega:</label>
                <input
                    type="date"
                    className="form-control"
                    value={fechaEntrega}
                    min={minFechaEntrega}
                    onChange={e => setFechaEntrega(e.target.value)}
                    required
                />
                <div className="form-check mt-2">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={recurrente}
                        onChange={e => setRecurrente(e.target.checked)}
                        id="recurrenteCheck"
                    />
                    <label className="form-check-label" htmlFor="recurrenteCheck">
                        ¿Repetir todos los días hasta la fecha?
                    </label>
                </div>
                {recurrente && (
                    <div className="mt-2">
                        <label className="form-label">Fecha de fin:</label>
                        <input
                            type="date"
                            className="form-control"
                            value={fechaFin}
                            min={fechaEntrega}
                            onChange={e => setFechaFin(e.target.value)}
                            required={recurrente}
                        />
                    </div>
                )}
            </div>
            <h3 className="mt-4">Carrito</h3>
            {carrito.length === 0 ? (
                <div>El carrito está vacío</div>
            ) : (
                <ul className="list-group">
                    {carrito.map(item => (
                        <li className="list-group-item d-flex justify-content-between align-items-center" key={item.producto_id}>
                            {item.nombre} x {item.cantidad}
                            <button className="btn btn-danger btn-sm" onClick={() => quitarDelCarrito(item.producto_id)}>
                                Quitar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <h3 className="mt-4">Productos</h3>
            <div className="row">
                {productos.map(producto => (
                    <div className="col-md-4 mb-3" key={producto.producto_id}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{producto.nombre}</h5>
                                <p className="card-text">{producto.descripcion}</p>
                                <p className="card-text">Precio: {producto.precio} €</p>
                                <button className="btn btn-outline-primary" onClick={() => agregarAlCarrito(producto)}>
                                    Añadir al carrito
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}