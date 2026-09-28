import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link className="logo" to="/">LearnHub</Link>

      <nav>
        <Link to="/courses">Courses</Link>

        {user ? (
          <>
            <Link to="/my-courses">My Courses</Link>
            <button className="nav-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/signin">Sign in</Link>
            <Link className="nav-cta" to="/signup">Get Started</Link>
          </>
        )}

        <Link className="admin-link" to="/admin">Admin</Link>
      </nav>
    </header>
  );
}
