// src/__tests__/useLocalStorage.test.jsx
import { renderHook, act } from "@testing-library/react";
import useLocalStorage from "../hooks/useLocalStorage";

beforeEach(() => {
  localStorage.clear();
  jest.spyOn(window.localStorage.__proto__, "setItem");
  jest.spyOn(window.localStorage.__proto__, "getItem");
  jest.spyOn(window.localStorage.__proto__, "removeItem");
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("initializes from localStorage when present", () => {
  localStorage.setItem("token", JSON.stringify("abc"));
  const { result } = renderHook(() => useLocalStorage("token", null));
  expect(result.current[0]).toBe("abc");
  expect(localStorage.getItem).toHaveBeenCalledWith("token");
});

test("writes to localStorage when state changes", () => {
  const { result } = renderHook(() => useLocalStorage("k", null));
  act(() => result.current[1]("value"));
  expect(localStorage.setItem).toHaveBeenCalledWith("k", JSON.stringify("value"));
});

test("removes key when state becomes null/undefined", () => {
  const { result } = renderHook(() => useLocalStorage("k", "x"));
  act(() => result.current[1](null));
  expect(localStorage.removeItem).toHaveBeenCalledWith("k");
});
