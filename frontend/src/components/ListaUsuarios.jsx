import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

function ListaUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const res = await api.get("/usuarios/");
                setUsuarios(res.data);
            } catch (err) {
                setError("Error al cargar usuarios");
            } finally {
                setLoading(false);
            }
        };
        fetchUsuarios();
    }, []);

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
        try {
            await api.delete(`/usuarios/${id}/`);
            setUsuarios(usuarios.filter(u => u.id !== id));
        } catch (err) {
            alert("Error al eliminar usuario");
        }
    };

    if (loading) return <div>Cargando usuarios...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="container mt-4">
            <table className="table table-striped table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>Usuario</th>
                        <th>Tienda</th>
                        <th>Teléfono</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.length === 0 ? (
                        <tr key="empty">
                            <td colSpan={5} className="text-center">Lista vacía</td>
                        </tr>
                    ) : (
                        usuarios.map(u => (
                            <tr key={u.id}>
                                <td>{u.username}</td>
                                <td>{u.tienda}</td>
                                <td>{u.telefono}</td>
                                <td>{u.user_type}</td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-primary btn-sm me-2"
                                        onClick={() => navigate(`/nuevo-usuario/${u.id}`)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleEliminar(u.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ListaUsuarios;