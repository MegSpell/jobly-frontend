// src/__tests__/Guards.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { PrivateRoute, AnonRoute } from "../routes/Guards";
import CurrentUserContext from "../auth/CurrentUserContext";

// Minimal Navigate mock so <Navigate/> doesn’t crash in tests
jest.mock(
  "react-router-dom",
  () => {
    const React = require("react");
    return { Navigate: () => <div>Navigate</div> };
  },
  { virtual: true }
);

function renderWithUser(ui, user) {
  const value = { currentUser: user };
  return render(
    <CurrentUserContext.Provider value={value}>{ui}</CurrentUserContext.Provider>
  );
}

test("PrivateRoute renders children when logged in", () => {
  renderWithUser(
    <PrivateRoute><div>Secret</div></PrivateRoute>,
    { username: "testuser" }
  );
  expect(screen.getByText("Secret")).toBeInTheDocument();
});

test("PrivateRoute redirects when logged out", () => {
  renderWithUser(<PrivateRoute><div>Secret</div></PrivateRoute>, null);
  expect(screen.getByText("Navigate")).toBeInTheDocument();
});

test("AnonRoute renders children when logged out", () => {
  renderWithUser(<AnonRoute><div>LoginPage</div></AnonRoute>, null);
  expect(screen.getByText("LoginPage")).toBeInTheDocument();
});

test("AnonRoute redirects when logged in", () => {
  renderWithUser(
    <AnonRoute><div>LoginPage</div></AnonRoute>,
    { username: "testuser" }
  );
  expect(screen.getByText("Navigate")).toBeInTheDocument();
});
