/**
 * JoblyApi
 * ---------------------------------------------------------------------------
 * Centralized API helper class for communicating with the backend.
 *
 * This acts like a “model layer” for the frontend:
 *   - All HTTP requests to the backend go through this class.
 *   - Keeps axios setup, token handling, and error formatting consistent.
 *
 * Usage example:
 *   JoblyApi.token = "<JWT>";
 *   const companies = await JoblyApi.getCompanies("apple");
 */

import axios from "axios";

// Base URL for API calls
// In production, this value is injected via the environment variable REACT_APP_BASE_URL
// (set automatically by Render or another deployment host).
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class JoblyApi {
  /** ------------------------------------------------------------------------
   * token
   * JWT authentication token (if logged in).
   * Stored as a static property so all requests automatically use it.
   ------------------------------------------------------------------------ */
  static token = null;

  /** ------------------------------------------------------------------------
   * request(endpoint, data = {}, method = "get")
   *
   * Generic method used by all other helpers to send requests to the backend.
   * - Handles token auth header automatically
   * - Supports query params for GET and body data for POST/PATCH
   * - Catches and normalizes errors
   *
   * Returns the raw response `.data` object.
   ------------------------------------------------------------------------ */
  static async request(endpoint, data = {}, method = "get") {
    const url = `${BASE_URL}/${endpoint}`;
    const headers = JoblyApi.token
      ? { Authorization: `Bearer ${JoblyApi.token}` }
      : {};
    const params = method === "get" ? data : undefined;

    try {
      const res = await axios({ url, method, data, params, headers });
      return res.data;
    } catch (err) {
      // Extract helpful error message(s) from the backend response
      const message = err?.response?.data?.error?.message || "API Error";
      // Always return an array of messages for consistency
      throw Array.isArray(message) ? message : [message];
    }
  }

  /** ------------------------------------------------------------------------
   * getCompanies(name)
   * Fetches all companies, optionally filtered by a search term.
   *  - GET /companies
   *  - Optional query param: ?name=term
   *
   * Returns: [ { handle, name, description, ... }, ... ]
   ------------------------------------------------------------------------ */
  static async getCompanies(name) {
    const q = name ? { name } : {};
    const { companies } = await this.request("companies", q);
    return companies;
  }

  /** ------------------------------------------------------------------------
   * getCompany(handle)
   * Fetches detailed info about a single company by handle.
   *  - GET /companies/:handle
   *
   * Returns: { handle, name, description, jobs: [ ... ] }
   ------------------------------------------------------------------------ */
  static async getCompany(handle) {
    const { company } = await this.request(`companies/${handle}`);
    return company;
  }

  /** ------------------------------------------------------------------------
   * getJobs(title)
   * Fetches all jobs, optionally filtered by a search term.
   *  - GET /jobs
   *  - Optional query param: ?title=term
   *
   * Returns: [ { id, title, salary, equity, companyHandle, companyName }, ... ]
   ------------------------------------------------------------------------ */
  static async getJobs(title) {
    const q = title ? { title } : {};
    const { jobs } = await this.request("jobs", q);
    return jobs;
  }

  /** ------------------------------------------------------------------------
   * login(credentials)
   * Authenticates a user and returns a signed JWT.
   *  - POST /auth/token
   *  - Body: { username, password }
   *
   * Returns: token (string)
   ------------------------------------------------------------------------ */
  static async login(credentials) {
    const { token } = await this.request("auth/token", credentials, "post");
    return token;
  }

  /** ------------------------------------------------------------------------
   * signup(data)
   * Registers a new user and returns a signed JWT.
   *  - POST /auth/register
   *  - Body: { username, password, firstName, lastName, email }
   *
   * Returns: token (string)
   ------------------------------------------------------------------------ */
  static async signup(data) {
    const { token } = await this.request("auth/register", data, "post");
    return token;
  }

  /** ------------------------------------------------------------------------
   * getCurrentUser(username)
   * Fetches the full user record for a given username.
   *  - GET /users/:username
   *
   * Returns: { username, firstName, lastName, email, applications: [...] }
   ------------------------------------------------------------------------ */
  static async getCurrentUser(username) {
    const { user } = await this.request(`users/${username}`);
    return user;
  }

  /** ------------------------------------------------------------------------
   * saveProfile(username, data)
   * Updates the profile for a given username.
   *  - PATCH /users/:username
   *  - Body: { firstName, lastName, email, password }
   *
   * Returns: updated user object
   ------------------------------------------------------------------------ */
  static async saveProfile(username, data) {
    const { user } = await this.request(`users/${username}`, data, "patch");
    return user;
  }

  /** ------------------------------------------------------------------------
   * applyToJob(username, jobId)
   * Applies the given user to the given job.
   *  - POST /users/:username/jobs/:jobId
   *
   * Returns: { applied: jobId }
   ------------------------------------------------------------------------ */
  static async applyToJob(username, jobId) {
    const { applied } = await this.request(
      `users/${username}/jobs/${jobId}`,
      {},
      "post"
    );
    return applied; // jobId
  }
}

export default JoblyApi;
