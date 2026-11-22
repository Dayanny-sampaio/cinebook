import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      {" "}
      {/*representa a barra de navegação*/}
      <h1>Cinebook</h1>
      <ul>
        <li>
          <Link to="/">Inicio</Link>
        </li>
        <li>
          <Link to="/explorar">Explorar</Link>
        </li>
        <li>
          <Link to="/biblioteca">Biblioteca</Link>
        </li>
        <li>
          <Link to="/perfil">Perfil</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
