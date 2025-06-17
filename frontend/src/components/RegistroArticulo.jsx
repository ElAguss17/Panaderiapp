import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function RegistroArticulo({ id }) {
    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            setLoading(true);
            api.get(`/productos/${id}/`)
                .then(res => setForm(res.data))
                .catch(() => setError("Error al cargar artículo"))
                .finally(() => setLoading(false));
        } else {
            setForm({
                nombre: "",
                descripcion: "",
                precio: "",
            });
        }
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        setError("");
        const { nombre, descripcion, precio } = form;
        try {
            if (id) {
                await api.put(`/productos/${id}/`, form);
            } else {
                await api.post("/productos/", form);
            }
            navigate("/articulos-lista");
        } catch (error) {
            setError("Fallo al guardar");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        setError("");
        try {
            await api.delete(`/productos/${id}/`);
            navigate("/articulos-lista");
        } catch (error) {
            setError("Fallo al eliminar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <h2>{id ? "Editar Artículo" : "Registrar Artículo"}</h2>
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
            <input name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" required />
            <input name="precio" type="number" step="0.01" value={form.precio} onChange={handleChange} placeholder="Precio" required />
            {error && <div className="error">{error}</div>}
            {loading && <LoadingIndicator />}
            <button
                type="submit"
                className={`btn ${id ? "btn-primary" : "btn-success"} btn-lg w-100 mt-3`}
            >
                {id ? "Actualizar" : "Registrar"}
            </button>
        </form>
    );
}

export default RegistroArticulo;