/**
 * CompanyList.test.jsx
 * Tests that the company list renders results and handles loading/errors.
 */

// --- Mock react-router-dom so <Link> works without ESM ---
jest.mock(
  "react-router-dom",
  () => {
    const React = require("react");
    return { Link: ({ children }) => <a>{children}</a> };
  },
  { virtual: true }
);

// --- Use the project-root __mocks__/api.js (prevents importing real axios) ---
jest.mock("../api");

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CompanyList from "../companies/CompanyList";
import JoblyApi from "../api";

// Mock a basic company list
const mockCompanies = [
  { handle: "apple", name: "Apple", description: "Tech giant" },
  { handle: "netflix", name: "Netflix", description: "Streaming service" }
];

describe("CompanyList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", async () => {
    JoblyApi.getCompanies.mockResolvedValueOnce(mockCompanies);

    render(<CompanyList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/apple/i)).toBeInTheDocument();
      expect(screen.getByText(/netflix/i)).toBeInTheDocument();
    });
  });

  test("handles API error gracefully", async () => {
    JoblyApi.getCompanies.mockRejectedValueOnce(["API Error"]);

    render(<CompanyList />);
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test("shows 'no companies' when empty array returned", async () => {
    JoblyApi.getCompanies.mockResolvedValueOnce([]);

    render(<CompanyList />);
    await waitFor(() => {
      expect(screen.getByText(/no companies found/i)).toBeInTheDocument();
    });
  });
});
