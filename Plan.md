# PrepVault
## Interview Experience & Question Archive Backend API

---

# 1. Project Overview

**PrepVault** is a backend API system designed to help students record, manage, and analyze interview experiences and frequently asked questions across companies.

Students preparing for internships or placements often forget interview questions, lose preparation notes, or cannot easily identify patterns in interview processes. PrepVault solves this by providing a centralized backend service where users can store and query interview experiences.

The system allows users to log interview details such as:

- Company name
- Role / position
- Interview rounds
- Questions asked
- Difficulty level
- Preparation tips



Beyond simple storage, the backend also provides analytics features such as:

- Frequently asked questions by company
- Interview difficulty patterns
- Search and filtering capabilities

The project focuses on demonstrating backend engineering principles including REST API design, routing, middleware, validation, database operations, and error handling.

---

# 2. Goals of the Project

## Primary Goals

- Build a well-structured RESTful backend API
- Demonstrate backend concepts from the course syllabus
- Provide useful features beyond basic CRUD operations
- Maintain a clean modular architecture
- Enable easy testing using Postman

## Secondary Goals

- Implement analytics endpoints
- Ensure robust validation and error handling
- Make the API scalable and extendable

---

# 3. Tech Stack

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose ODM

## Development Tools

- Postman (API testing)
- Nodemon (development server)
- dotenv (environment variables)

## Optional Enhancements

- JWT authentication
- Prisma + PostgreSQL
- Unit testing with Jest

---

# 4. System Architecture

The project follows a layered backend architecture.

Client (Postman / Frontend)

↓

Routes Layer

↓

Controllers Layer

↓

Business Logic Layer

↓

Database Models (Mongoose)

↓

MongoDB

Supporting layers include:

- Middleware (validation, logging, error handling)
- Utility helpers
- Configuration files

---

# 5. Core Entity Design

The main entity is **InterviewExperience**.

Each record represents one interview experience submitted by a user.

## InterviewExperience Fields

- company (string)
- role (string)
- rounds (number)
- questions (array of strings)
- difficulty (number from 1–5)
- tips (string)
- createdAt (date)

## Example Document

```json
{
  "company": "Infosys",
  "role": "Backend Intern",
  "rounds": 2,
  "questions": [
    "Explain REST APIs",
    "Difference between SQL and NoSQL"
  ],
  "difficulty": 3,
  "tips": "Focus on DBMS basics",
  "createdAt": "2026-03-10"
}
6. Core API Features
6.1 Add Interview Experience

Endpoint

POST /api/experiences

Description

Adds a new interview experience entry.

Example Request Body

{
  "company": "TCS",
  "role": "Ninja",
  "rounds": 2,
  "questions": [
    "Explain normalization",
    "What is polymorphism?"
  ],
  "difficulty": 3,
  "tips": "Revise OOP concepts"
}
6.2 Get All Interview Experiences

Endpoint

GET /api/experiences

Description

Returns all stored interview experiences.

Future improvements may include pagination and sorting.

6.3 Get Experiences By Company

Endpoint

GET /api/experiences/company/:companyName

Example:

GET /api/experiences/company/amazon

Returns interview experiences for that company.

6.4 Filter By Difficulty

Endpoint

GET /api/experiences?difficulty=3

Returns experiences filtered by difficulty level.

6.5 Update Interview Experience

Endpoint

PUT /api/experiences/:id

Updates an existing experience entry.

6.6 Delete Interview Experience

Endpoint

DELETE /api/experiences/:id

Deletes an interview experience record.

7. Analytics Endpoints

These endpoints provide value beyond simple CRUD operations.

7.1 Frequently Asked Questions Per Company

Endpoint

GET /api/analytics/common-questions/:company

Description

Aggregates questions from multiple interview experiences and returns the most frequently asked ones.

Example Response

{
  "company": "Amazon",
  "commonQuestions": [
    "Explain REST API",
    "Difference between SQL and NoSQL"
  ]
}
7.2 Difficulty Insights

Endpoint

GET /api/analytics/difficulty-summary

Description

Provides summary statistics of interview difficulty levels.

Example output:

Easy: 10
Medium: 25
Hard: 5

8. Middleware

The project will include multiple middleware components.

Validation Middleware

Ensures request data is valid.

Examples:

Company name cannot be empty

Difficulty must be between 1 and 5

Questions array must not be empty

Logging Middleware

Logs incoming API requests.

Example log:

POST /api/experiences
Timestamp: 2026-03-10

Error Handling Middleware

Centralized error handler for consistent responses.

Example error response:

{
  "success": false,
  "message": "Interview experience not found"
}
9. Folder Structure
prepVault-backend

controllers
    experienceController.js
    analyticsController.js

models
    experienceModel.js

routes
    experienceRoutes.js
    analyticsRoutes.js

middleware
    validationMiddleware.js
    errorMiddleware.js
    loggerMiddleware.js

config
    db.js

utils
    helpers.js

server.js

package.json

Plan.md
10. Example API Workflow (Postman Demo)

Step 1
Add an interview experience.

Step 2
Retrieve all experiences.

Step 3
Filter experiences by company.

Step 4
Retrieve common interview questions.

Step 5
View difficulty summary.

This demonstrates the full backend functionality.

11. Future Improvements (Optional)

Possible extensions:

User authentication (JWT)

User-specific interview logs

Upvoting useful experiences

Pagination and sorting

Topic tagging (DSA, DBMS, OS, HR)

Cloud deployment

12. Learning Outcomes

By completing this project we demonstrate:

REST API development using Express

MongoDB database modeling

Middleware implementation

Error handling strategies

Query filtering and analytics

Modular backend architecture

API testing using Postman

13. Project Status

Initial ideation and planning completed.

Next Steps

Initialize Node.js project

Setup Express server

Configure MongoDB connection

Implement models

Implement routes and controllers

Add middleware

Test APIs using Postman

Implement analytics endpoints


---