# PrepVault
## Interview Experience & Question Archive Backend API

---

> **Eval Context:** Backend Engineering-I | 24CSE0214 | B.E. CSE Batch 2024 | 4th Sem  
> **Evaluation 1 Period:** 09-03-2026 to 13-03-2026 | Total Marks: 30 (Presentation: 5 + Project & Viva: 25)

---

# 0. Syllabus Coverage Map

✅ = Actually in the project | 📖 = Know it for viva, not forced into code

| Syllabus Topic | Status | How |
|---|---|---|
| Client-Server Architecture | ✅ | Postman → Express → MongoDB |
| How requests are handled at server | ✅ | Routes → Middleware → Controller → Model |
| Node.js setup & environment | ✅ | `package.json`, `nodemon`, `.env` via `dotenv` |
| File handling module (`fs`) | ✅ | Logger middleware writes to file; export endpoint streams file |
| File dependency / module system | ✅ | `require()` across all modules |
| Node.js advantages / disadvantages | 📖 | Covered in presentation slide |
| HTTP module & creating endpoints | 📖 | Know how `http.createServer()` works; Express builds on top of it |
| Modules, NPM, import modules | ✅ | `express`, `mongoose`, `dotenv`, `morgan`, `nodemon` |
| Express.js framework | ✅ | Core of the project |
| Serve static files | ✅ | `express.static('public')` for a simple API info page |
| Routing methods (GET, POST, PUT, DELETE) | ✅ | All 4 used |
| Route paths | ✅ | `/api/experiences`, `/api/analytics/...` |
| Route parameters | ✅ | `/:id`, `/company/:companyName` |
| Route handlers | ✅ | Controller functions per route |
| Response methods | ✅ | `res.json()`, `res.status()`, `res.sendFile()` |
| Static pages with file stream | ✅ | `fs.createReadStream()` piped in export endpoint |
| Handling exceptions | ✅ | try/catch in controllers + centralized error middleware |
| Middleware lifecycle | ✅ | Demonstrated across all middleware layers |
| Application-level middleware | ✅ | `morgan`, `express.json()`, custom logger — on `app` |
| Router-level middleware | ✅ | Validation middleware attached to experience `router` |
| Error-handling middleware | ✅ | 4-argument `(err, req, res, next)` handler |
| Third-party middleware | ✅ `morgan` used; 📖 `cors`, `helmet`, `express-validator` — know what they do |

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

## NPM Packages Used

- **morgan** — HTTP request logger (used in project)
- **nodemon** — Auto-restart dev server
- **dotenv** — Environment variable management

## Know for Viva (not in project, but understand what they do)

- **cors** — Middleware to allow cross-origin requests from browsers
- **helmet** — Sets secure HTTP headers to protect against common attacks
- **express-validator** — Third-party body validation library (we do custom validation instead)

## Optional Enhancements (Post-Eval)

- JWT authentication
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
- tags (array — e.g. `["DSA", "DBMS", "OS", "CN", "HR"]`)
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
  "tags": ["DBMS", "CN"],
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

6.7 Search Experiences (Full-text Query)

Endpoint

GET /api/experiences/search?q=polymorphism

Description

Searches questions and tips for the given keyword. Useful for finding experiences containing specific topics.

6.8 Filter by Tag

Endpoint

GET /api/experiences?tag=DSA

Returns all experiences tagged with a specific topic (DSA, DBMS, OS, CN, HR).

6.9 Export Experiences to File (fs Module)

Endpoint

GET /api/experiences/export

Description

Uses Node.js `fs` module to write all experiences to a `exports/experiences.json` file on the server.
Returns the file as a download using `fs.createReadStream()` piped to the response.

This directly demonstrates:
- `fs.writeFile()` / `fs.createReadStream()`
- File streaming via `res.pipe()`
- File dependency and the `fs` module requirement from syllabus

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

## 8.1 Application-Level Middleware (attached to `app`)

Runs for every request — registered directly on `app`.

**morgan** — Third-party request logger, logs method + URL + status + response time
```js
app.use(morgan('dev'))
```
Using `morgan` makes sense here — it's production-standard, saves us writing a console logger from scratch, and it's a real third-party middleware example.

**express.json()** — Parses incoming JSON request bodies
```js
app.use(express.json())
```

**Custom Logger Middleware** — Writes request logs to `logs/requests.log` using `fs.appendFile`
```js
app.use(loggerMiddleware)  // fs module in action
```
This is our own middleware that persists logs to a file — shows `fs` module usage naturally.

