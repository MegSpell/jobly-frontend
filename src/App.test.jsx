// --- Mock react-router-dom BEFORE importing App ---
jest.mock(
  "react-router-dom",
  () => {
    const React = require("react");
    return {
      BrowserRouter: ({ children }) => <div>{children}</div>,
      Routes: ({ children }) => <div>{children}</div>,
      Route: ({ element }) => element,
      Navigate: () => <div>Navigate</div>,
      Link: ({ children }) => <a>{children}</a>,
      NavLink: ({ children }) => <a>{children}</a>,
      useLocation: () => ({ pathname: "/" }),
      useNavigate: () => jest.fn()
    };
  },
  { virtual: true }
);

// ✅ Use the project-root __mocks__/api.js
jest.mock("./api");

import React from "react";
import { render } from "@testing-library/react";

// IMPORTANT: import AFTER mocks so real modules aren’t evaluated.
const App = require("./App").default;

test("renders App without crashing", () => {
  render(<App />);
});
