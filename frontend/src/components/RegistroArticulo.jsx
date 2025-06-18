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
    const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo estado para controlar envíos múltiples
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
        e.preventDefault();
        
        // Si ya está en proceso de envío, evitar múltiples envíos
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        setLoading(true);
        setError("");
        
        try {
            if (id) {
                await api.put(`/productos/${id}/`, form);
            } else {
                await api.post("/productos/", form);
            }
            navigate("/articulos-lista");
        } catch (error) {
            console.error("Error al guardar:", error);
            setError("Fallo al guardar");
            setIsSubmitting(false); // Permitir reintentar en caso de error
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
                disabled={isSubmitting} // Deshabilitar el botón durante el envío
            >
                {isSubmitting ? "Procesando..." : (id ? "Actualizar" : "Registrar")}
            </button>
        </form>
    );
}

export default RegistroArticulo;