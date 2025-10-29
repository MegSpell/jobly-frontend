/**
 * LoginForm.test.jsx
 * Verifies submit behavior:
 *  - calls login() with form data
 *  - navigates to "/" on success
 *  - shows error on failure and does NOT navigate
 */

// --- Mock react-router-dom (virtual to bypass ESM import issues) ---
const mockNavigate = jest.fn();
jest.mock(
  "react-router-dom",
  () => ({
    useNavigate: () => mockNavigate,
    Link: ({ children }) => <a>{children}</a>
  }),
  { virtual: true }
);

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "../auth/LoginForm";

beforeEach(() => {
  mockNavigate.mockReset();
});

function setup(overrides = {}) {
  const login = overrides.login || jest.fn().mockResolvedValue("fake-token");
  render(<LoginForm login={login} />);
  const username = screen.getByLabelText(/username/i);
  const password = screen.getByLabelText(/password/i);
  const submit = screen.getByRole("button", { name: /sign in/i });
  return { login, username, password, submit, user: userEvent.setup() };
}

test("submits credentials and navigates on success", async () => {
  const { login, username, password, submit, user } = setup();

  // overwrite defaults to make sure our values are used
  await user.clear(username);
  await user.type(username, "testuser");
  await user.clear(password);
  await user.type(password, "password");

  await user.click(submit);

  expect(login).toHaveBeenCalledWith({ username: "testuser", password: "password" });
  expect(mockNavigate).toHaveBeenCalledWith("/");
});

test("shows error and does not navigate on failure", async () => {
  const failingLogin = jest.fn().mockRejectedValue(["Invalid credentials"]);
  const { username, password, submit, user } = setup({ login: failingLogin });

  await user.clear(username);
  await user.type(username, "baduser");
  await user.clear(password);
  await user.type(password, "nope");

  await user.click(submit);

  // Error appears
  expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  // No navigation on failure
  expect(mockNavigate).not.toHaveBeenCalled();
});
