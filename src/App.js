/**
 * App
 * ---------------------------------------------------------------------------
 * Top-level React component for Jobly (frontend).
 *
 * Responsibilities:
 *  - Owns auth token and currentUser state
 *  - On token changes, loads user info from backend (via JoblyApi)
 *  - Provides a context (CurrentUserContext) with auth + helper functions
 *  - Defines all routes and applies route guards (PrivateRoute / AnonRoute)
 *
 * Key ideas:
 *  - Token is persisted in localStorage (via useLocalStorage hook)
 *  - When token changes, decode it to get username, then fetch user profile
 *  - While loading user info, show a simple "Loading…" gate
 *  - Route guards:
 *      * PrivateRoute  → only for logged-in users
 *      * AnonRoute     → only for logged-out users
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";               // decode JWT payload safely
import { PrivateRoute, AnonRoute } from "./routes/Guards";

import NavBar from "./NavBar";
import Homepage from "./Homepage";

import CompanyList from "./companies/CompanyList";
import CompanyDetail from "./companies/CompanyDetail";
import JobList from "./jobs/JobList";

import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";
import ProfileForm from "./profile/ProfileForm";

import JoblyApi from "./api";
import CurrentUserContext from "./auth/CurrentUserContext";
import useLocalStorage from "./hooks/useLocalStorage";

// Key used to persist the JWT in localStorage
const TOKEN_STORAGE_KEY = "jobly-token";

export default function App() {
  // Persist token across reloads; null means "not logged in"
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_KEY, null);

  // Current logged-in user's full record from the backend (or null)
  const [currentUser, setCurrentUser] = useState(null);

  // Gate for "are we done deciding who the user is?"
  const [infoLoaded, setInfoLoaded] = useState(false);

  /**
   * Effect: run whenever token changes.
   *  - If we have a token, set it on the API helper, decode username,
   *    then fetch that user's profile.
   *  - If no token, clear current user.
   *  - Always flip infoLoaded to true when done (success or error),
   *    so the UI can render routes.
   */
  useEffect(() => {
    async function loadUser() {
      setInfoLoaded(false);
      try {
        if (token) {
          // Configure API helper with the new token for authenticated requests
          JoblyApi.token = token;

          // Decode payload (DO NOT use jsonwebtoken in the browser)
          const { username } = jwtDecode(token);

          // Fetch full user data (includes applications list, etc.)
          const user = await JoblyApi.getCurrentUser(username);
          setCurrentUser(user);
        } else {
          // Logged out / no token
          setCurrentUser(null);
        }
      } catch (err) {
        // If token is invalid/expired or request fails, reset state
        console.error("loadUser failed:", err);
        setCurrentUser(null);
      } finally {
        setInfoLoaded(true);
      }
    }

    loadUser();
  }, [token]);

  /**
   * login
   * - Accepts { username, password }
   * - Gets token from backend and saves it (triggers loadUser effect)
   */
  async function login(formData) {
    const newToken = await JoblyApi.login(formData);
    setToken(newToken);
  }

  /**
   * signup
   * - Accepts { username, password, firstName, lastName, email }
   * - Gets token from backend and saves it (triggers loadUser effect)
   */
  async function signup(formData) {
    const newToken = await JoblyApi.signup(formData);
    setToken(newToken);
  }

  /**
   * logout
   * - Clears token (and removes from localStorage via hook)
   * - Clears API helper token too
   */
  function logout() {
    setToken(null);
    JoblyApi.token = null;
  }

  /**
   * hasAppliedToJob
   * - Fast lookup for "has current user already applied to jobId?"
   * - Returns false if no user
   */
  function hasAppliedToJob(jobId) {
    if (!currentUser) return false;
    return new Set(currentUser.applications).has(jobId);
  }

  /**
   * applyToJob
   * - Calls backend to apply to a job for the current user
   * - Guards against duplicate applications
   * - Updates currentUser state locally so UI reflects "Applied" immediately
   */
  async function applyToJob(jobId) {
    if (!currentUser) return;

    // Avoid duplicate apply UI/API calls
    if (hasAppliedToJob(jobId)) return;

    await JoblyApi.applyToJob(currentUser.username, jobId);

    // Merge new jobId into applications set, then set state
    setCurrentUser((u) => ({
      ...u,
      applications: [...new Set([...(u.applications || []), jobId])],
    }));
  }

  /**
   * Memoized context value
   * - Only recompute when currentUser or token changes
   * - Exposes auth state and helpers to the entire app tree
   */
  const ctx = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      token,
      setToken,
      hasAppliedToJob,
      applyToJob,
    }),
    [currentUser, token]
  );

  // While deciding who the user is (on initial load or token change),
  // render a simple loading gate to avoid flashing incorrect routes.
  if (!infoLoaded) return <div style={{ padding: 20 }}>Loading…</div>;

  return (
    <CurrentUserContext.Provider value={ctx}>
      <BrowserRouter>
        {/* Top navigation (shows different links if logged in/out) */}
        <NavBar logout={logout} />

        {/* App routes:
            - Public: Homepage
            - Private: Companies, Company detail, Jobs, Profile
            - Anonymous-only: Login, Signup
            - * → redirect unknown routes back to home
        */}
        <Routes>
          <Route path="/" element={<Homepage />} />

          <Route
            path="/companies"
            element={
              <PrivateRoute>
                <CompanyList />
              </PrivateRoute>
            }
          />
          <Route
            path="/companies/:handle"
            element={
              <PrivateRoute>
                <CompanyDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <PrivateRoute>
                <JobList />
              </PrivateRoute>
            }
          />

          <Route
            path="/login"
            element={
              <AnonRoute>
                <LoginForm login={login} />
              </AnonRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AnonRoute>
                <SignupForm signup={signup} />
              </AnonRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfileForm />
              </PrivateRoute>
            }
          />

          {/* Catch-all: go home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </CurrentUserContext.Provider>
  );
}

