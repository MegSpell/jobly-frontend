/**
 * SearchForm
 * ---------------------------------------------------------------------------
 * A small reusable search input component used on multiple pages
 * (e.g., CompanyList and JobList).
 *
 * Responsibilities:
 *  - Manages a controlled input for the search term.
 *  - Calls the `onSearch` callback (passed in via props) when submitted.
 *  - Accepts an optional `initialTerm` prop for prefilled search values.
 *
 * Props:
 *  - initialTerm (string) → optional default input value
 *  - onSearch (function)  → callback that receives the search term
 *
 * Behavior:
 *  - Trims whitespace; if empty, sends `undefined` to clear filters.
 *  - Prevents full-page reload on submit (via e.preventDefault()).
 */

import { useState } from "react";

export default function SearchForm({ initialTerm = "", onSearch }) {
  // Track the search input value (controlled component)
  const [term, setTerm] = useState(initialTerm);

  /** Handle form submission */
  function handleSubmit(e) {
    e.preventDefault();
    // Trim extra spaces and pass up to parent
    onSearch(term.trim() || undefined);
  }

  return (
    <form className="search" onSubmit={handleSubmit}>
      {/* Controlled text input for search term */}
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search…"
        aria-label="search term"
      />

      {/* Submit button (styled via .btn.outline) */}
      <button className="btn outline">Search</button>
    </form>
  );
}
