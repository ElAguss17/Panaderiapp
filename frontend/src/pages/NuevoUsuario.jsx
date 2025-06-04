import { useParams } from "react-router-dom";
import RegistroUsuario from "../components/RegistroUsuario";

export default function NuevoUsuario() {
    const { id } = useParams();
    return (
        <div className="nuevo-usuario-container">
            <RegistroUsuario id={id} />
        </div>
    );
}