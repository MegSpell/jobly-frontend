/**
 * JobCard.test.jsx
 * Tests the Apply button behavior and conditional rendering.
 *  - Shows job title, salary, equity, etc.
 *  - Renders "Apply" if not applied, "Applied" if already applied.
 *  - Calls applyToJob() when user clicks Apply.
 */

// --- Mock react-router-dom (virtual for Jest ESM fix) ---
jest.mock(
  "react-router-dom",
  () => ({}),
  { virtual: true }
);

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JobCard from "../jobs/JobCard";
import CurrentUserContext from "../auth/CurrentUserContext";

const job = {
  id: 1,
  title: "Software Engineer",
  salary: 120000,
  equity: 0.05,
  companyName: "TechCorp"
};

/** Helper: render component with a mock context */
function renderWithCtx(value) {
  return render(
    <CurrentUserContext.Provider value={value}>
      <JobCard job={job} showCompany />
    </CurrentUserContext.Provider>
  );
}

test("renders job details correctly", () => {
  renderWithCtx({});
  expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  expect(screen.getByText(/salary/i)).toBeInTheDocument();
  expect(screen.getByText(/equity/i)).toBeInTheDocument();
  expect(screen.getByText(/TechCorp/)).toBeInTheDocument();
});

test("shows 'Applied' if user has already applied", () => {
  const mockCtx = {
    currentUser: { username: "testuser" },
    hasAppliedToJob: () => true
  };
  renderWithCtx(mockCtx);

  expect(screen.getByText("Applied")).toBeInTheDocument();
});

test("calls applyToJob() when Apply is clicked", async () => {
  const applyToJob = jest.fn().mockResolvedValue();
  const mockCtx = {
    currentUser: { username: "testuser" },
    hasAppliedToJob: () => false,
    applyToJob
  };

  const user = userEvent.setup();
  renderWithCtx(mockCtx);

  const btn = screen.getByRole("button", { name: /apply/i });
  await user.click(btn);

  expect(applyToJob).toHaveBeenCalledWith(1);
});
