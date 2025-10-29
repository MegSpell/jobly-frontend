/**
 * LoginForm
 * ---------------------------------------------------------------------------
 * Form for existing users to log into the app.
 *
 * Responsibilities:
 *  - Manage controlled form state for username/password.
 *  - Call the `login()` function (passed in via props) on submit.
 *  - Handle loading, success, and error states.
 *  - Redirect to homepage on successful login.
 *
 * Props:
 *  - login(formData): async function that authenticates and sets token.
 *
 * Behavior:
 *  - Uses React Router’s useNavigate() for redirecting.
 *  - Displays validation error if credentials are invalid.
 *  - Includes a quick link to the signup form.
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginForm({ login }) {
  const navigate = useNavigate();

  // ------------------------------
  // Local state
  // ------------------------------
  const [formData, setFormData] = useState({
    username: "testuser", // dev defaults (for quick testing)
    password: "password",
  });
  const [submitting, setSubmitting] = useState(false); // button loading
  const [error, setError] = useState(null);            // error message

  /** Handle input changes (controlled form fields) */
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  }

  /** Handle form submission */
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(formData); // call parent login() handler
      navigate("/");         // redirect to homepage after success
    } catch (errs) {
      setError(Array.isArray(errs) ? errs.join(", ") : String(errs));
    } finally {
      setSubmitting(false);
    }
  }

  // ------------------------------
  // Render
  // ------------------------------
  return (
    <div className="container">
      <div className="panel">
        {/* Page header */}
        <h2 className="section-title">Log in</h2>
        <div className="subtle" style={{ marginBottom: 12 }}>
          Welcome back — sign in to continue.
        </div>

        {/* Login form */}
        <form className="form" onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="row">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          {/* Password */}
          <div className="row">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {/* Buttons: submit + link to signup */}
          <div className="actions">
            <button className="btn primary" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </button>
            <Link to="/signup" className="btn outline">
              Create account
            </Link>
          </div>

          {/* Error feedback */}
          {error && <div className="alert error">Error: {error}</div>}
        </form>
      </div>
    </div>
  );
}
