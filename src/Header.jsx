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
            <Link to="/lines">Drawing Lines</Link>
          </li>
          <li>
            <Link to="/shapes">Custom Animations</Link>
          </li>
          <li>
            <Link to="/tiling">Tiling</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Header;
