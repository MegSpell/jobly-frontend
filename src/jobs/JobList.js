/**
 * JobList
 * ---------------------------------------------------------------------------
 * Page that lists all job postings, with optional search by title.
 *
 * Responsibilities:
 *  - Fetch jobs from the backend (via JoblyApi).
 *  - Handle loading and error states.
 *  - Provide a search bar for filtering jobs by title.
 *
 * Components used:
 *  - SearchForm → reusable search input component
 *  - JobCard    → displays info for each job (can also show company name)
 *
 * Data flow:
 *  - `handleSearch()` calls JoblyApi.getJobs(term)
 *  - Results are stored in state and displayed in a grid of JobCards.
 */

import { useEffect, useState } from "react";
import JoblyApi from "../api";
import SearchForm from "../common/SearchForm";
import JobCard from "./JobCard";

export default function JobList() {
  // ------------------------------
  // Local state
  // ------------------------------
  const [jobs, setJobs] = useState(null);       // list of job results
  const [error, setError] = useState(null);     // error message string
  const [isLoading, setLoading] = useState(true); // whether API is loading

  // ------------------------------
  // Fetch all jobs when page first loads
  // ------------------------------
  useEffect(() => {
    handleSearch(); // no term = get all jobs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** ------------------------------------------------------------------------
   * handleSearch(term)
   * - Called when SearchForm is submitted.
   * - Calls JoblyApi.getJobs(term) to fetch matching jobs.
   * - Handles loading and error state transitions.
   ------------------------------------------------------------------------ */
  async function handleSearch(term) {
    try {
      setLoading(true);
      setError(null);

      const res = await JoblyApi.getJobs(term);
      setJobs(res);
    } catch (errs) {
      setError(Array.isArray(errs) ? errs.join(", ") : String(errs));
    } finally {
      setLoading(false);
    }
  }

  // ------------------------------
  // Render
  // ------------------------------
  return (
    <div className="container">
      {/* Header */}
      <div className="page-header">
        <h2>Jobs</h2>
        <div className="subtle">Find current openings</div>
      </div>

      {/* Search input (passes data to handleSearch) */}
      <SearchForm onSearch={handleSearch} initialTerm="" />

      {/* Conditional render states */}
      {isLoading && <div>Loading…</div>}
      {error && <div className="alert error">Error: {error}</div>}

      {!isLoading && !error && jobs?.length === 0 && (
        <div>No jobs found.</div>
      )}

      {/* Job result cards */}
      {!isLoading && !error && jobs?.length > 0 && (
        <div className="grid cards">
          {jobs.map((j) => (
            <JobCard key={j.id} job={j} showCompany />
          ))}
        </div>
      )}
    </div>
  );
}
