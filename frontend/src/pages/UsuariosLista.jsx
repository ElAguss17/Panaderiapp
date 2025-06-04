import "bootstrap/dist/css/bootstrap.min.css";
import ListaUsuarios from "../components/ListaUsuarios";
import { useNavigate } from "react-router-dom";

export default function UsuariosLista() {
    const navigate = useNavigate();

    return (
        <div className="nuevo-usuario-container">
            <div className="d-flex justify-content-start mb-3">
                <button
                    className="btn btn-success btn-lg"
                    onClick={() => navigate("/nuevo-usuario")}
                >
                    Añadir
                </button>
            </div>
            <ListaUsuarios />
        </div>
    );
}