## 8.2 Router-Level Middleware (attached to `router`)

Validation middleware is attached to the experience `router`, not to `app` globally. This is a natural fit — validation only makes sense on routes that accept data.

```js
// experienceRoutes.js
const router = express.Router()
router.use(validateExperienceBody)  // runs only for experience routes
router.post('/', createExperience)
router.put('/:id', updateExperience)
```

This is a clean, honest reason to use router-level middleware — scope validation to where it matters.

## 8.3 Error-Handling Middleware

Centralized 4-argument error handler — placed last in the middleware stack.

```js
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  })
})
```

Example error response:

```json
{
  "success": false,
  "message": "Interview experience not found"
}
```

## 8.4 Validation Middleware (Custom)

Written from scratch — runs before POST/PUT controllers.

Rules:
- `company` cannot be empty
- `difficulty` must be between 1 and 5
- `questions` array must not be empty
- `tags` must be from allowed values: DSA, DBMS, OS, CN, HR

> **Viva note:** If asked about `express-validator` — it's a third-party library that does the same thing more formally. We chose to write custom validation to understand the internals. Either approach is valid.

## 8.5 Middleware Lifecycle (For Presentation)

```
Incoming Request
    ↓
morgan [app-level, third-party] — logs to console
    ↓
express.json() [app-level, built-in] — parses body
    ↓
customLogger [app-level, custom] — fs.appendFile to logs/requests.log
    ↓
Router matched
    ↓
validateExperienceBody [router-level] — only on experience router
    ↓
Controller function (try/catch internally)
    ↓
Response sent
    ↓
[On error thrown] errorMiddleware (err, req, res, next)
```

## 8.6 What We Know But Don't Use

| Middleware | What it does | Why not in project |
|---|---|---|
| `cors` | Allows cross-origin requests from browsers | No browser frontend — Postman doesn't need it |
| `helmet` | Sets secure HTTP headers | Security hardening for production; overkill for dev |
| `express-validator` | Third-party validation library | We wrote custom validation to understand the internals |
9. Folder Structure
```
prepVault-backend/
│
├── controllers/
│   ├── experienceController.js
│   └── analyticsController.js
│
├── models/
│   └── experienceModel.js
│
├── routes/
│   ├── experienceRoutes.js
│   └── analyticsRoutes.js
│
├── middleware/
│   ├── validationMiddleware.js  ← router-level: attached to experience router
│   ├── errorMiddleware.js       ← error-handling: 4-arg (err, req, res, next)
│   └── loggerMiddleware.js      ← app-level: fs.appendFile to logs/
│
├── config/
│   └── db.js
│
├── utils/
│   └── helpers.js
│
├── public/                     ← served via express.static('public')
│   └── index.html              ← simple API info page
│
├── exports/                    ← created by fs.writeFile on export
│   └── experiences.json
│
├── logs/                       ← written by loggerMiddleware via fs.appendFile
│   └── requests.log
│
├── server.js
├── package.json
├── .env
└── Plan.md
```
10. Example API Workflow (Postman Demo)

**Step 1 — Start Express Server**
Show `server.js` — middleware stack registered, server listening.

**Step 2 — Static Landing Page**
Open `http://localhost:5000/` in browser — served by `express.static('public')`. Simple HTML page listing available endpoints.

**Step 3 — Add an Interview Experience**
POST `/api/experiences` with JSON body. Show validation middleware rejecting a bad request (empty company), then accepting a valid one.

**Step 4 — Retrieve All Experiences**
GET `/api/experiences` — returns list.

**Step 5 — Filter by Company**
GET `/api/experiences/company/amazon` — shows route parameters.

**Step 6 — Filter by Difficulty / Tag**
GET `/api/experiences?difficulty=3&tag=DSA` — shows query strings.

**Step 7 — Search**
GET `/api/experiences/search?q=normalization` — shows text search.

**Step 8 — Export to File**
GET `/api/experiences/export` — file downloads. Open `exports/experiences.json` and `logs/requests.log` to show `fs` module at work.

**Step 9 — Analytics: Common Questions**
GET `/api/analytics/common-questions/Amazon`

**Step 10 — Analytics: Difficulty Summary**
GET `/api/analytics/difficulty-summary`

**Step 11 — Trigger an Error**
GET `/api/experiences/badid` — shows centralized error middleware response format.

11. Presentation Strategy (5 Marks)

## Slide Flow (Suggested)

