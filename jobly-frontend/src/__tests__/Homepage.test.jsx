/**
 * Homepage.test.jsx
 * Verifies homepage renders correct content for logged-out and logged-in users.
 * Router is mocked so we don't pull in ESM modules in Jest.
 */

// Mock react-router-dom so <Link> doesn't require a Router and ESM is avoided
jest.mock(
  "react-router-dom",
  () => {
    const React = require("react");
    return {
      Link: ({ children }) => <a>{children}</a>,
    };
  },
  { virtual: true }
);

import React from "react";
import { render, screen } from "@testing-library/react";
import Homepage from "../Homepage";
import CurrentUserContext from "../auth/CurrentUserContext";

// Helper: render Homepage with (optional) currentUser
function renderHomepage(user = null) {
  return render(
    <CurrentUserContext.Provider value={{ currentUser: user }}>
      <Homepage />
    </CurrentUserContext.Provider>
  );
}

describe("Homepage", () => {
  test("renders for logged-out user", () => {
    renderHomepage();

    // Visitor hero text
    expect(
      screen.getByRole("heading", { name: /find your next role/i })
    ).toBeInTheDocument();

    // CTA buttons
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  test("renders for logged-in user", () => {
    const user = { username: "testuser", firstName: "Test" };
    renderHomepage(user);

    // Personalized greeting
    expect(
      screen.getByRole("heading", { name: /welcome back, test/i })
    ).toBeInTheDocument();

    // Signed-in CTAs
    expect(screen.getByText(/find jobs/i)).toBeInTheDocument();
    expect(screen.getByText(/explore companies/i)).toBeInTheDocument();
  });
});
