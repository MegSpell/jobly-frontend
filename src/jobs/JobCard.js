/**
 * JobCard
 * ---------------------------------------------------------------------------
 * Displays information about a single job listing.
 *
 * Responsibilities:
 *  - Show job title, salary, equity, and optionally the company name.
 *  - If a user is logged in, show an “Apply” button or “Applied” pill.
 *  - When clicked, triggers applyToJob() from global user context.
 *
 * Props:
 *  - job: { id, title, salary, equity, companyName }
 *  - showCompany: boolean → when true, display the company name
 *
 * Context (from useCurrentUser):
 *  - currentUser → logged-in user object
 *  - hasAppliedToJob(jobId) → returns whether user already applied
 *  - applyToJob(jobId) → calls backend and updates user applications
 */

import { useState } from "react";
import { useCurrentUser } from "../auth/CurrentUserContext";

export default function JobCard({ job, showCompany = false }) {
  // Access user info and helper functions from context
  const { currentUser, hasAppliedToJob, applyToJob } = useCurrentUser() || {};

  // Destructure job fields for clarity
  const { id, title, salary, equity, companyName } = job;

  // Local state: controls loading indicator for the Apply button
  const [isSubmitting, setSubmitting] = useState(false);

  // Determine if user has already applied to this job
  const applied = hasAppliedToJob ? hasAppliedToJob(id) : false;

  /** Format salary values as readable currency (e.g., $85,000) */
  function formatSalary(s) {
    if (s == null) return "—";
    return `$${Number(s).toLocaleString()}`;
  }

  /** Handle Apply button click */
  async function handleApply() {
    try {
      setSubmitting(true);
      await applyToJob(id); // triggers backend + updates context
    } finally {
      setSubmitting(false);
    }
  }

  // ------------------------------
  // Render UI
  // ------------------------------
  return (
    <div className="card">
      {/* Job title and optional company name */}
      <div className="title">{title}</div>
      {showCompany && companyName && <div className="muted">{companyName}</div>}

      {/* Job details */}
      <div className="muted">Salary: {formatSalary(salary)}</div>
      <div className="muted">Equity: {equity ?? "—"}</div>

      {/* Logged-in users can apply */}
      {currentUser && (
        <div style={{ marginTop: 10 }}>
          {applied ? (
            // Already applied → show static pill
            <span className="pill good">Applied</span>
          ) : (
            // Otherwise show Apply button
            <button
              className="btn primary"
              onClick={handleApply}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Applying…" : "Apply"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
