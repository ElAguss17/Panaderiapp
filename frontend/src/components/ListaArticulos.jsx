import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

function ListaArticulos() {
    const [articulos, setArticulos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticulos = async () => {
            try {
                const res = await api.get("/productos/");
                setArticulos(res.data);
            } catch (err) {
                setError("Error al cargar artículos");
            } finally {
                setLoading(false);
            }
        };
        fetchArticulos();
    }, []);

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este artículo?")) return;
        try {
            await api.delete(`/productos/${id}/`);
            setArticulos(articulos.filter(a => a.id !== id));
        } catch (err) {
            alert("Error al eliminar artículo");
        }
    };

    if (loading) return <div>Cargando artículos...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="container mt-4">
            <table className="table table-striped table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {articulos.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center">Lista vacía</td>
                        </tr>
                    ) : (
                        articulos.map(a => {
                            console.log(a); // <-- Añade esto temporalmente
                            return (
                                <tr key={a.producto_id}>
                                    <td>{a.nombre}</td>
                                    <td>{a.descripcion}</td>
                                    <td>{a.precio}</td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-primary btn-sm me-2"
                                            onClick={() => navigate(`/nuevo-articulo/${a.producto_id}`)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleEliminar(a.producto_id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ListaArticulos;