For a modern full-stack app, we would recommend a structure that is scalable from day one. Since we're using:

Frontend: React + TypeScript
Backend: Node.js + Express + TypeScript
Database: MongoDB + Mongoose
Authentication: JWT + Passport.js
Package Manager: npm (or pnpm if you prefer)

we would organize it like this.

```bash
my-app/
│
├── client/ # React Frontend
│ ├── public/
│ ├── src/
│ │
│ │── assets/
│ │── components/
│ │── layouts/
│ │── pages/
│ │── hooks/
│ │── context/
│ │── services/
│ │── routes/
│ │── utils/
│ │── types/
│ │── styles/
│ │
│ │── App.tsx
│ │── main.tsx
│ │── vite-env.d.ts
│ │
│ ├── package.json
│ └── tsconfig.json
│
│
├── server/
│ │
│ ├── src/
│ │
│ │── config/
│ │ ├── database.ts
│ │ ├── env.ts
│ │ ├── passport.ts
│ │ └── logger.ts
│ │
│ │── constants/
│ │
│ │── controllers/
│ │ ├── auth.controller.ts
│ │ └── user.controller.ts
│ │
│ │── services/
│ │ ├── auth.service.ts
│ │ └── user.service.ts
│ │
│ │── repositories/
│ │ └── user.repository.ts
│ │
│ │── models/
│ │ └── User.model.ts
│ │
│ │── routes/
│ │ ├── auth.routes.ts
│ │ ├── user.routes.ts
│ │ └── index.ts
│ │
│ │── middlewares/
│ │ ├── auth.middleware.ts
│ │ ├── error.middleware.ts
│ │ ├── validate.middleware.ts
│ │ └── notFound.middleware.ts
│ │
│ │── validators/
│ │ ├── auth.validator.ts
│ │ └── user.validator.ts
│ │
│ │── interfaces/
│ │
│ │── types/
│ │
│ │── utils/
│ │ ├── jwt.ts
│ │ ├── password.ts
│ │ ├── response.ts
│ │ └── asyncHandler.ts
│ │
│ │── helpers/
│ │
│ │── passport/
│ │ └── jwt.strategy.ts
│ │
│ │── docs/
│ │
│ │── app.ts
│ │── server.ts
│ │
│ ├── tests/
│ │
│ ├── .env
│ ├── .env.example
│ ├── package.json
│ └── tsconfig.json
│
│
├── .gitignore
├── README.md
└── package.json
```

Backend Flow

Request
│
▼
Route
│
▼
Validation Middleware
│
▼
Passport JWT Middleware
│
▼
Controller
│
▼
Service
│
▼
Repository
│
▼
MongoDB

This separation keeps your business logic clean and makes testing easier.

Authentication Flow

Register
POST /api/auth/register
│
▼
Controller
│
▼
Hash Password (bcrypt)
│
▼
MongoDB
│
▼
Return JWT

Login
POST /api/auth/login
│
▼
Find User
│
▼
Compare Password
│
▼
Generate JWT
│
▼
Return Token

Protected Route
Client
│
Authorization: Bearer JWT
│
▼
Passport JWT Strategy
│
Verify Token
│
Find User
│
Attach user to req.user
│
Controller

User Model
\_id
name
email
password
role
avatar
isVerified
createdAt
updatedAt

Auth Routes
POST /register
POST /login
POST /logout
POST /refresh-token
GET /me
POST /forgot-password
POST /reset-password
POST /verify-email

User Routes
GET /users
GET /users/:id
PATCH /users/:id
DELETE /users/:id

Config Folder
config/
database.ts
Mongo Connection
passport.ts
Passport initialization
env.ts
Environment variables
logger.ts
Winston or Pino logger

Middleware
middlewares/
authenticate.ts
authorize.ts
validate.ts
errorHandler.ts
notFound.ts

Utils
jwt.ts
password.ts
ApiResponse.ts
ApiError.ts
catchAsync.ts

Environment Variables
NODE_ENV=development
PORT=5000
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRES=30d
CLIENT_URL=http://localhost:5173

NPM Scripts
{
"scripts": {
"dev": "nodemon",
"build": "tsc",
"start": "node dist/server.js",
"lint": "eslint .",
"format": "prettier --write .",
"test": "jest"
}
}

Recommended Packages
Core
express
typescript
ts-node
nodemon
dotenv
cors
helmet
compression
morgan

Database
mongoose

Authentication
passport
passport-jwt
jsonwebtoken
bcrypt

Validation
zod
or
express-validator

Development
eslint
prettier
husky
lint-staged
jest
supertest

Recommended Design Pattern
Routes
│
Controllers
│
Services
│
Repositories
│
Database

This pattern has several benefits:

Controllers only handle HTTP requests and responses.
Services contain business logic.
Repositories handle database queries.
Models define the data schema.
Middleware manages authentication, authorization, validation, and error handling.

This separation makes the codebase easier to maintain, test, and scale as your application grows.

Suggested Folder Creation Order
When starting from scratch, create things in this order:

Initialize the project (package.json, TypeScript, Express).
Configure environment variables and database connection.
Set up the Express app (app.ts, server.ts).
Create utility functions and global middleware.
Define models.
Build repositories.
Build services.
Build controllers.
Create routes.
Configure Passport JWT authentication.
Add request validation.
Add tests, logging, and API documentation (such as Swagger/OpenAPI).

This foundation is production-friendly and provides a solid base for features like role-based authorization, refresh tokens, email verification, file uploads, and additional modules in the future.
