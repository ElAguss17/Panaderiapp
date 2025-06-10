import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../images/panaderiapp.png";
import usuarioImg from "../images/usuario.png";

function Sidebar() {
  const [usuario, setUsuario] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");
  const location = useLocation();

  // Update user and user type on every route change
  useEffect(() => {
    setUsuario(localStorage.getItem("usuario") || "");
    setTipoUsuario(localStorage.getItem("tipo_usuario") || "");
  }, [location]);

  // Helper to check user type
  const isAdmin = tipoUsuario === "admin";
  const isPanadero = tipoUsuario === "panadero";
  const isCliente = tipoUsuario === "cliente";

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-light min-vh-100" style={{ width: 280 }}>
      <Link to="/" className="d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <div style={{ width: 140, height: 110, overflow: 'hidden', borderRadius: '16px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <img src={logo} alt="PanaderiApp Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
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
        {isAdmin && (
          <li>
            <Link
              to="/lista-usuarios"
              className={`nav-link${location.pathname === "/lista-usuarios" ? " active" : " link-dark"}`}
            >
              <svg className="bi me-2" width="16" height="16"><use xlinkHref="#people-circle" /></svg>
              Usuarios
            </Link>
          </li>
        )}
        {isAdmin && (
          <li>
            <Link
              to="/articulos-lista"
              className={`nav-link${location.pathname === "/articulos-lista" ? " active" : " link-dark"}`}
            >
              <svg className="bi me-2" width="16" height="16"><use xlinkHref="#box-seam" /></svg>
              Artículos
            </Link>
          </li>
        )}
        {(isAdmin || isPanadero || isCliente) && (
          <li>
            <Link
              to="/carrito"
              className={`nav-link${location.pathname === "/carrito" ? " active" : " link-dark"}`}
            >
              <svg className="bi me-2" width="16" height="16"><use xlinkHref="#cart" /></svg>
              Carrito
            </Link>
          </li>
        )}
        {(isAdmin || isPanadero || isCliente) && (
          <li>
            <Link
              to="/facturas"
              className={`nav-link${location.pathname === "/facturas" ? " active" : " link-dark"}`}
            >
              <svg className="bi me-2" width="16" height="16"><use xlinkHref="#file-earmark-text" /></svg>
              Facturas
            </Link>
          </li>
        )}
      </ul>
      <hr />
      <div className="dropdown">
        <a href="#" className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
          <img src={usuarioImg} alt="Usuario" width="32" height="32" className="rounded-circle me-2" />
          <strong>{usuario || "Usuario"}</strong>
        </a>
        <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
          <li><Link className="dropdown-item" to="/logout">Cerrar sesión</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;


