/**
 * SignupForm.test.jsx
 * Checks that signup form:
 *  - calls signup() with correct data
 *  - navigates to "/" on success
 *  - shows error message on failure
 */

// --- Mock react-router-dom (virtual to avoid ESM import issues) ---
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
import SignupForm from "../auth/SignupForm";

beforeEach(() => {
  mockNavigate.mockReset();
});

function setup(overrides = {}) {
  const signup = overrides.signup || jest.fn().mockResolvedValue("fake-token");

  render(<SignupForm signup={signup} />);

  const username = screen.getByLabelText(/username/i);
  const password = screen.getByLabelText(/password/i);
  const firstName = screen.getByLabelText(/first name/i);
  const lastName = screen.getByLabelText(/last name/i);
  const email = screen.getByLabelText(/email/i);
  const submit = screen.getByRole("button", { name: /create account/i });

  return {
    signup,
    username,
    password,
    firstName,
    lastName,
    email,
    submit,
    user: userEvent.setup()
  };
}

test("submits signup form and navigates on success", async () => {
  const { signup, username, password, firstName, lastName, email, submit, user } = setup();

  await user.type(username, "newuser");
  await user.type(password, "secret123");
  await user.type(firstName, "New");
  await user.type(lastName, "User");
  await user.type(email, "newuser@example.com");

  await user.click(submit);

  expect(signup).toHaveBeenCalledWith({
    username: "newuser",
    password: "secret123",
    firstName: "New",
    lastName: "User",
    email: "newuser@example.com"
  });
  expect(mockNavigate).toHaveBeenCalledWith("/");
});

test("shows error and does not navigate on failure", async () => {
  const failingSignup = jest.fn().mockRejectedValue(["Email already exists"]);
  const { username, password, firstName, lastName, email, submit, user } = setup({ signup: failingSignup });

  await user.type(username, "baduser");
  await user.type(password, "badpass");
  await user.type(firstName, "Bad");
  await user.type(lastName, "User");
  await user.type(email, "taken@example.com");

  await user.click(submit);

  expect(await screen.findByText(/email already exists/i)).toBeInTheDocument();
  expect(mockNavigate).not.toHaveBeenCalled();
});
