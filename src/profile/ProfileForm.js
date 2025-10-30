/**
 * ProfileForm
 * ---------------------------------------------------------------------------
 * Allows the logged-in user to edit their profile information.
 *
 * Responsibilities:
 *  - Prefill form fields from the current user context.
 *  - Manage controlled inputs and local "saving/status/error" UI state.
 *  - Call JoblyApi.saveProfile() and update global user context on success.
 *
 * Notes:
 *  - Backend requires current password for profile updates, so form includes
 *    a "Confirm with password" field that is required on submit.
 */

import { useEffect, useState } from "react";
import JoblyApi from "../api";
import { useCurrentUser } from "../auth/CurrentUserContext";

export default function ProfileForm() {
  // Read and update the globally-shared user record
  const { currentUser, setCurrentUser } = useCurrentUser() || {};

  // Local form state (controlled fields)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "" // required to confirm changes
  });

  // UI state for submit/save feedback
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [error, setError] = useState(null);

  /**
   * Prefill the form when currentUser is available/changes.
   * Password is intentionally left blank.
   */
  useEffect(() => {
    if (currentUser) {
      setFormData(f => ({
        ...f,
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        password: ""
      }));
    }
  }, [currentUser]);

  // If user data hasn't loaded yet, show simple gate
  if (!currentUser) return <div className="container">Loading…</div>;

  /** Handle controlled input updates */
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  }

  /** Handle save submit */
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    setError(null);

    // Prepare payload; trim text fields but DO NOT trim password
    const toSend = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password
    };

    try {
      // Persist changes via API and sync global user context
      const updated = await JoblyApi.saveProfile(currentUser.username, toSend);
      setCurrentUser(updated);
      setStatus("success");

      // Clear password field after successful save
      setFormData(f => ({ ...f, password: "" }));
    } catch (errs) {
      setStatus("error");
      setError(Array.isArray(errs) ? errs.join(", ") : String(errs));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container">
      <div className="panel">
        {/* Title and immutable username display */}
        <h2 className="section-title">Profile</h2>
        <div className="subtle" style={{ marginBottom: 12 }}>
          <strong>Username:</strong> {currentUser.username}
        </div>

        {/* Profile form */}
        <form className="form" onSubmit={handleSubmit}>
          {/* First name */}
          <div className="row">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
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
            />
          </div>

          {/* Password confirmation (required by backend) */}
          <div className="row">
            <label htmlFor="password">Confirm with password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password to save changes"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Actions: save + reset to server values */}
          <div className="actions">
            <button className="btn primary" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>

            <button
              type="button"
              className="btn outline"
              onClick={() =>
                setFormData(f => ({
                  ...f,
                  firstName: currentUser.firstName || "",
                  lastName: currentUser.lastName || "",
                  email: currentUser.email || "",
                  password: ""
                }))
              }
              disabled={saving}
            >
              Reset
            </button>
          </div>

          {/* Feedback messages */}
          {status === "success" && (
            <div className="alert success">Profile updated!</div>
          )}
          {status === "error" && (
            <div className="alert error">
              Error: {error || "Could not save profile."}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
