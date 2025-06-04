import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator";

function RegistroUsuario({ }) {
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
    const [error, setError] = useState(""); // <-- FALTA ESTO
    const navigate = useNavigate();

    // FALTA ESTA FUNCIÓN
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        setError(""); // Limpia error anterior
        console.log("Datos enviados:", form);
        try {
            await api.post("/api/user/register/", form);
            alert("Usuario añadido");
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
        } catch (error) {
            alert(error);
            //alert("Fallo al añadir");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <h2>Registrar Usuario</h2>
            <input name="username" value={form.username} onChange={handleChange} placeholder="Usuario" required />
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Contraseña" required />
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
            <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" required />
            <input name="telefono" type="number" min="9" max="9" value={form.telefono} onChange={handleChange} placeholder="Teléfono" required />
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
            <button type="submit">Registrar</button>
        </form>
    );
}

export default RegistroUsuario;