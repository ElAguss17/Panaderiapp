import "bootstrap/dist/css/bootstrap.min.css";
import ListaArticulos from "../components/ListaArticulos";
import { useNavigate } from "react-router-dom";

export default function ArticulosLista() {
    const navigate = useNavigate();

    return (
        <div className="nuevo-articulo-container">
            <div className="d-flex justify-content-start mb-4 mt-3">
                <button
                    className="btn btn-success btn-lg"
                    onClick={() => navigate("/nuevo-articulo")}
                >
                    Añadir
                </button>
            </div>
            <ListaArticulos />
        </div>
    );
}