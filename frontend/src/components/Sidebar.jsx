import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Sidebar() {
  const [usuario, setUsuario] = useState("");
  const location = useLocation();

  useEffect(() => {
    const nombreUsuario = localStorage.getItem("usuario");
    if (nombreUsuario) setUsuario(nombreUsuario);
  }, []);

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-light min-vh-100" style={{ width: 280 }}>
      <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <span className="fs-4">Sidebar</span>
      </Link>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link
            to="/"
            className={`nav-link${location.pathname === "/" ? " active" : " link-dark"}`}
            aria-current="page"
          >
            <svg className="bi me-2" width="16" height="16"><use xlinkHref="#home" /></svg>
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/lista-usuarios"
            className={`nav-link${location.pathname === "/lista-usuarios" ? " active" : " link-dark"}`}
          >
            <svg className="bi me-2" width="16" height="16"><use xlinkHref="#people-circle" /></svg>
            Usuarios
          </Link>
        </li>
        <li>
          <Link
            to="/articulos-lista"
            className={`nav-link${location.pathname === "/articulos-lista" ? " active" : " link-dark"}`}
          >
            <svg className="bi me-2" width="16" height="16"><use xlinkHref="#box-seam" /></svg>
            Artículos
          </Link>
        </li>
        <li>
          <Link
            to="/carrito"
            className={`nav-link${location.pathname === "/carrito" ? " active" : " link-dark"}`}
          >
            <svg className="bi me-2" width="16" height="16"><use xlinkHref="#cart" /></svg>
            Carrito
          </Link>
        </li>
        <li>
          <Link
            to="/pan-diario"
            className={`nav-link${location.pathname === "/pan-diario" ? " active" : " link-dark"}`}
          >
            <svg className="bi me-2" width="16" height="16"><use xlinkHref="#table" /></svg>
            Pan Diario
          </Link>
        </li>
        <li>
          <Link
            to="/facturas"
            className={`nav-link${location.pathname === "/facturas" ? " active" : " link-dark"}`}
          >
            <svg className="bi me-2" width="16" height="16"><use xlinkHref="#file-earmark-text" /></svg>
            Facturas
          </Link>
        </li>
      </ul>
      <hr />
      <div className="dropdown">
        <a href="#" className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
          <strong>{usuario || "Usuario"}</strong>
        </a>
        <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
          <li><a className="dropdown-item" href="#">Perfil</a></li>
          <li><a className="dropdown-item" href="#">Configuración</a></li>
          <li><hr className="dropdown-divider" /></li>
          <li><Link className="dropdown-item" to="/logout">Cerrar sesión</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;