1. **Problem Statement** — Why PrepVault? What problem does it solve?
2. **Client-Server Architecture Diagram** — Browser/Postman → Node.js → MongoDB
3. **Why Node.js?** — Event loop, non-blocking I/O, advantages vs Java/Python backends
4. **Tech Stack** — Node.js, Express, MongoDB, third-party middleware list
5. **Architecture** — Layered diagram (Routes → Middleware → Controller → Model → DB)
6. **Middleware Lifecycle** — Visual flowchart of all 4 middleware types
7. **API Endpoints Table** — Method, Path, Purpose
8. **Live Demo** — Postman walkthrough (Steps 1–13 from Section 10)
9. **fs Module in Action** — Show export endpoint + log file
10. **Analytics** — Show the beyond-CRUD value

## Key Talking Points for Viva

**About Node.js**
- What is the event loop in Node.js? How does non-blocking I/O work?
- Difference between `require` (CommonJS) and `import` (ES Modules)
- Node.js advantages vs Java/Python for backend — and what it's bad at (CPU-heavy tasks)

**About HTTP & Express**
- How does `http.createServer()` work? What does Express add on top of it?
  > Answer: Express wraps Node's `http` module. `http.createServer()` gives you a raw request/response; Express adds routing, middleware, `res.json()`, etc.
- What does `express.static()` do internally? 
  > Answer: Reads the file from disk and streams it as the response with correct Content-Type headers.

**About Routing**
- Why use `express.Router()` instead of putting all routes in `server.js`?
- Difference between route parameters (`/:id`) and query strings (`?difficulty=3`)

**About Middleware**
- What is middleware? What is the difference between app-level and router-level?
- Why does the error handler need 4 arguments? What happens if you use 3?
- What does `next(err)` do vs `next()`?
- Why did you use `morgan` instead of writing your own console logger?
  > Answer: morgan is a mature, configurable third-party middleware. We added a custom `loggerMiddleware` on top of it to write to file, which shows both approaches.
- Why not use `cors` or `helmet` in your project?
  > Answer: `cors` is needed when browsers make cross-origin requests — we're only using Postman so it's not required. `helmet` is a production security concern, not relevant for a dev/demo project. We know what they do and would add them before deploying.
- What is `express-validator`? Why didn't you use it?
  > Answer: It's a third-party library for request validation. We wrote custom validation middleware to understand how it works internally. `express-validator` does the same thing more formally with schema-based rules.

**About fs Module**
- Difference between `fs.readFile()` and `fs.createReadStream()`?
  > Answer: `readFile` loads the whole file into memory first. `createReadStream` sends it in chunks — better for large files.
- What is `fs.appendFile()` vs `fs.writeFile()`?

---

12. Future Improvements (Post Eval)

- User authentication (JWT) with protected routes
- User-specific interview logs
- Upvoting useful experiences
- Pagination and sorting on list endpoints
- Rate limiting middleware (third-party: `express-rate-limit`)
- Cloud deployment (Railway / Render)
- Frontend interface

13. Learning Outcomes

By completing this project we demonstrate:

- Client-server architecture with Node.js and Express
- Raw HTTP module usage vs Express abstraction
- `fs` module for file handling, logging, and streaming
- `express.static()` for serving static files
- REST API development with full CRUD
- MongoDB modeling with Mongoose
- All 4 middleware types: app-level, router-level, error-handling, third-party
- Third-party middleware: morgan, cors, helmet
- Query filtering, search, and analytics
- Modular backend architecture
- API testing using Postman

14. Project Status

Phase: **Ideation & Planning Complete**

## Implementation Checklist

- [ ] Initialize Node.js project (`npm init`)
- [ ] Create `http-demo/rawServer.js` with bare `http.createServer()`
- [ ] Setup Express server (`server.js`)
- [ ] Configure MongoDB connection (`config/db.js`)
- [ ] Create `public/index.html` and wire `express.static('public')`
- [ ] Implement `experienceModel.js` (with tags field)
- [ ] Implement experience routes and controller (CRUD + search + export)
- [ ] Implement `loggerMiddleware.js` using `fs.appendFile`
- [ ] Implement `validationMiddleware.js`
- [ ] Implement `requireApiKey.js` as router-level middleware
- [ ] Install and wire morgan, cors, helmet
- [ ] Implement analytics routes and controller
- [ ] Implement `errorMiddleware.js`
- [ ] Implement `/api/experiences/export` using `fs.createReadStream`
- [ ] Test all endpoints in Postman
- [ ] Prepare presentation slides


---