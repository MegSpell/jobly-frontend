/**
 * ProfileForm.test.jsx
 * Tests profile editing behavior:
 *  - shows current user info in inputs
 *  - saves updates successfully (calls API + shows success)
 *  - shows error alert on failure
 */

// --- Mock react-router-dom (virtual to avoid ESM issues) ---
jest.mock(
  "react-router-dom",
  () => ({}),
  { virtual: true }
);

// --- Mock API so no real requests are made ---
jest.mock("../api", () => ({
  saveProfile: jest.fn()
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfileForm from "../profile/ProfileForm";
import CurrentUserContext from "../auth/CurrentUserContext";
import JoblyApi from "../api";

const mockUser = {
  username: "testuser",
  firstName: "Testy",
  lastName: "McTester",
  email: "test@test.com"
};

function renderWithUser(ui, valueOverrides = {}) {
  const ctx = {
    currentUser: mockUser,
    setCurrentUser: jest.fn(),
    ...valueOverrides
  };
  return render(
    <CurrentUserContext.Provider value={ctx}>{ui}</CurrentUserContext.Provider>
  );
}

test("renders with current user data prefilled", () => {
  renderWithUser(<ProfileForm />);
  expect(screen.getByLabelText(/first name/i)).toHaveValue("Testy");
  expect(screen.getByLabelText(/last name/i)).toHaveValue("McTester");
  expect(screen.getByLabelText(/email/i)).toHaveValue("test@test.com");
});

test("submits updated profile and shows success", async () => {
  JoblyApi.saveProfile.mockResolvedValue({
    ...mockUser,
    firstName: "Updated"
  });

  const user = userEvent.setup();
  const setCurrentUser = jest.fn();
  renderWithUser(<ProfileForm />, { setCurrentUser });

  const firstName = screen.getByLabelText(/first name/i);
  await user.clear(firstName);
  await user.type(firstName, "Updated");

  await user.type(screen.getByLabelText(/password/i), "password123");
  await user.click(screen.getByRole("button", { name: /save changes/i }));

  expect(JoblyApi.saveProfile).toHaveBeenCalledWith("testuser", {
    firstName: "Updated",
    lastName: "McTester",
    email: "test@test.com",
    password: "password123"
  });
  expect(setCurrentUser).toHaveBeenCalled();
  expect(await screen.findByText(/profile updated/i)).toBeInTheDocument();
});

test("shows error alert on failure", async () => {
  JoblyApi.saveProfile.mockRejectedValue(["Invalid password"]);
  const user = userEvent.setup();
  renderWithUser(<ProfileForm />);

  await user.type(screen.getByLabelText(/password/i), "wrongpass");
  await user.click(screen.getByRole("button", { name: /save changes/i }));

  expect(await screen.findByText(/invalid password/i)).toBeInTheDocument();
});
