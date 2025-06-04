import { useParams } from "react-router-dom";
import RegistroArticulo from "../components/RegistroArticulo";

export default function NuevoArticulo() {
    const { id } = useParams();
    console.log("ID recibido en NuevoArticulo:", id); // Añade este log
    return (
        <div className="nuevo-articulo-container">
            <RegistroArticulo id={id} />
        </div>
    );
}