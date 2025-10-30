/**
 * CompanyList
 * ---------------------------------------------------------------------------
 * Page that lists all companies, with optional name-based search.
 *
 * Responsibilities:
 *  - Fetch companies from the backend (via JoblyApi).
 *  - Display loading/error states.
 *  - Provide a search bar for filtering companies by name.
 *
 * Components used:
 *  - SearchForm → reusable search input form
 *  - CompanyCard → displays each company summary
 *
 * Data flow:
 *  - `handleSearch()` calls JoblyApi.getCompanies(term)
 *  - Results are stored in state and displayed in a grid of cards.
 */

import { useEffect, useState } from "react";
import JoblyApi from "../api";
import SearchForm from "../common/SearchForm";
import CompanyCard from "./CompanyCard";

export default function CompanyList() {
  // ------------------------------
  // Local state
  // ------------------------------
  const [companies, setCompanies] = useState(null); // API results
  const [error, setError] = useState(null);         // API error message
  const [isLoading, setLoading] = useState(true);   // loading spinner toggle

  // ------------------------------
  // Fetch initial company list on mount
  // ------------------------------
  useEffect(() => {
    handleSearch(); // no search term = fetch all companies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** ------------------------------------------------------------------------
   * handleSearch(term)
   * Triggered when SearchForm is submitted.
   * Calls backend, updates company list, and handles errors/loading.
   ------------------------------------------------------------------------ */
  async function handleSearch(term) {
    try {
      setLoading(true);
      setError(null);

      // API call (JoblyApi automatically handles auth token)
      const res = await JoblyApi.getCompanies(term);
      setCompanies(res);
    } catch (errs) {
      // Format errors consistently as string(s)
      setError(Array.isArray(errs) ? errs.join(", ") : String(errs));
    } finally {
      setLoading(false);
    }
  }

  // ------------------------------
  // Render UI
  // ------------------------------
  return (
    <div className="container">
      {/* Header section */}
      <div className="page-header">
        <h2>Companies</h2>
        <div className="subtle">Search and explore employers</div>
      </div>

      {/* Search form (passes results to handleSearch) */}
      <SearchForm onSearch={handleSearch} />

      {/* Conditional render states */}
      {isLoading && <div>Loading…</div>}
      {error && <div className="alert error">Error: {error}</div>}

      {!isLoading && !error && companies?.length === 0 && (
        <div>No companies found.</div>
      )}

      {/* Company results grid */}
      {!isLoading && !error && companies?.length > 0 && (
        <div className="grid cards">
          {companies.map((c) => (
            <CompanyCard key={c.handle} company={c} />
          ))}
        </div>
      )}
    </div>
  );
}
