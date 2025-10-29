// jobly-frontend/src/__mocks__/api.js
const JoblyApi = {
  token: null,
  request: jest.fn(),

  // Auth
  login: jest.fn().mockResolvedValue("fake-token"),
  signup: jest.fn().mockResolvedValue("fake-token"),
  getCurrentUser: jest.fn().mockResolvedValue({
    username: "testuser",
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    applications: []
  }),

  // Companies
  getCompanies: jest.fn().mockResolvedValue([]),
  getCompany: jest.fn().mockResolvedValue({
    name: "ACME",
    description: "Sample company",
    jobs: []
  }),

  // Jobs
  getJobs: jest.fn().mockResolvedValue([]),
  applyToJob: jest.fn().mockResolvedValue(123),

  // Profile
  saveProfile: jest.fn().mockResolvedValue({
    username: "testuser",
    firstName: "Updated",
    lastName: "User",
    email: "test@example.com",
    applications: []
  })
};

export default JoblyApi;
