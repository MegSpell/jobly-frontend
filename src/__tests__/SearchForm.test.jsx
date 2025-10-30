// src/__tests__/SearchForm.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchForm from "../common/SearchForm";

test("calls onSearch with typed term", () => {
  const onSearch = jest.fn();
  render(<SearchForm onSearch={onSearch} />);

  const input = screen.getByPlaceholderText(/search/i);
  fireEvent.change(input, { target: { value: "apple" } });
  fireEvent.submit(input.closest("form"));

  expect(onSearch).toHaveBeenCalledWith("apple");
});

test("calls onSearch with undefined when input is blank", () => {
  const onSearch = jest.fn();
  render(<SearchForm onSearch={onSearch} />);

  const input = screen.getByPlaceholderText(/search/i);
  fireEvent.change(input, { target: { value: "   " } });
  fireEvent.submit(input.closest("form"));

  expect(onSearch).toHaveBeenCalledWith(undefined);
});
