/**
 * CompanyDetail.test.jsx
 * - Mocks react-router-dom with a top-level jest.fn() (no pre-init refs)
 * - Uses the manual __mocks__/api.js so axios never loads
 * - Requires CompanyDetail AFTER mocks are set up
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import JoblyApi from "../api";

// Create the function we'll control in tests:
const mockUseParams = jest.fn();

// Mock the router using only values that exist right now.
// Don't reference outer objects (prevents "before initialization" errors).
jest.mock(
  "react-router-dom",
  () => ({
    __esModule: true,
    useParams: mockUseParams,       // <- safe: defined above
    Link: ({ children }) => <a>{children}</a>
  }),
  { virtual: true }
);

// Use our manual API mock
jest.mock("../api");

// Import AFTER mocks so the component sees the mocked modules.
const CompanyDetail = require("../companies/CompanyDetail").default;

describe("CompanyDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders company name and jobs", async () => {
    mockUseParams.mockReturnValue({ handle: "acme" });

    JoblyApi.getCompany.mockResolvedValueOnce({
      handle: "acme",
      name: "ACME Corp",
      description: "Gadgets",
      jobs: [
        { id: 1, title: "Engineer", salary: 100000, equity: "0.02" },
        { id: 2, title: "Designer", salary: 90000, equity: null }
      ]
    });

    render(<CompanyDetail />);

    await waitFor(() => {
      expect(screen.getByText(/acme corp/i)).toBeInTheDocument();
      expect(screen.getByText(/engineer/i)).toBeInTheDocument();
      expect(screen.getByText(/designer/i)).toBeInTheDocument();
    });
  });

  test("shows error on API failure", async () => {
    mockUseParams.mockReturnValue({ handle: "oops" });
    JoblyApi.getCompany.mockRejectedValueOnce(["API Error"]);

    render(<CompanyDetail />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
