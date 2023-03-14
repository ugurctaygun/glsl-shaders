import { Outlet, Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/blending-colors">Blending Colors</Link>
          </li>
          <li>
            <Link to="/flame">Flames</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Header;
