# Testing

This folder contains a simple smoke-test script to validate the API endpoints locally.

Run:
```bash
node testing/api_smoke_test.js
```

It will attempt to register a new test user, login, create an experience, list experiences, and fetch the profile.

Note: ensure the backend is running on `http://localhost:5000` or set `BASE_URL` env var.
