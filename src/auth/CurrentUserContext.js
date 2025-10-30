/**
 * CurrentUserContext
 * ---------------------------------------------------------------------------
 * React Context for sharing the authenticated user's information
 * and related helper functions throughout the app.
 *
 * Provides a single source of truth for:
 *  - currentUser: full user object from the backend (or null if logged out)
 *  - setCurrentUser, token, applyToJob, etc. (all passed in via Provider)
 *
 * The Provider is set up in App.js:
 *   <CurrentUserContext.Provider value={ctx}> ... </Provider>
 *
 * This file also exports a small custom hook (useCurrentUser) so components
 * can easily consume the context without importing useContext each time.
 */

import { createContext, useContext } from "react";

// Create context object with default value of null
// (will be replaced by the value provided in App.js)
const CurrentUserContext = createContext(null);

export default CurrentUserContext;

/**
 * useCurrentUser()
 * ---------------------------------------------------------------------------
 * Custom convenience hook:
 *   - Instead of `useContext(CurrentUserContext)` in every component,
 *     you can just call `useCurrentUser()` for cleaner code.
 *
 * Example:
 *   const { currentUser, applyToJob } = useCurrentUser();
 */
export function useCurrentUser() {
  return useContext(CurrentUserContext);
}
