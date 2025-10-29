/**
 * Homepage
 * ---------------------------------------------------------------------------
 * Main landing page for the Jobly app.
 *
 * Responsibilities:
 *  - Displays a “hero” section that changes depending on whether the user
 *    is logged in.
 *  - If logged out → invites the user to log in or sign up.
 *  - If logged in  → welcomes the user and provides quick links to jobs/companies.
 *
 * Uses:
 *  - useCurrentUser() → read current user info from global context.
 *  - react-router-dom <Link> → client-side navigation between pages.
 */

import { Link } from "react-router-dom";
import { useCurrentUser } from "./auth/CurrentUserContext";

export default function Homepage() {
  // Pull user info from context (null if logged out)
  const { currentUser } = useCurrentUser() || {};

  // Choose first name if available, fallback to username
  const first = currentUser?.firstName || currentUser?.username;

  return (
    <>
      {/* --------------------------------------------------------------------
         HERO SECTION
         - Background image and central text/buttons.
         - Text and buttons change based on whether user is logged in.
         -------------------------------------------------------------------- */}
      <section className="hero">
        <div className="hero-content container">
          {currentUser ? (
            // If logged in
            <>
              <h1>Welcome back, {first}.</h1>
              <p>Browse companies, track openings, and apply with one click.</p>

              {/* Main calls to action for logged-in users */}
              <div className="cta">
                <Link to="/jobs" className="btn primary">
                  Find Jobs
                </Link>
                <Link to="/companies" className="btn primary">
                  Explore Companies
                </Link>
              </div>
            </>
          ) : (
            // If logged out
            <>
              <h1>Find your next role.</h1>
              <p>
                Search companies and jobs, apply, and keep moving forward with
                JOBLY.
              </p>

              {/* Main calls to action for visitors */}
              <div className="cta">
                <Link to="/login" className="btn primary">
                  Log In
                </Link>
                <Link to="/signup" className="btn primary">
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* --------------------------------------------------------------------
         OPTIONAL "Quick Start" PANEL (visible only to logged-in users)
         - Appears below the hero for a faster workflow.
         - Encourages exploring jobs, companies, or editing profile.
         -------------------------------------------------------------------- */}
      {currentUser && (
        <div className="container">
          <div className="panel">
            <h3 className="section-title" style={{ marginBottom: 6 }}>
              Quick start
            </h3>
            <div className="subtle">Jump right in:</div>

            <div className="actions" style={{ marginTop: 12 }}>
              <Link to="/jobs" className="btn primary">
                Browse Jobs
              </Link>
              <Link to="/companies" className="btn outline">
                See Companies
              </Link>
              <Link to="/profile" className="btn outline">
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
