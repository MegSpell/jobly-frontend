/**
 * CompanyCard
 * ---------------------------------------------------------------------------
 * Displays a single company summary inside a clickable card.
 *
 * Responsibilities:
 *  - Shows company name, description, and employee count.
 *  - If available, displays the company logo.
 *  - Wraps the entire card in a <Link> to that company’s detail page.
 *
 * Props:
 *  - company: {
 *      handle, name, description, numEmployees, logoUrl
 *    }
 *
 * Used by:
 *  - CompanyList → maps over all companies and renders one <CompanyCard> per item.
 */

import { Link } from "react-router-dom";

export default function CompanyCard({ company }) {
  // Destructure data for cleaner JSX
  const { handle, name, description, numEmployees, logoUrl } = company;

  return (
    // Each company card is a clickable link to its detail page
    <Link
      to={`/companies/${handle}`}
      className="card"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {/* If company has a logo, show it — otherwise render an empty placeholder box */}
      {logoUrl ? (
        <img className="logo" src={logoUrl} alt={`${name} logo`} />
      ) : (
        <div className="logo" aria-hidden />
      )}

      {/* Company name and description */}
      <div className="title" style={{ marginTop: 8 }}>
        {name}
      </div>
      <div className="muted">{description}</div>

      {/* Employee count (if numeric; otherwise show fallback) */}
      <div className="muted" style={{ marginTop: 6 }}>
        {typeof numEmployees === "number"
          ? `${numEmployees.toLocaleString()} employees`
          : "Employee count n/a"}
      </div>
    </Link>
  );
}
