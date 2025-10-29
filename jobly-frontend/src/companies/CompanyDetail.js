/**
 * CompanyDetail
 * ---------------------------------------------------------------------------
 * Displays details for a single company, including its open job listings.
 *
 * Responsibilities:
 *  - Fetch the selected company (by its handle from the URL).
 *  - Handle loading and error states.
 *  - Display all jobs that belong to this company using <JobCard />.
 *
 * Routing:
 *  - Path: /companies/:handle
 *  - The `handle` parameter comes from React Router’s useParams().
 *
 * Data flow:
 *  - On mount or when `handle` changes → fetch company from API.
 *  - JoblyApi.getCompany(handle) → returns { name, description, jobs[] }
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JoblyApi from "../api";
import JobCard from "../jobs/JobCard";

export default function CompanyDetail() {
  // Get company handle from URL parameters
  const { handle } = useParams();

  // ------------------------------
  // Local state
  // ------------------------------
  const [company, setCompany] = useState(null);  // full company object
  const [error, setError] = useState(null);      // API error messages
  const [isLoading, setLoading] = useState(true); // loading indicator

  // ------------------------------
  // Fetch company data on mount / handle change
  // ------------------------------
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        // Fetch details for this company handle
        const data = await JoblyApi.getCompany(handle);
        setCompany(data);
      } catch (errs) {
        setError(Array.isArray(errs) ? errs.join(", ") : String(errs));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [handle]);

  // ------------------------------
  // Conditional render states
  // ------------------------------
  if (isLoading) return <div style={{ padding: 20 }}>Loading…</div>;
  if (error) return <div style={{ padding: 20, color: "crimson" }}>Error: {error}</div>;
  if (!company) return <div style={{ padding: 20 }}>Company not found.</div>;

  // ------------------------------
  // Main render: company + job listings
  // ------------------------------
  return (
    <div style={{ padding: 20 }}>
      {/* Company name + summary */}
      <h2>{company.name}</h2>
      <p style={{ color: "#555" }}>{company.description}</p>

      {/* Related job postings */}
      <h3 style={{ marginTop: "1.25rem" }}>Open Jobs</h3>
      {company.jobs?.length ? (
        <div style={{ display: "grid", gap: ".75rem" }}>
          {company.jobs.map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
        </div>
      ) : (
        <div>No current job postings.</div>
      )}
    </div>
  );
}
