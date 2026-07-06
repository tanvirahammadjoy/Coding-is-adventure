# FullStack Boilerplate

A modern, production-ready full-stack web application boilerplate built with React, TypeScript, Node.js, Express, and MongoDB.

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Project Structure

```
fullstack-boilerplate/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts       # MongoDB connection
│   │   ├── middleware/
│   │   │   └── auth.ts           # JWT authentication middleware
│   │   ├── models/
│   │   │   └── User.ts           # User model
│   │   ├── routes/
│   │   │   ├── auth.ts           # Authentication routes
│   │   │   └── users.ts          # User routes
│   │   └── index.ts              # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.tsx        # Navigation component
    │   ├── lib/
    │   │   ├── api.ts            # API client
    │   │   └── utils.ts          # Utility functions
    │   ├── pages/
    │   │   ├── Home.tsx          # Home page
    │   │   ├── Login.tsx         # Login page
    │   │   ├── Register.tsx      # Register page
    │   │   └── Dashboard.tsx     # Dashboard page
    │   ├── App.tsx               # Main app component
    │   ├── main.tsx              # Entry point
    │   └── index.css             # Global styles
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── .env.example
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fullstack-boilerplate
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Configuration

1. Backend configuration:
```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/fullstack-boilerplate
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRE=7d
```

2. Frontend configuration:
```bash
cd frontend
cp .env.example .env
```

Edit `.env` with your configuration:
```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

1. Start MongoDB (if using local instance):
```bash
mongod
```

2. Start the backend server:
```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

3. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

### Building for Production

1. Build the backend:
```bash
cd backend
npm run build
npm start
```

2. Build the frontend:
```bash
cd frontend
npm run build
```

The production build will be in the `dist` folder.

## Features

- **User Authentication**: Register, login, and logout with JWT tokens
- **Protected Routes**: Dashboard accessible only to authenticated users
- **Responsive Design**: Mobile-friendly UI with TailwindCSS
- **Type Safety**: Full TypeScript support on both frontend and backend
- **API Proxy**: Vite proxy for seamless API communication
- **Input Validation**: Server-side validation with express-validator
- **Password Security**: Bcrypt hashing for secure password storage

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user (protected)
- `PUT /api/users/me` - Update current user (protected)

### Health
- `GET /health` - Health check endpoint

## Development Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Customization

This boilerplate is designed to be easily customizable. You can:

- Add new API routes in `backend/src/routes/`
- Add new models in `backend/src/models/`
- Add new pages in `frontend/src/pages/`
- Add new components in `frontend/src/components/`
- Modify the UI by editing TailwindCSS classes
- Add new middleware in `backend/src/middleware/`

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
