/**
 * JobList.test.jsx
 * Ensures jobs load correctly, handles loading/error states,
 * and shows message when no jobs are found.
 */

// --- Mock react-router-dom (same reason as CompanyList) ---
jest.mock(
  "react-router-dom",
  () => {
    const React = require("react");
    return { Link: ({ children }) => <a>{children}</a> };
  },
  { virtual: true }
);

// ✅ Use the project-root __mocks__/api.js
jest.mock("../api");

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import JobList from "../jobs/JobList";
import JoblyApi from "../api";

// Mock job data
const mockJobs = [
  { id: 1, title: "Frontend Engineer", companyName: "Apple", salary: 120000 },
  { id: 2, title: "Backend Developer", companyName: "Netflix", salary: 135000 }
];

describe("JobList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", async () => {
    JoblyApi.getJobs.mockResolvedValueOnce(mockJobs);

    render(<JobList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/frontend engineer/i)).toBeInTheDocument();
      expect(screen.getByText(/backend developer/i)).toBeInTheDocument();
    });
  });

  test("handles API error gracefully", async () => {
    JoblyApi.getJobs.mockRejectedValueOnce(["API Error"]);

    render(<JobList />);
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test("shows 'no jobs' when empty array returned", async () => {
    JoblyApi.getJobs.mockResolvedValueOnce([]);

    render(<JobList />);
    await waitFor(() => {
      expect(screen.getByText(/no jobs found/i)).toBeInTheDocument();
    });
  });
});
