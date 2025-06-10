import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { username: usuario, password });
            console.log("Respuesta del backend:", res.data); 
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                localStorage.setItem("usuario", usuario); // Guarda el nombre de usuario
                localStorage.setItem("usuario_id", res.data.id); // Guarda el id del usuario
                localStorage.setItem("tipo_usuario", res.data.tipo_usuario); // Guarda el tipo de usuario
                console.log("ID guardado en localStorage:", res.data.id);
                console.log("Tipo de usuario guardado en localStorage:", res.data.tipo_usuario);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            console.log("Error al hacer la petición:", error);
            alert("Algun campo es incorrecto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            <input
                className="form-input"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Usuario"
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
            />
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                {name}
            </button>
        </form>
    );
}

export default Form