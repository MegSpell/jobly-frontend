/**
 * useLocalStorage
 * ---------------------------------------------------------------------------
 * A reusable custom React Hook that syncs state with localStorage.
 *
 * Responsibilities:
 *  - Provide persistent state across browser refreshes/sessions.
 *  - Automatically serialize/deserialize JSON data.
 *  - Remove key from storage when value becomes null or undefined.
 *
 * Usage:
 *  const [token, setToken] = useLocalStorage("jobly-token", null);
 *
 * Parameters:
 *  - key: string → the key name in localStorage
 *  - initialValue: any → fallback value if key not found
 *
 * Returns:
 *  [state, setState] just like useState
 */

import { useEffect, useState } from "react";

export default function useLocalStorage(key, initialValue = null) {
  // -------------------------------------------------------------------------
  // Initialize state:
  // Try reading existing value from localStorage on first render.
  // If found → parse and use it; otherwise use provided initialValue.
  // -------------------------------------------------------------------------
  const [state, setState] = useState(() => {
    const json = window.localStorage.getItem(key);
    return json ? JSON.parse(json) : initialValue;
  });

  // -------------------------------------------------------------------------
  // Whenever the key or value changes:
  //  - Save new state to localStorage as JSON.
  //  - If state is null/undefined, remove the key instead.
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (state === null || state === undefined) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  // Return [value, setter] so it works exactly like useState()
  return [state, setState];
}
