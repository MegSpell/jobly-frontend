/**
 * NavBar.test.jsx
 * Tests that the navigation bar renders the right links based on login state.
 */

jest.mock(
  "react-router-dom",
  () => {
    const React = require("react");
    return {
      NavLink: ({ children, to }) => <a href={to}>{children}</a>,
      useLocation: () => ({ pathname: "/" })
    };
  },
  { virtual: true }
);

import React from "react";
import { render, screen } from "@testing-library/react";
import NavBar from "../NavBar";
import CurrentUserContext from "../auth/CurrentUserContext";

describe("NavBar", () => {
  test("shows login/signup when logged out", () => {
    render(
      <CurrentUserContext.Provider value={{ currentUser: null }}>
        <NavBar logout={jest.fn()} />
      </CurrentUserContext.Provider>
    );

    expect(screen.getByText(/jobly/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  test("shows company/job/profile/logout when logged in", () => {
    const fakeUser = { username: "testuser" };

    render(
      <CurrentUserContext.Provider value={{ currentUser: fakeUser }}>
        <NavBar logout={jest.fn()} />
      </CurrentUserContext.Provider>
    );

    expect(screen.getByText(/companies/i)).toBeInTheDocument();
    expect(screen.getByText(/jobs/i)).toBeInTheDocument();
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText(/log out/i)).toBeInTheDocument();
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
  });
});
