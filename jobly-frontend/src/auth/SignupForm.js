/**
 * SignupForm
 * ---------------------------------------------------------------------------
 * Form for new users to register an account on Jobly.
 *
 * Responsibilities:
 *  - Manage controlled form inputs for user registration.
 *  - Call the `signup()` prop (from App) to create a new user.
 *  - Show feedback for loading and API errors.
 *  - Redirect to homepage upon successful signup.
 *
 * Props:
 *  - signup(formData): async function that registers and sets token.
 *
 * Behavior:
 *  - Uses React Router's useNavigate() for redirecting.
 *  - Shows a link to the login page for existing users.
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function SignupForm({ signup }) {
  const navigate = useNavigate();

  // ------------------------------
  // Local state
  // ------------------------------
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: ""
  });
  const [submitting, setSubmitting] = useState(false); // loading state
  const [error, setError] = useState(null);            // API error message

  /** Handle input field changes */
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  }

  /** Handle form submission */
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await signup(formData);  // parent function handles API + token
      navigate("/");           // redirect to homepage
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
        {/* Header */}
        <h2 className="section-title">Create your account</h2>
        <div className="subtle" style={{ marginBottom: 12 }}>
          Join Jobly to search companies and apply to jobs.
        </div>

        {/* Signup form */}
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
              autoComplete="new-password"
              required
            />
          </div>

          {/* First name */}
          <div className="row">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              autoComplete="given-name"
              required
            />
          </div>

          {/* Last name */}
          <div className="row">
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              autoComplete="family-name"
              required
            />
          </div>

          {/* Email */}
          <div className="row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          {/* Buttons: submit + link to login */}
          <div className="actions">
            <button className="btn primary" disabled={submitting}>
              {submitting ? "Creating…" : "Create account"}
            </button>
            <Link to="/login" className="btn outline">
              I already have an account
            </Link>
          </div>

          {/* Error feedback */}
          {error && <div className="alert error">Error: {error}</div>}
        </form>
      </div>
    </div>
  );
}
