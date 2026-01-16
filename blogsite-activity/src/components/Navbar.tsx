import { NavLink, useNavigate } from "react-router-dom";
import { isLoggedIn, logoutUser, getUser } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const user = getUser();

  const activeClass = ({ isActive }: { isActive: boolean }) =>
    "nav-link px-3 " + (isActive ? "active-nav" : "");

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">
          BlogSite
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className={activeClass} to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={activeClass} to="/posts">Posts</NavLink>
            </li>
            {loggedIn && (
              <li className="nav-item">
                <NavLink className={activeClass} to="/create-post">
                  Create Post
                </NavLink>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {!loggedIn ? (
              <>
                <li className="nav-item">
                  <NavLink className={activeClass} to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={activeClass} to="/register">Register</NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <span className="nav-link px-3">
                    Hi, {user?.name}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      logoutUser();
                      navigate("/");
                      window.location.reload();
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
