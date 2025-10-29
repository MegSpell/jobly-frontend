/**
 * Route Guards
 * ---------------------------------------------------------------------------
 * Protects certain routes in the Jobly frontend by checking authentication state.
 *
 * Two guards are exported:
 *   1. PrivateRoute → restricts access to *logged-in* users only.
 *   2. AnonRoute    → restricts access to *logged-out* (anonymous) users only.
 *
 * Both use the CurrentUserContext (via useCurrentUser) to see if a user is logged in.
 *
 * How they work:
 *  - PrivateRoute: If there is no currentUser, redirect to /login.
 *  - AnonRoute: If user *is* logged in, redirect to / (home).
 *
 * Usage in App.js:
 *   <Route path="/jobs" element={
 *       <PrivateRoute><JobList /></PrivateRoute>
 *   } />
 *
 *   <Route path="/login" element={
 *       <AnonRoute><LoginForm /></AnonRoute>
 *   } />
 */

import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../auth/CurrentUserContext";

/**
 * PrivateRoute
 * ---------------------------------------------------------------------------
 * Wraps a route that should only be visible to authenticated users.
 * If no currentUser is found, navigates to the login page.
 */
export function PrivateRoute({ children }) {
  const { currentUser } = useCurrentUser() || {};
  return currentUser ? children : <Navigate to="/login" replace />;
}

/**
 * AnonRoute
 * ---------------------------------------------------------------------------
 * Wraps a route that should only be visible to *anonymous* users (not logged in).
 * If a user is already logged in, redirects them to the homepage.
 */
export function AnonRoute({ children }) {
  const { currentUser } = useCurrentUser() || {};
  return !currentUser ? children : <Navigate to="/" replace />;
}
