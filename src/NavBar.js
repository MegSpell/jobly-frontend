/**
 * NavBar
 * ---------------------------------------------------------------------------
 * Top navigation bar component for the Jobly app.
 *
 * Responsibilities:
 *  - Shows navigation links that depend on whether a user is logged in.
 *  - Displays the current username and a "Log out" button when authenticated.
 *  - Highlights the active route using NavLink.
 *  - Uses a background style that changes on non-home pages (via `nav-hero` class).
 *
 * Dependencies:
 *  - react-router-dom → NavLink (for route-aware links), useLocation (for page detection)
 *  - useCurrentUser → access the authenticated user context
 *
 * Props:
 *  - logout(): function to clear token and log the user out (passed from App)
 */

import { NavLink, useLocation } from "react-router-dom";
import { useCurrentUser } from "./auth/CurrentUserContext";

export default function NavBar({ logout }) {
  // Pull current user info from context (null if logged out)
  const { currentUser } = useCurrentUser() || {};

  // useLocation allows us to determine the current URL path
  const { pathname } = useLocation();

  // Boolean: true if we’re on the homepage (used to control nav background style)
  const isHome = pathname === "/";

  return (
    // Apply "nav-hero" class only on non-home pages (dark translucent background)
    <div className={`nav ${!isHome ? "nav-hero" : ""}`}>
      <div className="nav-inner container">
        {/* App name / logo link (always visible) */}
        <NavLink to="/" end>
          Jobly
        </NavLink>

        {/* If logged in: show main app navigation and username */}
        {currentUser ? (
          <>
            {/* Main navigation links */}
            <NavLink to="/companies">Companies</NavLink>
            <NavLink to="/jobs">Jobs</NavLink>
            <NavLink to="/profile">Profile</NavLink>

            {/* Push everything after this point to the right side */}
            <span className="spacer" />

            {/* Display current username and logout button */}
            <span className="signin-pill">
              Signed in as <strong>{currentUser.username}</strong>
            </span>

            {/* Accessible button for logging out */}
            <button onClick={logout} aria-label="Log out">
              Log out
            </button>
          </>
        ) : (
          // If logged out: show login and signup links
          <>
            <span className="spacer" />
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
          </>
        )}
      </div>
    </div>
  );
}
