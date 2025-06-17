import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function RegistroUsuario({ id }) {
    const [form, setForm] = useState({
        username: "",
        password: "",
        nombre: "",
        apellido: "",
        telefono: "",
        user_type: "cliente",
        direccion: "",
        prioridad: "",
        tienda: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Si hay id, carga los datos del usuario
    useEffect(() => {
        if (id) {
            setLoading(true);
            api.get(`/usuarios/${id}/`)
                .then(res => {
                    setForm({
                        ...res.data,
                        password: "", // No rellenes el password
                    });
                })
                .catch(() => setError("Error al cargar usuario"))
                .finally(() => setLoading(false));
        } else {
            // Si no hay id, limpia el formulario
            setForm({
                username: "",
                password: "",
                nombre: "",
                apellido: "",
                telefono: "",
                user_type: "cliente",
                direccion: "",
                prioridad: "",
                tienda: "",
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
        try {
            if (id) {
                await api.put(`/usuarios/${id}/`, form);
                //alert("Usuario actualizado");
            } else {
                await api.post("/user/register/", form);
                //alert("Usuario añadido");
            }
            navigate("/lista-usuarios");
        } catch (error) {
            setError("Fallo al guardar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <h2>{id ? "Editar Usuario" : "Registrar Usuario"}</h2>
            <input name="username" value={form.username} onChange={handleChange} placeholder="Usuario" required />
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Contraseña" required={!id} />
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
            <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" required />
            <input
                name="telefono"
                type="text"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Teléfono"
                required
                minLength={9}
                maxLength={9}
                pattern="\d{9}"
                title="El teléfono debe tener 9 dígitos numéricos"
            />
            <select name="user_type" value={form.user_type} onChange={handleChange} required>
                <option value="admin">Admin</option>
                <option value="panadero">Panadero</option>
                <option value="cliente">Cliente</option>
            </select>
            <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" required />
            <input name="prioridad" type="number" min="1" max="5" value={form.prioridad} onChange={handleChange} placeholder="Prioridad (1-5)" required />
            <input name="tienda" value={form.tienda} onChange={handleChange} placeholder="Tienda" required />
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

export default RegistroUsuario;